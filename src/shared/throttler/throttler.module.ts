import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RATE_LIMIT } from '../../common/constants/rate-limit.constant';
import { CustomThrottlerGuard } from '../../common/guards/throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: RATE_LIMIT.GLOBAL.name,
      ttl: RATE_LIMIT.GLOBAL.ttl,
      limit: RATE_LIMIT.GLOBAL.limit,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class ThrottlerConfigModule {}
