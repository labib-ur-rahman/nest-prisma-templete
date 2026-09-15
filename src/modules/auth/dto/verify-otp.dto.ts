import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { OtpType } from '../../../../prisma/generated/client';

export class VerifyOtpDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: OtpType, example: OtpType.ACCOUNT_VERIFY })
  @IsEnum(OtpType)
  @IsNotEmpty()
  type: OtpType;
}