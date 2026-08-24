"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weeklyCommand = weeklyCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function weeklyCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const lastUsed = user.cooldowns?.get('weekly_reward') || 0;
    const now = Date.now();
    const weeklyMs = 604800000; // 7 ngày = 7 * 24 * 3600 * 1000
    if (now - lastUsed < weeklyMs) {
        const remSec = Math.ceil((weeklyMs - (now - lastUsed)) / 1000);
        const days = Math.floor(remSec / 86400);
        const hours = Math.floor((remSec % 86400) / 3600);
        const minutes = Math.floor((remSec % 3600) / 60);
        await message.reply(`⏰ **Hoàng Gia nhắn:** Bạn đã nhận phần thưởng hàng tuần rồi! Vui lòng quay lại sau **${days}d ${hours}h ${minutes}m**.`);
        return;
    }
    const rewardVang = 50000 + user.canhGioi.capDo * 2000;
    await UserService_1.UserService.addDongAtomic(userId, rewardVang);
    await UserService_1.UserService.addItemAtomic(userId, 'gift_01a', 1);
    await UserService_1.UserService.addItemAtomic(userId, 'scroll_reset_job', 1);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'weekly_reward', Date.now());
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎁 PHẦN THƯỞNG HÀNG TUẦN — KYRISE MEDIEVAL')
        .setDescription(`🛡️ Chúc mừng Kị Sĩ **${message.author.username}** đã kiên trì chinh chiến bảo vệ Vương Quốc suốt tuần qua!\n\n` +
        `💰 **Phần Thưởng Hàng Tuần:** \`+${(0, formatters_1.formatDong)(rewardVang)}\` Vàng\n` +
        `🧰 **Báu Vật Hoàng Gia:** \`1x Rương Báu Thượng Cổ (gift_01a)\` | \`1x Sách Xóa Nghề (scroll_reset_job)\`!\n\n` +
        `💡 *Mở Rương Báu Thượng Cổ (\`vkl open gift_01a\`) để thu thập trang bị hiếm!*`);
    await message.reply({ embeds: [embed] });
}
