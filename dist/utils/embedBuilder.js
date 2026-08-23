"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDongSonEmbed = createDongSonEmbed;
const discord_js_1 = require("discord.js");
function createDongSonEmbed() {
    return new discord_js_1.EmbedBuilder()
        .setColor('#D4AF37') // Mầu vàng đồng cổ Đông Sơn
        .setAuthor({
        name: '🏛️ HÙNG VƯƠNG TRUYỀN KỲ - BẢN SẮC DÂN GIAN VIỆT NAM 🏛️',
    })
        .setFooter({
        text: '🐉 Con Rồng Cháu Tiên • Trừ tà diệt quái, săn quái tích truyền kỳ',
    })
        .setTimestamp();
}
