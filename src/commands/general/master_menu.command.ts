import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function masterMenuCommand(message: Message): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);

  const currentCombat = (user.hePhai || 'Chưa Chọn').toUpperCase();
  const currentProducer = ((user as any).producerJob || 'Chưa Chọn').toUpperCase();

  const embed = createDongSonEmbed()
    .setTitle('🎮 TRUYỀN KỲ THỦY TỔ TRUNG CỔ - BẢNG ĐIỀU KHIỂN GAMER (PREFIX: vkl)')
    .setDescription(
      `👤 **Anh Hùng:** ${message.author.username}\n` +
        `⚔️ **Class Chiến Đấu:** \`${currentCombat}\` | 🔨 **Class Sản Xuất:** \`${currentProducer}\`\n\n` +
        `💡 **BẤM NÚT HOẶC CHỌN MENU BÊN DƯỚI ĐỂ CHƠI NGAY (KHÔNG CẦN GÕ CHỮ TRẮC TRỞ!):**`
    );

  // Row 1: Direct Action Buttons
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vkl w)').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('cmd_dungeon_1').setLabel('🗺️ Ngục Tối (vkl d)').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ (vkl i)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_profile').setLabel('👤 Hồ Sơ (vkl p)').setStyle(ButtonStyle.Secondary)
  );

  // Row 2: Master Select Menu for Quick Options
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('master_menu_select')
    .setPlaceholder('👉 Chọn Thao Tác Game Ngay Tại Đây...')
    .addOptions([
      { label: '🎭 Chọn Song Phái Dual-Class', value: 'menu_job', description: 'Chọn Class Chiến Đấu & Class Sản Xuất', emoji: '⚔️' },
      { label: '📦 Kho Vault Chung Tổ Đội', value: 'menu_vault', description: 'Gửi / Rút tài nguyên Kho Hợp Tác Xã', emoji: '📦' },
      { label: '🛍️ Giao Dịch Trực Tiếp 1-1', value: 'menu_trade', description: 'Trao đổi đồ trực tiếp với bạn bè', emoji: '🤝' },
      { label: '🎓 Đệ Tử Truyền Thừa', value: 'menu_detu', description: 'Quản lý Đệ Tử & Dạy Nghề', emoji: '🎓' },
      { label: '🐉 Linh Thú Đồng Hành', value: 'menu_pet', description: 'Ấp trứng & Nuôi Linh thú', emoji: '🐉' },
      { label: '🎰 Minigames & Board Games', value: 'menu_minigames', description: 'Slots, Dice, Coinflip, Blackjack', emoji: '🎲' },
    ]);

  const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await message.reply({ embeds: [embed], components: [row1, row2] });
}
