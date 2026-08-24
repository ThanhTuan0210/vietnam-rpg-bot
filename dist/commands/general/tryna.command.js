"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trynaCommand = trynaCommand;
const Bounty_model_1 = require("../../database/models/Bounty.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function trynaCommand(message, args) {
    const userId = message.author.id;
    const subCmd = args[0]?.toLowerCase();
    if (subCmd === 'dang') {
        const reward = parseInt(args[1], 10);
        const dungeonName = args.slice(2).join(' ') || 'Phụ Bản Trùm Vùng 2';
        if (isNaN(reward) || reward <= 0) {
            await message.reply('⚠️ **Cú pháp:** `vkl truy_na dang [số_tiền_thưởng] [tên_phụ_bản]`');
            return;
        }
        const paid = await UserService_1.UserService.deductDongAtomic(userId, reward);
        if (!paid) {
            await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(reward)} để lập Khế Ước Đánh Thuê!`);
            return;
        }
        const bountyId = `bounty_${Date.now()}`;
        await Bounty_model_1.BountyModel.create({
            bountyId,
            posterId: userId,
            posterName: message.author.username,
            targetDungeon: dungeonName,
            rewardDong: reward,
        });
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 LẬP KHẾ ƯỚC ĐÁNH THUÊ BẢNG VÀNG')
            .setDescription(`**${message.author.username}** đã chi trả ${(0, formatters_1.formatDong)(reward)} để treo Khế ước nhờ gánh **${dungeonName}**!\n` +
            `Mã khế ước: \`${bountyId}\``);
        await message.reply({ embeds: [embed] });
        return;
    }
    if (subCmd === 'nhan') {
        const bountyId = args[1];
        if (!bountyId) {
            await message.reply('⚠️ **Cú pháp:** `vkl truy_na nhan [mã_khế_ước]`');
            return;
        }
        const bounty = await Bounty_model_1.BountyModel.findOne({ bountyId, status: 'PENDING' });
        if (!bounty) {
            await message.reply('❌ Khế ước không tồn tại hoặc đã được nhận bởi người khác!');
            return;
        }
        bounty.acceptedBy = userId;
        bounty.status = 'COMPLETED';
        await bounty.save();
        await UserService_1.UserService.addDongAtomic(userId, bounty.rewardDong);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('⚔️ HOÀN THÀNH KHẾ ƯỚC ĐÁNH THUÊ!')
            .setDescription(`Anh Hùng **<@${userId}>** đã ra tay giúp **${bounty.posterName}** vượt qua **${bounty.targetDungeon}**!\n\n` +
            `💰 Phần thưởng ${(0, formatters_1.formatDong)(bounty.rewardDong)} đã được chuyển vào túi!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // Danh sách Khế Ước
    const pendingBounties = await Bounty_model_1.BountyModel.find({ status: 'PENDING' }).limit(5);
    if (pendingBounties.length === 0) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 BẢNG VÀNG KHẾ ƯỚC ĐÁNH THUÊ')
            .setDescription('Hiện tại không có Khế Ước Đánh Thuê nào đang treo.\n\n• `vkl truy_na dang [tiền_thưởng] [tên_phụ_bản]` để treo khế ước!');
        await message.reply({ embeds: [embed] });
        return;
    }
    const listStr = pendingBounties
        .map((b) => `• Mã: \`${b.bountyId}\` | **${b.posterName}** cần giúp **${b.targetDungeon}** ➔ Thưởng: ${(0, formatters_1.formatDong)(b.rewardDong)} (\`vkl truy_na nhan ${b.bountyId}\`)`)
        .join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('📜 BẢNG VÀNG KHẾ ƯỚC ĐÁNH THUÊ')
        .setDescription(`Danh sách Khế Ước đang chờ Anh Hùng gánh:\n\n${listStr}`);
    await message.reply({ embeds: [embed] });
}
