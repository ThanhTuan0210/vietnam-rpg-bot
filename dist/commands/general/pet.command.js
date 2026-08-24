"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petCommand = petCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function petCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const subCommand = args[0]?.toLowerCase();
    if (subCommand === 'adopt' && args[1]) {
        const petType = args[1].toLowerCase();
        const validPets = ['longvuong', 'cuuviho', 'chimlac'];
        if (!validPets.includes(petType)) {
            await message.reply('⚠️ **Linh thú không hợp lệ!** Chọn 1 trong 3 Linh Thú: `longvuong` (Thần Long nhặt quặng x2), `cuuviho` (+20% Rèn Bạo Tinh), `chimlac` (+15% Né Tránh).');
            return;
        }
        user.petType = petType;
        user.petLevel = 1;
        await user.save();
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🐣 ẤP TRỨNG LINH THÚ THÀNH CÔNG!')
            .setDescription(`🎉 **Chúc mừng ${message.author.username}!** Bạn đã nhận Linh Thú Đồng Hành:\n\n` +
            `🐉 **Linh Thú:** \`${petType.toUpperCase()}\` (Cấp 1)\n` +
            `✨ **Nội Tại:** Tự động hỗ trợ nhặt đồ x2 & buff thuộc tính trong combat!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const petType = user.petType || 'Chưa Có';
    const petLevel = user.petLevel || 0;
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🐉 HỆ THỐNG LINH THÚ ĐỒNG HÀNH (PET MEDIEVAL)')
        .setDescription(`👤 **Chủ Nhân:** ${message.author.username}\n` +
        `🐾 **Linh Thú Đang Nuôi:** \`${petType.toUpperCase()}\` (Level ${petLevel})\n\n` +
        `📌 **Hướng dẫn:**\n` +
        `• Bắt Linh thú: \`vn pet adopt <longvuong|cuuviho|chimlac>\``);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Đi Điểm Nhặt Đồ').setStyle(discord_js_1.ButtonStyle.Success));
    await message.reply({ embeds: [embed], components: [row] });
}
