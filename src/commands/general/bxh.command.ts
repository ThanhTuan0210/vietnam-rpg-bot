import { Message } from 'discord.js';
import { TowerLeaderboardModel } from '../../database/models/TowerLeaderboard.model';
import { UserModelAdvanced } from '../../database/models/User.model';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function bxhCommand(message: Message, args: string[]): Promise<void> {
  const type = args[0]?.toLowerCase() || 'thap';

  if (type === 'thap' || type === 'leothap') {
    const topTower = await TowerLeaderboardModel.find().sort({ highestFloor: -1, totalTrialPoints: -1 }).limit(10);

    const listStr =
      topTower.length > 0
        ? topTower
            .map(
              (t, i) =>
                `${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**#${i + 1}**`} **${t.username}** — 🏰 Tầng **${
                  t.highestFloor
                }** | ✨ **${t.totalTrialPoints}** Điểm`
            )
            .join('\n')
        : '*(Chưa có người chơi nào leo tháp)*';

    const embed = createDongSonEmbed()
      .setTitle('🏆 BẢNG XẾP HẠNG ANH HÙNG LEO THÁP')
      .setDescription(`TOP 10 Cao Thủ Leo Tháp Thí Luyện 100 Tầng:\n\n${listStr}`);

    await message.reply({ embeds: [embed] });
    return;
  }

  if (type === 'giau' || type === 'phuhao') {
    const topRich = await UserModelAdvanced.find().sort({ 'taiChinh.dong': -1 }).limit(10);

    const listStr = topRich
      .map(
        (u, i) =>
          `${i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**#${i + 1}**`} <@${u.userId}> — ${formatDong(
            u.taiChinh.dong
          )} | 💎 **${u.taiChinh.kimBao}** Kim Bảo`
      )
      .join('\n');

    const embed = createDongSonEmbed()
      .setTitle('💎 BẢNG XẾP HẠNG ĐẠI PHÚ HÀO')
      .setDescription(`TOP 10 Người Chơi Giàu Có Nhất Server:\n\n${listStr}`);

    await message.reply({ embeds: [embed] });
    return;
  }

  // Mặc định Bảng Xếp Hạng Cấp Độ
  const topLevel = await UserModelAdvanced.find().sort({ 'canhGioi.capDo': -1, 'canhGioi.kinhNghiem': -1 }).limit(10);

  const listStr = topLevel
    .map(
      (u, i) =>
        `${i === 0 ? '🌟' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**#${i + 1}**`} <@${u.userId}> — Level **${
          u.canhGioi.capDo
        }** (${u.hePhai || 'Chưa chọn Phái'})`
    )
    .join('\n');

  const embed = createDongSonEmbed()
    .setTitle('⚡ BẢNG XẾP HẠNG CẢNH GIỚI CAO THỦ')
    .setDescription(
      `TOP 10 Người Chơi Cấp Độ Cao Nhất:\n\n${listStr}\n\n` +
        `• \`vkl bxh thap\` : BXH Leo Tháp Thí Luyện\n` +
        `• \`vkl bxh giau\` : BXH Đại Phú Hào`
    );

  await message.reply({ embeds: [embed] });
}
