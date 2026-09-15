import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'System health check (Database, Redis, Memory)' })
  check() {
    return this.health.check([
      // Database health
      () => this.prismaHealth.pingCheck('database', this.prisma),
      // Memory heap health (< 300MB heap used threshold)
      () => this.memoryHealth.checkHeap('memory_heap', 300 * 1024 * 1024),
      // Redis health check
      async (): Promise<HealthIndicatorResult> => {
        try {
          const pong = await this.redisService.ping();
          return {
            redis: {
              status: pong === 'PONG' ? 'up' : 'down',
            },
          };
        } catch (error: any) {
          return {
            redis: {
              status: 'down',
              message: error.message,
            },
          };
        }
      },
    ]);
  }
}
