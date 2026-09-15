import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsString()
    @IsNotEmpty()
    resetToken: string;

    @ApiProperty({ example: 'newpassword123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}