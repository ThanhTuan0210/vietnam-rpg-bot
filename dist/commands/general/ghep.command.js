"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghepCommand = ghepCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function ghepCommand(message, args) {
    const userId = message.author.id;
    const targetId = args[0]?.toLowerCase();
    const recipes = {
        thoi_dong: {
            resultName: 'Thỏi Đồng Thau',
            resultQty: 1,
            dongCost: 200,
            materials: [{ itemId: 'quang_dong', qty: 10 }],
        },
        thoi_sat: {
            resultName: 'Thỏi Sắt Tinh Luyện',
            resultQty: 1,
            dongCost: 500,
            materials: [{ itemId: 'quang_sat', qty: 10 }],
        },
        thoi_huyen_thiet: {
            resultName: 'Thỏi Huyền Thiết',
            resultQty: 1,
            dongCost: 1500,
            materials: [{ itemId: 'huyen_thiet_thach', qty: 10 }],
        },
        thoi_than_kim: {
            resultName: 'Thỏi Thần Kim',
            resultQty: 1,
            dongCost: 5000,
            materials: [{ itemId: 'than_kim_thach', qty: 10 }],
        },
        banh_chung: {
            resultName: 'Bánh Chưng Lang Liêu',
            resultQty: 1,
            dongCost: 300,
            materials: [
                { itemId: 'bo_nep', qty: 2 },
                { itemId: 'tui_dau', qty: 1 },
            ],
        },
        banh_giay: {
            resultName: 'Bánh Giầy Lang Liêu',
            resultQty: 1,
            dongCost: 300,
            materials: [{ itemId: 'bo_nep', qty: 3 }],
        },
    };
    if (!targetId) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧈 HỢP THÀNH NGUYÊN LIỆU & BÁNH DÂN GIAN')
            .setDescription(`Nấu quặng thô thành Thỏi Kim Loại hoặc gói Bánh Chưng / Bánh Giầy dâng Vua Hùng!\n\n` +
            `• Cú pháp: \`vn ghep [mã_vật_phẩm]\` (Ví dụ: \`vn ghep thoi_dong\` hoặc \`vn ghep banh_chung\`)\n\n` +
            `🧈 **Thỏi Đồng Thau** (\`thoi_dong\`) — Cần 10 Quặng Đồng (\`quang_dong\`) + 200đ\n` +
            `🧱 **Thỏi Sắt Tinh Luyện** (\`thoi_sat\`) — Cần 10 Quặng Sắt (\`quang_sat\`) + 500đ\n` +
            `🕋 **Thỏi Huyền Thiết** (\`thoi_huyen_thiet\`) — Cần 10 Huyền Thiết Thạch (\`huyen_thiet_thach\`) + 1,500đ\n` +
            `👑 **Thỏi Thần Kim** (\`thoi_than_kim\`) — Cần 10 Thần Kim Thạch (\`than_kim_thach\`) + 5,000đ\n` +
            `🟩 **Bánh Chưng Lang Liêu** (\`banh_chung\`) — Cần 2 Bó Nếp + 1 Túi Đậu + 300đ\n` +
            `⚪ **Bánh Giầy Lang Liêu** (\`banh_giay\`) — Cần 3 Bó Nếp + 300đ`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const recipe = recipes[targetId];
    if (!recipe) {
        await message.reply('❌ Công thức ghép không tồn tại! Gõ `vn ghep` để xem danh sách.');
        return;
    }
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    if (user.taiChinh.dong < recipe.dongCost) {
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(recipe.dongCost)} phí hợp thành!`);
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
        .setTitle('✨ HỢP THÀNH THÀNH CÔNG!')
        .setDescription(`Bạn đã đúc thành công **${recipe.resultName}** (\`${targetId}\`) **x${recipe.resultQty}** với phí ${(0, formatters_1.formatDong)(recipe.dongCost)}!`);
    await message.reply({ embeds: [embed] });
}
