import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { OtpService } from './otp.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { OtpType } from '../../../../prisma/generated/client';
import { ResponseHelper } from '../../../common/helpers/response.helper';
import * as bcrypt from 'bcrypt';
import {
    NotFoundException,
    OtpInvalidException,
    UnauthorizedException,
} from '../../../common/exceptions/business.exception';

@Injectable()
export class PasswordService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly otpService: OtpService,
        private readonly jwtService: JwtService,
    ) { }

    async forgotPassword(dto: ForgotPasswordDto) {
        return this.otpService.sendOtp({
            email: dto.email,
            type: OtpType.PASSWORD_RESET,
        });
    }

    async resetPassword(dto: ResetPasswordDto) {
        try {
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

            const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return ResponseHelper.success(null, 'Password reset successful');
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
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

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return ResponseHelper.success(null, 'Password changed successfully');
    }
}