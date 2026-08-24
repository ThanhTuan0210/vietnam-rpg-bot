"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterMenuCommand = masterMenuCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function masterMenuCommand(message) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const currentCombat = (user.hePhai || 'Chưa Chọn').toUpperCase();
    const currentProducer = (user.producerJob || 'Chưa Chọn').toUpperCase();
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎮 TRUYỀN KỲ THỦY TỔ TRUNG CỔ - BẢNG ĐIỀU KHIỂN GAMER')
        .setDescription(`👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu:** \`${currentCombat}\` | 🔨 **Class Sản Xuất:** \`${currentProducer}\`\n\n` +
        `💡 **BẤM NÚT HOẶC CHỌN MENU BÊN DƯỚI ĐỂ CHƠI NGAY (KHÔNG CẦN GÕ CHỮ TRẮC TRỞ!):**`);
    // Row 1: Direct Action Buttons
    const row1 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vn w)').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_dungeon_1').setLabel('🗺️ Ngục Tối (vn d)').setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ (vn i)').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_profile').setLabel('👤 Hồ Sơ (vn p)').setStyle(discord_js_1.ButtonStyle.Secondary));
    // Row 2: Master Select Menu for Quick Options
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('master_menu_select')
        .setPlaceholder('👉 Chọn Thao Tác Game Ngay Tại Đây...')
        .addOptions([
        { label: '🎭 Chọn Song Phái Dual-Class', value: 'menu_job', description: 'Chọn Class Chiến Đấu & Class Sản Xuất', emoji: '⚔️' },
        { label: '📦 Kho Vault Chung Tổ Đội', value: 'menu_vault', description: 'Gửi / Rút tài nguyên Kho Hợp Tác Xã', emoji: '📦' },
        { label: '🛍️ Giao Dịch Trực Tiếp 1-1', value: 'menu_trade', description: 'Trao đổi đồ trực tiếp với bạn bè', emoji: '🤝' },
        { label: '🎓 Đệ Tử Truyền Thừa', value: 'menu_detu', description: 'Quản lý Đệ Tử & Dạy Nghề', emoji: '🎓' },
        { label: '🐉 Linh Thú Đồng Hành', value: 'menu_pet', description: 'Ấp trứng & Nuôi Linh thú', emoji: '🐉' },
        { label: '🎰 Minigames & Board Games', value: 'menu_minigames', description: 'Slots, Dice, Coinflip, Blackjack', emoji: '🎲' },
    ]);
    const row2 = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
    await message.reply({ embeds: [embed], components: [row1, row2] });
}
