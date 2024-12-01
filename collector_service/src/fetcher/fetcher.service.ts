import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';
import { EventBus } from '@nestjs/cqrs';
import { RatesFetchedEvent } from '../events/rates-fetched.event';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import * as process from 'node:process';
import { NotificationStatus, Rule, RuleType } from '@prisma/client';
import { RuleNotificationEvent } from '../events/rule-notification.event';

@Injectable()
export class FetcherService {
  private readonly logger = new Logger(FetcherService.name);
  private readonly apiUrl = process.env.API_URL;
  private readonly apiKey = process.env.API_KEY;

  constructor(
    private readonly eventBus: EventBus,
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {
  }

  //   //2. У fetcher сервісі ми беремо всі правила, витягаємо всі baseCurrencies, і робимо запит на апі https://openexchangerates.org/api/latest.json?app_id={procces.env.API_REY}&base={baseCurrencies}
  //     // 3. У відповіді шукаємо targetCurrencies і вираховуємо на який відсоток валюта baseCurrencies впала/зросла  порівняно з валютою targetCurrencies (на основі останніх даних вибірки)
  //     // 4. Якщо правило здійснюється то відправляємо імейл
  //

  @Interval(15000)
  async fetchRates() {
    try {
      const rules = await this.prisma.rule.findMany({
        where: { isActive: true },
        include: {
          baseCurrency: true,
          targetCurrency: true,
          user: true,
        },
      });

      console.log(this.apiUrl);
      console.log(this.apiKey);

      for (const rule of rules) {
        const { baseCurrency, targetCurrency, percentage, type: ruleType } = rule;

        let rates = await this.redis.get(baseCurrency.symbol);

        if (!rates) {
          // const response = await axios.get(this.apiUrl, {
          //   params: { app_id: this.apiKey, base: baseCurrency.symbol },
          // });
          // NEED SUBSTITUTION TO THE API
          const response = await axios.get(this.apiUrl, {
            params: { app_id: this.apiKey },
          });
          await this.redis.set(baseCurrency.symbol, JSON.stringify(response.data.rates));
        } else {
          rates = JSON.parse(rates);
        }

        const targetCurrencyRate = rates[targetCurrency.symbol];
        if (!targetCurrencyRate) {
          this.logger.warn(`Target currency ${targetCurrency.symbol} not found in rates.`);
          continue;
        }

        const previousRate = rule.previousRate || targetCurrencyRate;
        const currentPercentage = ((targetCurrencyRate - previousRate) / previousRate) * 100;

        rule.previousRate = targetCurrencyRate;
        await this.prisma.rule.update({
          where: { id: rule.id },
          data: { previousRate: targetCurrencyRate.toString() },
        });

        console.log('currentPercentage', currentPercentage);
        console.log('percentage', percentage);
        console.log('ruleType', ruleType);
        const isRuleConditionMet = this.checkRuleCondition(ruleType, currentPercentage, percentage);

        console.log('isRuleConditionMet', isRuleConditionMet);

        if (isRuleConditionMet) {
          await this.createNotification(rule, currentPercentage, targetCurrencyRate);
        }
      }

      await this.redis.flushall();
    } catch (error) {
      this.logger.error('Error fetching rates:', error.message);
    }
  }

  private checkRuleCondition(
    ruleType: RuleType,
    percentageChange: number,
    rulePercentage: number
  ): boolean {
    // switch (ruleType) {
    //   case RuleType.INCREASE:
    //     return percentageChange >= rulePercentage;
    //   case RuleType.DECREASE:
    //     return percentageChange <= -rulePercentage;
    // }
    return true;
  }

  private async createNotification(
    rule: Rule,
    percentageChange: number,
    currentRate: number
  ) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: rule.userId,
          ruleId: rule.id,
          sentAt: new Date(),
          status: NotificationStatus.PENDING,
          details: JSON.stringify({
            baseCurrency: rule.baseCurrencyId,
            targetCurrency: rule.targetCurrencyId,
            percentageChange: percentageChange.toFixed(2),
            currentRate: currentRate.toFixed(4),
            ruleType: rule.type,
            rulePercentage: rule.percentage,
          }),
        },
      });
    console.log('notification', notification);

      await this.eventBus.publish(new RuleNotificationEvent(notification));

      this.logger.log(`Notification created for rule ${rule.id}`);
    } catch (error) {
      this.logger.error(`Failed to create notification for rule ${rule.id}`, error.stack);
    }
  }
}