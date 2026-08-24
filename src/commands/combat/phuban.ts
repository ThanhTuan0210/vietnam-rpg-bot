import { Message } from 'discord.js';
import { dungeonCommand } from '../general/dungeon.command';

export async function phuBanCommandAdvanced(message: Message, args: string[] = []): Promise<void> {
  await dungeonCommand(message, args);
}
