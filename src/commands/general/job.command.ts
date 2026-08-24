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
    };

    const normCombat = combatMap[combatInput];
    const normProducer = producerMap[producerInput];

    if (!normCombat || !normProducer) {
      await message.reply('⚠️ **Cú pháp chưa đúng!** Chọn Class Chiến Đấu (`war`, `mag`, `ran`, `ass`) và 1 trong 3 Class Sản Xuất (`min`, `alc`, `blk`).\n*VD:* `vkl job sel war min`');
      return;
    }

    const currentProducer = ((user as any).producerJob || '').toString().toLowerCase();

    // Check 24-hour real-time cooldown if player is CHANGING an existing producer class
    if (currentProducer && currentProducer !== 'chưa chọn' && currentProducer !== normProducer) {
      const lastChange = user.cooldowns?.get('producer_job_change') || 0;
      const now = Date.now();
      const COOLDOWN_24H = 24 * 60 * 60 * 1000;

      if (now - lastChange < COOLDOWN_24H) {
        const remainingMs = COOLDOWN_24H - (now - lastChange);
        const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

        await message.reply(
          `⏰ **COOLDOWN CHUYỂN NGHỀ SẢN XUẤT (24h REAL-TIME)!**\n\n` +
            `Bạn đã chuyển Class Sản Xuất gần đây. Bạn phải chờ thêm **${remHours} giờ ${remMins} phút** nữa mới có thể đổi Class Sản Xuất lần nữa!\n\n` +
            `💡 *Nếu muốn chuyển nghề NGAY LẬP TỨC mà không cần chờ, hãy mua **📜 Sách Xóa Nghề Trung Cổ (\`scroll_reset_job\`)** trong Tiệm Thương Nhân (\`vkl shop\`) với giá **50.000 Vàng** rồi sử dụng (\`vkl use scroll_reset_job\`)!*`
        );
        return;
      }
    }

    user.hePhai = normCombat as any;
    (user as any).producerJob = normProducer;
    await UserService.updateCooldownAtomic(message.author.id, 'producer_job_change', Date.now());
    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã đăng ký thành công Song Phái Trung Cổ:\n\n` +
          `⚔️ **Class Chiến Đấu (Chính):** \`${normCombat.toUpperCase()}\` (Đi săn quái, kiếm Vàng & đánh Boss)\n` +
          `🔨 **Class Sản Xuất (PP):** \`${normProducer.toUpperCase()}\` (Khai thác tài nguyên & nạp Kho Vault)\n\n` +
          `💡 *Tổ đội 3-5 bạn bè hãy phân công 3 người làm 3 Nghề Sản Xuất khác nhau (Miner, Alchemist, Blacksmith) để hình thành vòng kinh tế khép kín!*`
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
  const currentCombat = (user.hePhai || 'Chưa Chọn').toString();
  const currentProducer = ((user as any).producerJob || 'Chưa Chọn').toString();

  const embed = createDongSonEmbed()
    .setTitle('🎭 QUẢN LÝ SONG PHÁI DUAL-CLASS (1 COMBAT + 1 PRODUCER)')
    .setDescription(
      `👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu (Đi Săn & Đánh Boss):** \`${currentCombat.toUpperCase()}\`\n` +
        `🔨 **Class Sản Xuất (3 Nghề Khép Kín):** \`${currentProducer.toUpperCase()}\`\n\n` +
        `📌 **Cú pháp Tiếng Anh 3 chữ đầu tiện lợi:**\n` +
        `• Gõ 3 chữ đầu: \`vkl job sel <war|mag|ran|ass> <min|alc|blk>\` (VD: \`vkl job sel war min\`)\n` +
        `• **Class Chiến Đấu:** \`war\` (Warrior), \`mag\` (Mage), \`ran\` (Ranger), \`ass\` (Assassin)\n` +
        `• **3 Class Sản Xuất (PP):** \`min\` (Miner), \`alc\` (Alchemist), \`blk\` (Blacksmith)`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('cmd_trade').setLabel('🛍️ Giao Dịch 1-1').setStyle(ButtonStyle.Primary)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
