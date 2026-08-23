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
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
    return;
  }

  const { totalMaxHp } = CombatEngineAdvanced.calculateTotalStats(user);

  if (user.chiSo.hp >= totalMaxHp) {
    await message.reply('❤️ **Lang Y nhắn:** Sinh lực của bạn đang sung mãn nhất (100% HP), không cần trị thương!');
    return;
  }

  // 1. Ưu tiên dùng Cơm Lam trong túi đồ
  const hasComLam = await UserService.consumeItemAtomic(userId, 'com_lam', 1);

  if (hasComLam) {
    await UserService.healUserAtomic(userId);
    const embed = createDongSonEmbed()
      .setTitle('🍙 DƯỠNG THƯƠNG BẰNG CƠM LAM')
      .setDescription(
        `Bạn đã thưởng thức một ống **Cơm Lam** thơm dẻo linh khí đất trời, hồi phục **100% Sinh Lực & Mana**!\n\n${renderHpBar(
          totalMaxHp,
          totalMaxHp
        )}`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // 2. Tính Phí Dưỡng Thương theo công thức chuẩn: Level * 120 * (1 - HP_Current / HP_Max)
  const currentHp = Math.max(0, user.chiSo.hp);
  const hpMissingRatio = 1 - currentHp / totalMaxHp;
  const healCost = Math.max(20, Math.floor(user.canhGioi.capDo * 120 * hpMissingRatio));

  const paidSuccess = await UserService.deductDongAtomic(userId, healCost);

  if (!paidSuccess) {
    await message.reply(
      `❌ **Lang Y lắc đầu:** Bạn không có **Cơm Lam** và cũng không đủ ${formatDong(
        healCost
      )} để chi trả tiền thuốc thang!`
    );
    return;
  }

  await UserService.healUserAtomic(userId);

  const embed = createDongSonEmbed()
    .setTitle('🏥 LANG Y LÀNG CHỮA BỆNH')
    .setDescription(
      `Bạn đã chi trả ${formatDong(
        healCost
      )} cho Lang Y làng để đắp thuốc lá rừng. Sinh lực đã được phục hồi hoàn toàn!\n\n${renderHpBar(
        totalMaxHp,
        totalMaxHp
      )}`
    );

  await message.reply({ embeds: [embed] });
}
