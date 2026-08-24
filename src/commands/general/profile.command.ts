import { Message } from 'discord.js';
import { nhanVatCommandAdvanced } from './nhanvat';

export async function profileCommandAdvanced(message: Message): Promise<void> {
  await nhanVatCommandAdvanced(message);
}
