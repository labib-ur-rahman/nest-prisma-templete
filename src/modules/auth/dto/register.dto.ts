import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
}