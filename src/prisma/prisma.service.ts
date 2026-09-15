import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly connectionString: string;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      log: [{ emit: 'event', level: 'error' }],
    });
    this.connectionString = connectionString;
  }

  async onModuleInit() {
    this.logger.log('[INIT] Prisma connecting...');
    await this.$connect();
    this.logger.log('[INIT] Prisma connected');
  }

  async onModuleDestroy() {
    this.logger.log('[DESTROY] Prisma disconnecting...');
    await this.$disconnect();
    this.logger.log('[DESTROY] Prisma disconnected');
  }
}