import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsNumber()
  @IsOptional()
  POSTGRES_PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string;

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number;

  @IsNumber()
  @IsOptional()
  REDIS_HOST_PORT: number;

  @IsEmail()
  ADMIN_EMAIL: string;

  @IsString()
  ADMIN_PASSWORD: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsNumber()
  @IsOptional()
  BCRYPT_SALT_ROUNDS: number;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  @IsOptional()
  SMTP_PORT: number;

  @IsString()
  @IsOptional()
  SMTP_SECURE: string;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;

  @IsString()
  SMTP_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
