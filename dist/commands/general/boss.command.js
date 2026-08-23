"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bossCommand = bossCommand;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const AreaBossService_1 = require("../../game/services/AreaBossService");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function bossCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật hoặc chọn Hệ Phái! Hãy gõ `vn batdau` trước.');
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một trận chiến hoặc thao tác chưa hoàn thành!');
        return;
    }
    const currentArea = user.canhGioi.khuVuc;
    const checkRes = await AreaBossService_1.AreaBossService.checkAndConsumeMeritForBoss(userId, currentArea);
    if (!checkRes.canChallenge || !checkRes.bossInfo) {
        session.unlock(userId);
        await message.reply(checkRes.message);
        return;
    }
    const boss = checkRes.bossInfo;
    let bossHp = boss.hp;
    const totalStats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    let playerHp = user.chiSo.hp > 0 ? user.chiSo.hp : totalStats.totalMaxHp;
    let playerMp = user.chiSo.mp;
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('boss_attack').setLabel('⚔️ Tấn Công Sát Thể').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('boss_skill').setLabel('⚡ Kỹ Năng Hệ Phái').setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('boss_defend').setLabel('🛡️ Phòng Thủ Trấn Trạng').setStyle(discord_js_1.ButtonStyle.Secondary));
    const renderBossEmbed = (logs) => {
        return (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`⛩️ ĐỘT PHÁ KỶ NGUYÊN — QUYẾT CHIẾN ${boss.name.toUpperCase()}`)
            .setDescription(logs.join('\n\n'))
            .addFields({
            name: `👤 Bạn (${user.hePhai})`,
            value: `❤️ HP: ${(0, formatters_1.renderHpBar)(playerHp, totalStats.totalMaxHp)}\n💧 MP: ${(0, formatters_1.renderProgressBar)(playerMp, totalStats.totalMaxMp, 10, '🟦', '⬛')}`,
            inline: true,
        }, {
            name: `${boss.icon} ${boss.name}`,
            value: `❤️ HP: ${(0, formatters_1.renderHpBar)(bossHp, boss.maxHp)}`,
            inline: true,
        });
    };
    let battleLogs = [
        `⛩️ Trận pháp phong ấn tan biến! **${boss.icon} ${boss.name}** đã xuất hiện để cản đường bạn đột phá sang **Khu Vực ${currentArea + 1}**!`,
    ];
    const replyMsg = await message.reply({
        embeds: [renderBossEmbed(battleLogs)],
        components: [row],
    });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const action = i.customId;
        let pDmg = 0;
        let pLog = '';
        let isDefending = false;
        if (action === 'boss_attack') {
            const isCrit = Math.random() < totalStats.totalCrit;
            pDmg = Math.max(1, Math.floor(totalStats.totalAtk - boss.def * 0.5));
            if (isCrit)
                pDmg = Math.floor(pDmg * 1.5);
            bossHp = Math.max(0, bossHp - pDmg);
            pLog = isCrit
                ? `💥 **BẠO KÍCH!** Bạn giáng đòn bạo sát **${pDmg} sát thương** lên ${boss.name}!`
                : `⚔️ Bạn tấn công ${boss.name} gây **${pDmg} sát thương**!`;
        }
        else if (action === 'boss_skill') {
            if (playerMp < 20) {
                await i.reply({ content: '💧 Không đủ Mana (Cần 20 MP)!', ephemeral: true });
                return;
            }
            playerMp -= 20;
            pDmg = Math.max(1, Math.floor(totalStats.totalAtk * 1.8 - boss.def * 0.4));
            bossHp = Math.max(0, bossHp - pDmg);
            pLog = `⚡ **TUYỆT KỸ BÁ VƯƠNG!** Bạn xả chiêu gây **${pDmg} sát thương**!`;
        }
        else if (action === 'boss_defend') {
            isDefending = true;
            pLog = `🛡️ Bạn giơ khiên thủ thế phòng thủ kiên cố, giảm 50% sát thương đòn đánh của Boss!`;
        }
        // Boss đánh trả nếu chưa bị hạ
        let bLog = '';
        if (bossHp > 0) {
            const bSkill = Math.random() < 0.4;
            const bMult = bSkill ? 1.5 : 1.0;
            let bDmg = Math.max(1, Math.floor(boss.atk * bMult - totalStats.totalDef * 0.5));
            if (isDefending)
                bDmg = Math.floor(bDmg * 0.5);
            playerHp = Math.max(0, playerHp - bDmg);
            bLog = bSkill
                ? `🔥 **${boss.icon} ${boss.name}** xả tuyệt kỹ **${boss.skillName}** gây **${bDmg} sát thương**!`
                : `👹 **${boss.icon} ${boss.name}** giáng đòn uy áp **${bDmg} sát thương**!`;
        }
        battleLogs = [pLog, bLog].filter(Boolean);
        // KẾT THÚC TRẬN CHIẾN BOSS?
        if (bossHp <= 0 || playerHp <= 0) {
            session.unlock(userId);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            const endEmbed = (0, embedBuilder_1.createDongSonEmbed)();
            if (bossHp <= 0) {
                // ĐẢ BẠI BOSS: ĐỘT PHÁ SANG KHU VỰC TIẾP THEO!
                const nextArea = currentArea + 1;
                await User_model_1.UserModelAdvanced.updateOne({ userId }, {
                    $set: {
                        'canhGioi.khuVuc': nextArea,
                        'chiSo.hp': playerHp,
                        'chiSo.mp': playerMp,
                    },
                    $inc: {
                        'canhGioi.kinhNghiem': boss.rewardExp,
                        'taiChinh.dong': boss.rewardDong,
                        'taiChinh.kimBao': boss.rewardKimBao,
                    },
                });
                endEmbed.setTitle(`🎉 ĐẠI THẮNG BOSS VÙNG — ĐỘT PHÁ SANG KHU VỰC ${nextArea}!`);
                endEmbed.setDescription(`🌟 **BÁO TIN THẮNG TRẬN!** Bạn đã dũng mãnh đánh tan **${boss.icon} ${boss.name}**!\n\n` +
                    `🗺️ **RẢNH RỖI TIẾN VÀO:** **Khu Vực ${nextArea}** (Mở khóa Quái mới & Tài nguyên hiếm mới!)\n\n` +
                    `🎁 **Phần thưởng:** **+${boss.rewardExp} EXP** | ${(0, formatters_1.formatDong)(boss.rewardDong)} | 💎 **+${boss.rewardKimBao} Kim Bảo**!`);
            }
            else {
                await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { 'chiSo.hp': 0 } });
                endEmbed.setTitle('💀 BẠI TRẬN TRƯỚC BOSS VÙNG');
                endEmbed.setDescription(`Uy áp của **${boss.icon} ${boss.name}** quá kinh hoàng! Bạn đã tử trận và rơi về **0 HP**.\n` +
                    `Hãy dùng \`vn duongthuong\` để hồi phục và dùng \`vn congduc mua\` tích lũy thêm để phục thù!`);
            }
            await i.update({ embeds: [endEmbed], components: [disabledRow] });
            collector.stop('completed');
            return;
        }
        await i.update({
            embeds: [renderBossEmbed(battleLogs)],
            components: [row],
        });
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({ content: '⏰ Hết 60 giây! Trận đấu Boss bị hủy.', components: [disabledRow] });
        }
    });
}
