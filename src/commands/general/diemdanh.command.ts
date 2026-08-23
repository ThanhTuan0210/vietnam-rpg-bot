import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function diemDanhCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const cooldownCheck = UserService.checkDailyRewardCooldown(user);
  if (!cooldownCheck.isReady) {
    await message.reply(`⏰ Bạn đã điểm danh hôm nay rồi! Vui lòng quay lại sau **${cooldownCheck.formattedTime}**.`);
    return;
  }

  // Thưởng cơ bản
  const rewardDong = 5000 + user.canhGioi.capDo * 200;
  const rewardKimBao = 1;

  await UserService.addDongAtomic(userId, rewardDong);
  await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': rewardKimBao } });
  await UserService.updateCooldownAtomic(userId, 'daily_reward', Date.now());

  const embed = createDongSonEmbed()
    .setTitle('🎁 ĐIỂM DANH HÀNG NGÀY THÀNH CÔNG!')
    .setDescription(
      `Chúc mừng **${message.author.username}** đã thưởng ngoạn làng xóm hôm nay!\n\n` +
        `💰 **Phần thưởng:** +${formatDong(rewardDong)} | 💎 **+${rewardKimBao} Kim Bảo**\n\n` +
        `🔥 **Streak Bonus:** Hãy tiếp tục điểm danh hàng ngày để không bị ngắt chuỗi nhận Rương Báu!`
    );

  await message.reply({ embeds: [embed] });
}
