"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideCommand = guideCommand;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function guideCommand(message) {
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('📜 HƯỚNG DẪN NỘI DUNG & CỐT TRUYỆN — MEDIEVAL DARK FANTASY RPG')
        .setDescription(`🏛️ **KỶ NGUYÊN TRUNG CỔ GOTHIC (PREFIX CHÍNH THỨC: \`vkl\`):**\n\n` +
        `📖 **1. CỐT TRUYỆN & SỨ MỆNH ANH HÙNG:**\n` +
        `Đế Quốc Trung Cổ chìm vào bóng tối dưới sự thống trị của **Vua Rồng Infernal King (Boss Tầng 7)**. Nhiệm vụ của bạn và tổ đội 3-5 người là thành lập **Song Phái Dual-Class**, sản xuất vũ khí ma dược và chinh phục 7 Ngục Tối để rèn nên **Thần Kiếm Excalibur (\`sword_03e\`)**!\n\n` +
        `⚔️ **2. BỘ SONG PHÁI DUAL-CLASS (1 COMBAT + 1 PRODUCER):**\n` +
        `• **1 Class Chiến Đấu (Săn Quái & Đánh Boss):** \`Warrior\` (Kị Sĩ), \`Mage\` (Pháp Sư), \`Ranger\` (Cung Thủ), \`Assassin\` (Sát Thủ).\n` +
        `• **1 trong 3 Class Sản Xuất Khép Kín (PP):**\n` +
        `  └ 🪨 **Miner (Thợ Mỏ - \`vkl mine\`):** Đào quặng, tinh thạch & ngọc quý.\n` +
        `  └ 🧪 **Alchemist (Thợ Bào Chế - \`vkl brew\`):** Luyện thuốc HP/MP & ma dược kích rèn.\n` +
        `  └ 🔨 **Blacksmith (Thợ Rèn - \`vkl craft\`):** Rèn vũ khí, khiên giáp & cuốc mỏ.\n\n` +
        `🔄 **3. VÒNG KINH TẾ TỔ ĐỘI KHO VAULT CHUNG:**\n` +
        `• Thợ Mỏ đào quặng ➔ Nạp vào Kho Vault (\`vkl vlt dep\`) ➔ Thợ Rèn lấy quặng rèn đồ!\n` +
        `• Thợ Mỏ đào tinh thạch ➔ Nạp vào Kho Vault ➔ Thợ Bào Chế lấy luyện thuốc HP/MP!\n` +
        `• Thợ Bào Chế luyện thuốc ➔ Cung cấp cho Kị Sĩ đi săn quái (\`vkl hunt\`) & đánh Boss Ngục Tối (\`vkl d 1..7\`)!\n\n` +
        `⏳ **4. GIỚI HẠN ĐỔI NGHỀ 24H & SÁCH XÓA NGHỀ:**\n` +
        `• Đổi Class Sản Xuất bị giới hạn **24 giờ thời gian thực**.\n` +
        `• Nếu muốn đổi ngay lập tức: Mua **📜 Sách Xóa Nghề (\`scroll_reset_job\`)** trong Tiệm NPC (\`vkl shop\` - Giá 50k Vàng) và dùng (\`vkl use scroll_reset_job\`)!\n\n` +
        `🐉 **5. LINH THÚ KỊ SĨ & GIFTCODE TÂN THỦ:**\n` +
        `• Nuôi Linh thú hỗ trợ chuyên môn: \`vkl pet\` (🐉 Rồng Lửa, 🐺 Sói Âm Linh, 🐴 Chiến Mã, 🦅 Ưng Tiên Tri).\n` +
        `• Nhận quà Tân thủ khủng: Gõ \`vkl code VKL2026\`, \`vkl code EXCALIBUR\`, \`vkl code MEDIEVALVIP\`!`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_master_menu').setLabel('🎮 Bảng Master Menu (vkl)').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ (vkl i)').setStyle(discord_js_1.ButtonStyle.Primary));
    await message.reply({ embeds: [embed], components: [row] });
}
