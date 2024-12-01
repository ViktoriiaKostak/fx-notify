import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramNotifyService {
  private readonly logger = new Logger(TelegramNotifyService.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;

  async sendMessage(message: string, parseMode: 'Markdown' | 'HTML' = 'Markdown'): Promise<void> {
    try {
      const response = await axios.get(
          `https://api.telegram.org/bot${this.token}/sendMessage`,
          {
            params: {
              chat_id: this.chatId,
              text: message,
              parse_mode: parseMode,
              disable_notification: false,
            },
          },
      );
      this.logger.log('Telegram message sent successfully:', response.data);
    } catch (error) {
      this.logger.error('Error sending message to Telegram:', error.stack);
    }
  }
}