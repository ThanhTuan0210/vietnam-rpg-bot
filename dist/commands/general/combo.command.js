"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comboAllCommand = comboAllCommand;
const User_model_1 = require("../../database/models/User.model");
const monsters_1 = require("../../game/data/monsters");
const items_1 = require("../../game/data/items");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const UserService_1 = require("../../game/services/UserService");
const GatheringService_1 = require("../../game/services/GatheringService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const master_menu_command_1 = require("./master_menu.command");
async function comboAllCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await (0, master_menu_command_1.masterMenuCommand)(message);
        return;
    }
    const producerJob = user.producerJob || null;
    if (!producerJob) {
        await message.reply('⚠️ **Bạn chưa chọn Class Sản Xuất (PP)!** Hãy gõ `vkl` để hoàn tất chọn nghề (**Miner / Alchemist / Blacksmith**).');
        return;
    }
    // Check 0 HP Faint
    if ((user.chiSo.hp || 0) <= 0) {
        await message.reply(`💀 **BẠN ĐÃ BỊ TRỌNG THƯƠNG (0 HP)!**\n\n` +
            `Bạn kiệt sức hoàn toàn và không thể tiếp tục chiến đấu/săn quái!\n\n` +
            `💡 **Hãy uống Thuốc Hồi Máu HP (\`vkl use potion_01a\`) để hồi sinh 100% HP hoặc mua thêm thuốc tại Tiệm Dự Trữ (\`vkl shop\`)!**`);
        return;
    }
    // 1. Kiểm tra Cooldown 60s
    const lastUsed = user.cooldowns?.get('combo_all') || 0;
    const now = Date.now();
    if (now - lastUsed < 60000) {
        const remSec = Math.ceil((60000 - (now - lastUsed)) / 1000);
        await message.reply(`⏰ **Cooldown:** Vui lòng chờ **${remSec}s** nữa mới có thể tiếp tục \`vkl w\`.`);
        return;
    }
    // Cập nhật Cooldown
    await UserService_1.UserService.updateCooldownAtomic(userId, 'combo_all', now);
    // 2. [COMBAT HUNTING] CLASS CHÍNH SĂN QUÁI
    const areaMonsters = monsters_1.MONSTERS.filter((m) => m.area === user.canhGioi.khuVuc && !m.isBoss);
    const baseMonster = areaMonsters[Math.floor(Math.random() * areaMonsters.length)] || monsters_1.MONSTERS[0];
    const totalStats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    const isCrit = Math.random() < totalStats.totalCrit;
    let damageDealt = Math.max(1, Math.floor(totalStats.totalAtk - baseMonster.def * 0.5));
    if (isCrit)
        damageDealt = Math.floor(damageDealt * 1.5);
    const monsterDamage = Math.max(12, Math.floor(baseMonster.atk * 1.5 - totalStats.totalDef * 0.3));
    const currentHp = user.chiSo.hp || totalStats.totalMaxHp;
    const newPlayerHp = Math.max(0, currentHp - monsterDamage);
    const expEarned = baseMonster.expReward;
    const dongEarned = baseMonster.dongReward;
    const huntLoot = [];
    for (const drop of baseMonster.dropTable) {
        const itemDef = items_1.ITEMS[drop.itemId];
        if (itemDef && itemDef.type !== 'vukhi' && itemDef.type !== 'aogiap') {
            const dropChance = Math.max(0.2, drop.chance);
            if (Math.random() <= dropChance) {
                const qty = Math.floor(Math.random() * (drop.maxQty - drop.minQty + 1)) + drop.minQty;
                huntLoot.push({ itemId: drop.itemId, quantity: qty });
            }
        }
    }
    // Xử lý nếu nhân vật bị đả bại (0 HP) -> Áp dụng Hình Phạt Tử Trận (Phạt Vàng + Giảm -1 Level)
    if (newPlayerHp === 0) {
        const penalty = await UserService_1.UserService.applyDeathPenalty(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`💀 NHÂN VẬT TỬ TRẬN TRONG TRẬN ĐẤU — ${message.author.username.toUpperCase()}`)
            .setDescription(`👺 **TỬ TRẬN:** Bạn đã bị ${baseMonster.icon} **${baseMonster.name}** đả bại dã man!\n\n` +
            `📉 **HÌNH PHẠT TỬ TRẬN HARDCORE:**\n` +
            `• 🔻 **Giảm -1 Level:** \`Lv ${penalty.oldLevel}\` ➔ \`Lv ${penalty.newLevel}\` *(Kinh nghiệm reset về 0)*\n` +
            `• 💸 **Phạt Tiền Vàng:** \`-${(0, formatters_1.formatDong)(penalty.goldLost)}\` Vàng *(Phạt 10% Vàng)*\n` +
            `• 💀 **Sinh Lực:** \`0 / ${totalStats.totalMaxHp} HP\` *(TRỌNG THƯƠNG)*\n\n` +
            `🧪 **HỒI SINH BÌNH PHỤC:**\n` +
            `👉 Hãy dùng **Thuốc Hồi Máu HP (\`vkl use potion_01a\`)** hoặc mua tại **Tiệm Dự Trữ (\`vkl shop\`)** với giá 200 Vàng để bình phục 100% HP và tiếp tục chiến đấu!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const battleRes = await UserService_1.UserService.applyBattleResults(userId, newPlayerHp, expEarned, dongEarned, false, user.canhGioi.capDo, huntLoot);
    // 3. [PRODUCER JOB] CHỈ THỰC HIỆN ĐÚNG 1 NGHỀ CỦA NGƯỜI CHƠI
    let producerResultText = '';
    let producerJobName = '';
    if (producerJob === 'miner' || producerJob === 'min') {
        producerJobName = '🪨 MINER (Thợ Mỏ)';
        const mineRes = await GatheringService_1.GatheringService.mine(userId);
        producerResultText = mineRes.itemsGained.map((i) => `🪨 **${i.name}** x${i.qty}`).join(', ');
    }
    else if (producerJob === 'alchemist' || producerJob === 'alc') {
        producerJobName = '🧪 ALCHEMIST (Thợ Bào Chế)';
        const herbRes = await GatheringService_1.GatheringService.gatherHerbs(userId);
        producerResultText = herbRes.itemsGained.map((i) => `🧪 **${i.name}** x${i.qty}`).join(', ');
    }
    else {
        producerJobName = '🔨 BLACKSMITH (Thợ Rèn)';
        const woodRes = await GatheringService_1.GatheringService.woodcut(userId);
        producerResultText = woodRes.itemsGained.map((i) => `🪵 **${i.name}** x${i.qty}`).join(', ');
    }
    // 4. Tổng hợp kết quả
    const critBadge = isCrit ? ' 💥 **CRITICAL!**' : '';
    const huntLootText = huntLoot.length > 0
        ? huntLoot
            .map((d) => {
            const icon = (0, items_1.getItemIcon)(d.itemId);
            const itemDef = items_1.ITEMS[d.itemId] || { name: d.itemId };
            return `${icon} **${itemDef.name}** x${d.quantity}`;
        })
            .join(', ')
        : 'Không có';
    const levelUpNotify = battleRes.levelUp
        ? `\n\n🎉 **THĂNG CẤP THÀNH CÔNG!** Bạn đã đạt **Level ${battleRes.newLevel}**!\n📈 **Chỉ số tự động cộng:** **+50 Max HP** | **+20 Max MP** | **+10 Sát Thương** | **+3 Phòng Thu**!`
        : '';
    const hpStatusText = newPlayerHp === 0
        ? `💔 **Bị thương:** \`-${monsterDamage} HP\` | 💀 **HP:** \`0 / ${totalStats.totalMaxHp}\` *(TRỌNG THƯƠNG!)*`
        : `💔 **Bị thương:** \`-${monsterDamage} HP\` | ❤️ **HP:** \`${newPlayerHp} / ${totalStats.totalMaxHp}\``;
    const hpAlertText = newPlayerHp === 0
        ? `\n\n⚠️ **CẢNH BÁO TRỌNG THƯƠNG:** HP của bạn đã cạn về 0! Hãy dùng Thuốc HP (\`vkl use potion_01a\`) để bình phục!`
        : '';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`⚡ HOẠT ĐỘNG SẢN XUẤT NHÂN VẬT — ${message.author.username.toUpperCase()}`)
        .setDescription(`🎯 **KẾT QUẢ ĐƠN PHÁI CHUYÊN MÔN (1 COMBAT + 1 PRODUCER):**\n\n` +
        `⚔️ **HUNTING (Săn Quái):** Đả bại ${baseMonster.icon} **${baseMonster.name}** (Gây \`${damageDealt}\` DMG${critBadge})\n` +
        `🩸 **Tổn Thất Sinh Lực:** ${hpStatusText}\n` +
        `✨ **Thưởng:** \`+${expEarned} EXP\` | \`+${dongEarned} Vàng\` | **Loot:** ${huntLootText}\n\n` +
        `${producerJobName}: ${producerResultText}` +
        `${levelUpNotify}${hpAlertText}\n\n` +
        `💡 *Uống Thuốc HP (\`vkl use potion_01a\`) khi HP giảm thấp để duy trì chiến đấu!*`);
    await message.reply({ embeds: [embed] });
}
