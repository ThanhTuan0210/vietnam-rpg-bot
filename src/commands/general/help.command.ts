import { Message } from 'discord.js';
import { CONFIG } from '../../config/env';
import { HelpMenuService } from '../../game/services/HelpMenuService';

export async function helpCommand(message: Message): Promise<void> {
  const embed = HelpMenuService.renderHelpEmbed(CONFIG.PREFIX);
  await message.reply({ embeds: [embed] });
}
