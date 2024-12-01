import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RuleNotificationEvent } from '../../events/rule-notification.event';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../mails/mail.service';
import { NotificationStatus } from '../enums/notification-status';
import { TelegramNotifyService } from '../telegram-notify.service';

@EventsHandler(RuleNotificationEvent)
@Injectable()
export class RuleNotificationHandler
  implements IEventHandler<RuleNotificationEvent>
{
  private readonly logger = new Logger(RuleNotificationHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly telegramNotifyService: TelegramNotifyService, // Inject the service
  ) {}

  async handle(event: RuleNotificationEvent): Promise<void> {
    console.log('RuleNotificationEvent received', event);
    const { notification } = event;

    try {
      console.log('Raw notification details:', notification.details);

      // Parse `details` string into an object
      const details = JSON.parse(notification.details);

      console.log('Parsed notification details:', details);

      // Fetch the currency names from the database
      const baseCurrency = await this.prisma.currency.findUnique({
        where: { id: details.baseCurrency },
      });
      const targetCurrency = await this.prisma.currency.findUnique({
        where: { id: details.targetCurrency },
      });

      // Replace currency IDs with their names or codes
      const context = {
        baseCurrency: baseCurrency ? baseCurrency.name : 'Unknown', // Replace 'name' with the appropriate field if needed
        targetCurrency: targetCurrency ? targetCurrency.name : 'Unknown', // Same here
        percentageChange: details.percentageChange || '0',
        currentRate: details.currentRate || '0',
        ruleType: details.ruleType || 'N/A',
        rulePercentage: details.rulePercentage || 0,
      };

      console.log('Email context:', context);

      // Retrieve user information
      const user = await this.prisma.user.findUnique({ where: { id: notification.userId } });
      if (!user || !user.email) {
        this.logger.warn(`User with ID ${notification.userId} does not have an email.`);
        return;
      }

      // Send email
      await this.emailService.sendEmail({
        to: user.email,
        subject: `Currency Alert: Rule ${notification.ruleId} Triggered`,
        template: 'rule-notification',
        context,
      });

      // Send Telegram notification
      const telegramMessage = `Rule ${notification.ruleId} triggered: ${context.baseCurrency} to ${context.targetCurrency} rate is now ${context.currentRate}.`;
      await this.telegramNotifyService.sendMessage(telegramMessage);

      // Update notification status
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: NotificationStatus.SUCCESS },
      });

      this.logger.log(`Notification ${notification.id} processed successfully.`);
    } catch (error) {
      this.logger.error(`Error processing notification ${notification.id}`, error.stack);

      // Update notification status to FAILED
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: NotificationStatus.FAILED },
      });
    }
  }
}