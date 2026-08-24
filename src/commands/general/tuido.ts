import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { ITEMS, getItemIcon } from '../../game/data/items';

export async function tuiDoCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const embed = createDongSonEmbed().setTitle(`🎒 ${message.author.username.toLowerCase()} — inventory`);

  if (!user.tuiDo || user.tuiDo.length === 0) {
    embed.setDescription('🎒 *Túi đồ của bạn đang trống rỗng. Gõ `vn hunt` để đi săn thu thập tài nguyên!*');
    await message.reply({ embeds: [embed] });
    return;
  }

  const materialsList: string[] = [];
  const consumablesList: string[] = [];
  const equipmentList: string[] = [];

  for (const itemSlot of user.tuiDo) {
    if (itemSlot.soLuong <= 0) continue;
    const itemDef = ITEMS[itemSlot.itemId];
    const icon = getItemIcon(itemSlot.itemId);
    const line = `${icon} **\`${itemSlot.itemId}\`**: ${itemSlot.soLuong}`;

    if (!itemDef) {
      materialsList.push(line);
      continue;
    }

    if (itemDef.type === 'nguyenlieu') {
      materialsList.push(line);
    } else if (itemDef.type === 'duoclieu') {
      consumablesList.push(line);
    } else {
      equipmentList.push(line);
    }
  }

  // Render 3 Cột Side-by-Side (inline: true) Giống hệt Epic RPG Screenshot
  if (materialsList.length > 0) {
    embed.addFields({
      name: '📦 Items (Tài nguyên)',
      value: materialsList.join('\n'),
      inline: true,
    });
  }

  if (consumablesList.length > 0) {
    embed.addFields({
      name: '🧪 Consumables (Tiêu dùng)',
      value: consumablesList.join('\n'),
      inline: true,
    });
  }

  if (equipmentList.length > 0) {
    embed.addFields({
      name: '🎁 Chests & Gear (Rương & Đồ)',
      value: equipmentList.join('\n'),
      inline: true,
    });
  }

  await message.reply({ embeds: [embed] });
}
