"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phuBanCommandAdvanced = phuBanCommandAdvanced;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const monsters_1 = require("../../game/data/monsters");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const UserService_1 = require("../../game/services/UserService");
const SessionManager_1 = require("../../game/managers/SessionManager");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const items_1 = require("../../game/data/items");
const shop_command_1 = require("../general/shop.command");
const BOSS_BY_AREA = {
    1: 'boss_quy_thon',
    2: 'boss_moc_tinh_ngan_nam',
    3: 'boss_thuy_tinh_hung_do',
    4: 'boss_quy_vuong_u_minh',
    5: 'boss_nam_giao_raider',
};
const BOSS_KB_REWARDS = {
    1: 2,
    2: 4,
    3: 8,
    4: 15,
    5: 30,
};
async function phuBanCommandAdvanced(message) {
    const userId = message.author.id;
    let user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật hoặc chọn Hệ Phái! Hãy gõ `vn start` trước.');
        return;
    }
    const currentArea = user.canhGioi.khuVuc || 1;
    const buaPrice = shop_command_1.BUA_TRU_TA_REGION_PRICES[currentArea] || 10000;
    // Cooldown Check 5 phút
    const lastUsed = user.cooldowns.get('phuban') || 0;
    if (Date.now() - lastUsed < 300000) {
        const remSec = Math.ceil((300000 - (Date.now() - lastUsed)) / 1000);
        await message.reply(`⏰ **Thầy Phù Thủy nhắn:** Cổng phụ bản cần thời gian hạ nhiệt! Chờ thêm **${remSec} giây**.`);
        return;
    }
    // Tiêu hao 1 Bùa Trừ Tà
    const hasBua = await UserService_1.UserService.consumeItemAtomic(userId, 'bua_tru_ta', 1);
    if (!hasBua) {
        await message.reply(`⛩️ **CẦN BÙA TRỪ TÀ:** Bạn phải sở hữu **1 Bùa Trừ Tà** để mở cổng Phụ Bản Trùm Vùng ${currentArea}!\n` +
            `💡 Mua Bùa Trừ Tà tại shop với giá **${(0, formatters_1.formatDong)(buaPrice)}**: \`vn buy bua_tru_ta\``);
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một thao tác / trận đấu chưa hoàn thành!');
        return;
    }
    const bossId = BOSS_BY_AREA[currentArea] || 'boss_nam_giao_raider';
    const baseBoss = monsters_1.MONSTERS.find((m) => m.id === bossId);
    if (!baseBoss) {
        session.unlock(userId);
        await message.reply('🎉 Không tìm thấy dữ liệu Trùm Vùng!');
        return;
    }
    const bossAdv = {
        id: baseBoss.id,
        ten: baseBoss.name,
        khuVuc: baseBoss.area,
        isBoss: true,
        stats: {
            hp: baseBoss.hp,
            maxHp: baseBoss.maxHp,
            atk: baseBoss.atk,
            def: baseBoss.def,
            speed: 12,
        },
        skills: [
            { tenChieu: 'Nộ Trảm Tụ Ma Khí', satThuongHeSo: 1.5, hieuUng: 'GIAM_GIAP' },
            { tenChieu: 'Thiên Địa Diệt Vong (Tất Sát)', satThuongHeSo: 2.5, hieuUng: 'CHOANG' },
        ],
        lootTable: baseBoss.dropTable.map((d) => ({
            itemId: d.itemId,
            tyLe: d.chance,
            soLuongMin: d.minQty,
            soLuongMax: d.maxQty,
        })),
        icon: baseBoss.icon,
        description: baseBoss.description,
    };
    const totalStats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    const combatState = {
        playerHp: user.chiSo.hp,
        playerMaxHp: totalStats.totalMaxHp,
        playerMp: user.chiSo.mp,
        playerMaxMp: totalStats.totalMaxMp,
        playerAtk: totalStats.totalAtk,
        playerDef: totalStats.totalDef,
        playerCrit: totalStats.totalCrit,
        playerDodge: totalStats.totalDodge,
        playerStatus: [],
        monsterHp: bossAdv.stats.hp,
        monsterMaxHp: bossAdv.stats.maxHp,
        monsterAtk: bossAdv.stats.atk,
        monsterDef: bossAdv.stats.def,
        monsterStatus: [],
        isEnraged: false,
    };
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('pb_attack').setLabel('⚔️ Đánh Thường').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('pb_skill').setLabel('⚡ Tuyệt Kỹ Hệ Phái').setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('pb_flee').setLabel('🏃 Bỏ Chạy').setStyle(discord_js_1.ButtonStyle.Secondary));
    const renderBattleEmbed = (logs) => {
        const statusEnrage = combatState.isEnraged ? ' 🔥 **[CUỒNG BẠO ENRAGE +50% ATK]**' : '';
        return (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`⛩️ PHỤ BẢN TRÙM VÙNG ${currentArea} - ${bossAdv.icon} ${bossAdv.ten.toUpperCase()}${statusEnrage}`)
            .setDescription(logs.join('\n\n'))
            .addFields({
            name: `👤 Bạn (${user.hePhai})`,
            value: `❤️ HP: ${(0, formatters_1.renderHpBar)(combatState.playerHp, combatState.playerMaxHp)}\n💧 MP: ${(0, formatters_1.renderProgressBar)(combatState.playerMp, combatState.playerMaxMp, 10, '🟦', '⬛')}`,
            inline: true,
        }, {
            name: `👹 ${bossAdv.ten}`,
            value: `❤️ HP: ${(0, formatters_1.renderHpBar)(combatState.monsterHp, combatState.monsterMaxHp)}`,
            inline: true,
        });
    };
    let battleLogs = [
        `Bạn dùng **Bùa Trừ Tà** phá vỡ ma khí và khiêu chiến Trùm Vùng **${bossAdv.icon} ${bossAdv.ten}**!`,
    ];
    const replyMsg = await message.reply({
        embeds: [renderBattleEmbed(battleLogs)],
        components: [row],
    });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 90000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const action = i.customId;
        if (action === 'pb_flee') {
            session.unlock(userId);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await i.update({ content: '🏃 Bạn đã hoảng sợ tháo chạy khỏi Phụ Bản!', components: [disabledRow] });
            collector.stop('fled');
            return;
        }
        let pTurnLog = '';
        if (action === 'pb_attack') {
            const pAttack = CombatEngine_1.CombatEngineAdvanced.executeNormalAttack('Bạn', bossAdv.ten, combatState.playerAtk, combatState.playerCrit, combatState.monsterDef, 0.05);
            combatState.monsterHp = Math.max(0, combatState.monsterHp - pAttack.damageDealt);
            pTurnLog = pAttack.logText;
        }
        else if (action === 'pb_skill') {
            const skillRes = CombatEngine_1.CombatEngineAdvanced.executeClassSkill(user, combatState, bossAdv.ten);
            if (skillRes.errorMsg) {
                await i.reply({ content: skillRes.errorMsg, ephemeral: true });
                return;
            }
            combatState.monsterHp = Math.max(0, combatState.monsterHp - skillRes.output.damageDealt);
            pTurnLog = skillRes.output.logText;
        }
        // Process Status Effects
        const statusRes = CombatEngine_1.CombatEngineAdvanced.processStatusEffects(combatState);
        const statusLogs = statusRes.logs;
        // Boss Turn
        let mTurnLog = '';
        if (combatState.monsterHp > 0) {
            // Check Enrage mode when Boss HP < 30%
            if (combatState.monsterHp / combatState.monsterMaxHp < 0.3 && !combatState.isEnraged) {
                combatState.isEnraged = true;
                combatState.monsterAtk = Math.floor(combatState.monsterAtk * 1.5);
                battleLogs.push(`🔥 **${bossAdv.ten} BÙNG NỔ PHÁP LỰC!** Tiến vào trạng thái **CUỒNG BẠO (+50% SÁT THƯƠNG)**!`);
            }
            const mTurn = CombatEngine_1.CombatEngineAdvanced.executeMonsterTurn(bossAdv, combatState);
            combatState.playerHp = Math.max(0, combatState.playerHp - mTurn.output.damageDealt);
            mTurnLog = mTurn.output.logText;
        }
        battleLogs = [pTurnLog, ...statusLogs, mTurnLog].filter(Boolean);
        // KẾT THÚC TRẬN ĐẤU?
        if (combatState.monsterHp <= 0 || combatState.playerHp <= 0) {
            session.unlock(userId);
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { 'cooldowns.phuban': Date.now() } });
            const endEmbed = (0, embedBuilder_1.createDongSonEmbed)();
            if (combatState.monsterHp <= 0) {
                let nextAreaMsg = '';
                if (user.canhGioi.khuVuc < 5) {
                    const nextArea = user.canhGioi.khuVuc + 1;
                    await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { 'canhGioi.khuVuc': nextArea } });
                    nextAreaMsg = `\n🚀 **ĐỘT PHÁ CẢNH GIỚI VÙNG ĐẤT!** Bạn đã mở khóa thành công **Vùng Đất ${nextArea}**!`;
                }
                const expEarned = baseBoss.expReward;
                const dongEarned = baseBoss.dongReward;
                const kbEarned = BOSS_KB_REWARDS[currentArea] || 5;
                // Xử lý rớt vật phẩm từ DropTable của Boss
                const droppedLootItems = [];
                for (const drop of baseBoss.dropTable) {
                    if (Math.random() <= drop.chance) {
                        const qty = Math.floor(Math.random() * (drop.maxQty - drop.minQty + 1)) + drop.minQty;
                        const itemDef = items_1.ITEMS[drop.itemId] || { name: drop.itemId, icon: '📦' };
                        droppedLootItems.push({ itemId: drop.itemId, name: itemDef.name, icon: itemDef.icon, qty });
                        await UserService_1.UserService.addItemAtomic(userId, drop.itemId, qty);
                    }
                }
                // Cộng Kim Bảo vào CSDL
                await User_model_1.UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': kbEarned } });
                // Áp dụng kết quả trận đấu (EXP & Đồng)
                await UserService_1.UserService.applyBattleResults(userId, combatState.playerHp, expEarned, dongEarned, true, user.canhGioi.capDo, []);
                const lootListStr = droppedLootItems.map((i) => `• ${i.icon} **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
                endEmbed.setTitle(`⛩️ PHỤ BẢN TRÙM VÙNG ${currentArea} - ĐẠI THẮNG QUYẾT CHIẾN!`);
                endEmbed.setDescription(`Bạn đã dốc toàn lực đánh bại hoàn toàn Trùm Vùng **${bossAdv.icon} ${bossAdv.ten}**!${nextAreaMsg}\n\n` +
                    `🎁 **TỔNG HỢP CHIẾN LỢI PHẨM TRÙM VÙNG:**\n` +
                    `• 🪙 **+${(0, formatters_1.formatDong)(dongEarned)}**\n` +
                    `• 💎 **+${(0, formatters_1.formatKimBao)(kbEarned)}**\n` +
                    `• 🌟 **+${expEarned.toLocaleString('vi-VN')} EXP** *(Tự động thăng cấp khi đủ tu vi)*\n\n` +
                    `📦 **VẬT PHẨM & TRANG BỊ RỚT TỪ TRÙM:**\n${lootListStr || '*(Không rớt vật phẩm)*'}`);
            }
            else {
                await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { 'chiSo.hp': 0 } });
                endEmbed.setTitle(`💀 THẤT BẠI TRƯỚC TRÙM VÙNG ${currentArea}`);
                endEmbed.setDescription(`Trùm vùng quá hung hãn! Máu của bạn đã giảm về **0 HP**. Hãy rèn thêm trang bị và cường hóa tại Lò Rèn để quay lại báo thù!`);
            }
            await i.update({ embeds: [endEmbed], components: [disabledRow] });
            collector.stop('completed');
            return;
        }
        await i.update({
            embeds: [renderBattleEmbed(battleLogs)],
            components: [row],
        });
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({ content: '⏰ Đã hết 90 giây! Phụ bản bị hủy.', components: [disabledRow] });
        }
    });
}
