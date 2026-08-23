import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { CooldownDashboardService } from '../../game/services/CooldownDashboardService';

export async function cooldownCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const embed = CooldownDashboardService.renderCooldownEmbed(user, message.author.username);
  await message.reply({ embeds: [embed] });
}
