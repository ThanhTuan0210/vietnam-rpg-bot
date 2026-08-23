import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { StatCalculationService } from '../../game/services/StatCalculationService';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong, formatKimBao } from '../../utils/formatters';

function renderColoredProgressBar(current: number, max: number, filledEmoji = '🟩', emptyEmoji = '⬛', length = 8): string {
  const safeCurrent = Math.max(0, current);
  const safeMax = Math.max(1, max);
  const percentVal = Math.min(100, Math.floor((safeCurrent / safeMax) * 100));
  const filledLength = Math.min(length, Math.round((safeCurrent / safeMax) * length));
  const emptyLength = Math.max(0, length - filledLength);

  const barStr = filledEmoji.repeat(filledLength) + emptyEmoji.repeat(emptyLength);
  return `${barStr} **(${percentVal}%)**`;
}

export async function profileCommandAdvanced(message: Message): Promise<void> {
  const userId = message.author.id;
  
  // Tự động kiểm tra và nâng level nếu người chơi đang tích thừa EXP (Sửa triệt để lỗi 360/100 EXP)
  let user = await UserService.checkAndApplyLevelUp(userId);

  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn start` để chọn Hệ Phái.');
    return;
  }

  const matrix = StatCalculationService.calculateFullMatrix(user);

  const level = user.canhGioi.capDo;
  const expNeeded = level * 100;
  const currentExp = user.canhGioi.kinhNghiem;

  // Trang bị đang mặc thực tế của người chơi (Hiển thị Mã ID dạng codeblock)
  const wSlot = user.trangBi?.vuKhi;
  const aSlot = user.trangBi?.aoGiap;
  const pSlot = user.trangBi?.phapBao;
  const lSlot = user.trangBi?.linhThu;

  const wStr = wSlot?.itemId && wSlot.itemId !== 'none' ? `\`${wSlot.itemId}\` +${wSlot.capCuongHoa || 0}` : '`none`';
  const aStr = aSlot?.itemId && aSlot.itemId !== 'none' ? `\`${aSlot.itemId}\` +${aSlot.capCuongHoa || 0}` : '`none`';
  const pStr = pSlot?.itemId && pSlot.itemId !== 'none' ? `\`${pSlot.itemId}\`` : '`none`';
  const lStr = lSlot?.name && lSlot.name !== 'none' ? `\`${lSlot.name}\`` : '`none`';

  const hpBar = renderColoredProgressBar(user.chiSo.hp, matrix.totalMaxHp, '🟩', '⬛');
  const mpBar = renderColoredProgressBar(user.chiSo.mp, matrix.totalMaxMp, '🟦', '⬛');
  const expBar = renderColoredProgressBar(currentExp, expNeeded, '🟪', '⬛');

  const embed = createDongSonEmbed()
    .setTitle(`📜 HỒ SƠ — ${message.author.username.toUpperCase()}`)
    .setDescription(
      `🏛️ **${matrix.realmName}** (${user.danhHieu}) | ⚡ **Lực Chiến:** \`${matrix.combatPower.toLocaleString('vi-VN')}\`\n\n` +
        `❤️ **HP:** ${hpBar} \`(${user.chiSo.hp}/${matrix.totalMaxHp})\`\n` +
        `💧 **MP:** ${mpBar} \`(${user.chiSo.mp}/${matrix.totalMaxMp})\`\n` +
        `🌟 **Tu Vi (Level ${level}):** ${expBar} \`(${currentExp}/${expNeeded} EXP)\``
    )
    .setThumbnail(message.author.displayAvatarURL())
    .addFields(
      {
        name: '⚔️ Chỉ Số Chiến Đấu',
        value:
          `⚔️ **ATK:** \`${matrix.physicalAtk}\` | 🛡️ **DEF:** \`${matrix.physicalDef}\` *(Giảm ${matrix.dmgReductionPercent}%)*\n` +
          `🎯 **Crit:** \`${(matrix.critRate * 100).toFixed(1)}%\` | 💥 **Bạo:** \`${Math.round(matrix.critDmg * 100)}%\` | 💨 **Né:** \`${Math.round(
            matrix.dodgeRate * 100
          )}%\``,
        inline: false,
      },
      {
        name: '🗡️ Trang Bị Đang Mặc',
        value: `🗡️ **Vũ khí:** ${wStr}\n🥋 **Áo giáp:** ${aStr}\n📿 **Pháp bảo:** ${pStr}\n🐎 **Linh thú:** ${lStr}`,
        inline: false,
      },
      {
        name: '💰 Tài Phú',
        value: `${formatDong(user.taiChinh.dong)} | ${formatKimBao(user.taiChinh.kimBao)}`,
        inline: false,
      }
    );

  await message.reply({ embeds: [embed] });
}
