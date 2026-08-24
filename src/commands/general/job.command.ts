import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function jobCommand(message: Message, args: string[]): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);

  const subCommand = args[0]?.toLowerCase();

  if (subCommand === 'select' && args.length >= 3) {
    const combatInput = args[1].toLowerCase();
    const producerInput = args[2].toLowerCase();

    const validCombat = ['warrior', 'mage', 'ranger', 'assassin'];
    const validProducer = ['miner', 'alchemist', 'blacksmith', 'hunter'];

    if (!validCombat.includes(combatInput) || !validProducer.includes(producerInput)) {
      await message.reply('⚠️ **Cú pháp chưa đúng!** Vui lòng chọn 1 Class Chiến Đấu (`warrior`, `mage`, `ranger`, `assassin`) và 1 Class Sản Xuất (`miner`, `alchemist`, `blacksmith`, `hunter`).\n*VD:* `vn job select mage miner`');
      return;
    }

    user.hePhai = combatInput as any;
    (user as any).producerJob = producerInput;
    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã đăng ký thành công Song Phái Trung Cổ:\n\n` +
          `⚔️ **Class Chiến Đấu:** \`${combatInput.toUpperCase()}\` (Sát thương & Lực chiến CP)\n` +
          `🔨 **Class Sản Xuất (PP):** \`${producerInput.toUpperCase()}\` (Giao thương & Nạp Kho Vault)\n\n` +
          `💡 *Tổ đội 3-5 bạn bè hãy phân công mỗi người 1 Nghề Sản Xuất khác nhau để làm giàu nhanh nhất!*`
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ Person').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault Chung').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('cmd_dungeon').setLabel('🗺️ Ngục Tối').setStyle(ButtonStyle.Danger)
    );

    await message.reply({ embeds: [embed], components: [row] });
    return;
  }

  // Display Current Jobs
  const currentCombat = user.hePhai || 'Chưa Chọn';
  const currentProducer = (user as any).producerJob || 'Chưa Chọn';

  const embed = createDongSonEmbed()
    .setTitle('🎭 QUẢN LÝ SONG PHÁI DUAL-CLASS (MEDIEVAL RPG)')
    .setDescription(
      `👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu Hiện Tại:** \`${currentCombat.toUpperCase()}\`\n` +
        `🔨 **Class Sản Xuất Hiện Tại (PP):** \`${currentProducer.toUpperCase()}\`\n\n` +
        `📌 **Hướng dẫn chọn Song Phái:**\n` +
        `• Gõ: \`vn job select <combat_class> <producer_class>\`\n` +
        `• **Class Chiến Đấu:** \`warrior\` (Kị Sĩ), \`mage\` (Pháp Sư), \`ranger\` (Cung Thủ), \`assassin\` (Sát Thủ)\n` +
        `• **Class Sản Xuất:** \`miner\` (Thợ Mỏ), \`alchemist\` (Thợ Bào Chế), \`blacksmith\` (Thợ Rèn), \`hunter\` (Thợ Săn)`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('cmd_trade').setLabel('🛍️ Giao Dịch 1-1').setStyle(ButtonStyle.Primary)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
