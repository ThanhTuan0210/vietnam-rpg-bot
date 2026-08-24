import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function diemDanhCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  const cooldownCheck = UserService.checkDailyRewardCooldown(user);
  if (!cooldownCheck.isReady) {
    await message.reply(`⏰ **Hoàng Gia nhắn:** Bạn đã điểm danh hôm nay rồi! Vui lòng quay lại sau **${cooldownCheck.formattedTime}**.`);
    return;
  }

  // Thưởng cơ bản
  const rewardVang = 10000 + user.canhGioi.capDo * 500;

  await UserService.addDongAtomic(userId, rewardVang);
  await UserService.addItemAtomic(userId, 'potion_01a', 1);
  await UserService.addItemAtomic(userId, 'key_01a', 1);
  await UserService.updateCooldownAtomic(userId, 'daily_reward', Date.now());

  const embed = createDongSonEmbed()
    .setTitle('🎁 ĐIỂM DANH HÀNG NGÀY — KYRISE MEDIEVAL')
    .setDescription(
      `⚔️ Chào mừng Kị Sĩ **${message.author.username}** đã tuần tra bảo vệ Vương Quốc Gothic hôm nay!\n\n` +
        `💰 **Phần Thưởng Hàng Ngày:** \`+${formatDong(rewardVang)}\` Vàng\n` +
        `🧪 **Vật Phẩm Kèm Theo:** \`1x Thuốc Hồi Máu HP (potion_01a)\` | \`1x Chìa Khóa Ngục Tối (key_01a)\`!\n\n` +
        `💡 *Dùng Thuốc HP (\`vkl use potion_01a\`) để duy trì sinh lực đi săn quái!*`
    );

  await message.reply({ embeds: [embed] });
}
