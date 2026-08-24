"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detuCommand = detuCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function detuCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    if (user.level < 50) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎓 HỆ THỐNG ĐỆ TỬ TRUYỀN THỪA (MEDIEVAL DETU)')
            .setDescription(`🔒 **Yêu cầu mở khóa:** Bạn cần đạt **Level 50** để thu nhận Đệ Tử Truyền Thừa!\n` +
            `📊 **Cấp độ hiện tại:** \`Level ${user.level}/50\`\n\n` +
            `💡 *Khi đạt Level 50, Đệ tử sẽ trợ chiến Buff HP/ATK trong combat và tự học 2 Nghề Sản Xuất nạp đồ vào Kho Vault cho cả nhóm!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const subCommand = args[0]?.toLowerCase();
    if (subCommand === 'nhan' && args[1]) {
        const detuName = args.slice(1).join(' ');
        user.detuName = detuName;
        user.detuLevel = 1;
        await user.save();
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎓 BÁI SƯ THÀNH CÔNG!')
            .setDescription(`🎉 **Chúc mừng Sư Phụ ${message.author.username}!** Bạn đã thu nhận Đệ Tử Truyền Thừa:\n\n` +
            `👤 **Tên Đệ Tử:** \`${detuName}\` (Cấp 1)\n` +
            `⚔️ **Kỹ năng Trợ Chiến:** Buff Hồi 20% HP/MP & +15% ATK cho Sư Phụ trong combat.\n` +
            `🔨 **Truyền Nghề:** Gõ \`vkl detu hoc <nghề1> <nghề2>\` để dạy 2 Nghề Sản Xuất cho đệ tử nạp Kho Vault!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const detuName = user.detuName || 'Chưa Thu Nhận';
    const detuLevel = user.detuLevel || 0;
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎓 THÔNG TIN ĐỆ TỬ TRUYỀN THỪA')
        .setDescription(`👤 **Sư Phụ:** ${message.author.username}\n` +
        `👦 **Đệ Tử:** \`${detuName}\` (Level ${detuLevel})\n` +
        `⚔️ **Trợ Chiến:** Active Buff +15% ATK & +20% HP Heal\n\n` +
        `📌 **Hướng dẫn:**\n` +
        `• Nhận Đệ tử: \`vkl detu nhan <tên_đệ_tử>\`\n` +
        `• Truyền nghề: \`vkl detu hoc <nghề1> <nghề2>\``);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_dungeon').setLabel('🗺️ Vượt Ngục Tối').setStyle(discord_js_1.ButtonStyle.Danger));
    await message.reply({ embeds: [embed], components: [row] });
}
