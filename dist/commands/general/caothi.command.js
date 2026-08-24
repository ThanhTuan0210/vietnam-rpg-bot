"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caoThiCommand = caoThiCommand;
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
// HÀM TẠO NHIỆM VỤ CÁO THỊ TRUNG CỔ NGẪU NHIÊN 3H REAL-TIME
function generateRandomQuestsForUser(userId) {
    const cycleIndex = Math.floor(Date.now() / (3 * 3600 * 1000));
    const userNum = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = cycleIndex * 1000 + userNum;
    const pseudoRandom = (offset) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };
    const pool1 = [
        `🪵 **Đốn 15 Gỗ Sồi Cổ Gothic (\`vkl wcut\` / \`vkl craft\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(15000)} | 🔮 **5x Tinh Thạch Lam**`,
        `⛏️ **Đào 10 Thỏi Kim Loại Thạch (\`vkl mine\` / \`vkl m\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(20000)} | 🔮 **5x Tinh Thạch Lam**`,
        `🧪 **Bào Chế 5 Ma Dược HP/MP (\`vkl brew\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(15000)} | 🧪 **3x Thuốc HP (\`potion_01a\`)**`,
        `🔨 **Rèn 1 Vũ Khí/Giáp Tại Công Xưởng (\`vkl craft sword_01a\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(30000)} | 🧰 **1x Rương Báu Thượng Cổ**`,
        `🎣 **Câu 5 Cá Biển Sâu Gothic (\`vkl fish\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(12000)} | 🧪 **2x Thuốc Mana MP**`,
    ];
    const pool2 = [
        `⚔️ **Thực Hiện Lao Động Combo 3 Lần (\`vkl w\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(25000)} | ✨ **+500 EXP**`,
        `🐺 **Đả Bại Sói Rừng Âm Linh Gothic (\`vkl h\` / \`vkl hunt\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(30000)} | 🗝️ **1x Chìa Khóa Ngục Tối**`,
        `🏰 **Chinh Phục Ngục Tối Tầng 1-7 (\`vkl d 1\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(50000)} | 🧰 **1x Rương Báu Thượng Cổ**`,
        `🤺 **Quyết Đấu Lôi Đài Kị Sĩ PVP (\`vkl pvp\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(35000)} | ✨ **+1,000 EXP**`,
        `👑 **Khiêu Chiến Boss Thế Giới Trung Cổ (\`vkl boss\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(60000)} | 💎 **5x Hồng Ngọc Khảm Giáp**`,
    ];
    const pool3 = [
        `💥 **Cường Hóa Trang Bị Lên +1 Thành Công (\`vkl refine\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(40000)} | 🧪 **1x Ma Dược Kích Rèn**`,
        `💎 **Khảm 1 Hồng Ngọc Vào Lỗ Vũ Khí (\`vkl socket\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(50000)} | 💎 **1x Hồng Ngọc Khảm Giáp**`,
        `📜 **Sử Dụng Sách Xóa Nghề Trung Cổ (\`vkl use scroll_reset_job\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(60000)} | 📜 **1x Sách Xóa Nghề**`,
        `🧰 **Mở 1 Rương Báu Thần Bí (\`vkl open\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(30000)} | 🗝️ **2x Chìa Khóa Ngục Tối**`,
        `👑 **Thực Hiện 1 Lần Chuyển Sinh Căn Cốt (\`vkl rebirth\`)** — Thưởng: 💰 ${(0, formatters_1.formatDong)(100000)} | 💎 **10x Hồng Ngọc Thượng Cổ**`,
    ];
    const idx1 = Math.floor(pseudoRandom(1) * pool1.length);
    const idx2 = Math.floor(pseudoRandom(2) * pool2.length);
    const idx3 = Math.floor(pseudoRandom(3) * pool3.length);
    return [pool1[idx1], pool2[idx2], pool3[idx3]];
}
async function caoThiCommand(message) {
    const userId = message.author.id;
    const quests = generateRandomQuestsForUser(userId);
    // Tính thời gian còn lại của chu kỳ 3 giờ
    const cycleMs = 3 * 3600 * 1000;
    const currentCycleStart = Math.floor(Date.now() / cycleMs) * cycleMs;
    const nextCycleStart = currentCycleStart + cycleMs;
    const remMs = nextCycleStart - Date.now();
    const remHours = Math.floor(remMs / (3600 * 1000));
    const remMinutes = Math.floor((remMs % (3600 * 1000)) / (60 * 1000));
    const timeRemStr = remHours > 0 ? `${remHours} giờ ${remMinutes} phút` : `${remMinutes} phút`;
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('📜 BẢNG CÁO THỊ NHIỆM VỤ TRUNG CỔ (MEDIEVAL QUESTS)')
        .setDescription(`🏛️ **HOÀNG GIA CÁO THỊ:** Nhiệm vụ tự động đổi mới ngẫu nhiên mỗi **3 Giờ**!\n` +
        `⏳ **Làm mới nhiệm vụ tiếp theo sau:** \`${timeRemStr}\`\n\n` +
        `1. ${quests[0]}\n\n` +
        `2. ${quests[1]}\n\n` +
        `3. ${quests[2]}\n\n` +
        `💡 *Nhiệm vụ tự động hoàn thành và cộng thưởng trực tiếp khi bạn thực hiện các thao tác tương ứng!*`);
    await message.reply({ embeds: [embed] });
}
