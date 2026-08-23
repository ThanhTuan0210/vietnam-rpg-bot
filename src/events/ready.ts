import { Client, ActivityType } from 'discord.js';

export function onReady(client: Client): void {
  console.log(`[Discord Bot] Đã đăng nhập thành công dưới tên: ${client.user?.tag}`);

  const guilds = client.guilds.cache;
  const guildList = guilds.map((g) => `"${g.name}" (ID: ${g.id})`);

  console.log(`\n==================================================`);
  console.log(`🏰 [DANH SÁCH SERVER] Bot đang có mặt ở ${guilds.size} Server Discord:`);
  if (guilds.size > 0) {
    guildList.forEach((gName) => console.log(`   • ${gName}`));
  } else {
    console.log(`   ⚠️ Bot chưa được mời vào Server nào! Hãy dùng Link OAuth2 để mời Bot vào Server.`);
  }
  console.log(`==================================================\n`);

  // Đặt trạng thái Bot
  client.user?.setPresence({
    activities: [
      {
        name: 'vn batdau | RPG Dân Gian Việt Nam 🌾',
        type: ActivityType.Playing,
      },
    ],
    status: 'online',
  });
}
