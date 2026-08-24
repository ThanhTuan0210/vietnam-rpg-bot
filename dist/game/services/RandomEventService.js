"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomEventService = void 0;
exports.triggerRandomSurpriseEvent = triggerRandomSurpriseEvent;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../../utils/embedBuilder");
class RandomEventService {
    static async tryTriggerEvent(userIdOrMsg) {
        if (userIdOrMsg && typeof userIdOrMsg === 'object' && 'channel' in userIdOrMsg) {
            return triggerRandomSurpriseEvent(userIdOrMsg);
        }
        return null;
    }
    static async triggerRandomEvent(userId) {
        return null;
    }
}
exports.RandomEventService = RandomEventService;
async function triggerRandomSurpriseEvent(message) {
    // 15% chance to trigger random event
    if (Math.random() > 0.15) {
        return false;
    }
    const events = [
        {
            title: '🧙‍♂️ THƯƠNG NHÂN LỮ HÀNH GHÉ THĂM!',
            desc: 'Một thương nhân thần bí trung cổ dừng chân chào bán **Thần Kiếm Excalibur Cổ** với giá giảm cực sốc 80%!',
            btnLabel: '🛒 Mua Ngay (5,000 Vàng)',
            btnId: 'evt_buy_sword',
        },
        {
            title: '🧌 TREASURE GOBLIN BỔ RƯƠNG XUẤT HIỆN!',
            desc: 'Một con Yêu tinh Goblin vác bao tải vàng chạy ngang qua màn hình! Nhanh tay bắt quái để hốt 10,000 Tiền Vàng!',
            btnLabel: '⚡ Bắt Treasure Goblin',
            btnId: 'evt_catch_goblin',
        },
        {
            title: '🌋 SỤT MỎ THẠCH THƯỢNG CỔ!',
            desc: 'Cú chấn động làm phát lộ Lối vào Hang Tinh Thạch Bí Mật chứa 5 viên Tinh Thạch Hoàng Kim!',
            btnLabel: '⛏️ Đào Tinh Thạch Bí Mật',
            btnId: 'evt_mine_secret',
        },
        {
            title: '🍵 CỤ GIÀ ĐỐ VUI DÂN GIAN!',
            desc: 'Một cụ già thần bí thách đố bạn 1 câu hỏi dân gian để tặng **Bí Kíp Bão Lửa Gothic**!',
            btnLabel: '🧠 Trả Lời Câu Đố',
            btnId: 'evt_answer_riddle',
        },
    ];
    const evt = events[Math.floor(Math.random() * events.length)];
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🎁 SỰ KIỆN BẤT NGỜ! - ${evt.title}`)
        .setDescription(evt.desc)
        .setFooter({ text: '💡 Sự kiện ngẫu nhiên 15% xuất hiện khi tương tác Bot!' });
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(evt.btnId).setLabel(evt.btnLabel).setStyle(discord_js_1.ButtonStyle.Success));
    if (message.channel && 'send' in message.channel) {
        await message.channel.send({ embeds: [embed], components: [row] });
        return true;
    }
    return false;
}
