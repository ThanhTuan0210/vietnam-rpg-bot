"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuiDoCommand = tuiDoCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const items_1 = require("../../game/data/items");
async function tuiDoCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const embed = (0, embedBuilder_1.createDongSonEmbed)().setTitle(`🎒 ${message.author.username.toLowerCase()} — inventory`);
    if (!user.tuiDo || user.tuiDo.length === 0) {
        embed.setDescription('🎒 *Túi đồ của bạn đang trống rỗng. Gõ `vn hunt` để đi săn thu thập tài nguyên!*');
        await message.reply({ embeds: [embed] });
        return;
    }
    const materialsList = [];
    const consumablesList = [];
    const equipmentList = [];
    for (const itemSlot of user.tuiDo) {
        if (itemSlot.soLuong <= 0)
            continue;
        const itemDef = items_1.ITEMS[itemSlot.itemId];
        const icon = (0, items_1.getItemIcon)(itemSlot.itemId);
        const line = `${icon} **\`${itemSlot.itemId}\`**: ${itemSlot.soLuong}`;
        if (!itemDef) {
            materialsList.push(line);
            continue;
        }
        if (itemDef.type === 'nguyenlieu') {
            materialsList.push(line);
        }
        else if (itemDef.type === 'duoclieu') {
            consumablesList.push(line);
        }
        else {
            equipmentList.push(line);
        }
    }
    // Render 3 Cột Side-by-Side (inline: true) Giống hệt Epic RPG Screenshot
    if (materialsList.length > 0) {
        embed.addFields({
            name: '📦 Items (Tài nguyên)',
            value: materialsList.join('\n'),
            inline: true,
        });
    }
    if (consumablesList.length > 0) {
        embed.addFields({
            name: '🧪 Consumables (Tiêu dùng)',
            value: consumablesList.join('\n'),
            inline: true,
        });
    }
    if (equipmentList.length > 0) {
        embed.addFields({
            name: '🎁 Chests & Gear (Rương & Đồ)',
            value: equipmentList.join('\n'),
            inline: true,
        });
    }
    await message.reply({ embeds: [embed] });
}
