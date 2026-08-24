import { Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
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
import { jobCommand } from '../commands/general/job.command';
import { HourlyEventService } from '../game/services/HourlyEventService';
import { handleHelpSelectInteraction } from '../commands/general/help.command';
import { onMessageCreate } from './messageCreate';

function createMockMessage(interaction: any, customContent?: string): Message {
  return {
    author: interaction.user,
    channel: interaction.channel,
    guild: interaction.guild,
    member: interaction.member,
    client: interaction.client,
    content: customContent || 'vkl',
    reply: async (options: any) => {
      if (interaction.deferred || interaction.replied) {
        return await interaction.followUp(options);
      } else {
        return await interaction.reply(options);
      }
    },
  } as unknown as Message;
}

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  try {
    const user = await UserService.getOrCreateUser(interaction.user.id);
    const mockMsg = createMockMessage(interaction);

    // --- BUTTON INTERACTIONS ---
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // Handle 1-Click Execution Buttons from Fuzzy Suggestion
      if (customId.startsWith('cmd_run_')) {
        const targetAlias = customId.replace('cmd_run_', '');
        const runMsg = createMockMessage(interaction, `vkl ${targetAlias}`);
        await onMessageCreate(runMsg);
        return;
      }

      // Handle Class Selection Step 1 (Combat Class)
      if (customId.startsWith('job_combat_')) {
        const combat = customId.replace('job_combat_', '');
        user.hePhai = combat as any;
        await user.save();

        const embed = createDongSonEmbed()
          .setTitle('🎭 KHỞI TẠO NHÂN VẬT - BƯỚC 2: CHỌN CLASS SẢN XUẤT (PP)')
          .setDescription(
            `🎉 **Bạn đã chọn Class Chiến Đấu:** \`${combat.toUpperCase()}\`!\n\n` +
              `🔨 **Bây giờ hãy chọn 1 trong 3 Class Sản Xuất (PP) để đóng góp cho Kho Vault Tổ Đội:**\n` +
              `• **🪨 Miner (Thợ Mỏ):** Đào quặng, tinh thạch & ngọc quý\n` +
              `• **🧪 Alchemist (Bào Chế):** Luyện ma dược hồi HP/MP & thuốc kích rèn\n` +
              `• **🔨 Blacksmith (Thợ Rèn):** Rèn vũ khí, trang bị & cuốc mỏ`
          );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('job_producer_miner').setLabel('🪨 Miner (Thợ Mỏ)').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('job_producer_alchemist').setLabel('🧪 Alchemist (Bào Chế)').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('job_producer_blacksmith').setLabel('🔨 Blacksmith (Thợ Rèn)').setStyle(ButtonStyle.Danger)
        );

        await interaction.update({ embeds: [embed], components: [row] });
        return;
      }

      // Handle Class Selection Step 2 (Producer Class)
      if (customId.startsWith('job_producer_')) {
        const producer = customId.replace('job_producer_', '');
        const currentProducer = ((user as any).producerJob || '').toString().toLowerCase();

        if (currentProducer && currentProducer !== 'chưa chọn' && currentProducer !== 'null' && currentProducer !== producer) {
          const lastChange = user.cooldowns?.get('producer_job_change') || 0;
          const now = Date.now();
          const COOLDOWN_24H = 24 * 60 * 60 * 1000;

          if (now - lastChange < COOLDOWN_24H) {
            const hasResetScroll = await UserService.consumeItemAtomic(interaction.user.id, 'scroll_reset_job', 1);

            if (!hasResetScroll) {
              const paidFee = await UserService.deductDongAtomic(interaction.user.id, 50000);
              if (!paidFee) {
                const remainingMs = COOLDOWN_24H - (now - lastChange);
                const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
                const remMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

                const embed = createDongSonEmbed()
                  .setTitle('⏰ COOLDOWN CHUYỂN NGHỀ SẢN XUẤT (24h REAL-TIME)!')
                  .setDescription(
                    `Bạn đã chọn Class Sản Xuất trước đó. Đổi sang nghề **${producer.toUpperCase()}** yêu cầu chờ **${remHours}h ${remMins}m**!\n\n` +
                      `💡 **Để đổi nghề ngay lập tức:**\n` +
                      `1️⃣ Mua **📜 Sách Xóa Nghề (\`scroll_reset_job\`)** tại \`vkl shop\` (50k Vàng) rồi dùng (\`vkl use scroll_reset_job\`).\n` +
                      `2️⃣ Hoặc tích lũy **50.000 Vàng** trong ví để tự động trả phí đổi nghề!`
                  );

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
              }
            }
          }
        }

        (user as any).producerJob = producer;
        await UserService.updateCooldownAtomic(interaction.user.id, 'producer_job_change', Date.now());
        await user.save();

        const embed = createDongSonEmbed()
          .setTitle('🎉 CHỌN CLASS SẢN XUẤT THÀNH CÔNG — KYRISE RPG')
          .setDescription(
            `✨ **Chúc mừng ${interaction.user.username}!** Bạn đã cập nhật Song Phái Dual-Class:\n\n` +
              `⚔️ **Class Chiến Đấu:** \`${(user.hePhai || 'CHƯA CHỌN').toString().toUpperCase()}\`\n` +
              `🔨 **Class Sản Xuất (PP):** \`${producer.toUpperCase()}\`\n\n` +
              `🚀 **Tất cả tính năng đã được mở khóa! Gõ \`vkl\` hoặc bấm nút bên dưới để bắt đầu chơi!**`
          );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('cmd_master_menu').setLabel('🎮 Bảng Master Menu (vkl)').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vkl w)').setStyle(ButtonStyle.Primary)
        );

        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ embeds: [embed], components: [row] });
        } else {
          await interaction.update({ embeds: [embed], components: [row] });
        }
        return;
      }

      // Handle Event Claim Button
      if (customId.startsWith('event_claim_')) {
        const eventId = customId.replace('event_claim_', '');
        await HourlyEventService.handleClaim(interaction, eventId);
        return;
      }

      // Action Buttons
      if (customId === 'cmd_master_menu') {
        await masterMenuCommand(mockMsg);
        return;
      }

      if (customId === 'cmd_combo') {
        await comboAllCommand(mockMsg);
        return;
      }

      if (customId.startsWith('cmd_dungeon')) {
        const floorStr = customId.replace('cmd_dungeon_', '').replace('cmd_dungeon', '');
        const floor = parseInt(floorStr) || 1;
        await dungeonCommand(mockMsg, [floor.toString()]);
        return;
      }

      if (customId === 'cmd_tuido') {
        await tuiDoCommand(mockMsg);
        return;
      }

      if (customId === 'cmd_profile') {
        await nhanVatCommandAdvanced(mockMsg);
        return;
      }

      if (customId === 'cmd_vault') {
        await vaultCommand(mockMsg, []);
        return;
      }

      if (customId === 'cmd_trade') {
        await tradeCommand(mockMsg, []);
        return;
      }
    }

    // --- SELECT MENU INTERACTIONS ---
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'help_category_select') {
        await handleHelpSelectInteraction(interaction);
        return;
      }

      const selectedValue = interaction.values[0];

      if (selectedValue === 'menu_job') {
        await jobCommand(mockMsg, []);
        return;
      }

      if (selectedValue === 'menu_inventory') {
        await tuiDoCommand(mockMsg);
        return;
      }

      if (selectedValue === 'menu_profile') {
        await nhanVatCommandAdvanced(mockMsg);
        return;
      }

      if (selectedValue === 'menu_vault') {
        await vaultCommand(mockMsg, []);
        return;
      }

      if (selectedValue === 'menu_trade') {
        await tradeCommand(mockMsg, []);
        return;
      }

      if (selectedValue === 'menu_detu') {
        await detuCommand(mockMsg, []);
        return;
      }

      if (selectedValue === 'menu_pet') {
        await petCommand(mockMsg, []);
        return;
      }

      if (selectedValue === 'menu_dungeon') {
        await dungeonCommand(mockMsg, ['1']);
        return;
      }

      if (selectedValue === 'menu_minigames') {
        await slotsCommand(mockMsg, ['100']);
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
