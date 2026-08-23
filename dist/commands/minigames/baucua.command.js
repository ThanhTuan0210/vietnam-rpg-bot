"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bauCuaCommand = bauCuaCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const OPTIONS = [
    { id: 'bau', name: 'Bầu', emoji: '🍐' },
    { id: 'cua', name: 'Cua', emoji: '🦀' },
    { id: 'tom', name: 'Tôm', emoji: '🦐' },
    { id: 'ca', name: 'Cá', emoji: '🐟' },
    { id: 'ga', name: 'Gà', emoji: '🐓' },
    { id: 'nai', name: 'Nai', emoji: '🦌' },
];
async function bauCuaCommand(message, args) {
    const userId = message.author.id;
    // 1. Parse số tiền cược
    const betAmount = parseInt(args[0], 10);
    if (isNaN(betAmount) || betAmount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vn baucua [số tiền cược]` (Ví dụ: `vn baucua 100`)');
        return;
    }
    // 2. Session Lock
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một phiên cược / trận đấu chưa kết thúc! Hãy hoàn tất trước.');
        return;
    }
    // 3. Kiểm tra số dư và trừ tiền cược Atomic
    const deductSuccess = await UserService_1.UserService.deductDongAtomic(userId, betAmount);
    if (!deductSuccess) {
        session.unlock(userId);
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betAmount)} để tham gia đặt cược!`);
        return;
    }
    // 4. Tạo 6 Nút bấm đại diện 6 linh vật dân gian
    const row1 = new discord_js_1.ActionRowBuilder();
    const row2 = new discord_js_1.ActionRowBuilder();
    OPTIONS.slice(0, 3).forEach((opt) => {
        row1.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`baucua_${opt.id}`)
            .setLabel(opt.name)
            .setEmoji(opt.emoji)
            .setStyle(discord_js_1.ButtonStyle.Primary));
    });
    OPTIONS.slice(3, 6).forEach((opt) => {
        row2.addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`baucua_${opt.id}`)
            .setLabel(opt.name)
            .setEmoji(opt.emoji)
            .setStyle(discord_js_1.ButtonStyle.Primary));
    });
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎲 BẦU CUA TÔM CÁ DÂN GIAN')
        .setDescription(`Mức tiền cược: ${(0, formatters_1.formatDong)(betAmount)}\n\nHãy bấm chọn cửa cược của bạn dưới đây trong vòng **60 giây**:`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row1, row2] });
    // 5. Collector lắng nghe thao tác Nút bấm
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const chosenId = i.customId.replace('baucua_', '');
        const chosenOption = OPTIONS.find((o) => o.id === chosenId);
        // Lắc 3 quân xúc xắc
        const roll1 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
        const roll2 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
        const roll3 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
        const results = [roll1, roll2, roll3];
        const matchCount = results.filter((r) => r.id === chosenId).length;
        // Tính tiền trả thưởng: Trúng 1 con ăn x1 (+bet), trúng 2 ăn x2 (+2bet), trúng 3 ăn x3 (+3bet)
        // Nếu matchCount > 0, hoàn tiền gốc + tiền thắng = betAmount + (matchCount * betAmount)
        let winAmount = 0;
        if (matchCount > 0) {
            winAmount = betAmount * (matchCount + 1);
            await UserService_1.UserService.addDongAtomic(userId, winAmount);
        }
        // Disable buttons
        const disabledRow1 = new discord_js_1.ActionRowBuilder();
        const disabledRow2 = new discord_js_1.ActionRowBuilder();
        row1.components.forEach((btn) => disabledRow1.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
        row2.components.forEach((btn) => disabledRow2.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
        const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)();
        if (matchCount > 0) {
            const netProfit = betAmount * matchCount;
            resultEmbed.setTitle('🎉 KẾT QUẢ: THẮNG LỚN BẦU CUA!');
            resultEmbed.setDescription(`Bạn đặt cược cửa: ${chosenOption.emoji} **${chosenOption.name}**\n\n` +
                `🎲 **Kết quả lắc xúc xắc:** ${roll1.emoji} ${roll2.emoji} ${roll3.emoji}\n\n` +
                `✨ Trúng **${matchCount}** hình! Bạn nhận về ${(0, formatters_1.formatDong)(winAmount)} (Lời +${(0, formatters_1.formatDong)(netProfit)})!`);
        }
        else {
            resultEmbed.setTitle('💸 KẾT QUẢ: THỦI THỦI CẢNH LÀNG');
            resultEmbed.setDescription(`Bạn đặt cược cửa: ${chosenOption.emoji} **${chosenOption.name}**\n\n` +
                `🎲 **Kết quả lắc xúc xắc:** ${roll1.emoji} ${roll2.emoji} ${roll3.emoji}\n\n` +
                `❌ Rất tiếc không có hình bạn chọn! Bạn mất ${(0, formatters_1.formatDong)(betAmount)}.`);
        }
        await i.update({ embeds: [resultEmbed], components: [disabledRow1, disabledRow2] });
        session.unlock(userId);
        collector.stop('completed');
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            // Hết hạn 60s -> Hoàn tiền cược & disable buttons
            await UserService_1.UserService.addDongAtomic(userId, betAmount);
            const disabledRow1 = new discord_js_1.ActionRowBuilder();
            const disabledRow2 = new discord_js_1.ActionRowBuilder();
            row1.components.forEach((btn) => disabledRow1.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            row2.components.forEach((btn) => disabledRow2.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({
                content: '⏰ **Đã hết 60 giây!** Phiên cược bị hủy, tiền cược đã được hoàn lại.',
                components: [disabledRow1, disabledRow2],
            });
        }
    });
}
