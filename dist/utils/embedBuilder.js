"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDongSonEmbed = createDongSonEmbed;
const discord_js_1 = require("discord.js");
function createDongSonEmbed() {
    return new discord_js_1.EmbedBuilder()
        .setColor('#DAA520') // Vàng Kim Gothic Trung Cổ
        .setAuthor({
        name: '⚔️ MEDIEVAL KYRISE RPG - KỶ NGUYÊN TRUNG CỔ ⚔️',
    })
        .setFooter({
        text: '🛡️ Medieval Dark Fantasy • 7 Ngục Tối & Giao Thương Song Phái',
    })
        .setTimestamp();
}
