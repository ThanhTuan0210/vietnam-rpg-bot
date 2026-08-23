"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diemDanhCommand = diemDanhCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function diemDanhCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const cooldownCheck = UserService_1.UserService.checkDailyRewardCooldown(user);
    if (!cooldownCheck.isReady) {
        await message.reply(`⏰ Bạn đã điểm danh hôm nay rồi! Vui lòng quay lại sau **${cooldownCheck.formattedTime}**.`);
        return;
    }
    // Thưởng cơ bản
    const rewardDong = 5000 + user.canhGioi.capDo * 200;
    const rewardKimBao = 1;
    await UserService_1.UserService.addDongAtomic(userId, rewardDong);
    await User_model_1.UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': rewardKimBao } });
    await UserService_1.UserService.updateCooldownAtomic(userId, 'daily_reward', Date.now());
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎁 ĐIỂM DANH HÀNG NGÀY THÀNH CÔNG!')
        .setDescription(`Chúc mừng **${message.author.username}** đã thưởng ngoạn làng xóm hôm nay!\n\n` +
        `💰 **Phần thưởng:** +${(0, formatters_1.formatDong)(rewardDong)} | 💎 **+${rewardKimBao} Kim Bảo**\n\n` +
        `🔥 **Streak Bonus:** Hãy tiếp tục điểm danh hàng ngày để không bị ngắt chuỗi nhận Rương Báu!`);
    await message.reply({ embeds: [embed] });
}
