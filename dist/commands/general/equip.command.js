"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipCommand = equipCommand;
exports.unequipCommand = unequipCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function equipCommand(message, args) {
    const userId = message.author.id;
    const rawInput = args.join(' ').trim().toLowerCase();
    if (!rawInput) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🥋 HƯỚNG DẪN MẶC & THÁO TRANG BỊ')
            .setDescription('Vui lòng nhập đúng cú pháp để mặc trang bị từ túi đồ:')
            .addFields({
            name: '🥋 Mặc Trang Bị (Equip)',
            value: '• `vkl equip [mã_id]` hoặc `vkl dung [mã_id]`\n*Ví dụ: `vkl equip dao_mac_dong` hoặc `vkl dung basic armor`*',
            inline: false,
        }, {
            name: '🥋 Cởi / Tháo Trang Bị (Unequip)',
            value: '• `vkl unequip vukhi` hoặc `vkl thao vukhi` (Tháo vũ khí cất túi)\n• `vkl unequip aogiap` hoặc `vkl thao aogiap` (Tháo áo giáp cất túi)',
            inline: false,
        });
        await message.reply({ embeds: [embed] });
        return;
    }
    // Ánh xạ Alias Tên Tiếng Anh sang ID Vật Phẩm CSDL
    const aliases = {
        sword: 'sword_01a',
        'starter sword': 'sword_01a',
        shield: 'shield_01a',
        'starter shield': 'shield_01a',
        staff: 'staff_01a',
        bow: 'bow_01a',
        excalibur: 'sword_03e',
    };
    const itemId = aliases[rawInput] || rawInput.replace(/ +/g, '_');
    const result = await UserService_1.UserService.equipItemAtomic(userId, itemId);
    if (result.embed) {
        await message.reply({ embeds: [result.embed] });
    }
    else {
        await message.reply(result.message);
    }
}
async function unequipCommand(message, args) {
    const userId = message.author.id;
    const slotInput = args[0]?.toLowerCase();
    if (slotInput !== 'vukhi' && slotInput !== 'aogiap' && slotInput !== 'sword' && slotInput !== 'armor') {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🥋 HƯỚNG DẪN CỞI / THÁO TRANG BỊ')
            .setDescription('Vui lòng chọn vị trí trang bị muốn tháo cất lại vào túi đồ:')
            .addFields({
            name: '🗡️ Tháo Vũ Khí',
            value: '• `vkl unequip vukhi` (hoặc `vkl thao vukhi` / `vkl unequip sword`)',
            inline: true,
        }, {
            name: '🥋 Tháo Áo Giáp',
            value: '• `vkl unequip aogiap` (hoặc `vkl thao aogiap` / `vkl unequip armor`)',
            inline: true,
        });
        await message.reply({ embeds: [embed] });
        return;
    }
    const slotType = slotInput === 'vukhi' || slotInput === 'sword' ? 'vukhi' : 'aogiap';
    const result = await UserService_1.UserService.unequipItemAtomic(userId, slotType);
    if (result.embed) {
        await message.reply({ embeds: [result.embed] });
    }
    else {
        await message.reply(result.message);
    }
}
