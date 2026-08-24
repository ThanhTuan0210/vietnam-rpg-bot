import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { ITEMS, getItemIcon } from '../../game/data/items';

export async function tuiDoCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const embed = createDongSonEmbed().setTitle(`🎒 TÚI ĐỒ TRUNG CỔ — ${message.author.username.toUpperCase()}`);

  const inventorySlots = user.inventory && user.inventory.length > 0 ? user.inventory : user.tuiDo || [];

  if (!inventorySlots || inventorySlots.length === 0) {
    embed.setDescription('🎒 *Túi đồ của bạn đang trống rỗng. Gõ `vkl w` hoặc `vkl h` để đi làm thu thập tài nguyên!*');
    await message.reply({ embeds: [embed] });
    return;
  }

  const materialsList: string[] = [];
  const consumablesList: string[] = [];
  const equipmentList: string[] = [];

  for (const itemSlot of inventorySlots) {
    const qty = itemSlot.quantity || itemSlot.soLuong || 0;
    if (qty <= 0) continue;

    const itemId = itemSlot.itemId;
    const itemDef = ITEMS[itemId];
    const icon = getItemIcon(itemId);
    const line = `${icon} **${itemDef?.name || itemId}** (\`${itemId}\`): **x${qty}**`;

    if (!itemDef) {
      materialsList.push(line);
      continue;
    }

    const typeStr = (itemDef.type || '').toString();

    if (typeStr === 'nguyenlieu' || typeStr === 'quang' || typeStr === 'tinhthach' || typeStr === 'wood' || typeStr === 'ingot') {
      materialsList.push(line);
    } else if (typeStr === 'duoclieu' || typeStr === 'thuoc' || typeStr === 'potion') {
      consumablesList.push(line);
    } else {
      equipmentList.push(line);
    }
  }

  if (materialsList.length > 0) {
    embed.addFields({
      name: '📦 Nguyên Liệu & Quặng (Items)',
      value: materialsList.join('\n'),
      inline: true,
    });
  }

  if (consumablesList.length > 0) {
    embed.addFields({
      name: '🧪 Dược Phép & Tiêu Dùng (Consumables)',
      value: consumablesList.join('\n'),
      inline: true,
    });
  }

  if (equipmentList.length > 0) {
    embed.addFields({
      name: '⚔️ Trang Bị Medieval (Equipment)',
      value: equipmentList.join('\n'),
      inline: true,
    });
  }

  await message.reply({ embeds: [embed] });
}
