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
async function comboAllCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
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
    // 2. Thực hiện [1] HUNTER (SĂN QUÁI & RƯƠNG BÁU)
    const areaMonsters = monsters_1.MONSTERS.filter((m) => m.area === user.canhGioi.khuVuc && !m.isBoss);
    const baseMonster = areaMonsters[Math.floor(Math.random() * areaMonsters.length)] || monsters_1.MONSTERS[0];
    const totalStats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    const isCrit = Math.random() < totalStats.totalCrit;
    let damageDealt = Math.max(1, Math.floor(totalStats.totalAtk - baseMonster.def * 0.5));
    if (isCrit)
        damageDealt = Math.floor(damageDealt * 1.5);
    const monsterDamage = Math.max(1, Math.floor(baseMonster.atk - totalStats.totalDef * 0.4));
    const newPlayerHp = Math.max(0, user.chiSo.hp - monsterDamage);
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
    const battleRes = await UserService_1.UserService.applyBattleResults(userId, newPlayerHp, expEarned, dongEarned, false, user.canhGioi.capDo, huntLoot);
    // 3. Thực hiện [2] MINER (ĐÀO QUẶNG & TINH THẠCH)
    const mineRes = await GatheringService_1.GatheringService.mine(userId);
    // 4. Thực hiện [3] ALCHEMIST (BÀO CHẾ MA DƯỢC)
    const herbRes = await GatheringService_1.GatheringService.gatherHerbs(userId);
    // 5. Tổng hợp kết quả
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
    const mineText = mineRes.itemsGained.map((i) => `🪨 **${i.name}** x${i.qty}`).join(', ');
    const herbText = herbRes.itemsGained.map((i) => `🧪 **${i.name}** x${i.qty}`).join(', ');
    const levelUpNotify = battleRes.levelUp
        ? `\n\n🎉 **THĂNG CẤP THÀNH CÔNG!** Bạn đã đạt **Level ${battleRes.newLevel}**!\n📈 **Chỉ số tự động cộng:** **+50 Max HP** | **+20 Max MP** | **+10 Sát Thương** | **+3 Phòng Thủ**!`
        : '';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`⚡ HOẠT ĐỘNG SẢN XUẤT TỔ ĐỘI (WORK COMBO) — ${message.author.username.toUpperCase()}`)
        .setDescription(`🎯 **Kết quả sản xuất tài nguyên 4 Class PP:**\n\n` +
        `🏹 **HUNTER (Săn Quái):** Đả bại **${baseMonster.icon} ${baseMonster.name}** (Gây \`${damageDealt}\` DMG${critBadge})\n` +
        `✨ Thưởng: **+${expEarned} EXP** | **+${(0, formatters_1.formatDong)(dongEarned)}** | Loot: ${huntLootText}\n\n` +
        `🪨 **MINER (Đào Mỏ):** ${mineText}\n` +
        `🧪 **ALCHEMIST (Bào Chế):** ${herbText}${levelUpNotify}\n\n` +
        `💡 *Đừng quên thả nguyên liệu vào Kho Vault (\`vkl vlt dep\`) cho đồng đội trong nhóm 3-5 người dùng!*`);
    await message.reply({ embeds: [embed] });
}
