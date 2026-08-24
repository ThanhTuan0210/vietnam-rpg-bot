import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { ITEMS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function khamCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const slotType = args[0]?.toLowerCase();
  const gemId = args[1]?.toLowerCase();

  if (slotType !== 'vukhi' || !gemId) {
    const embed = createDongSonEmbed()
      .setTitle('🔴 KHẢM NGỌC TRANG BỊ')
      .setDescription(
        `Đính Ngọc Lửa, Ngọc Băng vào Vũ Khí để tăng mạnh sát thương chiến đấu!\n\n` +
          `• Cú pháp: \`vkl kham vukhi [mã_ngọc]\` (Ví dụ: \`vkl kham vukhi ngoc_lua_1\`)\n\n` +
          `🔴 **Ngọc Lửa Lv.1** (\`ngoc_lua_1\`) — *+10 ATK Sát Thương*\n` +
          `🔴 **Ngọc Lửa Lv.2** (\`ngoc_lua_2\`) — *+25 ATK Sát Thương*\n` +
          `🔵 **Ngọc Băng Lv.1** (\`ngoc_bang_1\`) — *+10 DEF Hộ Giáp*\n` +
          `⚡ **Ngọc Lôi Lv.1** (\`ngoc_loi_1\`) — *+5% Chí Mạng*`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const gemDef = ITEMS[gemId];
  if (!gemDef || gemDef.type !== 'ngoc') {
    await message.reply('❌ Viên ngọc không hợp lệ! Ví dụ: `ngoc_lua_1`, `ngoc_bang_1`.');
    return;
  }

  const consumed = await UserService.consumeItemAtomic(userId, gemId, 1);
  if (!consumed) {
    await message.reply(`❌ Bạn không sở hữu **${gemDef.name}** (\`${gemId}\`) trong túi đồ!`);
    return;
  }

  await UserModelAdvanced.updateOne({ userId }, { $set: { 'trangBi.vuKhi.khamNgoc': gemDef.name } });

  const embed = createDongSonEmbed()
    .setTitle('🔴 KHẢM NGỌC THÀNH CÔNG!')
    .setDescription(`Vũ khí của bạn đã được khảm linh nghiệm **${gemDef.icon} ${gemDef.name}** (\`${gemId}\`)!`);

  await message.reply({ embeds: [embed] });
}
