"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveCommand = giveCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function giveCommand(message, args) {
    const userId = message.author.id;
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1], 10) || parseInt(args[0], 10);
    if (!targetUser || targetUser.id === userId || targetUser.bot || isNaN(amount) || amount <= 0) {
        await message.reply('⚠️ **Cú pháp:** `vkl cho @User [số_đồng]` (Ví dụ: `vkl cho @Tuan 10000`)');
        return;
    }
    const paid = await UserService_1.UserService.deductDongAtomic(userId, amount);
    if (!paid) {
        await message.reply(`❌ Bạn không sở hữu đủ ${(0, formatters_1.formatDong)(amount)} để chuyển tặng!`);
        return;
    }
    await UserService_1.UserService.addDongAtomic(targetUser.id, amount);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('💸 CHUYỂN TIỀN THÀNH CÔNG!')
        .setDescription(`Anh hùng **<@${userId}>** đã chuyển tặng thành công **${(0, formatters_1.formatDong)(amount)}** cho **<@${targetUser.id}>**!`);
    await message.reply({ embeds: [embed] });
}
