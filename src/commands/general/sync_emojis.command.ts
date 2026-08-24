import { Client, Message } from 'discord.js';
import { ITEMS, CUSTOM_EMOJIS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function syncEmojisFromDiscord(client: Client): Promise<{ count: number; mapped: number; details: string[]; rawEmojiNames: string[] }> {
  const emojis = new Map<string, string>();
  const details: string[] = [];
  const rawEmojiNames: string[] = [];

  // 1. Quét Application Emojis
  if (client.application) {
    const appEmojis = await client.application.emojis.fetch().catch(() => null);
    if (appEmojis) {
      appEmojis.forEach((e) => {
        if (e.name) {
          const str = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
          emojis.set(e.name.toLowerCase(), str);
          rawEmojiNames.push(e.name);
        }
      });
    }
  }

  // 2. Quét Server Emojis
  client.emojis.cache.forEach((e) => {
    if (e.name) {
      const str = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
      if (!emojis.has(e.name.toLowerCase())) {
        emojis.set(e.name.toLowerCase(), str);
        rawEmojiNames.push(e.name);
      }
    }
  });

  let mappedCount = 0;

  // 3. Khớp Emoji với danh sách ITEMS trong Game
  for (const itemKey of Object.keys(ITEMS)) {
    const item = ITEMS[itemKey];
    const normId = item.id.toLowerCase();

    // Khớp chính xác tên ID (VD: `quang_sat`, `ruong_go`, `potion_01a`, `crystal_01a`...)
    if (emojis.has(normId)) {
      const emojiTag = emojis.get(normId)!;
      CUSTOM_EMOJIS[item.id] = emojiTag;
      mappedCount++;
      details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${emojiTag}`);
      continue;
    }

    // Khớp gần đúng (nếu tên emoji có chứa id hoặc ngược lại)
    for (const [eName, eTag] of emojis.entries()) {
      if (eName === normId || (eName.length > 3 && (normId.includes(eName) || eName.includes(normId)))) {
        CUSTOM_EMOJIS[item.id] = eTag;
        mappedCount++;
        details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${eTag}`);
        break;
      }
    }
  }

  return { count: emojis.size, mapped: mappedCount, details, rawEmojiNames };
}

export async function syncEmojisCommand(message: Message): Promise<void> {
  const res = await syncEmojisFromDiscord(message.client);

  const rawList = res.rawEmojiNames.length > 0 ? res.rawEmojiNames.slice(0, 20).map((n) => `\`:${n}:\``).join(', ') : 'Không có';

  const embed = createDongSonEmbed()
    .setTitle('🔄 ĐỒNG BỘ DISCORD CUSTOM EMOJIS')
    .setDescription(
      `🎉 **Đã quét thành công kho Emoji từ Discord!**\n\n` +
        `📊 **Tổng số Custom Emojis phát hiện:** \`${res.count}\` Emojis\n` +
        `⚡ **Số vật phẩm đã khớp thành công:** \`${res.mapped}\` Vật Phẩm\n\n` +
        `🔍 **Danh sách Emoji tìm thấy trên Server:** ${rawList}\n\n` +
        `**Chi tiết khớp Icon:**\n` +
        (res.details.length > 0
          ? res.details.slice(0, 15).join('\n')
          : '⚠️ *Chưa khớp vật phẩm nào! Hãy đổi tên các emoji thành tên ID vật phẩm (VD: đổi tên emoji_48 thành quang_sat).*')
    )
    .setFooter({ text: '💡 Mẹo: Vào Server Settings -> Emoji -> Đổi tên emoji thành tên ID vật phẩm rồi gõ lại vn sync_emojis!' });

  await message.reply({ embeds: [embed] });
}
