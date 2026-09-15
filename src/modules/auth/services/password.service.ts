import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { OtpService } from './otp.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { OtpType } from '../../../../prisma/generated/client';
import { ResponseHelper } from '../../../common/helpers/response.helper';
import { RedisService } from '../../../shared/redis/redis.service';
import * as bcrypt from 'bcrypt';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../common/exceptions/business.exception';

@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    return this.otpService.sendOtp({
      email: dto.email,
      type: OtpType.PASSWORD_RESET,
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      // Check if token has already been revoked / used
      const isRevoked = await this.redisService.get(
        `revoked_token:${dto.resetToken}`,
      );
      if (isRevoked) {
        throw new UnauthorizedException('Reset token has already been used');
      }

      const decoded = this.jwtService.verify(dto.resetToken);
      if (decoded.purpose !== 'reset-password') {
        throw new UnauthorizedException('Invalid token purpose');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });
      if (!user) {
        throw new NotFoundException('User');
      }

      const saltRounds =
        this.configService.get<number>('app.bcryptSaltRounds') ?? 10;
      const hashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Blacklist reset token for remaining lifespan (15 mins = 900s)
      await this.redisService.set(`revoked_token:${dto.resetToken}`, '1', 900);

      return ResponseHelper.success(null, 'Password reset successful');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new NotFoundException('User');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const saltRounds =
      this.configService.get<number>('app.bcryptSaltRounds') ?? 10;
    const hashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return ResponseHelper.success(null, 'Password changed successfully');
  }
}
