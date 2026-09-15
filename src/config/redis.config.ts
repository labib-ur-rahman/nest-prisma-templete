import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT as string, 10),
  hostPort: parseInt(process.env.REDIS_HOST_PORT as string, 10),
}));
