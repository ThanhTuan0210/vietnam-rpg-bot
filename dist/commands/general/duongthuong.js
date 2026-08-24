"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duongThuongCommand = duongThuongCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const User_model_1 = require("../../database/models/User.model");
async function duongThuongCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
        return;
    }
    const { totalMaxHp } = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    if (user.chiSo.hp >= totalMaxHp) {
        await message.reply('❤️ **Lang Y Gothic nhắn:** Sinh lực của bạn đang sung mãn nhất (100% HP), không cần trị thương!');
        return;
    }
    // 1. Ưu tiên dùng Thuốc Hồi HP (potion_01a) trong túi đồ
    const hasPotion = await UserService_1.UserService.consumeItemAtomic(userId, 'potion_01a', 1);
    if (hasPotion) {
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 DƯỠNG THƯƠNG BẰNG THUỐC HỒI MÁU (POTION HP)')
            .setDescription(`Bạn đã uống một bình **Thuốc Hồi Máu HP (potion_01a)**, hồi phục **100% Sinh Lực & Mana**!\n\n${(0, formatters_1.renderHpBar)(totalMaxHp, totalMaxHp)}`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 2. Tính Phí Dưỡng Thương
    const currentHp = Math.max(0, user.chiSo.hp);
    const hpMissingRatio = 1 - currentHp / totalMaxHp;
    const healCost = Math.max(20, Math.floor(user.canhGioi.capDo * 120 * hpMissingRatio));
    const paidSuccess = await UserService_1.UserService.deductDongAtomic(userId, healCost);
    if (!paidSuccess) {
        await message.reply(`❌ **Lang Y Gothic lắc đầu:** Bạn không có **Thuốc Hồi Máu HP** và cũng không đủ ${(0, formatters_1.formatDong)(healCost)} để chi trả tiền thuốc thang!`);
        return;
    }
    await UserService_1.UserService.healUserAtomic(userId);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🏥 DƯỠNG THƯƠNG TRUNG CỔ (MEDIEVAL HEAL)')
        .setDescription(`💊 **Chữa trị hoàn tất:** Bạn đã thanh toán **${(0, formatters_1.formatDong)(healCost)}** để phục hồi 100% Sinh Lực!\n\n${(0, formatters_1.renderHpBar)(totalMaxHp, totalMaxHp)}`);
    await message.reply({ embeds: [embed] });
}
