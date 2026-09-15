import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { RATE_LIMIT } from '../../common/constants/rate-limit.constant';
import { CustomThrottlerGuard } from '../../common/guards/throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('redis.host', 'localhost');
        const port = configService.get<number>('redis.port', 6379);

        return {
          throttlers: [
            {
              name: RATE_LIMIT.GLOBAL.name,
              ttl: RATE_LIMIT.GLOBAL.ttl,
              limit: RATE_LIMIT.GLOBAL.limit,
            },
          ],
          storage: new ThrottlerStorageRedisService({
            host,
            port,
          }),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class ThrottlerConfigModule {}
