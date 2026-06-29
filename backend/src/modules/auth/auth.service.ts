import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuthService {
  private prisma: any;

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
    this.prisma = this.prismaService;
  }

  async register(data: { name: string; phone: string; password: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existing)
      throw new ConflictException('Phone number already registered');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, phone: user.phone });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, phone: user.phone });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isSeller: user.isSeller,
        avatar: user.avatar,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isSeller: true,
        createdAt: true,
        store: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
