import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        // Try to get token from cookie first, then from Authorization header
        let token = req?.cookies?.accessToken;
        if (!token && req?.headers?.authorization) {
          const authHeader = req.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
          }
        }
        return token;
      },
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; role: string }) {
    if (this.configService.get<string>('MOCK_AUTH') === 'true') {
      return { id: payload.sub, role: payload.role };
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        isActive: true,
        role: true,
      },
    });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return { id: user.id, role: user.role };
  }
}
