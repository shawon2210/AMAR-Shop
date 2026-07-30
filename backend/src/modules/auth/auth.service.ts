import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
  ) {}

  private isMockAuth(): boolean {
    return this.configService.get<string>('MOCK_AUTH') === 'true';
  }

  private getMockUser(identity?: string) {
    const name = identity && identity.includes('@') ? identity.split('@')[0] : 'Demo User';
    return {
      id: 'mock-user-id',
      name,
      email: identity && identity.includes('@') ? identity : 'admin@demo.com',
      phone: '01700000000',
      role: 'SUPER_ADMIN',
      isSeller: false,
      avatar: null,
      isActive: true,
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      store: null,
      _count: { orders: 0, reviews: 0, wishlist: 0, addresses: 0 },
    };
  }

  private async mockGenerateTokens(userId: string, phone: string, role: string) {
    const accessToken = this.jwtService.sign({ sub: userId, phone, role });
    const refreshTokenValue = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshToken = this.refreshJwtService.sign({ sub: userId, jti: refreshTokenValue });
    return { accessToken, refreshToken, expiresAt: expiresAt.toISOString() };
  }

  async register(data: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }) {
    if (this.isMockAuth()) {
      const mockUser = this.getMockUser(data.email || data.phone);
      const tokens = await this.mockGenerateTokens(mockUser.id, mockUser.phone, mockUser.role);
      return { ...tokens, user: mockUser };
    }
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
    if (this.isMockAuth()) {
      const mockUser = this.getMockUser(identity);
      const tokens = await this.mockGenerateTokens(mockUser.id, mockUser.phone, mockUser.role);
      return { ...tokens, user: mockUser };
    }
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
    if (this.isMockAuth()) {
      const mockUser = this.getMockUser();
      const tokens = await this.mockGenerateTokens(mockUser.id, mockUser.phone, mockUser.role);
      return { ...tokens, user: mockUser };
    }
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
      if (stored && stored.revokedAt) {
        await this.prismaService.refreshToken.updateMany({
          where: { userId: stored.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        await this.prismaService.securityEvent.create({
          data: {
            userId: stored.userId,
            eventType: 'revoked_token_reuse_detected',
            details: { replayedTokenId: stored.id },
          },
        });
      } else if (stored && !stored.revokedAt) {
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

  async logout(userId: string, refreshTokenValue?: string) {
    if (this.isMockAuth()) {
      return { message: 'Logged out successfully' };
    }
    if (refreshTokenValue) {
      let payload: { sub: string; jti: string };
      try {
        payload = this.refreshJwtService.verify(refreshTokenValue);
      } catch {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const stored = await this.prismaService.refreshToken.findUnique({
        where: { token: payload.jti },
      });
      if (stored && stored.userId === userId && !stored.revokedAt) {
        await this.prismaService.refreshToken.update({
          where: { id: stored.id },
          data: { revokedAt: new Date() },
        });
      }
    } else {
      await this.prismaService.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    if (this.isMockAuth()) {
      return { message: 'Logged out from all devices' };
    }
    await this.prismaService.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out from all devices' };
  }

  async getSessions(userId: string, currentToken?: string) {
    if (this.isMockAuth()) {
      return [];
    }
    const tokens = await this.prismaService.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true, token: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });

    let currentJti: string | null = null;
    if (currentToken) {
      try {
        const payload = this.refreshJwtService.verify(currentToken) as { jti: string };
        currentJti = payload.jti;
      } catch {}
    }

    return tokens.map(t => ({
      id: t.id,
      createdAt: t.createdAt.toISOString(),
      expiresAt: t.expiresAt.toISOString(),
      isCurrent: t.token === currentJti,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    if (this.isMockAuth()) {
      return { message: 'Session revoked' };
    }
    const token = await this.prismaService.refreshToken.findUnique({
      where: { id: sessionId },
    });
    if (!token || token.userId !== userId) {
      throw new BadRequestException('Session not found');
    }
    if (token.revokedAt) {
      return { message: 'Session already revoked' };
    }
    await this.prismaService.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
    return { message: 'Session revoked' };
  }

  async logoutAllExcept(userId: string, refreshTokenValue: string) {
    if (this.isMockAuth()) {
      return { message: 'Logged out from all other devices' };
    }
    let payload: { sub: string; jti: string };
    try {
      payload = this.refreshJwtService.verify(refreshTokenValue);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prismaService.refreshToken.updateMany({
      where: { userId, revokedAt: null, NOT: { token: payload.jti } },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out from all other devices' };
  }

  async getProfile(userId: string) {
    if (this.isMockAuth()) {
      return this.getMockUser();
    }
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
    if (this.isMockAuth()) {
      return { message: 'If the phone number exists, a reset link has been sent' };
    }
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
    if (this.isMockAuth()) {
      return { message: 'Password reset successfully' };
    }
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
    if (this.isMockAuth()) {
      return { message: 'Email verified successfully' };
    }
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
    if (this.isMockAuth()) {
      return { message: 'Phone verified successfully' };
    }
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
    if (this.isMockAuth()) {
      return { message: 'Verification email sent' };
    }
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
    if (this.isMockAuth()) {
      return { message: 'Verification SMS sent' };
    }
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
    console.log(`Password reset SMS dispatched to [REDACTED]`);
  }

  private sendVerificationEmail(email: string, token: string) {
    console.log(`Verification email dispatched to [REDACTED]`);
  }

  private sendVerificationSMS(phone: string, token: string) {
    console.log(`Verification SMS dispatched to [REDACTED]`);
  }
}
