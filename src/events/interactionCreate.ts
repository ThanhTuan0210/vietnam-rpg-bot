import { Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from 'discord.js';
import { UserService } from '../game/services/UserService';
import { createDongSonEmbed } from '../utils/embedBuilder';
import { comboAllCommand } from '../commands/general/combo.command';
import { dungeonCommand } from '../commands/general/dungeon.command';
import { tuiDoCommand } from '../commands/general/tuido';
import { nhanVatCommandAdvanced } from '../commands/general/nhanvat';
import { vaultCommand } from '../commands/general/vault.command';
import { tradeCommand } from '../commands/general/trade.command';
import { detuCommand } from '../commands/general/detu.command';
import { petCommand } from '../commands/general/pet.command';
import { slotsCommand } from '../commands/minigames/slots.command';
import { masterMenuCommand } from '../commands/general/master_menu.command';

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  try {
    const user = await UserService.getOrCreateUser(interaction.user.id);

    // --- BUTTON INTERACTIONS ---
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // Handle Class Selection Step 1 (Combat Class)
      if (customId.startsWith('job_combat_')) {
        const combat = customId.replace('job_combat_', '');
        user.hePhai = combat as any;
        await user.save();

        const embed = createDongSonEmbed()
          .setTitle('🎭 KHỞI TẠO NHÂN VẬT - BƯỚC 2: CHỌN CLASS SẢN XUẤT (PP)')
          .setDescription(
            `🎉 **Bạn đã chọn Class Chiến Đấu:** \`${combat.toUpperCase()}\`!\n\n` +
              `🔨 **Bây giờ hãy chọn 1 Class Sản Xuất (PP) để đóng góp cho Kho Vault Tổ Đội:**\n` +
              `• **Miner:** Đào quặng, tinh thạch & ngọc quý\n` +
              `• **Alchemist:** Luyện ma dược hồi HP/MP & thuốc kháng độc\n` +
              `• **Blacksmith:** Rèn 45 loại vũ khí, giáp & cuốc\n` +
              `• **Hunter:** Săn quái lấy vàng, rương báu & chìa khóa`
          );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('job_producer_miner').setLabel('🪨 Miner (Thợ Mỏ)').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('job_producer_alchemist').setLabel('🧪 Alchemist (Bào Chế)').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('job_producer_blacksmith').setLabel('🔨 Blacksmith (Thợ Rèn)').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('job_producer_hunter').setLabel('🏹 Hunter (Thợ Săn)').setStyle(ButtonStyle.Secondary)
        );

        await interaction.update({ embeds: [embed], components: [row] });
        return;
      }

      // Handle Class Selection Step 2 (Producer Class)
      if (customId.startsWith('job_producer_')) {
        const producer = customId.replace('job_producer_', '');
        (user as any).producerJob = producer;
        await user.save();

        const embed = createDongSonEmbed()
          .setTitle('🎉 TẠO NHÂN VẬT THÀNH CÔNG! - CHÀO MỪNG ĐẾN KYRISE RPG')
          .setDescription(
            `✨ **Chúc mừng ${interaction.user.username}!** Bạn đã hoàn tất chọn Song Phái Dual-Class:\n\n` +
              `⚔️ **Class Chiến Đấu:** \`${(user.hePhai || '').toString().toUpperCase()}\`\n` +
              `🔨 **Class Sản Xuất (PP):** \`${producer.toUpperCase()}\`\n\n` +
              `🚀 **Tất cả tính năng đã được mở khóa! Gõ \`vkl\` hoặc bấm nút bên dưới để bắt đầu chơi!**`
          );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('cmd_master_menu').setLabel('🎮 Bảng Master Menu (vkl)').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vkl w)').setStyle(ButtonStyle.Primary)
        );

        await interaction.update({ embeds: [embed], components: [row] });
        return;
      }

      // Action Buttons
      if (customId === 'cmd_master_menu') {
        await interaction.deferUpdate();
        await masterMenuCommand(interaction.message as any);
        return;
      }

      if (customId === 'cmd_combo') {
        await interaction.deferReply();
        await comboAllCommand(interaction.message as any);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (customId.startsWith('cmd_dungeon')) {
        const floorStr = customId.replace('cmd_dungeon_', '').replace('cmd_dungeon', '');
        const floor = parseInt(floorStr) || 1;
        await interaction.deferReply();
        await dungeonCommand(interaction.message as any, [floor.toString()]);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (customId === 'cmd_tuido') {
        await interaction.deferReply();
        await tuiDoCommand(interaction.message as any);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (customId === 'cmd_profile') {
        await interaction.deferReply();
        await nhanVatCommandAdvanced(interaction.message as any);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (customId === 'cmd_vault') {
        await interaction.deferReply();
        await vaultCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (customId === 'cmd_trade') {
        await interaction.deferReply();
        await tradeCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }
    }

    // --- SELECT MENU INTERACTIONS ---
    if (interaction.isStringSelectMenu()) {
      const selectedValue = interaction.values[0];

      if (selectedValue === 'menu_job') {
        await interaction.deferReply();
        await masterMenuCommand(interaction.message as any);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (selectedValue === 'menu_vault') {
        await interaction.deferReply();
        await vaultCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (selectedValue === 'menu_trade') {
        await interaction.deferReply();
        await tradeCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (selectedValue === 'menu_detu') {
        await interaction.deferReply();
        await detuCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (selectedValue === 'menu_pet') {
        await interaction.deferReply();
        await petCommand(interaction.message as any, []);
        await interaction.deleteReply().catch(() => {});
        return;
      }

      if (selectedValue === 'menu_minigames') {
        await interaction.deferReply();
        await slotsCommand(interaction.message as any, ['100']);
        await interaction.deleteReply().catch(() => {});
        return;
      }
    }
  } catch (err) {
    console.error('❌ Lỗi xử lý Interaction:', err);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '⚠️ Đã xảy ra lỗi khi xử lý nút bấm, vui lòng thử lại!', ephemeral: true }).catch(() => {});
    }
  }
}
