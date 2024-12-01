import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { UserService } from '../users/user.service';
import { CurrenciesService } from '../currencies/currencies.service';

@Injectable()
export class RulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  async createRule(createRuleDto: CreateRuleDto) {
    const { email, baseCurrency, targetCurrency, type, percentage } = createRuleDto;

    const user = await this.userService.findUserByEmailOrCreate(email);

    const activeRulesCount = await this.prisma.rule.count({
      where: { userId: user.id, isActive: true },
    });

    if (activeRulesCount >= 5) {
      throw new BadRequestException('Users can only have up to 5 active rules.');
    }

    const baseCurrencyId = await this.currenciesService.getCurrencyId(baseCurrency);
    const targetCurrencyId = await this.currenciesService.getCurrencyId(targetCurrency);

    return this.prisma.rule.create({
      data: {
        userId: user.id,
        baseCurrencyId,
        targetCurrencyId,
        type,
        percentage,
      },
    });
  }

  async getRulesByUser(email: string) {
    const user = await this.userService.findUserByEmailOrCreate(email);
    return this.prisma.rule.findMany({
      where: { userId: user.id },
      include: { baseCurrency: true, targetCurrency: true },
    });
  }

  async deleteRule(id: string) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found.');

    return this.prisma.rule.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateRule(id: string, updateRuleDto: UpdateRuleDto) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found.');

    const { email, baseCurrencyId, targetCurrencyId, type, percentage, isActive } = updateRuleDto;

    const user = await this.userService.findUserByEmailOrCreate(email);

    return this.prisma.rule.update({
      where: { id },
      data: {
        userId: user.id,
        baseCurrencyId,
        targetCurrencyId,
        type,
        percentage,
        isActive,
      },
    });
  }


  async restoreRule(id: string) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found.');

    return this.prisma.rule.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
