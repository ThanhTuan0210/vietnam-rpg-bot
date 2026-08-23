import { Message } from 'discord.js';
import { MerchantService } from '../../game/services/MerchantService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function thuongLaiCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const subCmd = args[0]?.toLowerCase();

  if (subCmd === 'mua') {
    const itemId = args[1]?.toLowerCase();
    if (!itemId) {
      await message.reply('⚠️ **Cú pháp:** `vn thuonglai mua [ngoc_tinh_xao / bua_cuong_hoa_dac_biet]`');
      return;
    }

    const res = await MerchantService.buyFlashSale(userId, itemId);
    await message.reply(res.message);
    return;
  }

  // Hiển thị Chợ Phiên Phố Hiến Flash Sale
  const items = MerchantService.getFlashSaleItems();

  const itemListStr = items
    .map(
      (i) =>
        `${i.icon} **${i.name}** (\`${i.id}\`) — Giá: ${formatDong(i.price)} | Số lượng còn: **${i.stock}** (\`vn thuonglai mua ${i.id}\`)`
    )
    .join('\n');

  const embed = createDongSonEmbed()
    .setTitle('👳 THƯƠNG LÁI VẮNG LAI — CHỢ PHIÊN PHỐ HIẾN')
    .setDescription(
      `Thương lái vãng lai dừng chân ghé thăm server trong **15 phút**!\n\n` +
        `🔥 **DANH SÁCH GIỜ VÀNG FLASH SALE (SỐ LƯỢNG CÓ HẠN TOÀN SERVER):**\n${itemListStr}\n\n` +
        `🌾 **THU MUA GIÁ GẤP ĐÔI:** Hôm nay thương lái thu mua **🌾 Lúa Nước** với giá **600 Đồng/bông**!`
    );

  await message.reply({ embeds: [embed] });
}
