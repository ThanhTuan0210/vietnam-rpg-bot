import { Client, GatewayIntentBits } from 'discord.js';
import { CONFIG } from './config/env';
import { connectDatabase } from './database/connect';
import { onReady } from './events/ready';
import { onMessageCreate } from './events/messageCreate';

async function bootstrap() {
  console.log('🏛️  Khởi động Discord RPG Bot Dân Gian & Thần Thoại Việt Nam...');

  // 1. Kết nối CSDL MongoDB
  await connectDatabase();

  // 2. Khởi tạo Discord Client với các Gateway Intents cần thiết
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // 3. Đăng ký Sự Kiện (Events)
  client.once('ready', () => onReady(client));
  client.on('messageCreate', onMessageCreate);

  // 4. Đăng nhập Discord Bot Client
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
