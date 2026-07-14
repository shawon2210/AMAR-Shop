import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject('RefreshJwtService') private refreshJwtService: JwtService,
  ) {}

  async register(data: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }) {
    if (data.phone) {
      const existingPhone = await this.prismaService.user.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    if (data.email) {
      const existingEmail = await this.prismaService.user.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        password: hashedPassword,
        lastLoginAt: new Date(),
      },
    });

    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSeller: false,
        avatar: null,
      },
    };
  }

  async login(identity: string, password: string) {
    const normalizedPhone = identity.replace(/^(\+?880)/, '');
    const isEmail = identity.includes('@');

    let user;
    if (isEmail) {
      user = await this.prismaService.user.findUnique({
        where: { email: identity },
      });
    } else {
      user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { phone: `+88${normalizedPhone}` },
            { phone: `+880${normalizedPhone}` },
            { phone: `880${normalizedPhone}` },
            { phone: identity },
          ],
        },
      });
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSeller: user.isSeller,
        avatar: user.avatar,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; jti: string };
    try {
      payload = this.refreshJwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const stored = await this.prismaService.refreshToken.findUnique({
      where: { token: payload.jti },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      if (stored && !stored.revokedAt) {
        await this.prismaService.refreshToken.update({
          where: { id: stored.id },
          data: { revokedAt: new Date() },
        });
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prismaService.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: stored.userId },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user.id, user.phone, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isSeller: user.isSeller,
        avatar: user.avatar,
      },
    };
  }

  async logout(userId: string) {
    await this.prismaService.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.prismaService.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out from all devices' };
  }

  async getProfile(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isSeller: true,
        isVerified: true,
        createdAt: true,
        lastLoginAt: true,
        store: {
          select: { id: true, name: true, slug: true, isOfficial: true },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true,
            addresses: true,
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private async generateTokens(userId: string, phone: string, role: string) {
    const accessToken = this.jwtService.sign({
      sub: userId,
      phone,
      role,
    });

    const refreshTokenValue = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const refreshToken = this.refreshJwtService.sign({
      sub: userId,
      jti: refreshTokenValue,
    });

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async forgotPassword(phone: string) {
    const user = await this.prismaService.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return {
        message: 'If the phone number exists, a reset link has been sent',
      };
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prismaService.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    this.sendPasswordResetSMS(user.phone, resetToken);

    return {
      message: 'If the phone number exists, a reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await this.prismaService.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetRecord.used) {
      throw new BadRequestException('Reset token already used');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      this.prismaService.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true, usedAt: new Date() },
      }),
      this.prismaService.refreshToken.updateMany({
        where: { userId: resetRecord.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const emailVerification =
      await this.prismaService.emailVerificationToken.findUnique({
        where: { token },
      });

    if (!emailVerification || emailVerification.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (emailVerification.verified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: emailVerification.userId },
        data: { isVerified: true, emailVerifiedAt: new Date() },
      }),
      this.prismaService.emailVerificationToken.update({
        where: { id: emailVerification.id },
        data: { verified: true, verifiedAt: new Date() },
      }),
    ]);

    return { message: 'Email verified successfully' };
  }

  async verifyPhone(token: string) {
    const phoneVerification =
      await this.prismaService.phoneVerificationToken.findUnique({
        where: { token },
      });

    if (!phoneVerification || phoneVerification.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (phoneVerification.verified) {
      throw new BadRequestException('Phone already verified');
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: phoneVerification.userId },
        data: { isVerified: true, phoneVerifiedAt: new Date() },
      }),
      this.prismaService.phoneVerificationToken.update({
        where: { id: phoneVerification.id },
        data: { verified: true, verifiedAt: new Date() },
      }),
    ]);

    return { message: 'Phone verified successfully' };
  }

  async resendEmailVerification(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new BadRequestException('User not found or no email');
    }

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prismaService.emailVerificationToken.create({
      data: { token, userId, expiresAt },
    });

    this.sendVerificationEmail(user.email, token);

    return { message: 'Verification email sent' };
  }

  async resendPhoneVerification(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.phone) {
      throw new BadRequestException('User not found or no phone');
    }

    if (user.isVerified) {
      return { message: 'Phone already verified' };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prismaService.phoneVerificationToken.create({
      data: { token, userId, expiresAt },
    });

    await this.sendVerificationSMS(user.phone, token);

    return { message: 'Verification SMS sent' };
  }

  private sendPasswordResetSMS(phone: string, token: string) {
    console.log(`SMS to ${phone}: Reset token: ${token}`);
  }

  private sendVerificationEmail(email: string, token: string) {
    console.log(`Email to ${email}: Verification token: ${token}`);
  }

  private sendVerificationSMS(phone: string, token: string) {
    console.log(`SMS to ${phone}: Verification token: ${token}`);
  }
}
