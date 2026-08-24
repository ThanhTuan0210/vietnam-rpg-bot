import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function jobCommand(message: Message, args: string[]): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);

  const subCommand = args[0]?.toLowerCase();

  // Support 3-letter prefix: sel, select
  if ((subCommand === 'sel' || subCommand === 'select') && args.length >= 3) {
    const combatInput = args[1].toLowerCase();
    const producerInput = args[2].toLowerCase();

    const combatMap: Record<string, string> = {
      war: 'warrior',
      warrior: 'warrior',
      mag: 'mage',
      mage: 'mage',
      ran: 'ranger',
      ranger: 'ranger',
      ass: 'assassin',
      assassin: 'assassin',
    };

    const producerMap: Record<string, string> = {
      min: 'miner',
      miner: 'miner',
      alc: 'alchemist',
      alchemist: 'alchemist',
      blk: 'blacksmith',
      blacksmith: 'blacksmith',
      hnt: 'hunter',
      hunter: 'hunter',
    };

    const normCombat = combatMap[combatInput];
    const normProducer = producerMap[producerInput];

    if (!normCombat || !normProducer) {
      await message.reply('⚠️ **Cú pháp chưa đúng!** Chọn 3 chữ đầu Class Chiến Đấu (`war`, `mag`, `ran`, `ass`) và Class Sản Xuất (`min`, `alc`, `blk`, `hnt`).\n*VD:* `vn job sel mag min`');
      return;
    }

    user.hePhai = normCombat as any;
    (user as any).producerJob = normProducer;
    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã đăng ký thành công Song Phái Trung Cổ:\n\n` +
          `⚔️ **Class Chiến Đấu:** \`${normCombat.toUpperCase()}\` (Sát thương & Lực chiến CP)\n` +
          `🔨 **Class Sản Xuất (PP):** \`${normProducer.toUpperCase()}\` (Giao thương & Nạp Kho Vault)\n\n` +
          `💡 *Tổ đội 3-5 bạn bè hãy phân công mỗi người 1 Nghề Sản Xuất khác nhau để làm giàu nhanh nhất!*`
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault').setStyle(ButtonStyle.Success),
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
        `📌 **Cú pháp Tiếng Anh 3 chữ đầu tiện lợi:**\n` +
        `• Gõ 3 chữ đầu: \`vn job sel <war|mag|ran|ass> <min|alc|blk|hnt>\` (VD: \`vn job sel war min\`)\n` +
        `• **Combat:** \`war\` (Warrior), \`mag\` (Mage), \`ran\` (Ranger), \`ass\` (Assassin)\n` +
        `• **Producer:** \`min\` (Miner), \`alc\` (Alchemist), \`blk\` (Blacksmith), \`hnt\` (Hunter)`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('cmd_trade').setLabel('🛍️ Giao Dịch 1-1').setStyle(ButtonStyle.Primary)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
