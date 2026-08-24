import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { renderHpBar, formatDong } from '../../utils/formatters';
import { CombatEngineAdvanced } from '../../game/engines/CombatEngine';
import { UserModelAdvanced } from '../../database/models/User.model';

export async function duongThuongCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserModelAdvanced.findOne({ userId });

  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
    return;
  }

  const { totalMaxHp } = CombatEngineAdvanced.calculateTotalStats(user);

  if (user.chiSo.hp >= totalMaxHp) {
    await message.reply('❤️ **Lang Y Gothic nhắn:** Sinh lực của bạn đang sung mãn nhất (100% HP), không cần trị thương!');
    return;
  }

  // 1. Ưu tiên dùng Thuốc Hồi HP (potion_01a) trong túi đồ
  const hasPotion = await UserService.consumeItemAtomic(userId, 'potion_01a', 1);

  if (hasPotion) {
    await UserService.healUserAtomic(userId);
    const embed = createDongSonEmbed()
      .setTitle('🧪 DƯỠNG THƯƠNG BẰNG THUỐC HỒI MÁU (POTION HP)')
      .setDescription(
        `Bạn đã uống một bình **Thuốc Hồi Máu HP (potion_01a)**, hồi phục **100% Sinh Lực & Mana**!\n\n${renderHpBar(
          totalMaxHp,
          totalMaxHp
        )}`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // 2. Tính Phí Dưỡng Thương
  const currentHp = Math.max(0, user.chiSo.hp);
  const hpMissingRatio = 1 - currentHp / totalMaxHp;
  const healCost = Math.max(20, Math.floor(user.canhGioi.capDo * 120 * hpMissingRatio));

  const paidSuccess = await UserService.deductDongAtomic(userId, healCost);

  if (!paidSuccess) {
    await message.reply(
      `❌ **Lang Y Gothic lắc đầu:** Bạn không có **Thuốc Hồi Máu HP** và cũng không đủ ${formatDong(
        healCost
      )} để chi trả tiền thuốc thang!`
    );
    return;
  }

  await UserService.healUserAtomic(userId);

  const embed = createDongSonEmbed()
    .setTitle('🏥 DƯỠNG THƯƠNG TRUNG CỔ (MEDIEVAL HEAL)')
    .setDescription(
      `💊 **Chữa trị hoàn tất:** Bạn đã thanh toán **${formatDong(
        healCost
      )}** để phục hồi 100% Sinh Lực!\n\n${renderHpBar(totalMaxHp, totalMaxHp)}`
    );

  await message.reply({ embeds: [embed] });
}
