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
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn start`.');
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
    await message.reply(`❌ Bạn chưa trang bị ${slotType === 'vuKhi' ? 'Vũ khí' : 'Áo giáp'} để cường hóa! (Gõ \`vn enchant vukhi\` hoặc \`vn enchant aogiap\`)`);
    return;
  }

  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một thao tác chưa hoàn thành!');
    return;
  }

  const currentPercent = gearSlot.bonusStat || 0;
  const statTypeStr = slotType === 'vuKhi' ? 'ATK' : 'HP';
  const cost = 5000; // 5,000 Đồng / lần gieo

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('random_enchant')
      .setLabel(`🎲 Gieo Ngẫu Nhiên Chỉ Số (-${cost.toLocaleString('vi-VN')}đ)`)
      .setStyle(ButtonStyle.Primary)
  );

  const tierListStr = RANDOM_ENCHANT_TIERS.map(
    (t) => `• ${t.icon} **${t.name}**: **+${t.percent}% ${statTypeStr}** (Tỷ lệ rớt: ${Math.round(t.chance * 100)}%)`
  ).join('\n');

  const embed = createDongSonEmbed()
    .setTitle(`🔥 LÒ RÈN CƯỜNG HÓA CHỈ SỐ NGẪU NHIÊN - ${itemDef.icon} ${itemDef.name.toUpperCase()}`)
    .setDescription(
      `Trang bị đang chọn: ${itemDef.icon} **${itemDef.name}** (\`${gearSlot.itemId}\`)\n` +
        `📊 **Chỉ số linh khí hiện tại:** **+${currentPercent}% ${statTypeStr}**\n` +
        `💰 **Chi phí 1 lần gieo:** ${formatDong(cost)}\n\n` +
        `🎲 **BẢNG TỶ LỆ RA PHẦN TRĂM CHỈ SỐ NGẪU NHIÊN:**\n${tierListStr}`
    );

  const replyMsg = await message.reply({ embeds: [embed], components: [row] });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  collector.on('collect', async (i) => {
    const result = await RefineService.randomEnchantEquipment(userId, slotType);

    session.unlock(userId);

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('random_enchant_done')
        .setLabel(`🎲 Gieo Thành Công (+${result.percentBonus}%)`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );

    const resultEmbed = createDongSonEmbed();

    if (result.success) {
      resultEmbed.setTitle('🎉 GIEO NGUYÊN KHÍ THÀNH CÔNG!');
      resultEmbed.setDescription(result.message);
    } else {
      resultEmbed.setTitle('❌ LỖI THỰC THI');
      resultEmbed.setDescription(result.message);
    }

    await i.update({ embeds: [resultEmbed], components: [disabledRow] });
    collector.stop('completed');
  });

  collector.on('end', async (_, reason) => {
    session.unlock(userId);
    if (reason === 'time') {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('random_enchant_t').setLabel('🎲 Hết thời gian').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );
      await replyMsg.edit({ components: [disabledRow] }).catch(() => {});
    }
  });
}
