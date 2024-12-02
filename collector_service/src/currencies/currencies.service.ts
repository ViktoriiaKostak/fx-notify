import { Injectable, Logger} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from "axios";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class CurrenciesService {
  private readonly apiUrl: string;
  private readonly logger = new Logger(CurrenciesService.name);

  constructor(
      private readonly prisma: PrismaService,
      private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('CURRENCIES_API_URL') || '';
  }

  async updateCurrencies(): Promise<void> {
    try {
      const response = await axios.get(this.apiUrl);

      const currencies = Object.entries(response.data).map(([symbol, name]) => ({
        symbol,
        name: name as string,
      }));

      for (const currency of currencies) {
        await this.prisma.currency.upsert({
          where: { symbol: currency.symbol },
          update: { name: currency.name },
          create: { symbol: currency.symbol, name: currency.name },
        });
      }

      this.logger.log('Currencies successfully updated.');
    } catch (error) {
      this.logger.error('Failed to update currencies.', error.message);
    }
  }
}