import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { CombatEngineAdvanced } from '../../game/engines/CombatEngine';
import { ITEMS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { renderHpBar, renderProgressBar, formatDong, formatKimBao } from '../../utils/formatters';

const CLASS_DISPLAY: Record<string, string> = {
  DUNG_TUONG: '🛡️ Dũng Tướng',
  DAO_SI: '🔮 Đạo Sĩ',
  THO_SAN: '🏹 Thợ Săn',
};

export async function nhanVatCommandAdvanced(message: Message): Promise<void> {
  const userId = message.author.id;
  let user = await UserModelAdvanced.findOne({ userId });

  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
    return;
  }

  const { totalAtk, totalDef, totalMaxHp, totalMaxMp, totalCrit, totalDodge } =
    CombatEngineAdvanced.calculateTotalStats(user);

  const wSlot = user.trangBi.vuKhi;
  const aSlot = user.trangBi.aoGiap;

  const wItem = ITEMS[wSlot.itemId] || { name: 'Tay Không', icon: '👊' };
  const aItem = ITEMS[aSlot.itemId] || { name: 'Áo Vải Thô', icon: '🥋' };

  const wLvlStr = wSlot.capCuongHoa > 0 ? ` (+${wSlot.capCuongHoa})` : '';
  const aLvlStr = aSlot.capCuongHoa > 0 ? ` (+${aSlot.capCuongHoa})` : '';

  const expNeeded = user.canhGioi.capDo * 100;
  const className = user.hePhai ? CLASS_DISPLAY[user.hePhai] : 'Chưa chọn';

  const embed = createDongSonEmbed()
    .setTitle(`🛡️ HỒ SƠ ANH HÙNG - ${message.author.username.toUpperCase()}`)
    .setThumbnail(message.author.displayAvatarURL())
    .addFields(
      { name: '👤 Danh Hiệu & Phái', value: `🏅 **${user.danhHieu}**\n${className}`, inline: true },
      { name: '⭐ Cấp Độ', value: `🌟 **Cấp ${user.canhGioi.capDo}**`, inline: true },
      { name: '🗺️ Vùng Đất', value: `📍 **Vùng ${user.canhGioi.khuVuc}**`, inline: true },

      {
        name: '❤️ Sinh Lực (HP)',
        value: renderHpBar(user.chiSo.hp, totalMaxHp),
        inline: false,
      },
      {
        name: '💧 Chân Khí (MP)',
        value: renderProgressBar(user.chiSo.mp, totalMaxMp, 10, '🟦', '⬛'),
        inline: false,
      },
      {
        name: '✨ Kinh Nghiệm (EXP)',
        value: renderProgressBar(user.canhGioi.kinhNghiem, expNeeded, 10, '🟨', '⬛'),
        inline: false,
      },

      {
        name: '⚔️ Sát Thương (ATK)',
        value: `**${totalAtk}**`,
        inline: true,
      },
      {
        name: '🛡️ Phòng Thủ (DEF)',
        value: `**${totalDef}**`,
        inline: true,
      },
      {
        name: '⚡ Chí Mạng / Né',
        value: `🎯 **${Math.round(totalCrit * 100)}%** Crit | 💨 **${Math.round(totalDodge * 100)}%** Dodge`,
        inline: true,
      },

      {
        name: '💰 Ngân Khố',
        value: `${formatDong(user.taiChinh.dong)}\n${formatKimBao(user.taiChinh.kimBao)}`,
        inline: true,
      },
      {
        name: '🗡️ Trang Bị Đang Mặc',
        value: `${wItem.icon} **${wItem.name}${wLvlStr}**\n${aItem.icon} **${aItem.name}${aLvlStr}**`,
        inline: true,
      }
    );

  await message.reply({ embeds: [embed] });
}
