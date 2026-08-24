"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEmojisFromDiscord = syncEmojisFromDiscord;
exports.syncEmojisCommand = syncEmojisCommand;
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function syncEmojisFromDiscord(client) {
    const emojis = new Map();
    const details = [];
    // 1. Quét Application Emojis
    if (client.application) {
        const appEmojis = await client.application.emojis.fetch().catch(() => null);
        if (appEmojis) {
            appEmojis.forEach((e) => {
                if (e.name) {
                    const str = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
                    emojis.set(e.name.toLowerCase(), str);
                }
            });
        }
    }
    // 2. Quét Server Emojis
    client.emojis.cache.forEach((e) => {
        if (e.name) {
            const str = e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`;
            emojis.set(e.name.toLowerCase(), str);
        }
    });
    let mappedCount = 0;
    // 3. Khớp Emoji với danh sách ITEMS trong Game
    for (const itemKey of Object.keys(items_1.ITEMS)) {
        const item = items_1.ITEMS[itemKey];
        const normId = item.id.toLowerCase();
        // Khớp chính xác tên ID (VD: `quang_sat`, `ruong_go`, `potion_01a`, `crystal_01a`...)
        if (emojis.has(normId)) {
            const emojiTag = emojis.get(normId);
            items_1.CUSTOM_EMOJIS[item.id] = emojiTag;
            mappedCount++;
            details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${emojiTag}`);
            continue;
        }
        // Khớp gần đúng (nếu tên emoji có chứa id hoặc ngược lại)
        let found = false;
        for (const [eName, eTag] of emojis.entries()) {
            if (eName === normId || normId.includes(eName) || eName.includes(normId)) {
                items_1.CUSTOM_EMOJIS[item.id] = eTag;
                mappedCount++;
                details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${eTag}`);
                found = true;
                break;
            }
        }
    }
    return { count: emojis.size, mapped: mappedCount, details };
}
async function syncEmojisCommand(message) {
    const res = await syncEmojisFromDiscord(message.client);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔄 ĐỒNG BỘ DISCORD CUSTOM EMOJIS')
        .setDescription(`🎉 **Đã quét thành công kho Emoji từ Discord!**\n\n` +
        `📊 **Tổng số Custom Emojis phát hiện:** \`${res.count}\` Emojis\n` +
        `⚡ **Số vật phẩm đã khớp Icon 2D/3D:** \`${res.mapped}\` Vật Phẩm\n\n` +
        `**Chi tiết khớp Icon mới:**\n` +
        (res.details.length > 0 ? res.details.slice(0, 15).join('\n') : '*(Chưa khớp tên ID trực tiếp)*'))
        .setFooter({ text: '💡 Mẹo: Đặt tên Emoji giống ID vật phẩm (VD: quang_sat, ruong_go, potion_01a) để Bot tự khớp chuẩn 100%!' });
    await message.reply({ embeds: [embed] });
}
