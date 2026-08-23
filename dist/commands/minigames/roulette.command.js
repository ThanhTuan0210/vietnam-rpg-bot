"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rouletteCommand = rouletteCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
async function rouletteCommand(message, args) {
    const userId = message.author.id;
    const betAmount = parseInt(args[0], 10);
    if (isNaN(betAmount) || betAmount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vn roulette [số tiền cược]` (Ví dụ: `vn roulette 200`)');
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một phiên cược chưa hoàn thành!');
        return;
    }
    const deductSuccess = await UserService_1.UserService.deductDongAtomic(userId, betAmount);
    if (!deductSuccess) {
        session.unlock(userId);
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betAmount)} để quay Roulette!`);
        return;
    }
    // Select Menu lựa chọn cửa cược
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('roulette_select')
        .setPlaceholder('🎯 Chọn cửa cược Roulette của bạn...')
        .addOptions(new discord_js_1.StringSelectMenuOptionBuilder().setLabel('🔴 Cửa Đỏ (Red - Thưởng x2)').setValue('red').setEmoji('🔴'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('⚫ Cửa Đen (Black - Thưởng x2)').setValue('black').setEmoji('⚫'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('🔢 Cửa Chẵn (Even - Thưởng x2)').setValue('even').setEmoji('⚖️'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('⚡ Cửa Lẻ (Odd - Thưởng x2)').setValue('odd').setEmoji('⚡'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('🟢 Con Số May Mắn 0 (Thưởng x36)').setValue('num_0').setEmoji('🟢'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('🔥 Con Số May Mắn 7 (Thưởng x36)').setValue('num_7').setEmoji('🔥'), new discord_js_1.StringSelectMenuOptionBuilder().setLabel('👑 Con Số May Mắn 18 (Thưởng x36)').setValue('num_18').setEmoji('👑'));
    const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎡 ROULETTE QUỐC TẾ')
        .setDescription(`Mức cược: ${(0, formatters_1.formatDong)(betAmount)}\n\nHãy chọn cửa cược trong Select Menu bên dưới (60s):`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.StringSelect,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const choice = i.values[0];
        // Quay số ngẫu nhiên từ 0 đến 36
        const landedNumber = Math.floor(Math.random() * 37);
        const isRed = RED_NUMBERS.includes(landedNumber);
        const isZero = landedNumber === 0;
        let isWin = false;
        let multiplier = 0;
        if (choice === 'red' && isRed && !isZero) {
            isWin = true;
            multiplier = 2;
        }
        else if (choice === 'black' && !isRed && !isZero) {
            isWin = true;
            multiplier = 2;
        }
        else if (choice === 'even' && landedNumber % 2 === 0 && !isZero) {
            isWin = true;
            multiplier = 2;
        }
        else if (choice === 'odd' && landedNumber % 2 !== 0 && !isZero) {
            isWin = true;
            multiplier = 2;
        }
        else if (choice.startsWith('num_')) {
            const targetNum = parseInt(choice.replace('num_', ''), 10);
            if (landedNumber === targetNum) {
                isWin = true;
                multiplier = 36;
            }
        }
        const winAmount = betAmount * multiplier;
        if (winAmount > 0) {
            await UserService_1.UserService.addDongAtomic(userId, winAmount);
        }
        const colorEmoji = isZero ? '🟢' : isRed ? '🔴' : '⚫';
        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
        const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)();
        if (isWin) {
            resultEmbed.setTitle('🎉 KẾT QUẢ ROULETTE: THẮNG CƯỢC!');
            resultEmbed.setDescription(`🎡 **Quả bóng rơi vào số:** ${colorEmoji} **${landedNumber}**\n\n` +
                `✨ Bạn chọn cửa cược chính xác! Nhận về ${(0, formatters_1.formatDong)(winAmount)} (Lời +${(0, formatters_1.formatDong)(winAmount - betAmount)})!`);
        }
        else {
            resultEmbed.setTitle('💸 KẾT QUẢ ROULETTE: THẤT BẠI');
            resultEmbed.setDescription(`🎡 **Quả bóng rơi vào số:** ${colorEmoji} **${landedNumber}**\n\n` +
                `❌ Rất tiếc bạn đã đoán sai! Mất ${(0, formatters_1.formatDong)(betAmount)}.`);
        }
        await i.update({ embeds: [resultEmbed], components: [disabledRow] });
        session.unlock(userId);
        collector.stop('completed');
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            await UserService_1.UserService.addDongAtomic(userId, betAmount);
            await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Phiên quay hủy và hoàn tiền cược.', components: [] });
        }
    });
}
