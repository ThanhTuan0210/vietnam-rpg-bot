import { EmbedBuilder } from 'discord.js';

export function createDongSonEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#D4AF37') // Mầu vàng đồng cổ Đông Sơn
    .setAuthor({
      name: '🏛️ HÙNG VƯƠNG TRUYỀN KỲ - BẢN SẮC DÂN GIAN VIỆT NAM 🏛️',
    })
    .setFooter({
      text: '🐉 Con Rồng Cháu Tiên • Trừ tà diệt quái, săn quái tích truyền kỳ',
    })
    .setTimestamp();
}
