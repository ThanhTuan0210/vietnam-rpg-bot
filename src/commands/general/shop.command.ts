import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong, formatKimBao } from '../../utils/formatters';
import { getItemIcon, ITEMS } from '../../game/data/items';

export const BUA_TRU_TA_REGION_PRICES: Record<number, number> = {
  1: 10000,
  2: 25000,
  3: 60000,
  4: 150000,
  5: 400000,
};

export async function shopCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const user = await UserService.getOrCreateUser(userId);
  const firstArg = args[0]?.toLowerCase();

  // 🛍️ MEDIEVAL KYRISE SHOP CATALOG (GIÁ DỰ TRỮ KHẨN CẤP = GẤP ĐÔI 2X GIÁ THƯỜNG)
  const medievalShopCatalog: Record<string, { name: string; price: number; type: string; desc: string }> = {
    // Dược Phép & Hồi Phục (Giá x2)
    potion_01a: { name: ITEMS['potion_01a']?.name || 'Thuốc Hồi Máu HP', price: 200, type: 'Bào Chế', desc: 'Hồi phục 100 HP & MP ngay lập tức' },
    potion_02a: { name: ITEMS['potion_02a']?.name || 'Thuốc Hồi Mana MP', price: 300, type: 'Bào Chế', desc: 'Hồi phục 100 MP mana phép thuật' },
    potion_03a: { name: ITEMS['potion_03a']?.name || 'Ma Dược Cuồng Nộ', price: 1000, type: 'Bào Chế', desc: 'Tăng +20% Sát Thương (ATK) trong Ngục Tối' },

    // Vũ Khí & Giáp Sơ Cấp Trung Cổ (Giá x2)
    sword_01a: { name: ITEMS['sword_01a']?.name || 'Kiếm Sơ Cấp Trung Cổ', price: 2000, type: 'Rèn Đồ', desc: '+15 Sát Thương ATK Kị Sĩ' },
    shield_01a: { name: ITEMS['shield_01a']?.name || 'Khiên Thép Kị Sĩ', price: 2400, type: 'Rèn Đồ', desc: '+10 Phòng Thủ DEF' },
    staff_01a: { name: ITEMS['staff_01a']?.name || 'Trượng Gỗ Rừng Tinh Linh', price: 2000, type: 'Rèn Đồ', desc: '+20 Sát Thương Phép Magic ATK' },

    // Nguyên Liệu Rèn & Dụng Cụ (Giá x2)
    ingot_01a: { name: ITEMS['ingot_01a']?.name || 'Thỏi Đồng Cổ', price: 600, type: 'Quặng', desc: 'Nguyên liệu rèn vũ khí Tier 1' },
    crystal_01a: { name: ITEMS['crystal_01a']?.name || 'Tinh Thạch Thượng Cổ', price: 1600, type: 'Tinh Thạch', desc: 'Nguyên liệu kích rèn & khảm ngọc' },

    // Chìa Khóa & Sách Đặc Biệt (Giá x2)
    scroll_reset_job: { name: '📜 Sách Xóa Nghề Trung Cổ', price: 100000, type: 'Sách Phép', desc: 'Xóa ngay lập tức thời gian chờ 24h thực đổi Class Sản Xuất (PP)' },
    key_01a: { name: ITEMS['key_01a']?.name || 'Chìa Khóa Ngục Tối Tầng 1', price: 4000, type: 'Chìa Khóa', desc: 'Mở rương báu Goblin Rừng' },
    gift_01a: { name: ITEMS['gift_01a']?.name || 'Rương Báu Thần Bí', price: 10000, type: 'Rương Báu', desc: 'Mở ngẫu nhiên vũ khí & vàng' },
  };

  // Process Buy Command: vkl buy <itemId> <qty>
  if (firstArg === 'buy' || firstArg === 'mua') {
    const targetItemId = args[1]?.toLowerCase();
    const amount = Math.max(1, parseInt(args[2]) || 1);

    if (!targetItemId || !medievalShopCatalog[targetItemId]) {
      await message.reply('⚠️ **Vật phẩm không có trong Tiệm Dự Trữ!** Gõ `vkl shop` để xem danh sách.');
      return;
    }

    const item = medievalShopCatalog[targetItemId];
    const totalCost = item.price * amount;

    if (user.taiChinh.dong < totalCost) {
      await message.reply(`⚠️ **Không đủ Tiền Vàng!** Bạn cần **${formatDong(totalCost)}** để mua \`${amount}\`x \`${item.name}\`.`);
      return;
    }

    user.taiChinh.dong -= totalCost;
    await UserService.addItemAtomic(userId, targetItemId, amount);
    await user.save();

    const icon = getItemIcon(targetItemId);
    const embed = createDongSonEmbed()
      .setTitle('🛍️ MUA HÀNG DỰ TRỮ THÀNH CÔNG (EMERGENCY SHOP)')
      .setDescription(
        `🎉 **${username}** đã mua thành công:\n\n` +
          `• **${amount}x** ${icon} **${item.name}** (\`${targetItemId}\`)\n` +
          `💰 **Tổng chi phí (Giá Dự Trữ 2x):** \`${formatDong(totalCost)}\`\n\n` +
          `💡 *Vật phẩm đã được chuyển vào Túi Đồ (\`vkl i\`)!*`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // Display Medieval NPC Shop
  let shopItemsStr = '';
  Object.entries(medievalShopCatalog).forEach(([id, item]) => {
    const icon = getItemIcon(id);
    shopItemsStr += `${icon} **${item.name}** (\`${id}\`): **${formatDong(item.price)}** *(Giá 2x)*\n└ *${item.desc}*\n\n`;
  });

  const embed = createDongSonEmbed()
    .setTitle('🏛️ SHOP DỰ TRỮ KHẨN CẤP (EMERGENCY RESERVE SHOP — GIÁ 2X)')
    .setDescription(
      `🏛️ **THƯƠNG NHÂN DỰ TRỮ GOTHIC: Chào mừng ${username}!**\n\n` +
        `⚠️ **CHÚ Ý:** Vật phẩm trong Shop Dự Trữ Khẩn Cấp có **GIÁ GẤP ĐÔI (2x)** so với tự thu thập hoặc rèn đúc!\n\n` +
        `📌 **Cú pháp mua đồ nhanh:** \`vkl buy <mã_vật_phẩm> <số_lượng>\` (VD: \`vkl buy potion_01a 5\`)\n\n` +
        `📜 **DANH SÁCH VẬT PHẨM DỰ TRỮ (GIÁ DỰ TRỮ 2X):**\n\n${shopItemsStr}`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Xem Túi Đồ (vkl i)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung (vkl v)').setStyle(ButtonStyle.Success)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
