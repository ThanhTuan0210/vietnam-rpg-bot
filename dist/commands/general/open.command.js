"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openChestCommand = openChestCommand;
const UserService_1 = require("../../game/services/UserService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function openChestCommand(message, args) {
    const userId = message.author.id;
    let targetItemId = args[0]?.toLowerCase();
    // If no chest ID passed, automatically pick the first chest in player's inventory
    if (!targetItemId) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const inventory = user.inventory || user.tuiDo || [];
        const chestItem = inventory.find((i) => {
            const def = items_1.ITEMS[i.itemId];
            return def?.type === 'ruong' && (i.quantity || i.soLuong || 0) > 0;
        });
        if (!chestItem) {
            const embed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle('🧰 HƯỚNG DẪN MỞ RƯƠNG BÁU — KYRISE RPG')
                .setDescription(`Bạn không có Rương Báu nào trong túi đồ!\n\n` +
                `• Cú pháp: \`vkl open [mã_rương]\` (Ví dụ: \`vkl open gift_01a\` hoặc \`vkl open giftopen_01f\`)\n\n` +
                `🧰 **Rương Báu Thượng Cổ** (\`gift_01a\`) — *Cần Chìa Khóa Ngục Tối (\`key_01a\`)*\n` +
                `🎁 **Rương Vô Địch Rồng ENDGAME** (\`giftopen_01f\`) — *Mở trực tiếp nhận Thần Kiếm Excalibur & 50.000 Vàng!*\n\n` +
                `💡 *Săn quái (\`vkl h\`) hoặc đánh Ngục Tối (\`vkl d 1-7\`) để nhặt Rương Báu!*`);
            await message.reply({ embeds: [embed] });
            return;
        }
        targetItemId = chestItem.itemId;
    }
    const chestDef = items_1.ITEMS[targetItemId];
    if (!chestDef || chestDef.type !== 'ruong') {
        await message.reply(`❌ Vật phẩm \`${targetItemId}\` không phải là Rương Báu có thể mở!`);
        return;
    }
    // Check key requirement for standard chests
    if (targetItemId === 'gift_01a' || targetItemId.startsWith('gift_01')) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const inventory = user.inventory || user.tuiDo || [];
        const keyItem = inventory.find((i) => i.itemId === 'key_01a');
        const keyQty = keyItem?.quantity || keyItem?.soLuong || 0;
        if (keyQty < 1) {
            await message.reply(`❌ Rương Báu này cần **1 Chìa Khóa Ngục Tối** (\`key_01a\`) để mở! Bạn đang có ${keyQty} chìa.`);
            return;
        }
        await UserService_1.UserService.consumeItemAtomic(userId, 'key_01a', 1);
    }
    // Consume the chest item
    const consumed = await UserService_1.UserService.consumeItemAtomic(userId, targetItemId, 1);
    if (!consumed) {
        await message.reply(`❌ Bạn không có **${chestDef.name}** (\`${targetItemId}\`) trong túi đồ!`);
        return;
    }
    // Calculate Loot Rewards
    let goldReward = Math.floor(Math.random() * 5000) + 1000;
    const itemsRewarded = [];
    if (targetItemId === 'giftopen_01f') {
        goldReward = 50000;
        // ENDGAME chest drops Excalibur + Crystal
        itemsRewarded.push({ name: items_1.ITEMS['sword_03e']?.name || 'Excalibur', itemId: 'sword_03e', qty: 1, icon: '🗡️' });
        itemsRewarded.push({ name: items_1.ITEMS['crystal_01j']?.name || 'Tinh Thạch Hoàng Kim', itemId: 'crystal_01j', qty: 3, icon: '💎' });
        itemsRewarded.push({ name: items_1.ITEMS['scroll_reset_job']?.name || 'Sách Xóa Nghề', itemId: 'scroll_reset_job', qty: 1, icon: '📜' });
    }
    else {
        // Standard chest drops weapons/armors + crystals
        const lootPool = ['sword_01c', 'staff_01b', 'bow_01b', 'shield_01b', 'armor_01a', 'crystal_01a', 'gem_01a', 'potion_01a'];
        const randomItem = lootPool[Math.floor(Math.random() * lootPool.length)];
        const itemDef = items_1.ITEMS[randomItem] || { name: randomItem, icon: '📦' };
        itemsRewarded.push({ name: itemDef.name, itemId: randomItem, qty: 1, icon: itemDef.icon });
    }
    // Add Gold and Items to User
    await UserService_1.UserService.addDongAtomic(userId, goldReward);
    for (const item of itemsRewarded) {
        await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
    }
    const lootListText = itemsRewarded.map((i) => `${i.icon} **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🧰 MỞ RƯƠNG BÁU THÀNH CÔNG — ${chestDef.name.toUpperCase()}`)
        .setDescription(`🎉 **Bạn đã mở thành công 1x ${chestDef.name}!**\n\n` +
        `🪙 **Vàng nhận được:** +**${(0, formatters_1.formatDong)(goldReward)}**\n` +
        `🎁 **Vật phẩm thu hoạch được:**\n${lootListText}\n\n` +
        `💡 *Dùng \`vkl i\` để kiểm tra đồ trong túi hoặc \`vkl equip\` để mặc trang bị ngay!*`);
    await message.reply({ embeds: [embed] });
}
