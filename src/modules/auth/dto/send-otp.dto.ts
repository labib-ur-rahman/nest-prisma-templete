import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { OtpType } from '../../../../prisma/generated/client';

export class SendOtpDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ enum: OtpType, example: OtpType.ACCOUNT_VERIFY })
    @IsEnum(OtpType)
    @IsNotEmpty()
    type: OtpType;
}