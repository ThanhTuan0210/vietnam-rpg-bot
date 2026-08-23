"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taiXiuCommand = taiXiuCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function taiXiuCommand(message, args) {
    const userId = message.author.id;
    // Parse tiền cược
    const betAmount = parseInt(args[0], 10);
    if (isNaN(betAmount) || betAmount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vn taixiu [số tiền cược]` (Ví dụ: `vn taixiu 500`)');
        return;
    }
    // Session Lock
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một bàn cược chưa hoàn thành! Hãy kết thúc trước.');
        return;
    }
    // Trừ tiền cược Atomic
    const deductSuccess = await UserService_1.UserService.deductDongAtomic(userId, betAmount);
    if (!deductSuccess) {
        session.unlock(userId);
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betAmount)} để tham gia lắc Tài Xỉu!`);
        return;
    }
    // Action Row 2 Nút bấm Tài và Xỉu
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('taixiu_tai')
        .setLabel('🔴 TÀI (11 - 17 Điểm)')
        .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
        .setCustomId('taixiu_xiu')
        .setLabel('🔵 XỈU (4 - 10 Điểm)')
        .setStyle(discord_js_1.ButtonStyle.Primary));
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎲 LẮC TÀI XỈU DÂN GIAN')
        .setDescription(`Mức cược: ${(0, formatters_1.formatDong)(betAmount)}\n\nHãy chọn **🔴 TÀI** hoặc **🔵 XỈU** bên dưới trong vòng **60 giây**:`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const choice = i.customId.replace('taixiu_', ''); // 'tai' | 'xiu'
        // Lắc 3 viên xúc xắc (1 - 6)
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2 + d3;
        const isTriple = d1 === d2 && d2 === d3; // Bộ ba đồng nhất (Bão)
        let outcome = sum >= 11 ? 'tai' : 'xiu';
        if (isTriple)
            outcome = 'bao';
        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('disabled_tai')
            .setLabel('🔴 TÀI (11 - 17)')
            .setStyle(choice === 'tai' ? discord_js_1.ButtonStyle.Danger : discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true), new discord_js_1.ButtonBuilder()
            .setCustomId('disabled_xiu')
            .setLabel('🔵 XỈU (4 - 10)')
            .setStyle(choice === 'xiu' ? discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true));
        const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)();
        if (isTriple) {
            // Bão -> Nhà cái ăn hết!
            resultEmbed.setTitle('🌪️ XUẤT HIỆN BÃO ĐỒNG NHẤT (3 MẶT GIONG NHAU)!');
            resultEmbed.setDescription(`🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm**\n\n` +
                `⚡ **BÃO ĐỒNG NHẤT (${d1}-${d2}-${d3})!** Theo luật sòng bài, nhà cái nuốt trọn! Bạn mất ${(0, formatters_1.formatDong)(betAmount)}.`);
        }
        else if (choice === outcome) {
            // Thắng x2
            const winTotal = betAmount * 2;
            await UserService_1.UserService.addDongAtomic(userId, winTotal);
            resultEmbed.setTitle('🎉 KẾT QUẢ: BẠN ĐÃ THẮNG CƯỢC!');
            resultEmbed.setDescription(`🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm** (${outcome.toUpperCase()})\n\n` +
                `✨ Bạn đoán đúng **${choice.toUpperCase()}**! Nhận lại ${(0, formatters_1.formatDong)(winTotal)} (Lời +${(0, formatters_1.formatDong)(betAmount)})!`);
        }
        else {
            // Thua
            resultEmbed.setTitle('💸 KẾT QUẢ: THỦI THỦI CẢNH LÀNG');
            resultEmbed.setDescription(`🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm** (${outcome.toUpperCase()})\n\n` +
                `❌ Bạn đoán **${choice.toUpperCase()}** nhưng kết quả là **${outcome.toUpperCase()}**! Mất ${(0, formatters_1.formatDong)(betAmount)}.`);
        }
        await i.update({ embeds: [resultEmbed], components: [disabledRow] });
        session.unlock(userId);
        collector.stop('completed');
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            await UserService_1.UserService.addDongAtomic(userId, betAmount);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({
                content: '⏰ **Đã hết 60 giây!** Phiên Tài Xỉu đã hủy, tiền cược đã được hoàn lại.',
                components: [disabledRow],
            });
        }
    });
}
