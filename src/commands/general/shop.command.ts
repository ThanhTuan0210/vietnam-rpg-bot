import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';
import { getItemIcon } from '../../game/data/items';

// 📈 HỆ THỐNG GIÁ THỊ TRƯỜNG ĐỘNG DẠNG ALBION ONLINE (ALBION MARKET DYNAMIC CURVE)
export const GLOBAL_MARKET_MULTIPLIERS: Record<string, number> = {
  potion_01a: 1.0,
  potion_02a: 1.0,
  potion_03a: 1.0,
  sword_01a: 1.0,
  shield_01a: 1.0,
  staff_01a: 1.0,
  ingot_01a: 1.0,
  crystal_01a: 1.0,
  scroll_reset_job: 1.0,
  key_01a: 1.0,
  gift_01a: 1.0,
};

export const BASE_SHOP_PRICES: Record<string, { name: string; basePrice: number; type: string; desc: string }> = {
  potion_01a: { name: 'Thuốc Hồi Máu HP Tier 1.1', basePrice: 2500, type: 'Bào Chế', desc: 'Hồi 100 HP (Gồm: Chi phí Thảo dược + Công hái/bào chế + Phụ phí dự trữ)' },
  potion_02a: { name: 'Thuốc Hồi Mana MP Tier 2.1', basePrice: 3500, type: 'Bào Chế', desc: 'Hồi 100 MP (Gồm: Chi phí Thảo dược + Công hái/bào chế + Phụ phí dự trữ)' },
  potion_03a: { name: 'Ma Dược Kích Rèn Tier 3.1', basePrice: 10000, type: 'Bào Chế', desc: '+20% ATK Ngục Tối (Gồm: Thảo dược hiếm + Công nung lò ma dược)' },
  sword_01a: { name: 'Thép Kiếm Gothic Tier 1', basePrice: 25000, type: 'Rèn Đồ', desc: '+15 ATK (Gồm: 3x Thỏi Kim Loại + 2x Gỗ Sồi + Công Thợ Rèn)' },
  shield_01a: { name: 'Khiên Thép Gothic Tier 1', basePrice: 30000, type: 'Rèn Đồ', desc: '+10 DEF (Gồm: 4x Thỏi Kim Loại + 3x Gỗ Sồi + Công Rèn Giáp)' },
  staff_01a: { name: 'Trượng Gỗ Rừng Tier 1', basePrice: 25000, type: 'Rèn Đồ', desc: '+20 Magic ATK (Gồm: 4x Gỗ Sồi + 2x Tinh Thạch + Công Điêu Khắc)' },
  ingot_01a: { name: 'Thỏi Kim Loại Tier 1.1', basePrice: 4500, type: 'Quặng', desc: 'Nguyên liệu rèn (Gồm: Quặng thô + Công đập mỏ & nung quặng 30s)' },
  crystal_01a: { name: 'Tinh Thạch Ma Thuật Tier 1.1', basePrice: 12000, type: 'Tinh Thạch', desc: 'Nguyên liệu rèn/khảm (Gồm: Đá phép + Công mài giũa ma thuật)' },
  scroll_reset_job: { name: '📜 Sách Xóa Nghề Trung Cổ', basePrice: 150000, type: 'Sách Phép', desc: 'Xóa ngay 24h CD (Gồm: Phép xóa ký ức + Công Đại Pháp Sư)' },
  key_01a: { name: 'Chìa Khóa Ngục Tối Tầng 1', basePrice: 20000, type: 'Chìa Khóa', desc: 'Mở rương báu (Gồm: Phôi chìa + Công đúc kim khí)' },
  gift_01a: { name: 'Rương Báu Thần Bí', basePrice: 50000, type: 'Rương Báu', desc: 'Mở ngẫu nhiên vũ khí (Gồm: Rương cổ + Chi phí bảo quản dự trữ)' },
};

export function getDynamicItemPrice(itemId: string): number {
  const item = BASE_SHOP_PRICES[itemId];
  if (!item) return 1000;
  const mult = GLOBAL_MARKET_MULTIPLIERS[itemId] || 1.0;
  return Math.floor(item.basePrice * mult);
}

export async function shopCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const user = await UserService.getOrCreateUser(userId);
  const firstArg = args[0]?.toLowerCase();

  // Process Buy Command: vkl buy <itemId> <qty>
  if (firstArg === 'buy' || firstArg === 'mua') {
    const targetItemId = args[1]?.toLowerCase();
    const amount = Math.max(1, parseInt(args[2]) || 1);

    if (amount > 5) {
      await message.reply('⛔ **GIỚI HẠN DỰ TRỮ KHẨN CẤP:** Tối đa chỉ được mua **5x vật phẩm** mỗi đơn hàng để chống thao túng thị trường!');
      return;
    }

    if (!targetItemId || !BASE_SHOP_PRICES[targetItemId]) {
      await message.reply('⚠️ **Vật phẩm không có trong Tiệm Dự Trữ!** Gõ `vkl shop` để xem danh sách.');
      return;
    }

    const currentPrice = getDynamicItemPrice(targetItemId);
    const totalCost = currentPrice * amount;

    if (user.taiChinh.dong < totalCost) {
      await message.reply(`⚠️ **Không đủ Tiền Vàng!** Bạn cần **${formatDong(totalCost)}** để mua \`${amount}\`x \`${BASE_SHOP_PRICES[targetItemId].name}\`.`);
      return;
    }

    user.taiChinh.dong -= totalCost;
    await UserService.addItemAtomic(userId, targetItemId, amount);
    await user.save();

    // ALBION DYNAMIC MARKET CURVE: Increase demand multiplier (+10% per item bought)
    const oldMult = GLOBAL_MARKET_MULTIPLIERS[targetItemId] || 1.0;
    const newMult = Math.min(3.0, oldMult + 0.1 * amount);
    GLOBAL_MARKET_MULTIPLIERS[targetItemId] = newMult;

    const icon = getItemIcon(targetItemId);
    const pricePercentStr = newMult > 1.0 ? ` (📈 Giá tăng +${Math.round((newMult - 1.0) * 100)}% do Cầu tăng!)` : '';

    const embed = createDongSonEmbed()
      .setTitle('📈 THỊ TRƯỜNG ĐỘNG ALBION — GIAO DỊCH THÀNH CÔNG')
      .setDescription(
        `🎉 **${username}** đã mua thành công:\n\n` +
          `• **${amount}x** ${icon} **${BASE_SHOP_PRICES[targetItemId].name}** (\`${targetItemId}\`)\n` +
          `💰 **Tổng chi phí:** \`${formatDong(totalCost)}\`\n` +
          `📈 **Cung Cầu Động (Albion Curve):** Nguồn Cầu tăng mạnh! Giá đơn vị hiện tại là **${formatDong(getDynamicItemPrice(targetItemId))}**${pricePercentStr}!\n\n` +
          `💡 *Vật phẩm đã được chuyển vào Túi Đồ (\`vkl i\`)! Hãy cân nhắc trao đổi (\`vkl trade\`) hoặc dùng Kho Vault (\`vkl vlt\`) với đồng đội để tiết kiệm Vàng!*`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // Display Albion Dynamic NPC Shop
  let shopItemsStr = '';
  Object.entries(BASE_SHOP_PRICES).forEach(([id, item]) => {
    const icon = getItemIcon(id);
    const dynPrice = getDynamicItemPrice(id);
    const mult = GLOBAL_MARKET_MULTIPLIERS[id] || 1.0;
    const trendIcon = mult > 1.0 ? '📈' : mult < 1.0 ? '📉' : '⚖️';
    const percentChange = Math.round((mult - 1.0) * 100);
    const changeStr = percentChange > 0 ? ` (+${percentChange}%)` : percentChange < 0 ? ` (${percentChange}%)` : ' (Gốc)';

    shopItemsStr += `${icon} **${item.name}** (\`${id}\`): **${formatDong(dynPrice)}** ${trendIcon}*${changeStr}*\n└ *${item.desc}*\n\n`;
  });

  const embed = createDongSonEmbed()
    .setTitle('📈 TIỆM DỰ TRỮ KHẨN CẤP — THỊ TRƯỜNG CUNG CẦU ĐỘNG ALBION')
    .setDescription(
      `🏛️ **THƯƠNG NHÂN DỰ TRỮ GOTHIC: Chào mừng ${username}!**\n\n` +
        `⚖️ **CƠ CHẾ THỊ TRƯỜNG ĐỘNG (ALBION MARKET CURVE):**\n` +
        `• 📈 **Khi bạn Mua:** Giá vật phẩm tăng **+10%** cho mỗi đơn vị (Do Nguồn Cầu Tăng).\n` +
        `• 📉 **Khi bạn Bán:** Giá vật phẩm giảm **-5%** cho mỗi đơn vị (Do Nguồn Cung Tăng).\n` +
        `• 🛑 **Giới hạn mua:** Tối đa **5x vật phẩm** mỗi đơn hàng để khuyến khích Người Chơi Tự Chế & Trao Đổi (\`vkl trade\`)!\n\n` +
        `📌 **Cú pháp mua đồ nhanh:** \`vkl buy <mã_vật_phẩm> <số_lượng>\` (VD: \`vkl buy potion_01a 2\`)\n\n` +
        `📜 **DANH SÁCH VẬT PHẨM VỚI GIÁ ĐỘNG HIỆN TẠI:**\n\n${shopItemsStr}`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Xem Túi Đồ (vkl i)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung (vkl v)').setStyle(ButtonStyle.Success)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
