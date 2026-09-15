import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT as string, 10),
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10) || 10,
}));
