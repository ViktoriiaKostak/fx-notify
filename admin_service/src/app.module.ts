import { Module } from '@nestjs/common';
import { CurrenciesModule } from './currencies/currencies.module';
import { EventBusModule } from './infrastructure/event-bus/event-bus.module';
import { RulesModule } from './rules/rules.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'src/.env',
    cache: true,
  }),
    CurrenciesModule, EventBusModule, RulesModule, PrismaModule, RedisModule, UsersModule,
  ],
})
export class AppModule {
}
