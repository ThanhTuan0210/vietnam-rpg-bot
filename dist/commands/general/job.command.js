"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobCommand = jobCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function jobCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const subCommand = args[0]?.toLowerCase();
    // Support 3-letter prefix: sel, select
    if ((subCommand === 'sel' || subCommand === 'select') && args.length >= 3) {
        const combatInput = args[1].toLowerCase();
        const producerInput = args[2].toLowerCase();
        const combatMap = {
            war: 'warrior',
            warrior: 'warrior',
            mag: 'mage',
            mage: 'mage',
            ran: 'ranger',
            ranger: 'ranger',
            ass: 'assassin',
            assassin: 'assassin',
        };
        const producerMap = {
            min: 'miner',
            miner: 'miner',
            alc: 'alchemist',
            alchemist: 'alchemist',
            blk: 'blacksmith',
            blacksmith: 'blacksmith',
            hnt: 'hunter',
            hunter: 'hunter',
        };
        const normCombat = combatMap[combatInput];
        const normProducer = producerMap[producerInput];
        if (!normCombat || !normProducer) {
            await message.reply('⚠️ **Cú pháp chưa đúng!** Chọn 3 chữ đầu Class Chiến Đấu (`war`, `mag`, `ran`, `ass`) và Class Sản Xuất (`min`, `alc`, `blk`, `hnt`).\n*VD:* `vn job sel mag min`');
            return;
        }
        user.hePhai = normCombat;
        user.producerJob = normProducer;
        await user.save();
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
            .setDescription(`🎉 **Chúc mừng ${message.author.username}!** Bạn đã đăng ký thành công Song Phái Trung Cổ:\n\n` +
            `⚔️ **Class Chiến Đấu:** \`${normCombat.toUpperCase()}\` (Sát thương & Lực chiến CP)\n` +
            `🔨 **Class Sản Xuất (PP):** \`${normProducer.toUpperCase()}\` (Giao thương & Nạp Kho Vault)\n\n` +
            `💡 *Tổ đội 3-5 bạn bè hãy phân công mỗi người 1 Nghề Sản Xuất khác nhau để làm giàu nhanh nhất!*`);
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_dungeon').setLabel('🗺️ Ngục Tối').setStyle(discord_js_1.ButtonStyle.Danger));
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
        `📌 **Cú pháp Tiếng Anh 3 chữ đầu tiện lợi:**\n` +
        `• Gõ 3 chữ đầu: \`vn job sel <war|mag|ran|ass> <min|alc|blk|hnt>\` (VD: \`vn job sel war min\`)\n` +
        `• **Combat:** \`war\` (Warrior), \`mag\` (Mage), \`ran\` (Ranger), \`ass\` (Assassin)\n` +
        `• **Producer:** \`min\` (Miner), \`alc\` (Alchemist), \`blk\` (Blacksmith), \`hnt\` (Hunter)`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_trade').setLabel('🛍️ Giao Dịch 1-1').setStyle(discord_js_1.ButtonStyle.Primary));
    await message.reply({ embeds: [embed], components: [row] });
}
