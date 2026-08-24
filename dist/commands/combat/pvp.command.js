"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pvpCommand = pvpCommand;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function pvpCommand(message) {
    const userId = message.author.id;
    const targetUser = message.mentions.users.first();
    if (!targetUser || targetUser.id === userId || targetUser.bot) {
        await message.reply('⚠️ **Cú pháp:** `vkl pvp @User` (Thách đấu 1v1 Lôi Đài)');
        return;
    }
    const p1 = await User_model_1.UserModelAdvanced.findOne({ userId });
    const p2 = await User_model_1.UserModelAdvanced.findOne({ userId: targetUser.id });
    if (!p1 || !p1.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl batdau`.');
        return;
    }
    if (!p2 || !p2.hePhai) {
        await message.reply('❌ Đối thủ chưa khởi tạo nhân vật RPG!');
        return;
    }
    const p1Stats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(p1);
    const p2Stats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(p2);
    let p1Hp = p1Stats.totalMaxHp;
    let p2Hp = p2Stats.totalMaxHp;
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('pvp_accept').setLabel('⚔️ CHẤP NHẬN NGHÊNH CHIẾN').setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('pvp_decline').setLabel('❌ TỪ CHỐI').setStyle(discord_js_1.ButtonStyle.Secondary));
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('⚔️ THÁCH ĐẤU LÔI ĐÀI 1V1')
        .setDescription(`Anh hùng **<@${userId}>** (\`Cấp ${p1.canhGioi.capDo}\`) đã giơ kiếm thách đấu **<@${targetUser.id}>** (\`Cấp ${p2.canhGioi.capDo}\`) trên Lôi Đài Thăng Long!\n\n` +
        `**<@${targetUser.id}>**, bạn có đồng ý bước lên Lôi Đài nghênh chiến không?`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === targetUser.id,
    });
    collector.on('collect', async (i) => {
        if (i.customId === 'pvp_decline') {
            const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('pvp_dec').setLabel('❌ Đã Từ Chối').setStyle(discord_js_1.ButtonStyle.Secondary).setDisabled(true));
            await i.update({ content: '🏳️ Đối thủ đã từ chối bước lên Lôi Đài!', components: [disabledRow] });
            collector.stop('declined');
            return;
        }
        // MÔ PHỎNG TRẬN CHIẾN LÔI ĐÀI
        const battleLogs = [`⚔️ **TRẬN CHIẾN LÔI ĐÀI BẮT ĐẦU!**`];
        while (p1Hp > 0 && p2Hp > 0) {
            // P1 đánh P2
            const isCrit1 = Math.random() < p1Stats.totalCrit;
            let dmg1 = Math.max(1, Math.floor(p1Stats.totalAtk - p2Stats.totalDef * 0.5));
            if (isCrit1)
                dmg1 = Math.floor(dmg1 * 1.5);
            p2Hp = Math.max(0, p2Hp - dmg1);
            if (p2Hp <= 0)
                break;
            // P2 đánh P1
            const isCrit2 = Math.random() < p2Stats.totalCrit;
            let dmg2 = Math.max(1, Math.floor(p2Stats.totalAtk - p1Stats.totalDef * 0.5));
            if (isCrit2)
                dmg2 = Math.floor(dmg2 * 1.5);
            p1Hp = Math.max(0, p1Hp - dmg2);
        }
        const winnerId = p1Hp > 0 ? userId : targetUser.id;
        const loserId = p1Hp > 0 ? targetUser.id : userId;
        await UserService_1.UserService.updateCooldownAtomic(userId, 'pvp', Date.now());
        const winEmbed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('👑 TOÀN THẮNG LÔI ĐÀI 1V1!')
            .setDescription(`🏆 **CHIẾN THẮNG HUY HOÀNG!**\n\n` +
            `Cao thủ **<@${winnerId}>** đã dũng mãnh đả bại **<@${loserId}>** trên Lôi Đài Thăng Long!\n\n` +
            `🩸 Máu người chiến thắng còn lại: ${(0, formatters_1.renderHpBar)(Math.max(p1Hp, p2Hp), p1Hp > 0 ? p1Stats.totalMaxHp : p2Stats.totalMaxHp)}`);
        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('pvp_done').setLabel('🏆 Trận Đấu Kết Thúc').setStyle(discord_js_1.ButtonStyle.Success).setDisabled(true));
        await i.update({ embeds: [winEmbed], components: [disabledRow] });
        collector.stop('completed');
    });
    collector.on('end', async (_, reason) => {
        if (reason === 'time') {
            await replyMsg.edit({ content: '⏰ Hết 60 giây chờ chấp nhận thách đấu.', components: [] });
        }
    });
}
