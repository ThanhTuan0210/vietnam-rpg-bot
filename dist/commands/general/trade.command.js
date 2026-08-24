"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeCommand = tradeCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function tradeCommand(message, args) {
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
        await message.reply('⚠️ **Vui lòng tag người chơi cần giao dịch!**\n*VD:* `vn trade @ThanhTuan`');
        return;
    }
    if (targetUser.id === message.author.id) {
        await message.reply('⚠️ Bạn không thể giao dịch với chính mình!');
        return;
    }
    const sender = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const receiver = await UserService_1.UserService.getOrCreateUser(targetUser.id);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🛍️ PHÒNG GIAO DỊCH TRỰC TIẾP 1-1 (MEDIEVAL TRADE)')
        .setDescription(`👥 **Bên A (Khởi xướng):** ${message.author.username}\n` +
        `👥 **Bên B (Được mời):** ${targetUser.username}\n\n` +
        `🤝 **Cửa Sổ Thương Lượng Giao Thương:**\n` +
        `• Cả 2 bên hãy xác nhận đồng ý mở cửa sổ trao đổi nguyên liệu/vũ khí bằng Nút bấm dưới đây.\n` +
        `• Thợ Đào Mỏ có thể đổi Quặng lấy Dược Phép từ Thợ Bào Chế hoặc Cuốc từ Thợ Rèn!`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('trade_accept').setLabel('✅ Đồng Ý Giao Dịch').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('trade_cancel').setLabel('❌ Hủy Giao Dịch').setStyle(discord_js_1.ButtonStyle.Danger));
    await message.reply({ embeds: [embed], components: [row] });
}
