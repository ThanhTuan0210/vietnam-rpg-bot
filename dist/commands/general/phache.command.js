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
        com_lam: {
            resultName: 'Cơm Lam Bổ Dưỡng',
            resultQty: 2,
            dongCost: 100,
            materials: [
                { itemId: 'bo_nep', qty: 1 },
                { itemId: 'go_tre_gai', qty: 2 },
            ],
        },
        binh_kim_dan: {
            resultName: 'Bình Kim Đan Hộ Thể',
            resultQty: 1,
            dongCost: 500,
            materials: [
                { itemId: 'la_thuoc_nam', qty: 10 },
                { itemId: 'cu_nhiem_sam', qty: 2 },
            ],
        },
    };
    if (!targetId) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 DƯỢC LÒ PHA CHẾ — DÂN GIAN Y THUẬT')
            .setDescription(`Luyện dược liệu thuốc nam và nướng Cơm Lam dẻo thơm linh khí!\n\n` +
            `• Cú pháp: \`vn phache [mã_vật_phẩm]\` (Ví dụ: \`vn phache com_lam\` hoặc \`vn phache binh_kim_dan\`)\n\n` +
            `🍙 **Cơm Lam x2** (\`com_lam\`) — Cần 1 Bó Nếp + 2 Gỗ Tre (\`go_tre_gai\`) + 100đ *(Hồi 100% HP & MP)*\n` +
            `🔮 **Bình Kim Đan** (\`binh_kim_dan\`) — Cần 10 Lá Thuốc Nam (\`la_thuoc_nam\`) + 2 Củ Nhân Sâm (\`cu_nhiem_sam\`) + 500đ *(+100% DEF trong 30p)*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const recipe = recipes[targetId];
    if (!recipe) {
        await message.reply('❌ Công thức pha chế không tồn tại! Gõ `vn phache` để xem danh sách.');
        return;
    }
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    if (user.taiChinh.dong < recipe.dongCost) {
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(recipe.dongCost)} phí pha chế!`);
        return;
    }
    for (const mat of recipe.materials) {
        const uItem = user.tuiDo.find((i) => i.itemId === mat.itemId);
        const mDef = items_1.ITEMS[mat.itemId] || { name: mat.itemId };
        if (!uItem || uItem.soLuong < mat.qty) {
            await message.reply(`❌ Bạn thiếu **${mDef.name}** (\`${mat.itemId}\`) (Cần ${mat.qty}, đang có ${uItem?.soLuong || 0})!`);
            return;
        }
    }
    await UserService_1.UserService.deductDongAtomic(userId, recipe.dongCost);
    for (const mat of recipe.materials) {
        await UserService_1.UserService.consumeItemAtomic(userId, mat.itemId, mat.qty);
    }
    await UserService_1.UserService.addItemAtomic(userId, targetId, recipe.resultQty);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🧪 PHA CHẾ DƯỢC LIỆU THÀNH CÔNG!')
        .setDescription(`Bạn đã luyện thành công **${recipe.resultName}** (\`${targetId}\`) **x${recipe.resultQty}** với phí ${(0, formatters_1.formatDong)(recipe.dongCost)}!`);
    await message.reply({ embeds: [embed] });
}
