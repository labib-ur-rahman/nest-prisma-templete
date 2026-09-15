import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpType } from '../../../../prisma/generated/client';
import { ResponseHelper } from '../../../common/helpers/response.helper';
import {
    NotFoundException,
    OtpInvalidException,
    ServiceUnavailableException,
    TooManyAttemptsException,
} from '../../../common/exceptions/business.exception';
import { generateOtpCode } from '../utils/otp.util';
import { generateTokens } from '../utils/token.util';
import { EmailService } from '@/shared/mail/email-service';
import { getOtpEmailContent } from '@/shared/mail/templates/otp-email.template';
import { RedisService } from '../../../shared/redis/redis.service';

@Injectable()
export class OtpService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) { }

    async sendOtp(
        dto: SendOtpDto,
        isResend: boolean = false,
    ) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new NotFoundException('User');
        }

        const code = generateOtpCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        await this.prisma.oTP.updateMany({
            where: { userId: user.id, type: dto.type, isUsed: false },
            data: { isUsed: true },
        });

        await this.prisma.oTP.create({
            data: {
                userId: user.id,
                code,
                type: dto.type,
                expiresAt,
            },
        });

        const emailContent = getOtpEmailContent(code, dto.type, isResend);
        const isSent = await this.emailService.sendEmail(
            user.email!,
            emailContent.subject,
            emailContent.html,
        );
        if (!isSent) {
            throw new ServiceUnavailableException(
                'Failed to send email. Please try again.',
            );
        }

        return ResponseHelper.success(null, 'OTP sent successfully');
    }

    async resendOtp(dto: { email: string; type: OtpType }) {
        return this.sendOtp(dto, true);
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new NotFoundException('User');
        }

        const otp = await this.prisma.oTP.findFirst({
            where: {
                userId: user.id,
                type: dto.type,
                isUsed: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!otp) {
            throw new OtpInvalidException();
        }

        const attemptsKey = `otp_attempts:${otp.id}`;
        const currentAttempts = await this.redisService.get(attemptsKey);
        
        if (currentAttempts && parseInt(currentAttempts) >= 5) {
            throw new TooManyAttemptsException();
        }

        if (otp.code !== dto.code) {
            const newAttempts = await this.redisService.incr(attemptsKey);
            if (newAttempts === 1) {
                await this.redisService.expire(attemptsKey, 600); // Expires after 10 minutes (max validity of OTP)
            }
            throw new OtpInvalidException();
        }

        await this.redisService.del(attemptsKey);

        await this.prisma.oTP.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });

        if (dto.type === OtpType.ACCOUNT_VERIFY) {
            const updatedUser = await this.prisma.user.update({
                where: { id: user.id },
                data: { status: 'ACTIVE' },
            });

            const payload = {
                sub: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
            };
            const { accessToken, refreshToken } = generateTokens(
                this.jwtService,
                this.configService,
                payload,
            );

            return ResponseHelper.success(
                {
                    accessToken,
                    refreshToken,
                    user: {
                        id: updatedUser.id,
                        email: updatedUser.email,
                        role: updatedUser.role,
                    },
                },
                'Account verified successfully. You are now logged in.',
            );
        } else if (dto.type === OtpType.PASSWORD_RESET) {
            const resetToken = this.jwtService.sign(
                { sub: user.id, purpose: 'reset-password' },
                { expiresIn: '15m' },
            );
            return ResponseHelper.success(
                { resetToken },
                'OTP verified. Proceed to reset password.',
            );
        }

        return ResponseHelper.success(null, 'OTP verified successfully');
    }
}