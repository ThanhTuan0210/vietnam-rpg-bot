import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { masterMenuCommand } from './master_menu.command';

export async function batDauCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  let user = await UserService.getOrCreateUser(userId);

  // Initialize starting items with Medieval Kyrise Items
  if (!user.inventory || user.inventory.length === 0) {
    user.inventory = [
      { itemId: 'potion_01a', quantity: 5 },
      { itemId: 'wood_01a', quantity: 10 },
      { itemId: 'ingot_01a', quantity: 5 },
    ];
    user.trangBi = {
      vuKhi: { itemId: 'sword_01a', capCuongHoa: 0, bonusStat: 0 },
      aoGiap: { itemId: 'shield_01a', capCuongHoa: 0, bonusStat: 0 },
    };
    await user.save();
  }

  // Redirect cleanly to Master Menu (which handles step-by-step class selection & dashboard)
  await masterMenuCommand(message);
}
