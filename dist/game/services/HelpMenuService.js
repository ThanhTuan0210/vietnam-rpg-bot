"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpMenuService = void 0;
const embedBuilder_1 = require("../../utils/embedBuilder");
class HelpMenuService {
    /**
     * Tạo Embed Bảng Danh Sách Lệnh Medieval Dark Fantasy với Prefix "vkl"
     */
    static renderHelpEmbed(prefix = 'vkl') {
        return (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 BẢNG LỆNH GAMER - MEDIEVAL KYRISE RPG (PREFIX: vkl)')
            .setDescription(`🎮 **Bảng Điều Khiển Master Menu 1-Click:** Gõ \`vkl\` để bật Bảng Nút Bấm & Dropdown Menu!\n\n`)
            .addFields({
            name: '🎮 Phím Tắt 1 Chữ Cho Gamer',
            value: `\`vkl\` (Master Menu 1-Click), \`vkl w\` (Combo 5-trong-1), \`vkl h\` (Hunt), ` +
                `\`vkl d 1..7\` (Dungeon), \`vkl i\` (Inventory), \`vkl p\` (Profile), \`vkl v\` (Vault), \`vkl t @user\` (Trade)`,
            inline: false,
        }, {
            name: '🎭 Song Phái Dual-Class & Đệ Tử',
            value: `\`vkl job sel <war|mag|ran|ass> <min|alc|blk|hnt>\` (Chọn 1 Combat + 1 Producer)\n` +
                `\`vkl dtu rec <tên>\` (Thu nhận Đệ Tử Lv 50+), \`vkl pet adp longvuong\` (Ấp Linh thú)`,
            inline: false,
        }, {
            name: '📦 Kho Vault & Giao Thương',
            value: `\`vkl vlt dep <id> <qty>\` (Gửi đồ vào Kho Vault Tổ Đội 3-5 bạn bè)\n` +
                `\`vkl vlt wth <id> <qty>\` (Rút đồ từ Kho Vault Chung)\n` +
                `\`vkl shop\` (Tiệm NPC Trung Cổ), \`vkl buy <id> <qty>\` (Mua vật phẩm)`,
            inline: false,
        }, {
            name: '🗺️ 7 Ngục Tối Trung Cổ (7-Day Roadmap)',
            value: '**Tầng 1 (Lv 1-15):** Hang Goblin Rừng Tre (`vkl d 1`)\n' +
                '**Tầng 2 (Lv 15-25):** Đầm Lầy Orc Thượng Cổ (`vkl d 2`)\n' +
                '**Tầng 3 (Lv 25-35):** Mỏ Tháp Dwarven (`vkl d 3`)\n' +
                '**Tầng 4 (Lv 35-50):** Pháo Đài Gothic Âm Phủ (`vkl d 4`)\n' +
                '**Tầng 7 (Lv 85-100 ENDGAME):** Vương Tọa Rồng Infernal King (`vkl d 7`) ➔ **Bảo Kiếm Excalibur**',
            inline: false,
        })
            .setFooter({ text: '🛡️ Medieval Dark Fantasy • Gõ vkl để trải nghiệm 1-Click UI!' });
    }
}
exports.HelpMenuService = HelpMenuService;
