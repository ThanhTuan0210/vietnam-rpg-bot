"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotsCommand = slotsCommand;
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const REELS = ['🪙', '🏺', '🐉', '👑'];
async function slotsCommand(message, args) {
    const userId = message.author.id;
    const betAmount = parseInt(args[0], 10);
    if (isNaN(betAmount) || betAmount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vkl slots [số tiền cược]` (Ví dụ: `vkl slots 100`)');
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một phiên chơi chưa kết thúc!');
        return;
    }
    const deductSuccess = await UserService_1.UserService.deductDongAtomic(userId, betAmount);
    if (!deductSuccess) {
        session.unlock(userId);
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betAmount)} để quay Slots!`);
        return;
    }
    // Quay 3 trục ngẫu nhiên
    const r1 = REELS[Math.floor(Math.random() * REELS.length)];
    const r2 = REELS[Math.floor(Math.random() * REELS.length)];
    const r3 = REELS[Math.floor(Math.random() * REELS.length)];
    let multiplier = 0;
    let title = '💸 KHÔNG TRÚNG THƯỞNG';
    if (r1 === '🐉' && r2 === '🐉' && r3 === '🐉') {
        multiplier = 50;
        title = '🔥 JACKPOT NỔ HŨ HOÀNG CUNG x50!';
    }
    else if (r1 === '👑' && r2 === '👑' && r3 === '👑') {
        multiplier = 20;
        title = '👑 THẮNG VƯƠNG MIỆN x20!';
    }
    else if (r1 === '🏺' && r2 === '🏺' && r3 === '🏺') {
        multiplier = 10;
        title = '🏺 THẮNG CỔ VẬT x10!';
    }
    else if (r1 === '🪙' && r2 === '🪙' && r3 === '🪙') {
        multiplier = 5;
        title = '🪙 THẮNG ĐỒNG XU x5!';
    }
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        multiplier = 2;
        title = '✨ THẮNG ĐÔI x2!';
    }
    const winAmount = betAmount * multiplier;
    if (winAmount > 0) {
        await UserService_1.UserService.addDongAtomic(userId, winAmount);
    }
    session.unlock(userId);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(title)
        .setDescription(`🎰 **VÒNG QUAY NỔ HŨ HOÀNG CUNG** 🎰\n\n` +
        `[  ${r1}  |  ${r2}  |  ${r3}  ]\n\n` +
        (winAmount > 0
            ? `🎉 Chúc mừng! Bạn cược ${(0, formatters_1.formatDong)(betAmount)} và nhận về ${(0, formatters_1.formatDong)(winAmount)} (Lời +${(0, formatters_1.formatDong)(winAmount - betAmount)})!`
            : `❌ Rất tiếc không có hàng trùng! Bạn mất ${(0, formatters_1.formatDong)(betAmount)}.`));
    await message.reply({ embeds: [embed] });
}
