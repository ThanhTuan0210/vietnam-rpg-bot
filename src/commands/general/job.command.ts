import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function jobCommand(message: Message, args: string[]): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);

  const subCommand = args[0]?.toLowerCase();

  const producerMap: Record<string, string> = {
    min: 'miner',
    miner: 'miner',
    tho_mo: 'miner',
    alc: 'alchemist',
    alchemist: 'alchemist',
    bao_che: 'alchemist',
    blk: 'blacksmith',
    blacksmith: 'blacksmith',
    tho_ren: 'blacksmith',
  };

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

  // Direct selection by typing `vkl job miner` or `vkl job min`
  let targetProducer = producerMap[subCommand];
  let targetCombat = combatMap[subCommand];

  if ((subCommand === 'sel' || subCommand === 'select') && args.length >= 3) {
    targetCombat = combatMap[args[1]?.toLowerCase()];
    targetProducer = producerMap[args[2]?.toLowerCase()];
  }

  if (targetProducer || targetCombat) {
    const currentProducer = ((user as any).producerJob || '').toString().toLowerCase();

    // If targetProducer is provided
    if (targetProducer) {
      if (currentProducer && currentProducer !== 'chưa chọn' && currentProducer !== targetProducer) {
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

      (user as any).producerJob = targetProducer;
      await UserService.updateCooldownAtomic(message.author.id, 'producer_job_change', Date.now());
    }

    if (targetCombat) {
      user.hePhai = targetCombat as any;
    }

    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('⚔️ ĐỔI SONG PHÁI DUAL-CLASS THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã cập nhật thành công Song Phái Trung Cổ:\n\n` +
          `⚔️ **Class Chiến Đấu (Chính):** \`${(user.hePhai || 'CHƯA CHỌN').toString().toUpperCase()}\`\n` +
          `🔨 **Class Sản Xuất (PP):** \`${((user as any).producerJob || 'CHƯA CHỌN').toString().toUpperCase()}\`\n\n` +
          `💡 *Tổ đội 3-5 bạn bè hãy phân công 3 người làm 3 Nghề Sản Xuất khác nhau (Miner, Alchemist, Blacksmith) để hình thành vòng kinh tế khép kín!*`
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vkl w)').setStyle(ButtonStyle.Danger)
    );

    await message.reply({ embeds: [embed], components: [row] });
    return;
  }

  // Display Current Jobs & Interactive Buttons to Pick PP Job
  const currentCombat = (user.hePhai || 'Chưa Chọn').toString();
  const currentProducer = ((user as any).producerJob || 'Chưa Chọn').toString();

  const embed = createDongSonEmbed()
    .setTitle('🎭 QUẢN LÝ SONG PHÁI DUAL-CLASS (1 COMBAT + 1 PRODUCER)')
    .setDescription(
      `👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu (Đi Săn & Đánh Boss):** \`${currentCombat.toUpperCase()}\`\n` +
        `🔨 **Class Sản Xuất (PP):** \`${currentProducer.toUpperCase()}\`\n\n` +
        `👇 **CHỌN CLASS SẢN XUẤT (PP) BẰNG CÁCH BẤM NÚT BÊN DƯỚI:**\n` +
        `• **🪨 Miner (Thợ Mỏ):** Đào quặng, tinh thạch & ngọc quý\n` +
        `• **🧪 Alchemist (Bào Chế):** Luyện ma dược hồi HP/MP & thuốc kích rèn\n` +
        `• **🔨 Blacksmith (Thợ Rèn):** Rèn vũ khí, trang bị & cuốc mỏ`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('job_producer_miner').setLabel('🪨 Chọn Miner (Thợ Mỏ)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('job_producer_alchemist').setLabel('🧪 Chọn Alchemist (Bào Chế)').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('job_producer_blacksmith').setLabel('🔨 Chọn Blacksmith (Thợ Rèn)').setStyle(ButtonStyle.Danger)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
