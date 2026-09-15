import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  bcryptSaltRounds:
    parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10) || 10,
  corsOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'],
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
}));
