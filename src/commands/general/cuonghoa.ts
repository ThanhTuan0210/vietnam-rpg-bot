import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { RefineService, RANDOM_ENCHANT_TIERS } from '../../game/services/RefineService';
import { ITEMS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';
import { SessionManager } from '../../game/managers/SessionManager';

export async function cuongHoaCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const user = await UserModelAdvanced.findOne({ userId });

  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
    return;
  }

  let slotInput = args[0]?.toLowerCase();
  let slotType: 'vuKhi' | 'aoGiap' = 'vuKhi';

  if (slotInput === 'aogiap' || slotInput === 'giap' || slotInput === 'armor') {
    slotType = 'aoGiap';
  }

  const gearSlot = user.trangBi[slotType];
  const itemDef = ITEMS[gearSlot.itemId];

  if (!itemDef) {
    await message.reply(`❌ Bạn chưa trang bị ${slotType === 'vuKhi' ? 'Vũ khí' : 'Áo giáp'} để cường hóa! (Gõ \`vkl enchant vukhi\` hoặc \`vkl enchant aogiap\`)`);
    return;
  }

  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một thao tác chưa hoàn thành!');
    return;
  }

  const currentPercent = gearSlot.bonusStat || 0;
  const statTypeStr = slotType === 'vuKhi' ? 'ATK' : 'HP';
  const cost = 5000;

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('random_enchant')
      .setLabel(`🎲 Cường Hóa Tinh Thạch (-${cost.toLocaleString('vi-vkl')} Vàng)`)
      .setStyle(ButtonStyle.Primary)
  );

  const tierListStr = RANDOM_ENCHANT_TIERS.map(
    (t) => `• ${t.icon} **${t.name}**: **+${t.percent}% ${statTypeStr}** (Tỷ lệ rớt: ${Math.round(t.chance * 100)}%)`
  ).join('\n');

  const embed = createDongSonEmbed()
    .setTitle(`🔥 LÒ RÈN CƯỜNG HÓA TRUNG CỔ - ${itemDef.icon} ${itemDef.name.toUpperCase()}`)
    .setDescription(
      `Trang bị đang chọn: ${itemDef.icon} **${itemDef.name}** (\`${gearSlot.itemId}\`)\n` +
        `📊 **Chỉ số linh khí hiện tại:** **+${currentPercent}% ${statTypeStr}**\n` +
        `💰 **Chi phí 1 lần gieo:** ${formatDong(cost)}\n\n` +
        `🎲 **BẢNG TỶ LỆ CƯỜNG HÓA TISNH THẠCH:**\n${tierListStr}`
    );

  const replyMsg = await message.reply({ embeds: [embed], components: [row] });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 30000,
  });

  collector.on('collect', async (i) => {
    if (i.user.id !== userId) {
      await i.reply({ content: '⚠️ Bạn không thể điều khiển lò rèn của người khác!', ephemeral: true });
      return;
    }

    const res = await RefineService.randomEnchantGear(userId, slotType, cost);
    if (!res.success) {
      await i.reply({ content: `❌ ${res.message}`, ephemeral: true });
      return;
    }

    const tierDef = res.tier;
    const newEmbed = createDongSonEmbed()
      .setTitle(`✨ KẾT QUẢ CƯỜNG HÓA TRUNG CỔ — ${itemDef.name.toUpperCase()}`)
      .setDescription(
        `🎉 **Cường hóa thành công!**\n\n` +
          `• Phẩm cấp đạt được: ${tierDef.icon} **${tierDef.name}**\n` +
          `• Chỉ số gia tăng: **+${tierDef.percent}% ${statTypeStr}** (Cũ: +${res.oldPercent}%)\n\n` +
          `💡 *Chỉ số mới đã được áp dụng trực tiếp vào Lực chiến CP (\`vkl p\`)!*`
      );

    await i.update({ embeds: [newEmbed], components: [row] });
  });

  collector.on('end', () => {
    session.unlock(userId);
  });
}
