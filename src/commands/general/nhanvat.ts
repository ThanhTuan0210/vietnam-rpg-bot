import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { CombatEngineAdvanced } from '../../game/engines/CombatEngine';
import { ITEMS, getItemIcon } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { renderHpBar, renderProgressBar, formatDong, formatKimBao } from '../../utils/formatters';

export async function nhanVatCommandAdvanced(message: Message): Promise<void> {
  const userId = message.author.id;
  let user = await UserModelAdvanced.findOne({ userId });

  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
    return;
  }

  const { totalAtk, totalDef, totalMaxHp, totalMaxMp, totalCrit, totalDodge } =
    CombatEngineAdvanced.calculateTotalStats(user);

  const wSlot = user.trangBi?.vuKhi || { itemId: 'sword_01a', capCuongHoa: 0 };
  const aSlot = user.trangBi?.aoGiap || { itemId: 'shield_01a', capCuongHoa: 0 };

  const wDef = ITEMS[wSlot.itemId] || { name: 'Kiếm Sơ Cấp Trung Cổ', icon: '⚔️' };
  const aDef = ITEMS[aSlot.itemId] || { name: 'Khiên Thép Kị Sĩ', icon: '🛡️' };

  const wIcon = getItemIcon(wSlot.itemId);
  const aIcon = getItemIcon(aSlot.itemId);

  const expNeeded = user.canhGioi.capDo * 100;

  const validClasses = ['WARRIOR', 'MAGE', 'RANGER', 'ASSASSIN', 'warrior', 'mage', 'ranger', 'assassin'];
  const rawCombat = (user.hePhai || '').toString();
  const combatClass = validClasses.includes(rawCombat) ? rawCombat.toUpperCase() : 'CHƯA CHỌN';
  const producerClass = ((user as any).producerJob || 'CHƯA CHỌN').toUpperCase();

  // Calculate Combat Power (CP)
  const cp = (totalAtk * 2) + (totalDef * 3) + Math.floor(totalMaxHp / 10) + Math.floor(totalMaxMp / 5) + Math.floor(totalCrit * 50);

  const embed = createDongSonEmbed()
    .setTitle(`🛡️ HỒ SƠ ANH HÙNG TRUNG CỔ — ${message.author.username.toUpperCase()}`)
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(
      `📊 **LỰC CHIẾN TỔNG HỢP (CP):** \`${cp.toLocaleString('vi-VN')} CP\`\n\n` +
        `⚔️ **Class Chiến Đấu:** \`${combatClass}\`\n` +
        `🔨 **Class Sản Xuất (PP):** \`${producerClass}\`\n` +
        `🌟 **Level:** \`${user.canhGioi.capDo}\` | 🗺️ **Vùng Ngục Tối:** \`Tầng ${user.canhGioi.khuVuc}\`\n\n` +
        `❤️ **HP:** ${renderHpBar(user.chiSo.hp, totalMaxHp)}\n` +
        `💧 **MP:** ${renderProgressBar(user.chiSo.mp, totalMaxMp, 10, '🟦', '⬛')}\n` +
        `✨ **EXP:** ${renderProgressBar(user.canhGioi.kinhNghiem, expNeeded, 10, '🟨', '⬛')}\n\n` +
        `⚔️ **Sát Thương (ATK):** \`${totalAtk}\` | 🛡️ **Phòng Thủ (DEF):** \`${totalDef}\`\n` +
        `💥 **Bạo Kích:** \`${Math.round(totalCrit * 100)}%\` | 🍃 **Né Tránh:** \`${Math.round(totalDodge * 100)}%\`\n\n` +
        `🎒 **TRANG BỊ ĐANG MẶC:**\n` +
        `• **Vũ Khí:** ${wIcon} **${wDef.name}** (\`${wSlot.itemId}\`)\n` +
        `• **Áo Giáp:** ${aIcon} **${aDef.name}** (\`${aSlot.itemId}\`)\n\n` +
        `💰 **Ví Tiền Vàng:** \`${formatDong(user.taiChinh.dong)}\``
    );

  await message.reply({ embeds: [embed] });
}
