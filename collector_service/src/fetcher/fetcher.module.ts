import { Module } from '@nestjs/common';
import { FetcherService } from './fetcher.service';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../core/redis/redis.module';
import { EventBusModule } from '../infrastructure/event-bus/event-bus.module';


@Module({
  imports: [CqrsModule, PrismaModule, RedisModule],
  providers: [FetcherService],
})
export class FetcherModule {}