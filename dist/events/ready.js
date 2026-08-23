"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReady = onReady;
const discord_js_1 = require("discord.js");
function onReady(client) {
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
    // Đặt trạng thái Bot
    client.user?.setPresence({
        activities: [
            {
                name: 'vn batdau | RPG Dân Gian Việt Nam 🌾',
                type: discord_js_1.ActivityType.Playing,
            },
        ],
        status: 'online',
    });
}
