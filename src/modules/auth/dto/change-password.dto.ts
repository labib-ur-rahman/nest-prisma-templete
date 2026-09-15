import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldpassword123' })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({ example: 'newpassword123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}