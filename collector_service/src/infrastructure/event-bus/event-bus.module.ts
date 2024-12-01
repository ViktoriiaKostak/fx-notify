import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RuleNotificationHandler } from '../../notifications/handlers/rule-notification.handler';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../../mails/mail.module';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [CqrsModule, PrismaModule, MailModule, NotificationsModule],
  providers: [RuleNotificationHandler],
  exports: [CqrsModule], // Експортуйте CqrsModule, якщо його використовують інші модулі.
})
export class EventBusModule {}