"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuiDoCommand = tuiDoCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const items_1 = require("../../game/data/items");
async function tuiDoCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const embed = (0, embedBuilder_1.createDongSonEmbed)().setTitle(`🎒 TÚI ĐỒ TRUNG CỔ — ${message.author.username.toUpperCase()}`);
    const inventorySlots = user.inventory && user.inventory.length > 0 ? user.inventory : user.tuiDo || [];
    if (!inventorySlots || inventorySlots.length === 0) {
        embed.setDescription('🎒 *Túi đồ của bạn đang trống rỗng. Gõ `vkl w` hoặc `vkl h` để đi làm thu thập tài nguyên!*');
        await message.reply({ embeds: [embed] });
        return;
    }
    const materialsList = [];
    const consumablesList = [];
    const equipmentList = [];
    for (const itemSlot of inventorySlots) {
        const qty = itemSlot.quantity || itemSlot.soLuong || 0;
        if (qty <= 0)
            continue;
        const itemId = itemSlot.itemId;
        const itemDef = items_1.ITEMS[itemId];
        const icon = (0, items_1.getItemIcon)(itemId);
        const line = `${icon} **${itemDef?.name || itemId}** (\`${itemId}\`): **x${qty}**`;
        if (!itemDef) {
            materialsList.push(line);
            continue;
        }
        const typeStr = (itemDef.type || '').toString();
        if (typeStr === 'nguyenlieu' || typeStr === 'quang' || typeStr === 'tinhthach' || typeStr === 'wood' || typeStr === 'ingot') {
            materialsList.push(line);
        }
        else if (typeStr === 'duoclieu' || typeStr === 'thuoc' || typeStr === 'potion') {
            consumablesList.push(line);
        }
        else {
            equipmentList.push(line);
        }
    }
    if (materialsList.length > 0) {
        embed.addFields({
            name: '📦 Nguyên Liệu & Quặng (Items)',
            value: materialsList.join('\n'),
            inline: true,
        });
    }
    if (consumablesList.length > 0) {
        embed.addFields({
            name: '🧪 Dược Phép & Tiêu Dùng (Consumables)',
            value: consumablesList.join('\n'),
            inline: true,
        });
    }
    if (equipmentList.length > 0) {
        embed.addFields({
            name: '⚔️ Trang Bị Medieval (Equipment)',
            value: equipmentList.join('\n'),
            inline: true,
        });
    }
    await message.reply({ embeds: [embed] });
}
