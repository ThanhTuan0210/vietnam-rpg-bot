"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismantleCommand = dismantleCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function dismantleCommand(message, args) {
    const userId = message.author.id;
    const slotType = args[0]?.toLowerCase();
    if (slotType !== 'vukhi' && slotType !== 'aogiap' && slotType !== 'sword' && slotType !== 'armor') {
        await message.reply('⚠️ **Cú pháp phân tách chuẩn Epic RPG:** `vkl dismantle [vukhi / aogiap]` (Ví dụ: `vkl dismantle vukhi`)');
        return;
    }
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    const targetSlot = slotType === 'vukhi' || slotType === 'sword' ? 'vuKhi' : 'aoGiap';
    const itemSlot = user.trangBi[targetSlot];
    if (!itemSlot || !itemSlot.itemId) {
        await message.reply('❌ Bạn không đeo trang bị nào ở vị trí này để phân tách!');
        return;
    }
    // Rã trang bị thu hồi nguyên liệu & Bùa Cường Hóa
    await UserService_1.UserService.addItemAtomic(userId, 'bua_cuong_hoa_1', 1);
    await UserService_1.UserService.addItemAtomic(userId, 'quang_dong', 5);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔨 PHÂN TÁCH TRANG BỊ — THU HỒI NGUYÊN LIỆU')
        .setDescription(`Bạn đã rã trang bị và hoàn trả được:\n\n` +
        `• 🪨 **Quặng Đồng x5** (Thu hồi 50% nguyên liệu đúc)\n` +
        `• 📜 **1 Bùa Cường Hóa +1**!`);
    await message.reply({ embeds: [embed] });
}
