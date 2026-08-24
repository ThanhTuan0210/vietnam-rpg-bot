"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpInteractiveCommand = helpInteractiveCommand;
exports.handleHelpSelectInteraction = handleHelpSelectInteraction;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function helpInteractiveCommand(message) {
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('📖 TRUNG TÂM TRA CỨU & GỢI Ý LỆNH — KYRISE RPG')
        .setDescription(`Chào mừng bạn đến với Vương Quốc Trung Cổ Medieval Kyrise!\n\n` +
        `💡 **Chọn danh mục lệnh bên dưới Menu thả xuống để tra cứu chi tiết:**\n\n` +
        `⚔️ **1. Chiến Đấu & Ngục Tối** — *Săn quái, Đột kích Ngục Tối 7 Tầng, Luyện võ, Đấu PvP*\n` +
        `💼 **2. Nghề Nghiệp Sản Xuất (PP)** — *Thợ Mỏ, Thợ Bào Chế, Thợ Rèn, Lệnh W*\n` +
        `🎒 **3. Trang Bị & Cường Hóa** — *Hồ sơ, Túi đồ, Kho Vault, Khảm ngọc, Đập đồ*\n` +
        `🏰 **4. Bang Hội & Nhiệm Vụ** — *Bang hội, Bảng điểm danh, Giftcode, Chuyển sinh*\n` +
        `🎲 **5. Minigames Giải Trí** — *Tài xỉu, Xì dách, Bầu cua, Đua linh thú*\n\n` +
        `👇 **Hãy chọn 1 danh mục để xem hướng dẫn lệnh tương ứng!**`);
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('help_category_select')
        .setPlaceholder('🔍 Chọn danh mục câu lệnh muốn xem...')
        .addOptions([
        { label: '⚔️ Chiến Đấu & Ngục Tối', value: 'help_combat', description: 'Các lệnh vkl h, vkl d 1-7, vkl pvp, vkl boss' },
        { label: '💼 Nghề Nghiệp Sản Xuất (PP)', value: 'help_producer', description: 'Các lệnh vkl mine, vkl brew, vkl craft, vkl w' },
        { label: '🎒 Trang Bị & Cường Hóa', value: 'help_inventory', description: 'Các lệnh vkl p, vkl i, vkl v, vkl equip, vkl enchant' },
        { label: '🏰 Bang Hội & Tiến Trình', value: 'help_guild', description: 'Các lệnh vkl guild, vkl quest, vkl code, vkl rebirth' },
        { label: '🎲 Minigames Giải Trí', value: 'help_minigames', description: 'Các lệnh vkl taixiu, vkl xidach, vkl baucua' },
    ]);
    const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
    await message.reply({ embeds: [embed], components: [row] });
}
async function handleHelpSelectInteraction(interaction) {
    const value = interaction.values[0];
    let title = '';
    let description = '';
    switch (value) {
        case 'help_combat':
            title = '⚔️ TRA CỨU LỆNH: CHIẾN ĐẤU & NGỤC TỐI';
            description =
                `• \`vkl h\` (hoặc \`vkl hunt\`) — Săn quái quỷ nhặt Vàng, Rương & Chìa khóa\n` +
                    `• \`vkl d 1\` đến \`vkl d 7\` — Chinh phục Ngục Tối 7 Tầng quái vật\n` +
                    `• \`vkl pvp @User\` — Quyết đấu lôi đài với Kị Sĩ khác\n` +
                    `• \`vkl boss\` — Khiêu chiến Boss Thế Giới Trung Cổ\n` +
                    `• \`vkl tower\` — Đột kích Tháp Thách Thức Roguelike\n` +
                    `• \`vkl luyenvo\` — Luyện võ tăng lực chiến`;
            break;
        case 'help_producer':
            title = '💼 TRA CỨU LỆNH: NGHỀ NGHIỆP SẢN XUẤT (PP)';
            description =
                `• \`vkl w\` — Combo thực hiện công việc chuyên môn duy nhất của Class bạn\n` +
                    `• \`vkl mine\` — Công việc Thợ Mỏ (Đào khoáng thạch & quặng)\n` +
                    `• \`vkl brew\` — Công việc Thợ Bào Chế (Hái lá thuốc & nung ma dược)\n` +
                    `• \`vkl craft <itemId>\` — Công việc Thợ Rèn (Rèn vũ khí & áo giáp từ quặng)\n` +
                    `• \`vkl mastery\` — Xem Bảng Mệnh Đề Thông Thạo Nghề (Destiny Board)\n` +
                    `• \`vkl job\` — Xem & Chuyển đổi Class Sản Xuất (PP)`;
            break;
        case 'help_inventory':
            title = '🎒 TRA CỨU LỆNH: TRANG BỊ & KHO ĐỒ';
            description =
                `• \`vkl p\` (hoặc \`vkl profile\`) — Xem bảng chỉ số nhân vật & đồ đang mặc\n` +
                    `• \`vkl i\` (hoặc \`vkl inv\`) — Xem túi đồ cá nhân\n` +
                    `• \`vkl v\` (hoặc \`vkl vault\`) — Cất/Rút nguyên liệu Kho Vault Guild\n` +
                    `• \`vkl equip <itemId>\` — Mặc trang bị vào người\n` +
                    `• \`vkl unequip <vukhi/aogiap>\` — Tháo trang bị ra túi\n` +
                    `• \`vkl enchant <itemId>\` — Cường hóa đập đồ tăng ATK/DEF`;
            break;
        case 'help_guild':
            title = '🏰 TRA CỨU LỆNH: BANG HỘI & TIẾN TRÌNH';
            description =
                `• \`vkl guild\` — Xem thông tin & Quản lý Bang hội\n` +
                    `• \`vkl daily\` — Điểm danh nhận thưởng hàng ngày\n` +
                    `• \`vkl quest\` — Bảng nhiệm vụ cao thị hàng ngày\n` +
                    `• \`vkl code <MÃ>\` — Nhập Giftcode nhận quà\n` +
                    `• \`vkl rebirth\` — Chuyển sinh nhận điểm Căn Cốt`;
            break;
        case 'help_minigames':
            title = '🎲 TRA CỨU LỆNH: MINIGAMES GIẢI TRÍ';
            description =
                `• \`vkl taixiu [tiền] [tai/xiu]\` — Chơi Tài Xỉu xúc xắc\n` +
                    `• \`vkl xidach [tiền]\` — Đánh bài Xì Dách 21 điểm\n` +
                    `• \`vkl baucua [tiền] [con_vật]\` — Lắc Bầu Cua tôm cá\n` +
                    `• \`vkl slots [tiền]\` — Quay Nổ Hũ Slot Machine\n` +
                    `• \`vkl rps [tiền] [keo/bua/bao]\` — Trò chơi Oẳn Tù Tì thắng thua`;
            break;
    }
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(title)
        .setDescription(description + `\n\n💡 *Gõ bất kỳ lệnh nào ở trên để bắt đầu trải nghiệm!*`);
    await interaction.update({ embeds: [embed] });
}
