import { Message } from 'discord.js';
import { HourlyEventService, HOURLY_REWARDS } from '../../game/services/HourlyEventService';

export async function eventTestCommand(message: Message, args: string[]): Promise<void> {
  const hourArg = parseInt(args[0]) || 20;

  await message.reply(`⚡ **Kích hoạt Thử Nghiệm Sự Kiện Giờ Vàng (Khung ${hourArg}H)...**`);
  await HourlyEventService.broadcastHourlyEvent(message.client, hourArg, message);
}
