import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrencyId(symbol: string): Promise<string> {
    const currency = await this.prisma.currency.findUnique({
      where: { symbol },
      select: { id: true },
    });

    if (!currency) {
      throw new BadRequestException(`Currency ${symbol} not found.`);
    }

    return currency.id;
  }


  async getCurrencies(): Promise<string[]> {
    const currencies = await this.prisma.currency.findMany({
      select: { symbol: true },
    });
    return currencies.map((currency) => currency.symbol);
  }
}