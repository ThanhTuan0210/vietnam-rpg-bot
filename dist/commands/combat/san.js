"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanCommandAdvanced = sanCommandAdvanced;
const User_model_1 = require("../../database/models/User.model");
const monsters_1 = require("../../game/data/monsters");
const items_1 = require("../../game/data/items");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const UserService_1 = require("../../game/services/UserService");
const RandomEventService_1 = require("../../game/services/RandomEventService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function sanCommandAdvanced(message, isHardMode = false) {
    const userId = message.author.id;
    let user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn start` trước.');
        return;
    }
    // 1. Cooldown Check 60s
    const cooldownKey = isHardMode ? 'san_kho' : 'san';
    const lastUsed = user.cooldowns?.get(cooldownKey) || 0;
    const now = Date.now();
    if (now - lastUsed < 60000) {
        const remSec = Math.ceil((60000 - (now - lastUsed)) / 1000);
        await message.reply(`⏰ **Cooldown:** Vui lòng chờ **${remSec}s** nữa mới có thể tiếp tục \`vn hunt\`.`);
        return;
    }
    // 2. Lấy quái ngẫu nhiên theo vùng
    const areaMonsters = monsters_1.MONSTERS.filter((m) => m.area === user.canhGioi.khuVuc && !m.isBoss);
    const baseMonster = areaMonsters[Math.floor(Math.random() * areaMonsters.length)] || monsters_1.MONSTERS[0];
    const totalStats = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    // 3. Tính toán 1 ĐÁNH ĂN LUÔN (Instant 1-Shot Turn)
    const isCrit = Math.random() < totalStats.totalCrit;
    let damageDealt = Math.max(1, Math.floor(totalStats.totalAtk - baseMonster.def * 0.5));
    if (isCrit)
        damageDealt = Math.floor(damageDealt * 1.5);
    // Quái đánh trả
    const monsterDamage = Math.max(1, Math.floor(baseMonster.atk - totalStats.totalDef * 0.4));
    const newPlayerHp = Math.max(0, user.chiSo.hp - monsterDamage);
    const expEarned = isHardMode ? Math.floor(baseMonster.expReward * 1.5) : baseMonster.expReward;
    const dongEarned = isHardMode ? Math.floor(baseMonster.dongReward * 1.5) : baseMonster.dongReward;
    // 4. TỶ LỆ RỚT NGUYÊN LIỆU NGẪU NHIÊN CHUẨN (TẮT HOÀN TOÀN RỚT VŨ KHÍ & ÁO GIÁP THÀNH PHẨM)
    const droppedItems = [];
    for (const drop of baseMonster.dropTable) {
        const itemDef = items_1.ITEMS[drop.itemId];
        // CHỈ CHO PHÉP RỚT NGUYÊN LIỆU, DA THÚ, GỖ, QUẶNG, RƯƠNG (KHÔNG RỚT VŨ KHÍ / ÁO GIÁP THÀNH PHẨM)
        if (itemDef && itemDef.type !== 'vukhi' && itemDef.type !== 'aogiap' && itemDef.type !== 'mu' && itemDef.type !== 'giay') {
            const dropChance = Math.max(0.20, drop.chance);
            if (Math.random() <= dropChance) {
                const qty = Math.floor(Math.random() * (drop.maxQty - drop.minQty + 1)) + drop.minQty;
                droppedItems.push({ itemId: drop.itemId, quantity: qty });
            }
        }
    }
    // Cập nhật CSDL
    await UserService_1.UserService.updateCooldownAtomic(userId, cooldownKey, Date.now());
    const battleRes = await UserService_1.UserService.applyBattleResults(userId, newPlayerHp, expEarned, dongEarned, false, user.canhGioi.capDo, droppedItems);
    // 5. Render Embed Kết Quả Đòn Đánh Instant
    const critBadge = isCrit ? ' 💥 **CRITICAL HIT!**' : '';
    const lootStr = droppedItems.length > 0
        ? droppedItems
            .map((d) => {
            const itemDef = items_1.ITEMS[d.itemId] || { name: d.itemId, icon: '📦' };
            return `📦 **Loot:** ${itemDef.icon} **${itemDef.name}** (\`${d.itemId}\`) x${d.quantity}`;
        })
            .join('\n')
        : '📦 *Không có rớt đồ.*';
    const levelUpStr = battleRes.levelUp
        ? `\n\n🎉 **THĂNG CẤP THÀNH CÔNG!** Bạn đã đạt **Level ${battleRes.newLevel}**!\n📈 **Chỉ số tự động cộng:** **+50 Max HP** | **+20 Max MP** | **+10 Sát Thương (ATK)** | **+3 Phòng Thủ (DEF)**!`
        : '';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`⚔️ HUNT — ${message.author.username.toUpperCase()}`)
        .setDescription(`🌲 Bạn đi săn tại **Vùng ${user.canhGioi.khuVuc}** và bắt gặp **${baseMonster.icon} ${baseMonster.name}**!\n\n` +
        `⚔️ **Sát thương gây ra:** \`${damageDealt}\` DMG${critBadge}\n` +
        `🩸 **Trảm hạ quái vật!** *(Máu còn ${newPlayerHp}/${totalStats.totalMaxHp} HP)*\n\n` +
        `✨ **Thưởng:** **+${expEarned} EXP** | **+${(0, formatters_1.formatDong)(dongEarned)}**\n` +
        `${lootStr}${levelUpStr}`);
    await message.reply({ embeds: [embed] });
    // 6. Kích hoạt thử nghiệm Sự kiện Bất ngờ (15% tỷ lệ)
    await RandomEventService_1.RandomEventService.tryTriggerEvent(message);
}
