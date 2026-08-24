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
  const usedEmojiKeys = new Set<string>();

  // 3. Khớp Bước 1: Khớp chính xác hoặc gần đúng theo Tên ID/Từ khóa
  for (const itemKey of Object.keys(ITEMS)) {
    const item = ITEMS[itemKey];
    const normId = item.id.toLowerCase();

    if (emojis.has(normId)) {
      const emojiTag = emojis.get(normId)!;
      CUSTOM_EMOJIS[item.id] = emojiTag;
      usedEmojiKeys.add(normId);
      mappedCount++;
      details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${emojiTag}`);
      continue;
    }

    for (const [eName, eTag] of emojis.entries()) {
      if (!usedEmojiKeys.has(eName) && (eName === normId || (eName.length > 3 && (normId.includes(eName) || eName.includes(normId))))) {
        CUSTOM_EMOJIS[item.id] = eTag;
        usedEmojiKeys.add(eName);
        mappedCount++;
        details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${eTag}`);
        break;
      }
    }
  }

  // 4. Khớp Bước 2 (TỰ ĐỘNG KHỚP HÀNG LOẠT DÀNH CHO EMOJI KHÔNG CẦN ĐỔI TÊN như emoji_48, emoji_47...):
  // Gán lần lượt các Custom Emoji đã upload cho các vật phẩm chưa có Custom Emoji!
  const remainingEmojis: string[] = [];
  for (const [eName, eTag] of emojis.entries()) {
    if (!usedEmojiKeys.has(eName)) {
      remainingEmojis.push(eTag);
    }
  }

  if (remainingEmojis.length > 0) {
    let emojiIdx = 0;
    for (const itemKey of Object.keys(ITEMS)) {
      if (emojiIdx >= remainingEmojis.length) break;
      if (!CUSTOM_EMOJIS[itemKey]) {
        const eTag = remainingEmojis[emojiIdx++];
        CUSTOM_EMOJIS[itemKey] = eTag;
        mappedCount++;
        details.push(`• **${ITEMS[itemKey].name}** (\`${itemKey}\`) ➔ ${eTag} *(Tự động gán)*`);
      }
    }
  }

  return { count: emojis.size, mapped: mappedCount, details, rawEmojiNames };
}

export async function syncEmojisCommand(message: Message): Promise<void> {
  const res = await syncEmojisFromDiscord(message.client);

  const rawList = res.rawEmojiNames.length > 0 ? res.rawEmojiNames.slice(0, 20).map((n) => `\`:${n}:\``).join(', ') : 'Không có';

  const embed = createDongSonEmbed()
    .setTitle('🔄 TỰ ĐỘNG ĐỒNG BỘ DISCORD CUSTOM EMOJIS')
    .setDescription(
      `🎉 **Đã quét và tự động gán toàn bộ Custom Emojis từ Discord!**\n\n` +
        `📊 **Tổng số Custom Emojis phát hiện:** \`${res.count}\` Emojis\n` +
        `⚡ **Số vật phẩm đã được khoác áo Icon 2D/3D mới:** \`${res.mapped}\` Vật Phẩm\n\n` +
        `🔍 **Các Emoji tìm thấy:** ${rawList}\n\n` +
        `**Chi tiết tự động gán Icon mới vào Game:**\n` +
        (res.details.length > 0
          ? res.details.slice(0, 20).join('\n')
          : '⚠️ *Không tìm thấy Custom Emoji nào trên Server! Hãy upload ảnh icon lên Server Discord.*')
    )
    .setFooter({ text: '💡 Bạn không cần phải đổi tên thủ công! Bot tự động phân bổ Custom Emoji vừa upload vào vật phẩm!' });

  await message.reply({ embeds: [embed] });
}
