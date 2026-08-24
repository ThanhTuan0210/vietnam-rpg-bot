"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaultCommand = vaultCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const items_1 = require("../../game/data/items");
// Global Squad Vault store for 3-5 players
const SQUAD_VAULT = {
    ingot_01a: 15,
    crystal_01a: 8,
    potion_01a: 10,
    key_01a: 5,
};
async function vaultCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const action = args[0]?.toLowerCase();
    const itemId = args[1]?.toLowerCase();
    const amount = parseInt(args[2]) || 1;
    // Support: d, dep, deposit
    if ((action === 'd' || action === 'dep' || action === 'deposit') && itemId) {
        const itemSlot = user.inventory.find((i) => i.itemId.toLowerCase() === itemId);
        if (!itemSlot || itemSlot.quantity < amount) {
            await message.reply(`⚠️ **Không đủ vật phẩm!** Bạn không có đủ \`${amount}\` x \`${itemId}\` trong túi đồ.`);
            return;
        }
        itemSlot.quantity -= amount;
        if (itemSlot.quantity <= 0) {
            user.inventory = user.inventory.filter((i) => i.itemId.toLowerCase() !== itemId);
        }
        SQUAD_VAULT[itemId] = (SQUAD_VAULT[itemId] || 0) + amount;
        await user.save();
        const icon = (0, items_1.getItemIcon)(itemId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📥 ĐÃ THẢ VẬT PHẨM VÀO KHO VAULT CHUNG!')
            .setDescription(`🎉 **${message.author.username}** đã gửi thành công:\n\n` +
            `• **${amount}x** ${icon} \`${itemId}\` ➔ **Kho Vault Tổ Đội**\n\n` +
            `💡 *Đồng đội trong nhóm 3-5 người có thể rút ra dùng rèn đồ & chiến đấu bất cứ lúc nào!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // Support: w, wd, withdraw
    if ((action === 'w' || action === 'wd' || action === 'withdraw') && itemId) {
        const vaultQty = SQUAD_VAULT[itemId] || 0;
        if (vaultQty < amount) {
            await message.reply(`⚠️ **Kho Vault không đủ hàng!** Hiện chỉ có \`${vaultQty}\` x \`${itemId}\` trong Kho.`);
            return;
        }
        SQUAD_VAULT[itemId] -= amount;
        if (SQUAD_VAULT[itemId] <= 0) {
            delete SQUAD_VAULT[itemId];
        }
        const existingSlot = user.inventory.find((i) => i.itemId.toLowerCase() === itemId);
        if (existingSlot) {
            existingSlot.quantity += amount;
        }
        else {
            user.inventory.push({ itemId, quantity: amount });
        }
        await user.save();
        const icon = (0, items_1.getItemIcon)(itemId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📤 ĐÃ RÚT VẬT PHẨM TỪ KHO VAULT CHUNG!')
            .setDescription(`🎉 **${message.author.username}** đã rút thành công:\n\n` +
            `• **${amount}x** ${icon} \`${itemId}\` ➔ **Vào Túi Đồ Cá Nhân**`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // Display Squad Vault
    const vaultItems = Object.entries(SQUAD_VAULT);
    let vaultListStr = '';
    if (vaultItems.length === 0) {
        vaultListStr = '⚠️ *Kho Vault hiện tại đang trống!*';
    }
    else {
        vaultListStr = vaultItems
            .map(([id, qty]) => {
            const icon = (0, items_1.getItemIcon)(id);
            const name = items_1.ITEMS[id]?.name || id;
            return `• ${icon} **${name}** (\`${id}\`): **x${qty}**`;
        })
            .join('\n');
    }
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('📦 KHO TÀI NGUYÊN CHUNG TỔ ĐỘI (SQUAD VAULT)')
        .setDescription(`🏛️ **Kho Hợp Tác Xã Dành Cho Nhóm 3-5 Bạn Bè**\n\n` +
        `📊 **Danh mục tài nguyên trong Kho:**\n${vaultListStr}\n\n` +
        `📌 **Cú pháp Tiếng Anh viết tắt tối đa:**\n` +
        `• Gửi đồ vào Kho: \`vn v d <mã_đồ> <số_lượng>\` (Hoặc \`vn v dep ingot_01a 5\`)\n` +
        `• Rút đồ từ Kho: \`vn v w <mã_đồ> <số_lượng>\` (Hoặc \`vn v wd ingot_01a 5\`)`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ Cá Nhân').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_craft').setLabel('🔨 Lò Rèn').setStyle(discord_js_1.ButtonStyle.Success));
    await message.reply({ embeds: [embed], components: [row] });
}
