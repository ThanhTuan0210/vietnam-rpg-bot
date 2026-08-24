import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { ITEMS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';
import { GLOBAL_MARKET_MULTIPLIERS } from './shop.command';

export async function banCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const user = await UserModelAdvanced.findOne({ userId });

  if (!user || !user.hePhai) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl start`.');
    return;
  }

  const subCmd = args[0]?.toLowerCase();

  // 1. CƠ CHẾ BÁN TẤT CẢ TÀI NGUYÊN RÁC CHUẨN EPIC RPG (`vkl sell all` / `vkl ban tatca`)
  if (subCmd === 'all' || subCmd === 'tatca') {
    const lootTypes = ['nguyenlieu', 'duoclieu'];
    let totalRevenue = 0;
    const soldList: { itemId: string; name: string; qty: number; revenue: number }[] = [];

    const remainingInventory = [];

    for (const itemSlot of user.tuiDo) {
      const itemDef = ITEMS[itemSlot.itemId];
      if (itemDef && lootTypes.includes(itemDef.type) && itemSlot.soLuong > 0) {
        // Tăng +8% tiền thưởng bán hàng giúp người chơi dễ thở hơn
        const itemRevenue = Math.floor(itemSlot.soLuong * (itemDef.sellPrice || 500) * 1.08);
        totalRevenue += itemRevenue;
        soldList.push({ itemId: itemSlot.itemId, name: itemDef.name, qty: itemSlot.soLuong, revenue: itemRevenue });

        // Giảm -8% giá thị trường Albion do nguồn cung tràn ngập
        if (GLOBAL_MARKET_MULTIPLIERS[itemSlot.itemId] !== undefined) {
          const oldMult = GLOBAL_MARKET_MULTIPLIERS[itemSlot.itemId] || 1.0;
          GLOBAL_MARKET_MULTIPLIERS[itemSlot.itemId] = Math.max(0.5, oldMult - 0.08 * itemSlot.soLuong);
        }
      } else {
        remainingInventory.push(itemSlot);
      }
    }

    if (soldList.length === 0) {
      await message.reply('⚠️ Trong túi đồ của bạn không có tài nguyên rác nào để bán!');
      return;
    }

    // Cập nhật CSDL
    await UserModelAdvanced.updateOne({ userId }, { $set: { tuiDo: remainingInventory } });
    await UserService.addDongAtomic(userId, totalRevenue);

    const soldSummaryStr = soldList
      .map((s) => `• **${s.name}** (\`${s.itemId}\`) **x${s.qty}** ➔ +${formatDong(s.revenue)}`)
      .join('\n');

    const embed = createDongSonEmbed()
      .setTitle('💰 THU HOẠCH — BÁN TẤT CẢ TÀI NGUYÊN RÁC')
      .setDescription(
        `Bán tự động tất cả tài nguyên trong túi đồ (🎁 **Đã cộng +8% Tiền Thưởng Thương Lái**):\n\n` +
          `${soldSummaryStr}\n\n` +
          `💵 **TỔNG TIỀN VÀNG THU VỀ:** **+${formatDong(totalRevenue)}**!\n` +
          `📉 **Thị Trường Albion:** Nguồn cung tràn ngập! Giá mua lại giảm -8% mỗi đơn vị trong Tiệm Dự Trữ!`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // 2. CƠ CHẾ BÁN TỪNG MÓN (`vkl sell [mã_item] [số_lượng]`)
  const itemId = args[0]?.toLowerCase();
  const qty = parseInt(args[1], 10) || 1;

  if (!itemId) {
    await message.reply(
      '⚠️ **Cú pháp bán chuẩn Epic RPG:**\n' +
        '• Bán tất cả tài nguyên rác: `vkl sell all` hoặc `vkl ban tatca`\n' +
        '• Bán từng món: `vkl sell [mã_vật_phẩm] [số_lượng]` (Ví dụ: `vkl sell ingot_01a 5`)'
    );
    return;
  }

  const itemDef = ITEMS[itemId];
  if (!itemDef) {
    await message.reply('❌ Mã vật phẩm không hợp lệ!');
    return;
  }

  const consumed = await UserService.consumeItemAtomic(userId, itemId, qty);
  if (!consumed) {
    await message.reply(`❌ Bạn không sở hữu đủ **${qty}x ${itemDef.name}** (\`${itemId}\`) để bán!`);
    return;
  }

  // Tăng +8% giá tiền thu về khi bán lẻ giúp người chơi dễ thở hơn
  const basePrice = itemDef.sellPrice || 500;
  const totalEarned = Math.floor(basePrice * qty * 1.08);
  await UserService.addDongAtomic(userId, totalEarned);

  // ALBION DYNAMIC MARKET CURVE: Giảm -8% giá thị trường do Nguồn Cung tăng
  if (GLOBAL_MARKET_MULTIPLIERS[itemId] !== undefined) {
    const oldMult = GLOBAL_MARKET_MULTIPLIERS[itemId] || 1.0;
    GLOBAL_MARKET_MULTIPLIERS[itemId] = Math.max(0.5, oldMult - 0.08 * qty);
  }

  const embed = createDongSonEmbed()
    .setTitle('💰 BÁN HÀNG THÀNH CÔNG — THỊ TRƯỜNG ALBION')
    .setDescription(
      `Bạn đã bán **${qty}x ${itemDef.name}** (\`${itemId}\`) và thu về **+${formatDong(totalEarned)}** (🎁 **Đã trợ giá +8% Thưởng Bán Hàng**)!\n` +
        `📉 **Thị Trường Albion:** Nguồn Cung tăng làm giá vật phẩm này giảm -${8 * qty}% trong Tiệm Dự Trữ!`
    );

  await message.reply({ embeds: [embed] });
}
