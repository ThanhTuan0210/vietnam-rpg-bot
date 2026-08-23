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
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
        return;
    }
    const { totalMaxHp } = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    if (user.chiSo.hp >= totalMaxHp) {
        await message.reply('❤️ **Lang Y nhắn:** Sinh lực của bạn đang sung mãn nhất (100% HP), không cần trị thương!');
        return;
    }
    // 1. Ưu tiên dùng Cơm Lam trong túi đồ
    const hasComLam = await UserService_1.UserService.consumeItemAtomic(userId, 'com_lam', 1);
    if (hasComLam) {
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🍙 DƯỠNG THƯƠNG BẰNG CƠM LAM')
            .setDescription(`Bạn đã thưởng thức một ống **Cơm Lam** thơm dẻo linh khí đất trời, hồi phục **100% Sinh Lực & Mana**!\n\n${(0, formatters_1.renderHpBar)(totalMaxHp, totalMaxHp)}`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 2. Tính Phí Dưỡng Thương theo công thức chuẩn: Level * 120 * (1 - HP_Current / HP_Max)
    const currentHp = Math.max(0, user.chiSo.hp);
    const hpMissingRatio = 1 - currentHp / totalMaxHp;
    const healCost = Math.max(20, Math.floor(user.canhGioi.capDo * 120 * hpMissingRatio));
    const paidSuccess = await UserService_1.UserService.deductDongAtomic(userId, healCost);
    if (!paidSuccess) {
        await message.reply(`❌ **Lang Y lắc đầu:** Bạn không có **Cơm Lam** và cũng không đủ ${(0, formatters_1.formatDong)(healCost)} để chi trả tiền thuốc thang!`);
        return;
    }
    await UserService_1.UserService.healUserAtomic(userId);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🏥 LANG Y LÀNG CHỮA BỆNH')
        .setDescription(`Bạn đã chi trả ${(0, formatters_1.formatDong)(healCost)} cho Lang Y làng để đắp thuốc lá rừng. Sinh lực đã được phục hồi hoàn toàn!\n\n${(0, formatters_1.renderHpBar)(totalMaxHp, totalMaxHp)}`);
    await message.reply({ embeds: [embed] });
}
