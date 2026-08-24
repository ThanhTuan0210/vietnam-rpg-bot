"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diemDanhCommand = diemDanhCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function diemDanhCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const cooldownCheck = UserService_1.UserService.checkDailyRewardCooldown(user);
    if (!cooldownCheck.isReady) {
        await message.reply(`⏰ **Hoàng Gia nhắn:** Bạn đã điểm danh hôm nay rồi! Vui lòng quay lại sau **${cooldownCheck.formattedTime}**.`);
        return;
    }
    // Thưởng cơ bản
    const rewardVang = 10000 + user.canhGioi.capDo * 500;
    await UserService_1.UserService.addDongAtomic(userId, rewardVang);
    await UserService_1.UserService.addItemAtomic(userId, 'potion_01a', 1);
    await UserService_1.UserService.addItemAtomic(userId, 'key_01a', 1);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'daily_reward', Date.now());
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎁 ĐIỂM DANH HÀNG NGÀY — KYRISE MEDIEVAL')
        .setDescription(`⚔️ Chào mừng Kị Sĩ **${message.author.username}** đã tuần tra bảo vệ Vương Quốc Gothic hôm nay!\n\n` +
        `💰 **Phần Thưởng Hàng Ngày:** \`+${(0, formatters_1.formatDong)(rewardVang)}\` Vàng\n` +
        `🧪 **Vật Phẩm Kèm Theo:** \`1x Thuốc Hồi Máu HP (potion_01a)\` | \`1x Chìa Khóa Ngục Tối (key_01a)\`!\n\n` +
        `💡 *Dùng Thuốc HP (\`vkl use potion_01a\`) để duy trì sinh lực đi săn quái!*`);
    await message.reply({ embeds: [embed] });
}
