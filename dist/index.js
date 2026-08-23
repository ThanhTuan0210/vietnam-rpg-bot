"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const env_1 = require("./config/env");
const connect_1 = require("./database/connect");
const ready_1 = require("./events/ready");
const messageCreate_1 = require("./events/messageCreate");
async function bootstrap() {
    console.log('🏛️  Khởi động Discord RPG Bot Dân Gian & Thần Thoại Việt Nam...');
    // 1. Kết nối CSDL MongoDB
    await (0, connect_1.connectDatabase)();
    // 2. Khởi tạo Discord Client với các Gateway Intents cần thiết
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.MessageContent,
        ],
    });
    // 3. Đăng ký Sự Kiện (Events)
    client.once('ready', () => (0, ready_1.onReady)(client));
    client.on('messageCreate', messageCreate_1.onMessageCreate);
    // 4. Đăng nhập Discord Bot Client
    if (!env_1.CONFIG.DISCORD_TOKEN) {
        console.warn('⚠️  [CẢNH BÁO] Chưa cấu hình DISCORD_TOKEN trong tệp .env! Vui lòng thêm token trước khi chạy bot.');
    }
    else {
        await client.login(env_1.CONFIG.DISCORD_TOKEN);
    }
}
bootstrap().catch((err) => {
    console.error('❌ Lỗi khởi động bot:', err);
});
