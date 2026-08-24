import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from 'discord.js';
import { createDongSonEmbed } from './embedBuilder';

// Danh sách tất cả các lệnh hợp lệ kèm mô tả
export const ALL_VALID_COMMANDS: { command: string; aliases: string[]; description: string }[] = [
  { command: 'profile', aliases: ['p', 'pro', 'profile', 'nhanvat', 'stats'], description: 'Xem hồ sơ anh hùng & chỉ số' },
  { command: 'dungeon', aliases: ['d', 'dun', 'dungeon', 'nguctoi', 'phuban'], description: 'Chinh phục Ngục Tối 7 Tầng' },
  { command: 'hunt', aliases: ['h', 'hnt', 'hunt', 'san'], description: 'Săn quái quỷ nhặt Vàng & Rương' },
  { command: 'inventory', aliases: ['i', 'inv', 'inventory', 'tuido', 'kho'], description: 'Mở túi đồ cá nhân' },
  { command: 'vault', aliases: ['v', 'vlt', 'vault', 'khochung'], description: 'Mở Kho Vault chia sẻ nguyên liệu' },
  { command: 'work', aliases: ['w', 'work', 'combo', 'c', 'cmb', 'all'], description: 'Thu hoạch đơn nghề chuyên môn' },
  { command: 'mine', aliases: ['mine', 'm', 'min', 'daokhoang'], description: 'Thợ Mỏ đào khoáng thạch' },
  { command: 'brew', aliases: ['brew', 'alc', 'potion', 'phache'], description: 'Thợ Bào Chế luyện ma dược' },
  { command: 'craft', aliases: ['craft', 'blk', 'forge', 'ren'], description: 'Thợ Rèn đúc vũ khí trang bị' },
  { command: 'shop', aliases: ['shop', 'cuahang', 'buy', 'mua', 'kimbao', 'kb'], description: 'Cửa hàng vật phẩm & Kim Bảo' },
  { command: 'equip', aliases: ['equip', 'mac', 'unequip', 'thao'], description: 'Mặc / Tháo trang bị' },
  { command: 'enchant', aliases: ['enchant', 'cuonghoa', 'dapdo'], description: 'Cường hóa trang bị tăng ATK/DEF' },
  { command: 'trade', aliases: ['t', 'trd', 'trade', 'giaodich'], description: 'Giao dịch vật phẩm với người chơi khác' },
  { command: 'job', aliases: ['job', 'songphai'], description: 'Chuyển đổi Class Sản Xuất (PP)' },
  { command: 'guide', aliases: ['guide', 'huongdan', 'lore', 'g'], description: 'Xem cốt truyện & hướng dẫn chi tiết' },
  { command: 'code', aliases: ['code', 'giftcode'], description: 'Nhập Giftcode nhận quà' },
  { command: 'daily', aliases: ['daily', 'diemdanh'], description: 'Điểm danh nhận thưởng hàng ngày' },
  { command: 'rebirth', aliases: ['rebirth', 'trunghoi', 'trungsinh'], description: 'Chuyển sinh nhận điểm Căn Cốt' },
  { command: 'taixiu', aliases: ['taixiu', 'dice'], description: 'Minigame Tài Xỉu' },
  { command: 'xidach', aliases: ['xidach', 'blackjack'], description: 'Minigame Xì Dách 21 điểm' },
];

// Tính khoảng cách Levenshtein giữa 2 chuỗi
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Tìm các lệnh gợi ý tốt nhất khi gõ sai
export function findBestMatches(input: string): { command: string; bestAlias: string; description: string }[] {
  const cleanInput = input.toLowerCase().trim();
  const suggestions: { command: string; bestAlias: string; description: string; distance: number }[] = [];

  for (const cmdObj of ALL_VALID_COMMANDS) {
    let minDistance = 999;
    let matchedAlias = cmdObj.command;

    for (const alias of cmdObj.aliases) {
      const dist = levenshteinDistance(cleanInput, alias);
      if (dist < minDistance) {
        minDistance = dist;
        matchedAlias = alias;
      }
    }

    if (minDistance <= 4) {
      suggestions.push({
        command: cmdObj.command,
        bestAlias: matchedAlias,
        description: cmdObj.description,
        distance: minDistance,
      });
    }
  }

  suggestions.sort((a, b) => a.distance - b.distance);
  return suggestions.slice(0, 3);
}

// Xử lý và gửi Embed Gợi Ý Lệnh gõ sai kèm Nút bấm 1-Click
export async function handleUnknownCommandSuggest(message: Message, unknownCmd: string): Promise<void> {
  const matches = findBestMatches(unknownCmd);

  const embed = createDongSonEmbed()
    .setTitle('⚠️ KHÔNG TÌM THẤY LỆNH NÀY!')
    .setDescription(
      `Lệnh \`vkl ${unknownCmd}\` không tồn tại trong hệ thống Kyrise RPG.\n\n` +
        (matches.length > 0
          ? `💡 **Có phải bạn đang muốn gõ:**\n` +
            matches.map((m) => `• \`vkl ${m.bestAlias}\` — *${m.description}*`).join('\n')
          : `💡 *Gõ \`vkl help\` hoặc \`vkl g\` để xem danh sách toàn bộ câu lệnh trong game!*`)
    );

  if (matches.length > 0) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    for (let i = 0; i < Math.min(3, matches.length); i++) {
      const m = matches[i];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`cmd_run_${m.bestAlias}`)
          .setLabel(`vkl ${m.bestAlias}`)
          .setStyle(ButtonStyle.Primary)
      );
    }
    await message.reply({ embeds: [embed], components: [row] });
  } else {
    await message.reply({ embeds: [embed] });
  }
}
