import { EmbedBuilder } from 'discord.js';

export function createDongSonEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor('#DAA520') // Vàng Kim Gothic Trung Cổ
    .setAuthor({
      name: '⚔️ MEDIEVAL KYRISE RPG - KỶ NGUYÊN TRUNG CỔ ⚔️',
    })
    .setFooter({
      text: '🛡️ Medieval Dark Fantasy • 7 Ngục Tối & Giao Thương Song Phái',
    })
    .setTimestamp();
}
