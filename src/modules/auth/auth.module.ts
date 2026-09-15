import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from '../../shared/mail/email-service';
import { AuthOtpController } from './controllers/otp.controller';
import { AuthPasswordController } from './controllers/password.controller';
import { PasswordService } from './services/password.service';

import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret') as string,
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessTokenExpiresIn') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthOtpController, AuthPasswordController],
  providers: [AuthService, OtpService, PasswordService, EmailService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
