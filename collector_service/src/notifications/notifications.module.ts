import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { MailModule } from '../mails/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RuleNotificationHandler } from './handlers/rule-notification.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TelegramNotifyService } from './telegram-notify.service';

@Module({
  imports: [MailModule, PrismaModule, CqrsModule],
  providers: [RuleNotificationHandler, TelegramNotifyService],
  controllers: [NotificationsController ],
  exports: [TelegramNotifyService],
})
export class NotificationsModule {}