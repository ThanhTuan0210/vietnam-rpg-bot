"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEmojisFromDiscord = syncEmojisFromDiscord;
exports.syncEmojisCommand = syncEmojisCommand;
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function syncEmojisFromDiscord(client) {
    const emojis = new Map();
    const details = [];
    const rawEmojiNames = [];
    // Reset CUSTOM_EMOJIS sạch sẽ trước khi quét lại
    for (const k of Object.keys(items_1.CUSTOM_EMOJIS)) {
        delete items_1.CUSTOM_EMOJIS[k];
    }
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
    const usedEmojiKeys = new Set();
    // Helper tìm emoji chưa dùng thuộc danh sách từ khóa
    const findAvailableEmoji = (keywords) => {
        for (const [eName, eTag] of emojis.entries()) {
            if (usedEmojiKeys.has(eName))
                continue;
            for (const kw of keywords) {
                if (eName.includes(kw)) {
                    return { name: eName, tag: eTag };
                }
            }
        }
        return null;
    };
    // 3. KHỚP CHUẨN XÁC NỘI DUNG VẬT PHẨM VỚI DẠNG ICON KYRISE / GENERAL EMOJIS:
    for (const itemKey of Object.keys(items_1.ITEMS)) {
        const item = items_1.ITEMS[itemKey];
        const normId = item.id.toLowerCase();
        // 3.1 Khớp chính xác tên ID (VD: `quang_sat`, `ruong_go`, `potion_01a`, `crystal_01a`...)
        if (emojis.has(normId) && !usedEmojiKeys.has(normId)) {
            const emojiTag = emojis.get(normId);
            items_1.CUSTOM_EMOJIS[item.id] = emojiTag;
            usedEmojiKeys.add(normId);
            mappedCount++;
            details.push(`• **${item.name}** ➔ ${emojiTag}`);
            continue;
        }
        // 3.2 Khớp thông minh theo CHỦ ĐỀ VẬT PHẨM (Category Smart Match):
        let matched = null;
        if (normId.includes('ruong') || item.type === 'ruong') {
            matched = findAvailableEmoji(['gift', 'box', 'chest']);
        }
        else if (normId.includes('quang') || normId.includes('thiet') || normId.includes('kim_thach') || normId.includes('ngoc')) {
            matched = findAvailableEmoji(['crystal', 'gem', 'ingot']);
        }
        else if (normId.includes('thuoc') || normId.includes('dan') || normId.includes('sam') || item.type === 'duoclieu') {
            matched = findAvailableEmoji(['potion']);
        }
        else if (normId.includes('bua') || normId.includes('the_skip')) {
            matched = findAvailableEmoji(['scroll', 'spellbook', 'book']);
        }
        else if (normId.includes('ca_chep')) {
            matched = findAvailableEmoji(['fish']);
        }
        else if (normId.includes('nhan') || item.type === 'nhan') {
            matched = findAvailableEmoji(['ring']);
        }
        else if (normId.includes('day_chuyen') || item.type === 'daychuyen') {
            matched = findAvailableEmoji(['necklace']);
        }
        else if (normId.includes('non') || item.type === 'mu') {
            matched = findAvailableEmoji(['helmet']);
        }
        else if (item.type === 'vukhi') {
            matched = findAvailableEmoji(['sword', 'staff', 'bow', 'arrow']);
        }
        else if (item.type === 'aogiap') {
            matched = findAvailableEmoji(['shield', 'armour', 'armor']);
        }
        if (matched) {
            items_1.CUSTOM_EMOJIS[item.id] = matched.tag;
            usedEmojiKeys.add(matched.name);
            mappedCount++;
            details.push(`• **${item.name}** (\`${item.id}\`) ➔ ${matched.tag}`);
        }
    }
    return { count: emojis.size, mapped: mappedCount, details, rawEmojiNames };
}
async function syncEmojisCommand(message) {
    const res = await syncEmojisFromDiscord(message.client);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔄 ĐỒNG BỘ NÓNG DISCORD CUSTOM EMOJIS (CHUẨN LOẠI 100%)')
        .setDescription(`🎉 **Đã tái đồng bộ và phân loại chuẩn xác 100% Icon theo đúng danh mục!**\n\n` +
        `📊 **Tổng số Custom Emojis phát hiện:** \`${res.count}\` Emojis\n` +
        `⚡ **Số vật phẩm đã gán Icon chuẩn:** \`${res.mapped}\` Vật Phẩm\n\n` +
        `**Chi tiết khớp Icon theo đúng thể loại:**\n` +
        (res.details.length > 0
            ? res.details.slice(0, 25).join('\n')
            : '⚠️ *Không tìm thấy Custom Emoji nào khớp!*'))
        .setFooter({ text: '💡 Quy tắc phân loại: Rương -> Gift/Chest, Quặng -> Crystal/Gem, Thuốc -> Potion, Bùa -> Scroll/Book' });
    await message.reply({ embeds: [embed] });
}
