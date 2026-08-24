"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeCommand = codeCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function codeCommand(message, args) {
    const userId = message.author.id;
    const codeStr = args[0]?.toUpperCase();
    if (!codeStr) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎁 NHẬP MÃ GIFTCODE QUÀ TẶNG')
            .setDescription(`• Cú pháp: \`vkl code [mã_quà_tặng]\`\n\n` +
            `🔥 **GIFTCODE ĐẠI LỄ QUỐC KHÁNH 2/9 ĐANG MỞ:**\n` +
            `• Mã: \`QUOCKHANH29\` hoặc \`DOCLAP29\` — Nhận 3 Rương Báu Thượng Cổ + 29,000đ + 29 Kim Bảo!\n` +
            `• Mã: \`DAI_VIET_2026\` — Nhận Quà Tân Thủ Thần Thoại (50,000đ + 10 Kim Bảo)`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    const validCodes = {
        QUOCKHANH29: {
            rewardName: '🇻🇳 Quà Mừng Đại Lễ Quốc Khánh 2/9',
            dong: 29000,
            kimBao: 29,
            items: [
                { itemId: 'ruong_vang', name: 'Rương Vàng Thượng Cổ', icon: '🔮', qty: 1 },
                { itemId: 'ruong_huyen_thiet', name: 'Rương Huyền Thiết Hoàng Cung', icon: '🏵️', qty: 1 },
                { itemId: 'ruong_bac', name: 'Rương Bạc Thượng Cổ', icon: '🟦', qty: 1 },
            ],
        },
        DOCLAP29: {
            rewardName: '🇻🇳 Quà Mừng Độc Lập 2/9',
            dong: 29000,
            kimBao: 29,
            items: [
                { itemId: 'ruong_vang', name: 'Rương Vàng Thượng Cổ', icon: '🔮', qty: 1 },
                { itemId: 'ruong_huyen_thiet', name: 'Rương Huyền Thiết Hoàng Cung', icon: '🏵️', qty: 1 },
                { itemId: 'ruong_bac', name: 'Rương Bạc Thượng Cổ', icon: '🟦', qty: 1 },
            ],
        },
        DAI_VIET_2026: {
            rewardName: '🌾 Quà Tân Thủ Đại Việt',
            dong: 50000,
            kimBao: 10,
            items: [{ itemId: 'ruong_go', name: 'Rương Gỗ Thượng Cổ', icon: '📦', qty: 2 }],
        },
    };
    const gift = validCodes[codeStr];
    if (!gift) {
        await message.reply('❌ Mã quà tặng không hợp lệ hoặc đã hết hạn!');
        return;
    }
    // Kiểm tra mã đã sử dụng chưa
    const cooldownKey = `code_${codeStr}`;
    const lastUsed = user.cooldowns?.get(cooldownKey) || 0;
    if (lastUsed > 0) {
        await message.reply(`❌ Bạn đã sử dụng mã quà tặng **${codeStr}** rồi! Mỗi mã chỉ được nhập 1 lần.`);
        return;
    }
    // Trao thưởng
    await UserService_1.UserService.addDongAtomic(userId, gift.dong);
    await User_model_1.UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': gift.kimBao } });
    for (const item of gift.items) {
        await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
    }
    await UserService_1.UserService.updateCooldownAtomic(userId, cooldownKey, Date.now());
    const itemsStr = gift.items.map((i) => `• ${i.icon} **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🎉 KÍCH HOẠT GIFTCODE THÀNH CÔNG — ${codeStr}!`)
        .setDescription(`Chúc mừng **${message.author.username}** đã nhận thành công **${gift.rewardName}**!\n\n` +
        `💰 **Tiền Đồng:** +${(0, formatters_1.formatDong)(gift.dong)}\n` +
        `💎 **Kim Bảo:** +${(0, formatters_1.formatKimBao)(gift.kimBao)}\n` +
        `🎁 **Vật Phẩm:**\n${itemsStr}`);
    await message.reply({ embeds: [embed] });
}
