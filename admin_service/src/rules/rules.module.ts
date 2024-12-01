import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { UsersModule } from '../users/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [UsersModule, PrismaModule, CurrenciesModule],
  providers: [RulesService],
  controllers: [RulesController]
})
export class RulesModule {}
