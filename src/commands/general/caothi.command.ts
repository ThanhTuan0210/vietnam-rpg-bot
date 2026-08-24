import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

// HÀM TẠO NHIỆM VỤ CÁO THỊ SĂN QUÁI ĐƠN GIẢN TRONG 3 GIỜ REAL-TIME
function generateRandomQuestsForUser(userId: string) {
  const cycleIndex = Math.floor(Date.now() / (3 * 3600 * 1000));
  const userNum = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = cycleIndex * 1000 + userNum;

  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const pool1 = [
    `🐺 **Tiêu diệt 3 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **20.000 Vàng** | ✨ **+500 EXP**`,
    `⚔️ **Tiêu diệt 4 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **25.000 Vàng** | 🧪 **2x Thuốc HP (\`potion_01a\`)**`,
    `🛡️ **Tiêu diệt 5 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **30.000 Vàng** | 🗝️ **1x Chìa Khóa Ngục Tối (\`key_01a\`)**`,
  ];

  const pool2 = [
    `🏰 **Chinh phục 1 Tầng Ngục Tối bất kỳ (\`vkl d 1\`) trong 3 Giờ** — Thưởng: 💰 **40.000 Vàng** | 🧰 **1x Rương Báu Thượng Cổ**`,
    `💀 **Tiêu diệt 6 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **35.000 Vàng** | ✨ **+1,000 EXP**`,
    `🔥 **Tiêu diệt 8 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **50.000 Vàng** | 📜 **1x Sách Xóa Nghề**`,
  ];

  const pool3 = [
    `🤺 **Đả bại 1 Đối Thủ Lôi Đài PVP (\`vkl pvp\`) trong 3 Giờ** — Thưởng: 💰 **35.000 Vàng** | ✨ **+800 EXP**`,
    `👑 **Khiêu chiến 1 Boss Thế Giới (\`vkl boss\`) trong 3 Giờ** — Thưởng: 💰 **60.000 Vàng** | 🧰 **1x Rương Báu Thượng Cổ**`,
    `🐲 **Tiêu diệt 10 Quái Vật bất kỳ (\`vkl w\` / \`vkl h\`) trong 3 Giờ** — Thưởng: 💰 **70.000 Vàng** | 🗝️ **2x Chìa Khóa Ngục Tối**`,
  ];

  const idx1 = Math.floor(pseudoRandom(1) * pool1.length);
  const idx2 = Math.floor(pseudoRandom(2) * pool2.length);
  const idx3 = Math.floor(pseudoRandom(3) * pool3.length);

  return [pool1[idx1], pool2[idx2], pool3[idx3]];
}

export async function caoThiCommand(message: Message): Promise<void> {
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

  const embed = createDongSonEmbed()
    .setTitle('📜 BẢNG CÁO THỊ SĂN QUÁI TRUNG CỔ (MONSTER HUNT QUESTS)')
    .setDescription(
      `🏛️ **HOÀNG GIA CÁO THỊ SĂN QUÁI:** Nhiệm vụ tiêu diệt quái vật tự động đổi mới ngẫu nhiên mỗi **3 Giờ**!\n` +
        `⏳ **Thời gian làm mới tiếp theo sau:** \`${timeRemStr}\`\n\n` +
        `1. ${quests[0]}\n\n` +
        `2. ${quests[1]}\n\n` +
        `3. ${quests[2]}\n\n` +
        `💡 *Chỉ cần gõ \`vkl w\` hoặc \`vkl h\` để đả bại quái vật và hoàn thành Cáo Thị nhận Vàng & EXP dễ dàng!*`
    );

  await message.reply({ embeds: [embed] });
}
