"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phaCheCommand = phaCheCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function phaCheCommand(message, args) {
    const userId = message.author.id;
    const targetId = args[0]?.toLowerCase();
    const recipes = {
        potion_01a: {
            resultName: 'Bình Dược Hồi HP Sơ Cấp',
            resultQty: 2,
            dongCost: 100,
            materials: [{ itemId: 'wood_01a', qty: 2 }],
        },
        potion_03a: {
            resultName: 'Ma Dược Kích Rèn Thượng Cổ',
            resultQty: 1,
            dongCost: 500,
            materials: [{ itemId: 'crystal_01a', qty: 2 }],
        },
    };
    if (!targetId || !recipes[targetId]) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 LÒ BÀO CHẾ MA DƯỢC GOTHIC — ALCHEMIST FORGE')
            .setDescription(`Bào chế dược liệu thần kỳ hồi sinh lực và ma dược kích rèn!\n\n` +
            `• Cú pháp: \`vkl brew [mã_vật_phẩm]\` (VD: \`vkl brew potion_01a\` hoặc \`vkl brew potion_03a\`)\n\n` +
            `🧪 **Thuốc Hồi Máu HP x2** (\`potion_01a\`) — Cần 2 Gỗ Sồi Cổ (\`wood_01a\`) + 100 Vàng *(Hồi 100% HP & MP)*\n` +
            `🔮 **Ma Dược Kích Rèn** (\`potion_03a\`) — Cần 2 Tinh Thạch Thượng Cổ (\`crystal_01a\`) + 500 Vàng`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const recipe = recipes[targetId];
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    if (user.taiChinh.dong < recipe.dongCost) {
        await message.reply(`❌ Bạn không đủ Tiền Vàng! Cần **${(0, formatters_1.formatDong)(recipe.dongCost)}**.`);
        return;
    }
    const inventory = user.inventory || [];
    for (const mat of recipe.materials) {
        const userItem = inventory.find((i) => i.itemId === mat.itemId);
        const hasQty = userItem?.quantity || userItem?.soLuong || 0;
        if (hasQty < mat.qty) {
            const matDef = items_1.ITEMS[mat.itemId] || { name: mat.itemId };
            await message.reply(`❌ Bạn thiếu nguyên liệu **${matDef.name}** (\`${mat.itemId}\`)! Cần ${mat.qty}, có ${hasQty}.`);
            return;
        }
    }
    user.taiChinh.dong -= recipe.dongCost;
    for (const mat of recipe.materials) {
        await UserService_1.UserService.consumeItemAtomic(userId, mat.itemId, mat.qty);
    }
    await UserService_1.UserService.addItemAtomic(userId, targetId, recipe.resultQty);
    await user.save();
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🧪 BÀO CHẾ THÀNH CÔNG!')
        .setDescription(`Bạn đã bào chế thành công **${recipe.resultQty}x ${recipe.resultName}** (\`${targetId}\`)!`);
    await message.reply({ embeds: [embed] });
}
