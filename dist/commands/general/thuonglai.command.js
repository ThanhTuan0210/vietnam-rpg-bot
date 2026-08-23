"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thuongLaiCommand = thuongLaiCommand;
const MerchantService_1 = require("../../game/services/MerchantService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function thuongLaiCommand(message, args) {
    const userId = message.author.id;
    const subCmd = args[0]?.toLowerCase();
    if (subCmd === 'mua') {
        const itemId = args[1]?.toLowerCase();
        if (!itemId) {
            await message.reply('⚠️ **Cú pháp:** `vn thuonglai mua [ngoc_tinh_xao / bua_cuong_hoa_dac_biet]`');
            return;
        }
        const res = await MerchantService_1.MerchantService.buyFlashSale(userId, itemId);
        await message.reply(res.message);
        return;
    }
    // Hiển thị Chợ Phiên Phố Hiến Flash Sale
    const items = MerchantService_1.MerchantService.getFlashSaleItems();
    const itemListStr = items
        .map((i) => `${i.icon} **${i.name}** (\`${i.id}\`) — Giá: ${(0, formatters_1.formatDong)(i.price)} | Số lượng còn: **${i.stock}** (\`vn thuonglai mua ${i.id}\`)`)
        .join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('👳 THƯƠNG LÁI VẮNG LAI — CHỢ PHIÊN PHỐ HIẾN')
        .setDescription(`Thương lái vãng lai dừng chân ghé thăm server trong **15 phút**!\n\n` +
        `🔥 **DANH SÁCH GIỜ VÀNG FLASH SALE (SỐ LƯỢNG CÓ HẠN TOÀN SERVER):**\n${itemListStr}\n\n` +
        `🌾 **THU MUA GIÁ GẤP ĐÔI:** Hôm nay thương lái thu mua **🌾 Lúa Nước** với giá **600 Đồng/bông**!`);
    await message.reply({ embeds: [embed] });
}
