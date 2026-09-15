import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  dbName: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT as string, 10),
  url: process.env.DATABASE_URL,
}));
