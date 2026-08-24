"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUA_TRU_TA_REGION_PRICES = void 0;
exports.shopCommand = shopCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const items_1 = require("../../game/data/items");
exports.BUA_TRU_TA_REGION_PRICES = {
    1: 10000,
    2: 25000,
    3: 60000,
    4: 150000,
    5: 400000,
};
async function shopCommand(message, args) {
    const userId = message.author.id;
    const username = message.author.username;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const firstArg = args[0]?.toLowerCase();
    // 🛍️ MEDIEVAL KYRISE SHOP CATALOG (100% MEDIEVAL ITEMS & 1:1 EMOJIS)
    const medievalShopCatalog = {
        // Dược Phép & Hồi Phục
        potion_01a: { name: items_1.ITEMS['potion_01a']?.name || 'Thuốc Hồi Máu HP', price: 100, type: 'Bào Chế', desc: 'Hồi phục 100 HP & MP ngay lập tức' },
        potion_02a: { name: items_1.ITEMS['potion_02a']?.name || 'Thuốc Hồi Mana MP', price: 150, type: 'Bào Chế', desc: 'Hồi phục 100 MP mana phép thuật' },
        potion_03a: { name: items_1.ITEMS['potion_03a']?.name || 'Ma Dược Cuồng Nộ', price: 500, type: 'Bào Chế', desc: 'Tăng +20% Sát Thương (ATK) trong Ngục Tối' },
        // Vũ Khí & Giáp Sơ Cấp Trung Cổ
        sword_01a: { name: items_1.ITEMS['sword_01a']?.name || 'Kiếm Sơ Cấp Trung Cổ', price: 1000, type: 'Rèn Đồ', desc: '+15 Sát Thương ATK Kị Sĩ' },
        shield_01a: { name: items_1.ITEMS['shield_01a']?.name || 'Khiên Thép Kị Sĩ', price: 1200, type: 'Rèn Đồ', desc: '+10 Phòng Thủ DEF' },
        staff_01a: { name: items_1.ITEMS['staff_01a']?.name || 'Trượng Gỗ Rừng Tinh Linh', price: 1000, type: 'Rèn Đồ', desc: '+20 Sát Thương Phép Magic ATK' },
        // Nguyên Liệu Rèn & Dụng Cụ
        ingot_01a: { name: items_1.ITEMS['ingot_01a']?.name || 'Thỏi Đồng Cổ', price: 300, type: 'Quặng', desc: 'Nguyên liệu rèn vũ khí Tier 1' },
        crystal_01a: { name: items_1.ITEMS['crystal_01a']?.name || 'Tinh Thạch Thượng Cổ', price: 800, type: 'Tinh Thạch', desc: 'Nguyên liệu kích rèn & khảm ngọc' },
        // Chìa Khóa & Rương Gothic
        key_01a: { name: items_1.ITEMS['key_01a']?.name || 'Chìa Khóa Ngục Tối Tầng 1', price: 2000, type: 'Chìa Khóa', desc: 'Mở rương báu Goblin Rừng' },
        gift_01a: { name: items_1.ITEMS['gift_01a']?.name || 'Rương Báu Thần Bí', price: 5000, type: 'Rương Báu', desc: 'Mở ngẫu nhiên vũ khí & vàng' },
    };
    // Process Buy Command: vkl buy <itemId> <qty>
    if (firstArg === 'buy' || firstArg === 'mua') {
        const targetItemId = args[1]?.toLowerCase();
        const amount = Math.max(1, parseInt(args[2]) || 1);
        if (!targetItemId || !medievalShopCatalog[targetItemId]) {
            await message.reply('⚠️ **Vật phẩm không có trong Tiệm Trung Cổ!** Gõ `vkl shop` để xem danh sách.');
            return;
        }
        const item = medievalShopCatalog[targetItemId];
        const totalCost = item.price * amount;
        if (user.taiChinh.dong < totalCost) {
            await message.reply(`⚠️ **Không đủ Tiền Vàng!** Bạn cần **${(0, formatters_1.formatDong)(totalCost)}** để mua \`${amount}\`x \`${item.name}\`.`);
            return;
        }
        user.taiChinh.dong -= totalCost;
        await UserService_1.UserService.addItemAtomic(userId, targetItemId, amount);
        await user.save();
        const icon = (0, items_1.getItemIcon)(targetItemId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🛍️ MUA HÀNG THÀNH CÔNG (MEDIEVAL SHOP)')
            .setDescription(`🎉 **${username}** đã mua thành công:\n\n` +
            `• **${amount}x** ${icon} **${item.name}** (\`${targetItemId}\`)\n` +
            `💰 **Tổng chi phí:** \`${(0, formatters_1.formatDong)(totalCost)}\`\n\n` +
            `💡 *Vật phẩm đã được chuyển vào Túi Đồ (\`vkl i\`)!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // Display Medieval NPC Shop
    let shopItemsStr = '';
    Object.entries(medievalShopCatalog).forEach(([id, item]) => {
        const icon = (0, items_1.getItemIcon)(id);
        shopItemsStr += `${icon} **${item.name}** (\`${id}\`): **${(0, formatters_1.formatDong)(item.price)}**\n└ *${item.desc}*\n\n`;
    });
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🛍️ TIỆM THƯƠNG NHÂN TRUNG CỔ (MEDIEVAL SHOP)')
        .setDescription(`🏛️ **THƯƠNG NHÂN NPC GOTHIC: Chào mừng ${username}!**\n\n` +
        `📌 **Cú pháp mua đồ nhanh:** \`vkl buy <mã_vật_phẩm> <số_lượng>\` (VD: \`vkl buy potion_01a 5\`)\n\n` +
        `📜 **DANH SÁCH VẬT PHẨM TRUNG CỔ:**\n\n${shopItemsStr}`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Xem Túi Đồ (vkl i)').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung (vkl v)').setStyle(discord_js_1.ButtonStyle.Success));
    await message.reply({ embeds: [embed], components: [row] });
}
