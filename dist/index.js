"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const discord_js_1 = require("discord.js");
const env_1 = require("./config/env");
const connect_1 = require("./database/connect");
const ready_1 = require("./events/ready");
const messageCreate_1 = require("./events/messageCreate");
const interactionCreate_1 = require("./events/interactionCreate");
// 1. Tạo HTTP Server giả để giữ Render Web Service luôn trạng thái LIVE 24/7
const PORT = process.env.PORT || 3000;
http_1.default
    .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🤖 Discord RPG Bot Medieval Dark Fantasy đang hoạt động Online 24/7!');
})
    .listen(PORT, () => {
    console.log(`🌐 HTTP Server đang lắng nghe trên port ${PORT} cho Render Health Check`);
});
async function bootstrap() {
    console.log('⚔️ Khởi động Discord RPG Bot Medieval Dark Fantasy...');
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
    client.on('interactionCreate', interactionCreate_1.onInteractionCreate);
    // 4. Kết nối CSDL MongoDB (không để lỗi DB làm chặn Discord Bot login)
    (0, connect_1.connectDatabase)().catch((err) => {
        console.error('⚠️ [CẢNH BÁO CSDL] Chưa kết nối được MongoDB ngay lập tức, đang tự động thử lại...', err?.message || err);
    });
    // 5. Đăng nhập Discord Bot Client
    if (!env_1.CONFIG.DISCORD_TOKEN) {
        console.warn('⚠️  [CẢNH BÁO] Chưa cấu hình DISCORD_TOKEN trong tệp .env! Vui lòng thêm token trước khi chạy bot.');
    }
    else {
        try {
            console.log('🔑 Đang tiến hành đăng nhập vào Discord Bot API...');
            await client.login(env_1.CONFIG.DISCORD_TOKEN);
            console.log('✅ Đăng nhập Discord Bot API hoàn tất!');
        }
        catch (loginErr) {
            console.error('❌ Lỗi khi đăng nhập Discord Token:', loginErr?.message || loginErr);
        }
    }
}
bootstrap().catch((err) => {
    console.error('❌ Lỗi khởi động bot:', err);
});
