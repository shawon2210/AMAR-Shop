import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma.service';
import { JwtStrategy } from './jwt.strategy';

const refreshJwtProvider = {
  provide: 'RefreshJwtService',
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new JwtService({
      secret: config.get<string>('JWT_REFRESH_SECRET'),
      signOptions: { expiresIn: '7d' },
    }),
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, refreshJwtProvider],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
