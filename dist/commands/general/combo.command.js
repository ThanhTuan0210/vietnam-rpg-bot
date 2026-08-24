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
        await message.reply('❌ Bạn chưa khởi tạo nhân vật hoặc chọn Hệ Phái! Hãy gõ `vn batdau` trước.');
        return;
    }
    // 1. Kiểm tra Cooldown 60s dồn lệnh
    const lastUsed = user.cooldowns?.get('combo_all') || 0;
    const now = Date.now();
    if (now - lastUsed < 60000) {
        const remSec = Math.ceil((60000 - (now - lastUsed)) / 1000);
        await message.reply(`⏰ **Cooldown Bách Nghệ:** Vui lòng chờ **${remSec}s** nữa mới có thể tiếp tục gõ \`vn combo\` (hoặc \`vn all\`, \`vn work\`).`);
        return;
    }
    // Cập nhật Cooldown đồng bộ cho tất cả kỹ năng
    await UserService_1.UserService.updateCooldownAtomic(userId, 'combo_all', now);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'san', now);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'don_cui', now);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'dao_khoang', now);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'cau_ca', now);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'hai_thuoc', now);
    // 2. Thực hiện [1] SĂN QUÁI (HUNT)
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
        if (itemDef && itemDef.type !== 'vukhi' && itemDef.type !== 'aogiap' && itemDef.type !== 'mu' && itemDef.type !== 'giay') {
            const dropChance = Math.max(0.2, drop.chance);
            if (Math.random() <= dropChance) {
                const qty = Math.floor(Math.random() * (drop.maxQty - drop.minQty + 1)) + drop.minQty;
                huntLoot.push({ itemId: drop.itemId, quantity: qty });
            }
        }
    }
    const battleRes = await UserService_1.UserService.applyBattleResults(userId, newPlayerHp, expEarned, dongEarned, false, user.canhGioi.capDo, huntLoot);
    // 3. Thực hiện [2] ĐỐN CỦI (CHOP)
    const woodRes = await GatheringService_1.GatheringService.woodcut(userId);
    // 4. Thực hiện [3] ĐÀO QUẶNG (MINE)
    const mineRes = await GatheringService_1.GatheringService.mine(userId);
    // 5. Thực hiện [4] CÂU CÁ (FISH)
    const fishRes = await GatheringService_1.GatheringService.fish(userId);
    // 6. Thực hiện [5] HÁI THUỐC (PICKUP)
    const herbRes = await GatheringService_1.GatheringService.gatherHerbs(userId);
    // 7. Tổng hợp hiển thị tất cả vật phẩm nhận được
    const critBadge = isCrit ? ' 💥 **BẠO KÍCH!**' : '';
    const huntLootText = huntLoot.length > 0
        ? huntLoot
            .map((d) => {
            const itemDef = items_1.ITEMS[d.itemId] || { name: d.itemId, icon: '📦' };
            return `${itemDef.icon} **${itemDef.name}** x${d.quantity}`;
        })
            .join(', ')
        : 'Không có';
    const woodText = woodRes.itemsGained.map((i) => `🪵 **${i.name}** x${i.qty}`).join(', ');
    const mineText = mineRes.itemsGained.map((i) => `🪨 **${i.name}** x${i.qty}`).join(', ');
    const fishText = fishRes.itemsGained.map((i) => `🎣 **${i.name}** x${i.qty}`).join(', ');
    const herbText = herbRes.itemsGained.map((i) => `🍃 **${i.name}** x${i.qty}`).join(', ');
    const levelUpNotify = battleRes.levelUp
        ? `\n\n🎉 **THĂNG CẤP THÀNH CÔNG!** Bạn đã đạt **Level ${battleRes.newLevel}**!\n📈 **Chỉ số tự động cộng:** **+50 Max HP** | **+20 Max MP** | **+10 Sát Thương** | **+3 Phòng Thủ**!`
        : '';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🌾 BÁCH NGHỆ TẬP TRUNG (5 TRONG 1) — ${message.author.username.toUpperCase()}`)
        .setDescription(`⚡ **Bạn vừa đồng thời thực hiện 5 công việc lao động & săn bắt dũng mãnh:**\n\n` +
        `⚔️ **SĂN QUÁI (HUNT):** Đả bại **${baseMonster.icon} ${baseMonster.name}** (Gây \`${damageDealt}\` DMG${critBadge})\n` +
        `✨ Thưởng Săn: **+${expEarned} EXP** | **+${(0, formatters_1.formatDong)(dongEarned)}** | Loot: ${huntLootText}\n\n` +
        `🪵 **ĐỐN CỦI (CHOP):** ${woodText}\n` +
        `🪨 **ĐÀO QUẶNG (MINE):** ${mineText}\n` +
        `🎣 **CÂU CÁ (FISH):** ${fishText}\n` +
        `🍃 **HÁI THUỐC (PICKUP):** ${herbText}${levelUpNotify}`)
        .setFooter({ text: '💡 Mẹo: Bạn có thể gõ vn combo, vn all, hoặc vn work để thực hiện 5 việc cùng lúc mỗi 60 giây!' });
    await message.reply({ embeds: [embed] });
}
