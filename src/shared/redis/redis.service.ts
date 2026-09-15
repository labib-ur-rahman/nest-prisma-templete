import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('redis.host', 'localhost');
    const port = this.configService.get<number>('redis.port', 6380);

    this.redisClient = new Redis({
      host,
      port,
    });

    this.redisClient.on('connect', () => {
      this.logger.log(`Connected to Redis at ${host}:${port}`);
    });

    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`, err.stack);
    });
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  get client(): Redis {
    return this.redisClient;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redisClient.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.redisClient.expire(key, seconds);
  }
}
