import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class CurrenciesService {
  private readonly apiUrl = process.env.CURRENCIES_API_URL;
  private readonly apiKey = process.env.API_KEY;
  private readonly logger = new Logger(CurrenciesService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async updateCurrencies(): Promise<void> {
    try {
      await this.prisma.currency.deleteMany();
      const response = await axios.get(this.apiUrl);

      await this.prisma.currency.createMany({
        data: Object.entries(response.data).map(([symbol, name]) => ({
          symbol,
          name: name as string,
        })),
      });

      this.logger.log('Currencies successfully updated.');
    } catch (error) {
      this.logger.error('Failed to update currencies.', error.message);
    }
  }

}