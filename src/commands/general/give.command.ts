import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function giveCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const targetUser = message.mentions.users.first();
  const amount = parseInt(args[1], 10) || parseInt(args[0], 10);

  if (!targetUser || targetUser.id === userId || targetUser.bot || isNaN(amount) || amount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vn cho @User [số_đồng]` (Ví dụ: `vn cho @Tuan 10000`)');
    return;
  }

  const paid = await UserService.deductDongAtomic(userId, amount);
  if (!paid) {
    await message.reply(`❌ Bạn không sở hữu đủ ${formatDong(amount)} để chuyển tặng!`);
    return;
  }

  await UserService.addDongAtomic(targetUser.id, amount);

  const embed = createDongSonEmbed()
    .setTitle('💸 CHUYỂN TIỀN THÀNH CÔNG!')
    .setDescription(
      `Anh hùng **<@${userId}>** đã chuyển tặng thành công **${formatDong(amount)}** cho **<@${targetUser.id}>**!`
    );

  await message.reply({ embeds: [embed] });
}
