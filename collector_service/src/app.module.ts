import { Module } from '@nestjs/common';
import { FetcherModule } from './fetcher/fetcher.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggingInterceptor } from './logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventBusModule } from './infrastructure/event-bus/event-bus.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'src/.env',
    cache: true,
  }),
    ClientsModule.register([
      {
        name: 'COLLECTOR_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'collector_service',
          port: 3003,
        },
      },
    ]),
    PrometheusModule.register(), EventBusModule,
    FetcherModule, ScheduleModule.forRoot(), PrismaModule, RedisModule, CurrenciesModule],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }],
})
export class AppModule {
}