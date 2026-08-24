"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oanTuTiCommand = oanTuTiCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const MOVE_NAMES = {
    keo: { name: 'Kéo', emoji: '✌️' },
    bua: { name: 'Búa', emoji: '✊' },
    bao: { name: 'Bao', emoji: '✋' },
};
function getWinner(move1, move2) {
    if (move1 === move2)
        return 'tie';
    if ((move1 === 'keo' && move2 === 'bao') ||
        (move1 === 'bua' && move2 === 'keo') ||
        (move1 === 'bao' && move2 === 'bua')) {
        return 'p1';
    }
    return 'p2';
}
async function oanTuTiCommand(message, args) {
    const p1Id = message.author.id;
    const targetUser = message.mentions.users.first();
    let betAmount = 0;
    if (targetUser) {
        betAmount = parseInt(args[1], 10);
    }
    else {
        betAmount = parseInt(args[0], 10);
    }
    if (isNaN(betAmount) || betAmount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vkl oantuti [@user/bot] [tiền cược]` (Ví dụ: `vkl oantuti 100` hoặc `vkl oantuti @BanThan 200`)');
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(p1Id)) {
        await message.reply('⚠️ Bạn đang có một phiên cược chưa kết thúc!');
        return;
    }
    // Deduct P1 bet
    const p1Success = await UserService_1.UserService.deductDongAtomic(p1Id, betAmount);
    if (!p1Success) {
        session.unlock(p1Id);
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betAmount)} để cược!`);
        return;
    }
    // --- TRƯỜNG HỢP 1: CHƠI VỚI BOT ---
    if (!targetUser || targetUser.bot) {
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('ott_keo').setLabel('Kéo').setEmoji('✌️').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('ott_bua').setLabel('Búa').setEmoji('✊').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('ott_bao').setLabel('Bao').setEmoji('✋').setStyle(discord_js_1.ButtonStyle.Primary));
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('✌️✊✋ OẰN TÙ TÌ VỚI THẦY CÚNG (BOT)')
            .setDescription(`Mức cược: ${(0, formatters_1.formatDong)(betAmount)}\n\nHãy chọn nước đi của bạn dưới đây (60s):`);
        const replyMsg = await message.reply({ embeds: [embed], components: [row] });
        const collector = replyMsg.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000,
            filter: (i) => i.user.id === p1Id,
        });
        collector.on('collect', async (i) => {
            const p1Move = i.customId.replace('ott_', '');
            const botMoves = ['keo', 'bua', 'bao'];
            const botMove = botMoves[Math.floor(Math.random() * 3)];
            const winner = getWinner(p1Move, botMove);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)();
            if (winner === 'p1') {
                const winAmount = betAmount * 2;
                await UserService_1.UserService.addDongAtomic(p1Id, winAmount);
                resultEmbed.setTitle('🎉 BẠN ĐÃ THẮNG OẰN TÙ TÌ!');
                resultEmbed.setDescription(`Bạn ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\nBot ra: ${MOVE_NAMES[botMove].emoji} **${MOVE_NAMES[botMove].name}**\n\n✨ Bạn nhận về ${(0, formatters_1.formatDong)(winAmount)}!`);
            }
            else if (winner === 'p2') {
                resultEmbed.setTitle('💸 THẤT BẠI TRƯỚC THẦY CÚNG!');
                resultEmbed.setDescription(`Bạn ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\nBot ra: ${MOVE_NAMES[botMove].emoji} **${MOVE_NAMES[botMove].name}**\n\n❌ Bạn mất ${(0, formatters_1.formatDong)(betAmount)}.`);
            }
            else {
                await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
                resultEmbed.setTitle('🤝 HÒA NƯỚC ĐI!');
                resultEmbed.setDescription(`Cả hai cùng ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\n\nHoàn tiền cược ${(0, formatters_1.formatDong)(betAmount)}.`);
            }
            await i.update({ embeds: [resultEmbed], components: [disabledRow] });
            session.unlock(p1Id);
            collector.stop('completed');
        });
        collector.on('end', async (_, reason) => {
            session.unlock(p1Id);
            if (reason === 'time') {
                await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
                await replyMsg.edit({ content: '⏰ Hết giờ! Đã hoàn tiền cược.', components: [] });
            }
        });
        return;
    }
    // --- TRƯỜNG HỢP 2: CHƠI PVP VỚI NGƯỜI CHƠI KHÁC ---
    const p2Id = targetUser.id;
    if (p2Id === p1Id) {
        session.unlock(p1Id);
        await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
        await message.reply('❌ Bạn không thể tự thách đấu chính mình!');
        return;
    }
    if (!session.lock(p2Id)) {
        session.unlock(p1Id);
        await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
        await message.reply(`❌ **${targetUser.username}** đang trong một trận đấu khác!`);
        return;
    }
    // Trừ tiền P2
    const p2Success = await UserService_1.UserService.deductDongAtomic(p2Id, betAmount);
    if (!p2Success) {
        session.unlock(p1Id);
        session.unlock(p2Id);
        await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
        await message.reply(`❌ **${targetUser.username}** không đủ ${(0, formatters_1.formatDong)(betAmount)} để chấp nhận lời thách đấu!`);
        return;
    }
    const pvpRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('pvp_keo').setLabel('Kéo').setEmoji('✌️').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('pvp_bua').setLabel('Búa').setEmoji('✊').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('pvp_bao').setLabel('Bao').setEmoji('✋').setStyle(discord_js_1.ButtonStyle.Primary));
    let p1Choice = null;
    let p2Choice = null;
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('⚔️ ĐẠI CHIẾN OẰN TÙ TÌ (PVP)')
        .setDescription(`Thách đấu giữa **<@${p1Id}>** và **<@${p2Id}>**!\nMức cược tổng hũ: ${(0, formatters_1.formatDong)(betAmount * 2)}\n\nCả hai hãy bấm chọn nước đi bí mật dưới đây trong vòng **60 giây**:`);
    const replyMsg = await message.reply({ embeds: [embed], components: [pvpRow] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === p1Id || i.user.id === p2Id,
    });
    collector.on('collect', async (i) => {
        const move = i.customId.replace('pvp_', '');
        if (i.user.id === p1Id) {
            if (p1Choice) {
                await i.reply({ content: 'Bạn đã chọn nước đi rồi!', ephemeral: true });
                return;
            }
            p1Choice = move;
            await i.reply({ content: `Bạn đã kín đáo chọn: ${MOVE_NAMES[move].emoji} ${MOVE_NAMES[move].name}`, ephemeral: true });
        }
        else if (i.user.id === p2Id) {
            if (p2Choice) {
                await i.reply({ content: 'Bạn đã chọn nước đi rồi!', ephemeral: true });
                return;
            }
            p2Choice = move;
            await i.reply({ content: `Bạn đã kín đáo chọn: ${MOVE_NAMES[move].emoji} ${MOVE_NAMES[move].name}`, ephemeral: true });
        }
        if (p1Choice && p2Choice) {
            const winner = getWinner(p1Choice, p2Choice);
            const totalPot = betAmount * 2;
            const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)().setTitle('🏆 KẾT QUẢ ĐẠI CHIẾN OẰN TÙ TÌ');
            if (winner === 'p1') {
                await UserService_1.UserService.addDongAtomic(p1Id, totalPot);
                resultEmbed.setDescription(`<@${p1Id}>: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n<@${p2Id}>: ${MOVE_NAMES[p2Choice].emoji} **${MOVE_NAMES[p2Choice].name}**\n\n🎉 **<@${p1Id}> THẮNG TRẬN!** Nhận toàn bộ ${(0, formatters_1.formatDong)(totalPot)}!`);
            }
            else if (winner === 'p2') {
                await UserService_1.UserService.addDongAtomic(p2Id, totalPot);
                resultEmbed.setDescription(`<@${p1Id}>: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n<@${p2Id}>: ${MOVE_NAMES[p2Choice].emoji} **${MOVE_NAMES[p2Choice].name}**\n\n🎉 **<@${p2Id}> THẮNG TRẬN!** Nhận toàn bộ ${(0, formatters_1.formatDong)(totalPot)}!`);
            }
            else {
                await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
                await UserService_1.UserService.addDongAtomic(p2Id, betAmount);
                resultEmbed.setDescription(`Cả hai cùng chọn: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n\n🤝 **HÒA TRẬN!** Hoàn tiền cược cho cả hai.`);
            }
            session.unlock(p1Id);
            session.unlock(p2Id);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            pvpRow.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({ embeds: [resultEmbed], components: [disabledRow] });
            collector.stop('completed');
        }
    });
    collector.on('end', async (_, reason) => {
        session.unlock(p1Id);
        session.unlock(p2Id);
        if (reason === 'time' && (!p1Choice || !p2Choice)) {
            await UserService_1.UserService.addDongAtomic(p1Id, betAmount);
            await UserService_1.UserService.addDongAtomic(p2Id, betAmount);
            await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Trận đấu bị hủy và hoàn tiền cược.', components: [] });
        }
    });
}
