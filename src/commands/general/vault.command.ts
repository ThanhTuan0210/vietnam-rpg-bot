import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { getItemIcon, ITEMS } from '../../game/data/items';

// Global Squad Vault store for 3-5 players
const SQUAD_VAULT: Record<string, number> = {
  ingot_01a: 15,
  crystal_01a: 8,
  potion_01a: 10,
  key_01a: 5,
};

export async function vaultCommand(message: Message, args: string[]): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);
  const action = args[0]?.toLowerCase();
  const itemId = args[1]?.toLowerCase();
  const amount = parseInt(args[2]) || 1;

  // Support 3-letter prefix: dep, deposit
  if ((action === 'dep' || action === 'deposit') && itemId) {
    const itemSlot = user.inventory.find((i: any) => i.itemId.toLowerCase() === itemId);
    if (!itemSlot || itemSlot.quantity < amount) {
      await message.reply(`⚠️ **Không đủ vật phẩm!** Bạn không có đủ \`${amount}\` x \`${itemId}\` trong túi đồ.`);
      return;
    }

    itemSlot.quantity -= amount;
    if (itemSlot.quantity <= 0) {
      user.inventory = user.inventory.filter((i: any) => i.itemId.toLowerCase() !== itemId);
    }

    SQUAD_VAULT[itemId] = (SQUAD_VAULT[itemId] || 0) + amount;
    await user.save();

    const icon = getItemIcon(itemId);
    const embed = createDongSonEmbed()
      .setTitle('📥 ĐÃ THẢ VẬT PHẨM VÀO KHO VAULT CHUNG!')
      .setDescription(
        `🎉 **${message.author.username}** đã gửi thành công:\n\n` +
          `• **${amount}x** ${icon} \`${itemId}\` ➔ **Kho Vault Tổ Đội**\n\n` +
          `💡 *Đồng đội trong nhóm 3-5 người có thể rút ra dùng rèn đồ & chiến đấu bất cứ lúc nào!*`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // Support 3-letter prefix: wth, withdraw
  if ((action === 'wth' || action === 'withdraw') && itemId) {
    const vaultQty = SQUAD_VAULT[itemId] || 0;
    if (vaultQty < amount) {
      await message.reply(`⚠️ **Kho Vault không đủ hàng!** Hiện chỉ có \`${vaultQty}\` x \`${itemId}\` trong Kho.`);
      return;
    }

    SQUAD_VAULT[itemId] -= amount;
    if (SQUAD_VAULT[itemId] <= 0) {
      delete SQUAD_VAULT[itemId];
    }

    const existingSlot = user.inventory.find((i: any) => i.itemId.toLowerCase() === itemId);
    if (existingSlot) {
      existingSlot.quantity += amount;
    } else {
      user.inventory.push({ itemId, quantity: amount });
    }
    await user.save();

    const icon = getItemIcon(itemId);
    const embed = createDongSonEmbed()
      .setTitle('📤 ĐÃ RÚT VẬT PHẨM TỪ KHO VAULT CHUNG!')
      .setDescription(
        `🎉 **${message.author.username}** đã rút thành công:\n\n` +
          `• **${amount}x** ${icon} \`${itemId}\` ➔ **Vào Túi Đồ Cá Nhân**`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // Display Squad Vault
  const vaultItems = Object.entries(SQUAD_VAULT);
  let vaultListStr = '';

  if (vaultItems.length === 0) {
    vaultListStr = '⚠️ *Kho Vault hiện tại đang trống!*';
  } else {
    vaultListStr = vaultItems
      .map(([id, qty]) => {
        const icon = getItemIcon(id);
        const name = ITEMS[id]?.name || id;
        return `• ${icon} **${name}** (\`${id}\`): **x${qty}**`;
      })
      .join('\n');
  }

  const embed = createDongSonEmbed()
    .setTitle('📦 KHO TÀI NGUYÊN CHUNG TỔ ĐỘI (SQUAD VAULT)')
    .setDescription(
      `🏛️ **Kho Hợp Tác Xã Dành Cho Nhóm 3-5 Bạn Bè**\n\n` +
        `📊 **Danh mục tài nguyên trong Kho:**\n${vaultListStr}\n\n` +
        `📌 **Cú pháp Tiếng Anh 3 chữ đầu tiện lợi:**\n` +
        `• Gửi đồ vào Kho: \`vkl vlt dep <mã_đồ> <số_lượng>\` (VD: \`vkl vlt dep ingot_01a 5\`)\n` +
        `• Rút đồ từ Kho: \`vkl vlt wth <mã_đồ> <số_lượng>\` (VD: \`vkl vlt wth ingot_01a 5\`)`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ Cá Nhân').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_craft').setLabel('🔨 Lò Rèn').setStyle(ButtonStyle.Success)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
