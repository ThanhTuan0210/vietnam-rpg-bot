"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banCommand = banCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function banCommand(message, args) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl start`.');
        return;
    }
    const subCmd = args[0]?.toLowerCase();
    // 1. CƠ CHẾ BÁN TẤT CẢ TÀI NGUYÊN RÁC CHUẨN EPIC RPG (`vkl sell all` / `vkl ban tatca`)
    if (subCmd === 'all' || subCmd === 'tatca') {
        const lootTypes = ['nguyenlieu', 'duoclieu'];
        let totalRevenue = 0;
        const soldList = [];
        const remainingInventory = [];
        for (const itemSlot of user.tuiDo) {
            const itemDef = items_1.ITEMS[itemSlot.itemId];
            if (itemDef && lootTypes.includes(itemDef.type) && itemSlot.soLuong > 0) {
                const itemRevenue = itemSlot.soLuong * itemDef.sellPrice;
                totalRevenue += itemRevenue;
                soldList.push({ itemId: itemSlot.itemId, name: itemDef.name, qty: itemSlot.soLuong, revenue: itemRevenue });
            }
            else {
                remainingInventory.push(itemSlot);
            }
        }
        if (soldList.length === 0) {
            await message.reply('⚠️ Trong túi đồ của bạn không có tài nguyên rác nào để bán!');
            return;
        }
        // Cập nhật CSDL
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { tuiDo: remainingInventory } });
        await UserService_1.UserService.addDongAtomic(userId, totalRevenue);
        const soldSummaryStr = soldList
            .map((s) => `• **${s.name}** (\`${s.itemId}\`) **x${s.qty}** ➔ +${(0, formatters_1.formatDong)(s.revenue)}`)
            .join('\n');
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('💰 THU HOẠCH — BÁN TẤT CẢ TÀI NGUYÊN RÁC')
            .setDescription(`Bán tự động tất cả nông sản & phôi quặng trong túi đồ:\n\n` +
            `${soldSummaryStr}\n\n` +
            `💵 **TỔNG TIỀN ĐỒNG THU VỀ:** **+${(0, formatters_1.formatDong)(totalRevenue)}**!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 2. CƠ CHẾ BÁN TỪNG MÓN (`vkl sell [mã_item] [số_lượng]`)
    const itemId = args[0]?.toLowerCase();
    const qty = parseInt(args[1], 10) || 1;
    if (!itemId) {
        await message.reply('⚠️ **Cú pháp bán chuẩn Epic RPG:**\n' +
            '• Bán tất cả tài nguyên rác: `vkl sell all` hoặc `vkl ban tatca`\n' +
            '• Bán từng món: `vkl sell [mã_vật_phẩm] [số_lượng]` (Ví dụ: `vkl sell go_tre_gai 10`)');
        return;
    }
    const itemDef = items_1.ITEMS[itemId];
    if (!itemDef) {
        await message.reply('❌ Mã vật phẩm không hợp lệ!');
        return;
    }
    const consumed = await UserService_1.UserService.consumeItemAtomic(userId, itemId, qty);
    if (!consumed) {
        await message.reply(`❌ Bạn không sở hữu đủ **${qty}x ${itemDef.name}** (\`${itemId}\`) để bán!`);
        return;
    }
    const totalEarned = itemDef.sellPrice * qty;
    await UserService_1.UserService.addDongAtomic(userId, totalEarned);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('💰 BÁN HÀNG THÀNH CÔNG!')
        .setDescription(`Bạn đã bán **${qty}x ${itemDef.name}** (\`${itemId}\`) và thu về **+${(0, formatters_1.formatDong)(totalEarned)}**!`);
    await message.reply({ embeds: [embed] });
}
