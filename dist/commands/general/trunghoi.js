"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trungHoiCommand = trungHoiCommand;
exports.canCotCommand = canCotCommand;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const RebirthEngine_1 = require("../../game/engines/RebirthEngine");
const embedBuilder_1 = require("../../utils/embedBuilder");
const SessionManager_1 = require("../../game/managers/SessionManager");
async function trungHoiCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
        return;
    }
    const check = RebirthEngine_1.RebirthEngine.canRebirth(user);
    if (!check.eligible) {
        await message.reply(check.message);
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một thao tác chưa hoàn thành!');
        return;
    }
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('rebirth_confirm')
        .setLabel('🌀 XÁC NHẬN TRÙNG SINH LUÂN HỒI')
        .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
        .setCustomId('rebirth_cancel')
        .setLabel('❌ HỦY BỎ')
        .setStyle(discord_js_1.ButtonStyle.Secondary));
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🌀 XÁC NHẬN TRÙNG SINH LUÂN HỒI')
        .setDescription(`⚠️ **CẢNH BÁO LUÂN HỒI:**\n` +
        `• Cấp độ và Vùng đất sẽ reset về **Cấp 1 & Vùng 1**.\n` +
        `• Giữ nguyên: **Kim Bảo, Linh Thú, Danh Hiệu**.\n` +
        `• Tích lũy thêm: **+1 Lần Trùng Sinh** & **+10 Điểm Cân Cốt** để nâng cấp thuộc tính vĩnh viễn!\n\n` +
        `Bạn có chắc chắn muốn tiến hành Trùng Sinh không?`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        session.unlock(userId);
        const disabledRow = new discord_js_1.ActionRowBuilder();
        row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
        if (i.customId === 'rebirth_confirm') {
            const ok = await RebirthEngine_1.RebirthEngine.executeRebirth(userId);
            if (ok) {
                const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle('✨ TRÙNG SINH THÀNH CÔNG!')
                    .setDescription(`Chúc mừng bạn đã tái sinh luân hồi thành công! Bạn nhận được **+10 Điểm Cân Cốt**.\n\nGõ \`vn cancot\` để nâng cấp điểm tiềm năng vĩnh viễn!`);
                await i.update({ embeds: [resultEmbed], components: [disabledRow] });
            }
        }
        else {
            await i.update({ content: '❌ Đã hủy thao tác Trùng Sinh.', components: [disabledRow] });
        }
        collector.stop('completed');
    });
    collector.on('end', async (_, reason) => {
        session.unlock(userId);
        if (reason === 'time') {
            const disabledRow = new discord_js_1.ActionRowBuilder();
            row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
            await replyMsg.edit({ content: '⏰ Hết giờ! Thao tác Trùng Sinh bị hủy.', components: [disabledRow] });
        }
    });
}
async function canCotCommand(message, args) {
    const userId = message.author.id;
    const statTypeInput = args[0]?.toLowerCase();
    if (!statTypeInput) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        const pts = user?.diemCanCot || 0;
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('✨ CÂN CỐT TIỀM NĂNG LUÂN HỒI')
            .setDescription(`Số điểm Cân Cốt hiện có: **${pts} điểm**\n\n` +
            `**Các thuộc tính có thể nâng cấp:**\n` +
            `• \`vn cancot tocsdo\` : Tăng tốc độ thu hoạch (+5%/cấp)\n` +
            `• \`vn cancot cooldown\` : Giảm thời gian hồi chiêu (-2%/cấp)\n` +
            `• \`vn cancot drop\` : Tăng tỷ lệ rớt đồ hiếm (+3%/cấp)\n` +
            `• \`vn cancot exp\` : Hệ số nhân EXP vĩnh viễn (+0.5x/cấp)`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const mapKey = {
        tocdo: 'tocDoThuHoach',
        cooldown: 'giamCooldown',
        drop: 'tyLeDropHiem',
        exp: 'heSoExp',
    };
    const statKey = mapKey[statTypeInput];
    if (!statKey) {
        await message.reply('❌ Thuộc tính không hợp lệ! Dùng `vn cancot` để xem danh sách.');
        return;
    }
    const res = await RebirthEngine_1.RebirthEngine.upgradePotential(userId, statKey);
    await message.reply(res.message);
}
