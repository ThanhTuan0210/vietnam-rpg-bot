import http from 'http';
import { Client, GatewayIntentBits } from 'discord.js';
import { CONFIG } from './config/env';
import { connectDatabase } from './database/connect';
import { onReady } from './events/ready';
import { onMessageCreate } from './events/messageCreate';

// 1. Tạo HTTP Server giả để giữ Render Web Service luôn trạng thái LIVE 24/7
const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🤖 Discord RPG Bot Dân Gian & Thần Thoại Việt Nam đang hoạt động Online 24/7!');
  })
  .listen(PORT, () => {
    console.log(`🌐 HTTP Server đang lắng nghe trên port ${PORT} cho Render Health Check`);
  });

async function bootstrap() {
  console.log('🏛️  Khởi động Discord RPG Bot Dân Gian & Thần Thoại Việt Nam...');

  // 2. Kết nối CSDL MongoDB
  await connectDatabase();

  // 3. Khởi tạo Discord Client với các Gateway Intents cần thiết
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // 4. Đăng ký Sự Kiện (Events)
  client.once('ready', () => onReady(client));
  client.on('messageCreate', onMessageCreate);

  // 5. Đăng nhập Discord Bot Client
  if (!CONFIG.DISCORD_TOKEN) {
    console.warn(
      '⚠️  [CẢNH BÁO] Chưa cấu hình DISCORD_TOKEN trong tệp .env! Vui lòng thêm token trước khi chạy bot.'
    );
  } else {
    await client.login(CONFIG.DISCORD_TOKEN);
  }
}

bootstrap().catch((err) => {
  console.error('❌ Lỗi khởi động bot:', err);
});
