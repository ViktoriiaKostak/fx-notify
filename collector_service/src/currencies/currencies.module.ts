import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesTask } from './currencies-task.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [CurrenciesService, CurrenciesTask],
})
export class CurrenciesModule {}
