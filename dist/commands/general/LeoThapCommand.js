"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leoThapCommandClean = leoThapCommandClean;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const TowerService_1 = require("../../game/services/TowerService");
const TowerConfig_1 = require("../../game/config/TowerConfig");
const embedBuilder_1 = require("../../utils/embedBuilder");
const SessionManager_1 = require("../../game/managers/SessionManager");
function renderAsciiBar(current, max, length = 10) {
    const safeCurrent = Math.max(0, current);
    const percentage = Math.min(1, safeCurrent / max);
    const filledLength = Math.round(length * percentage);
    const emptyLength = length - filledLength;
    return `\`[${'█'.repeat(filledLength)}${'░'.repeat(emptyLength)}]\``;
}
async function leoThapCommandClean(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật hoặc chọn Hệ Phái! Hãy gõ `vn batdau` trước.');
        return;
    }
    // ATOMIC LOCK CHỐNG SPAM CLICK NÚT LIÊN TỤC
    const sessionManager = SessionManager_1.SessionManager.getInstance();
    if (!sessionManager.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một phiên chiến đấu / thao tác chưa hoàn thành! Hãy thử lại sau giây lát.');
        return;
    }
    try {
        const session = await TowerService_1.TowerService.startOrResumeRun(userId);
        // --- TRẠNG THÁI 1: ĐANG CHỜ CHỌN BÙA CHÚC PHÚC (TẦNG % 5 === 0) ---
        if (session.isAwaitingBoon) {
            const offeredIds = session.offeredBoons;
            const offeredBoons = TowerConfig_1.SIGNATURE_BOONS.filter((b) => offeredIds.includes(b.buffId));
            const row = new discord_js_1.ActionRowBuilder();
            offeredBoons.forEach((b) => {
                row.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId(`boon_select_${b.buffId}`)
                    .setLabel(b.name)
                    .setStyle(b.rarity === 'THAN_THOAI'
                    ? discord_js_1.ButtonStyle.Danger
                    : b.rarity === 'HIEM'
                        ? discord_js_1.ButtonStyle.Success
                        : discord_js_1.ButtonStyle.Primary));
            });
            const embed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle(`🏯 THÁP THÍ LUYỆN ROGUELIKE — TẦNG ${session.currentFloor}/100`)
                .setDescription(`🎉 **HẠ GỤC THỦ VỆ TINH ANH!**\n\n` +
                `🎁 **HÃY CHỌN 1 BÙA CHÚC PHÚC ĐỂ CỦNG CỐ THỰC LỰC:**\n\n` +
                offeredBoons.map((b, i) => `${i + 1}. ${b.icon} **${b.name}** [${b.rarity}]: *${b.desc}*`).join('\n'));
            const replyMsg = await message.reply({ embeds: [embed], components: [row] });
            const collector = replyMsg.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time: 60000,
                filter: (i) => i.user.id === userId,
            });
            collector.on('collect', async (i) => {
                try {
                    const boonId = i.customId.replace('boon_select_', '');
                    const res = await TowerService_1.TowerService.chooseBoon(userId, boonId);
                    const disabledRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                    await i.update({ content: res.message, components: [disabledRow] }).catch(() => { });
                    collector.stop('completed');
                }
                catch (err) {
                    console.error('[Boon Collect Error]', err);
                }
                finally {
                    sessionManager.unlock(userId);
                }
            });
            collector.on('end', async (_, reason) => {
                sessionManager.unlock(userId);
                if (reason === 'time') {
                    const disabledRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                    await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Phiên chọn Bùa bị hủy.', components: [disabledRow] }).catch(() => { });
                }
            });
            return;
        }
        // --- TRẠNG THÁI 2: ĐANG TẠI TRẠM NGHỈ VỌNG CẢNH ĐÀI (TẦNG 20, 40, 60, 80) ---
        if (session.isAtRestStation) {
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('rest_heal').setLabel('🌿 Hồi 40% HP & MP').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('rest_boon').setLabel('🎲 Rút Bùa Ngẫu Nhiên').setStyle(discord_js_1.ButtonStyle.Primary));
            const embed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle(`🏯 THÁP THÍ LUYỆN ROGUELIKE — TRẠM NGHỈ TẦNG ${session.currentFloor}`)
                .setDescription(`⛩️ **TRẠM NGHỈ VỌNG CẢNH ĐÀI**\n\n` +
                `🩸 Sinh Lực: \`${session.currentHp}/${session.maxHp}\`\n` +
                `🔷 Chân Khí: \`${session.currentMp}/${session.maxMp}\`\n\n` +
                `Hãy lựa chọn phương án nghỉ ngơi:`);
            const replyMsg = await message.reply({ embeds: [embed], components: [row] });
            const collector = replyMsg.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time: 60000,
                filter: (i) => i.user.id === userId,
            });
            collector.on('collect', async (i) => {
                try {
                    const disabledRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                    if (i.customId === 'rest_heal') {
                        const res = await TowerService_1.TowerService.claimRestAction(userId, 'HEAL');
                        await i.update({ content: res.message, components: [disabledRow] }).catch(() => { });
                    }
                    else {
                        const res = await TowerService_1.TowerService.claimRestAction(userId, 'RANDOM_BOON');
                        await i.update({ content: res.message, components: [disabledRow] }).catch(() => { });
                    }
                    collector.stop('completed');
                }
                catch (err) {
                    console.error('[Rest Station Error]', err);
                }
                finally {
                    sessionManager.unlock(userId);
                }
            });
            collector.on('end', async (_, reason) => {
                sessionManager.unlock(userId);
                if (reason === 'time') {
                    await replyMsg.edit({ content: '⏰ Đã hết 60 giây trạm nghỉ.', components: [] }).catch(() => { });
                }
            });
            return;
        }
        // --- TRẠNG THÁI 3: DASHBOARD CHUẨN THÁP THÍ LUYỆN ROGUELIKE ---
        const enemy = TowerConfig_1.TowerConfig.calculateEnemyStats(session.currentFloor);
        const activeBuffsStr = session.activeBuffs && session.activeBuffs.length > 0
            ? session.activeBuffs.map((b) => `${b.icon || '✨'} **${b.name || b.type}**`).join('\n')
            : '*(Chưa kích hoạt Bùa nào)*';
        const estimatedPoints = session.highestFloorThisRun * 15 + session.monstersSlain * 5;
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`🏯 THÁP THÍ LUYỆN ROGUELIKE — TẦNG ${session.currentFloor}/100`)
            .addFields({
            name: '🩸 Sinh Lực & Chân Khí',
            value: `🩸 **Sinh Lực:** \`${session.currentHp.toLocaleString('vi-VN')} / ${session.maxHp.toLocaleString('vi-VN')}\` ${renderAsciiBar(session.currentHp, session.maxHp)}\n` +
                `🔷 **Chân Khí:** \`${session.currentMp.toLocaleString('vi-VN')} / ${session.maxMp.toLocaleString('vi-VN')}\``,
            inline: false,
        }, {
            name: `👹 Đối Thủ Tầng Này: ${enemy.icon} ${enemy.name}`,
            value: `❤️ **HP Dự Kiến:** \`${enemy.maxHp.toLocaleString('vi-VN')}\` | ⚔️ **ATK:** \`${enemy.atk}\` | 🛡️ **DEF:** \`${enemy.def}\``,
            inline: false,
        }, {
            name: '✨ Bùa Đang Kích Hoạt',
            value: activeBuffsStr,
            inline: false,
        }, {
            name: '🪙 Điểm Thí Luyện Tích Lũy',
            value: `\`${estimatedPoints} Điểm\` *(Thất bại hoặc rút lui sẽ nhận số điểm này)*`,
            inline: false,
        });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('tower_challenge')
            .setLabel(`⚔️ Khiêu Chiến Tầng ${session.currentFloor}`)
            .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
            .setCustomId('tower_retreat')
            .setLabel('🏃 Rút Lui (Bảo Lưu Điểm)')
            .setStyle(discord_js_1.ButtonStyle.Secondary));
        const replyMsg = await message.reply({ embeds: [embed], components: [row] });
        const collector = replyMsg.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000,
            filter: (i) => i.user.id === userId,
        });
        collector.on('collect', async (i) => {
            try {
                if (i.customId === 'tower_retreat') {
                    const summary = await TowerService_1.TowerService.endRun(userId);
                    const disabledRow = new discord_js_1.ActionRowBuilder();
                    row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                    const retreatEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                        .setTitle('🏃 RÚT KHỎI THÁP BẢO LƯU ĐIỂM')
                        .setDescription(`Bạn đã dũng cảm dừng chân tại **Tầng ${summary.highestFloor}**!\n\n` +
                        `🪙 **Điểm Thí Luyện cộng vào tài khoản:** **+${summary.pointsEarned} Điểm**!`);
                    await i.update({ embeds: [retreatEmbed], components: [disabledRow] }).catch(() => { });
                    collector.stop('retreated');
                    return;
                }
                // Thực hiện Giao Tranh Tầng Tháp
                const combat = await TowerService_1.TowerService.executeFloorCombat(userId);
                const disabledRow = new discord_js_1.ActionRowBuilder();
                row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)();
                if (combat.combatResult.isDead) {
                    resultEmbed.setTitle('💀 TỬ TRẬN TRONG THÁP THÍ LUYỆN (PERMADEATH RUN)');
                    resultEmbed.setDescription(`Bạn đã gục ngã tại **Tầng ${session.currentFloor}** trước sức mạnh tàn bạo của đối thủ!\n\n` +
                        `📜 **Nhật ký giao tranh:**\n${combat.combatResult.logs.join('\n')}\n\n` +
                        `🪙 **Điểm Thí Luyện nhận được:** **+${combat.session.trialPointsEarned} Điểm**!`);
                }
                else {
                    resultEmbed.setTitle(`🎉 ĐẢ BẠI KẺ ĐỊCH TẦNG ${session.currentFloor}!`);
                    resultEmbed.setDescription(`📜 **Nhật ký giao tranh:**\n${combat.combatResult.logs.join('\n')}\n\n` +
                        `❤️ **Sinh Lực còn lại:** \`${combat.session.currentHp}/${combat.session.maxHp}\` HP\n\n` +
                        `👉 Gõ \`vn leothap\` để tiếp tục tiến vào Tầng ${combat.session.currentFloor}!`);
                }
                await i.update({ embeds: [resultEmbed], components: [disabledRow] }).catch(() => { });
                collector.stop('completed');
            }
            catch (err) {
                console.error('[Tower Battle Error]', err);
            }
            finally {
                sessionManager.unlock(userId);
            }
        });
        collector.on('end', async (_, reason) => {
            sessionManager.unlock(userId);
            if (reason === 'time') {
                const disabledRow = new discord_js_1.ActionRowBuilder();
                row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
                await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Thao tác leo tháp bị hủy.', components: [disabledRow] }).catch(() => { });
            }
        });
    }
    catch (err) {
        sessionManager.unlock(userId);
        console.error('[leoThapCommandClean Error]', err);
        await message.reply('❌ Đã xảy ra lỗi khi khởi tạo trận đấu Leo Tháp. Vui lòng gõ lại `vn leothap`.').catch(() => { });
    }
}
