"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReady = onReady;
const discord_js_1 = require("discord.js");
const sync_emojis_command_1 = require("../commands/general/sync_emojis.command");
const HourlyEventService_1 = require("../game/services/HourlyEventService");
async function onReady(client) {
    console.log(`[Discord Bot] Đã đăng nhập thành công dưới tên: ${client.user?.tag}`);
    const guilds = client.guilds.cache;
    const guildList = guilds.map((g) => `"${g.name}" (ID: ${g.id})`);
    console.log(`\n==================================================`);
    console.log(`🏰 [DANH SÁCH SERVER] Bot đang có mặt ở ${guilds.size} Server Discord:`);
    if (guilds.size > 0) {
        guildList.forEach((gName) => console.log(`   • ${gName}`));
    }
    else {
        console.log(`   ⚠️ Bot chưa được mời vào Server nào! Hãy dùng Link OAuth2 để mời Bot vào Server.`);
    }
    console.log(`==================================================\n`);
    // Tự động quét và đồng bộ Custom Emojis từ Discord
    const emojiRes = await (0, sync_emojis_command_1.syncEmojisFromDiscord)(client);
    console.log(`🎨 [EMOJI SYNC] Đã tự động phát hiện ${emojiRes.count} Custom Emojis & Khớp thành công ${emojiRes.mapped} Vật phẩm!`);
    // Đặt trạng thái Bot
    client.user?.setPresence({
        activities: [
            {
                name: 'vkl | Medieval Dark Fantasy RPG ⚔️',
                type: discord_js_1.ActivityType.Playing,
            },
        ],
        status: 'online',
    });
    // Khởi động Sự Kiện Giờ Vàng (20h - 00h)
    HourlyEventService_1.HourlyEventService.startEventLoop(client);
}
