"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobCommand = jobCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function jobCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const subCommand = args[0]?.toLowerCase();
    // Support: s, sel, select
    if ((subCommand === 's' || subCommand === 'sel' || subCommand === 'select') && args.length >= 3) {
        const combatInput = args[1].toLowerCase();
        const producerInput = args[2].toLowerCase();
        const validCombat = ['warrior', 'w', 'mage', 'm', 'ranger', 'r', 'assassin', 'a'];
        const validProducer = ['miner', 'm', 'alchemist', 'alc', 'blacksmith', 'bs', 'hunter', 'h'];
        const combatMap = { w: 'warrior', m: 'mage', r: 'ranger', a: 'assassin' };
        const producerMap = { m: 'miner', alc: 'alchemist', bs: 'blacksmith', h: 'hunter' };
        const normCombat = combatMap[combatInput] || combatInput;
        const normProducer = producerMap[producerInput] || producerInput;
        user.hePhai = normCombat;
        user.producerJob = normProducer;
        await user.save();
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
            .setDescription(`🎉 **Chúc mừng ${message.author.username}!** Bạn đã đăng ký thành công Song Phái Trung Cổ:\n\n` +
            `⚔️ **Class Chiến Đấu:** \`${normCombat.toUpperCase()}\` (Sát thương & Lực chiến CP)\n` +
            `🔨 **Class Sản Xuất (PP):** \`${normProducer.toUpperCase()}\` (Giao thương & Nạp Kho Vault)\n\n` +
            `💡 *Tổ đội 3-5 bạn bè hãy phân công mỗi người 1 Nghề Sản Xuất khác nhau để làm giàu nhanh nhất!*`);
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ Person').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_dungeon').setLabel('🗺️ Ngục Tối').setStyle(discord_js_1.ButtonStyle.Danger));
        await message.reply({ embeds: [embed], components: [row] });
        return;
    }
    // Display Current Jobs
    const currentCombat = user.hePhai || 'Chưa Chọn';
    const currentProducer = user.producerJob || 'Chưa Chọn';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎭 QUẢN LÝ SONG PHÁI DUAL-CLASS (MEDIEVAL RPG)')
        .setDescription(`👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu Hiện Tại:** \`${currentCombat.toUpperCase()}\`\n` +
        `🔨 **Class Sản Xuất Hiện Tại (PP):** \`${currentProducer.toUpperCase()}\`\n\n` +
        `📌 **Hướng dẫn chọn Song Phái (Cú pháp Tiếng Anh viết tắt tối đa):**\n` +
        `• Gõ ngắn nhất: \`vn j s <w|m|r|a> <m|alc|bs|h>\` (Hoặc \`vn j sel warrior miner\`)\n` +
        `• **Combat:** \`w\` (Warrior), \`m\` (Mage), \`r\` (Ranger), \`a\` (Assassin)\n` +
        `• **Producer:** \`m\` (Miner), \`alc\` (Alchemist), \`bs\` (Blacksmith), \`h\` (Hunter)`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_trade').setLabel('🛍️ Giao Dịch 1-1').setStyle(discord_js_1.ButtonStyle.Primary));
    await message.reply({ embeds: [embed], components: [row] });
}
