import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function weeklyCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const lastUsed = user.cooldowns.get('weekly_reward') || 0;
  const now = Date.now();
  const weeklyMs = 604800000; // 7 ngày = 7 * 24 * 3600 * 1000

  if (now - lastUsed < weeklyMs) {
    const remSec = Math.ceil((weeklyMs - (now - lastUsed)) / 1000);
    const days = Math.floor(remSec / 86400);
    const hours = Math.floor((remSec % 86400) / 3600);
    const minutes = Math.floor((remSec % 3600) / 60);

    await message.reply(
      `⏰ **Lang Y nhắn:** Bạn đã nhận phần thưởng tuần rồi! Vui lòng quay lại sau **${days}d ${hours}h ${minutes}m**.`
    );
    return;
  }

  const rewardDong = 30000 + user.canhGioi.capDo * 1000;
  const rewardKimBao = 5;

  await UserService.addDongAtomic(userId, rewardDong);
  await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': rewardKimBao } });
  await UserService.addItemAtomic(userId, 'ruong_bac', 1);
  await UserService.updateCooldownAtomic(userId, 'weekly_reward', Date.now());

  const embed = createDongSonEmbed()
    .setTitle('🎁 PHẦN THƯỞNG HÀNG TUẦN THÀNH CÔNG!')
    .setDescription(
      `Chúc mừng **${message.author.username}** đã kiên trì luyện võ cả tuần qua!\n\n` +
        `💰 **Phần thưởng Tuần:** +${formatDong(rewardDong)} | 💎 **+${rewardKimBao} Kim Bảo**\n` +
        `🥈 **Báu vật tặng kèm:** **1 Rương Bạc**!`
    );

  await message.reply({ embeds: [embed] });
}
