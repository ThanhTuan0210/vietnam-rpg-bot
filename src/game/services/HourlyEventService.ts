import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { UserService } from './UserService';
import { formatDong } from '../../utils/formatters';

export interface HourlyRewardTier {
  hour: number;
  label: string;
  dong: number;
  items: { itemId: string; name: string; icon: string; qty: number }[];
}

export const HOURLY_REWARDS: Record<number, HourlyRewardTier> = {
  20: {
    hour: 20,
    label: '🌆 KHUNG 20:00 — KHỞI ĐỘNG ĐÊM GOTHIC',
    dong: 5000,
    items: [
      { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 3 },
      { itemId: 'ingot_01a', name: 'Thỏi Đồng Cổ', icon: '🧱', qty: 3 },
    ],
  },
  21: {
    hour: 21,
    label: '🌙 KHUNG 21:00 — TĂNG TỐC TÀI NGUYÊN',
    dong: 10000,
    items: [
      { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 5 },
      { itemId: 'crystal_01a', name: 'Tinh Thạch Thượng Cổ', icon: '🔮', qty: 2 },
    ],
  },
  22: {
    hour: 22,
    label: '✨ KHUNG 22:00 — VẬT PHẨM TRUNG CỔ',
    dong: 18000,
    items: [
      { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối', icon: '🗝️', qty: 1 },
      { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 1 },
    ],
  },
  23: {
    hour: 23,
    label: '🔥 KHUNG 23:00 — SÁCH XÓA NGHỀ & HỒNG NGỌC',
    dong: 28000,
    items: [
      { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
      { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 1 },
    ],
  },
  0: {
    hour: 0,
    label: '👑 KHUNG 00:00 — MIDNIGHT JACKPOT HOÀNG CUNG',
    dong: 50000,
    items: [
      { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
      { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 3 },
      { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 2 },
    ],
  },
};

// Store active event state: eventId -> { claimedBy: string | null, reward: HourlyRewardTier }
export const activeEventsMap = new Map<
  string,
  {
    eventId: string;
    hour: number;
    claimedBy: { userId: string; username: string } | null;
    reward: HourlyRewardTier;
    messageId?: string;
  }
>();

export class HourlyEventService {
  private static lastTriggeredHour: number = -1;

  /**
   * Khởi động Cron Timer kiểm tra mỗi phút (Khung 20h, 21h, 22h, 23h, 00h)
   */
  public static startEventLoop(client: Client) {
    console.log('⏰ [EVENT ENGINE] Đã khởi chạy vòng lặp Sự Kiện Đêm (20h - 00h)...');

    setInterval(async () => {
      const now = new Date();
      // Chuyển sang giờ Việt Nam (UTC+7)
      const utc7Hour = (now.getUTCHours() + 7) % 24;
      const minutes = now.getUTCMinutes();

      // Chỉ kích hoạt ở đầu giờ (phút 0) và thuộc các khung: 20, 21, 22, 23, 0
      if (minutes === 0 && [20, 21, 22, 23, 0].includes(utc7Hour) && this.lastTriggeredHour !== utc7Hour) {
        this.lastTriggeredHour = utc7Hour;
        console.log(`🎉 [EVENT ENGINE] Kích hoạt Sự kiện Giờ Vàng Khung ${utc7Hour}:00!`);
        await this.broadcastHourlyEvent(client, utc7Hour);
      }
    }, 30000); // Check every 30s
  }

  /**
   * Phát tin nhắn Sự kiện vào tất cả Server / Kênh khả dụng
   */
  public static async broadcastHourlyEvent(client: Client, hour: number, targetMessage?: Message) {
    const rewardTier = HOURLY_REWARDS[hour] || HOURLY_REWARDS[20];
    const eventId = `evt_${Date.now()}_${hour}`;

    activeEventsMap.set(eventId, {
      eventId,
      hour,
      claimedBy: null,
      reward: rewardTier,
    });

    const embed = createDongSonEmbed()
      .setTitle(`⚡ SỰ KIỆN ĐIỂM DANH GIỜ VÀNG (20H - 00H) — ${rewardTier.label}`)
      .setDescription(
        `🚨 **CHỈ CÓ 1 NGƯỜI CHƠI NHANH TAY NHẤT MỚI NHẬN ĐƯỢC PHẦN THƯỞNG GIỜ NÀY!**\n\n` +
          `🎁 **PHẦN THƯỞNG KHUNG ${hour}:00 (TĂNG THEO GIỜ):**\n` +
          `💰 **Tiền Vàng:** \`+${formatDong(rewardTier.dong)}\`\n` +
          rewardTier.items.map((i) => `• **${i.qty}x** ${i.icon} **${i.name}** (\`${i.itemId}\`)`).join('\n') +
          `\n\n👇 **ẤN NÚT BÊN DƯỚI NGAY ĐỂ GIÀNH CHIẾN THẮNG!**`
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`event_claim_${eventId}`)
        .setLabel(`🎉 ĐIỂM DANH NHẬN GIFTCODE KHUNG ${hour}H (#1 FASTEST)`)
        .setStyle(ButtonStyle.Success)
    );

    if (targetMessage) {
      await targetMessage.reply({ embeds: [embed], components: [row] });
      return;
    }

    // Broadcast across all text channels where bot has access
    const guilds = client.guilds.cache;
    for (const [, guild] of guilds) {
      const channel = guild.channels.cache.find(
        (c) => c.isTextBased() && (c as TextChannel).permissionsFor(guild.members.me!)?.has('SendMessages')
      ) as TextChannel;

      if (channel) {
        await channel.send({ embeds: [embed], components: [row] }).catch(() => {});
      }
    }
  }

  /**
   * Xử lý khi người chơi bấm nút Điểm Danh Giờ Vàng
   */
  public static async handleClaim(interaction: any, eventId: string) {
    const event = activeEventsMap.get(eventId);
    if (!event) {
      await interaction.reply({ content: '⚠️ Sự kiện này đã kết thúc hoặc không tồn tại!', ephemeral: true });
      return;
    }

    if (event.claimedBy) {
      await interaction.reply({
        content: `⚠️ **Rất tiếc!** Người chơi **@${event.claimedBy.username}** đã nhanh tay bấm nút giành giải thưởng trước bạn! Hãy chờ mốc giờ tiếp theo!`,
        ephemeral: true,
      });
      return;
    }

    // Claim success for 1st player!
    const userId = interaction.user.id;
    const username = interaction.user.username;
    event.claimedBy = { userId, username };

    // Reward player
    const user = await UserService.getOrCreateUser(userId);
    user.taiChinh.dong += event.reward.dong;

    let itemRewardText = '';
    for (const item of event.reward.items) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
      itemRewardText += `• **${item.qty}x** ${item.icon} **${item.name}** (\`${item.itemId}\`)\n`;
    }
    await user.save();

    // Update Embed to Disabled
    const updatedEmbed = createDongSonEmbed()
      .setTitle(`🏆 SỰ KIỆN GIỜ VÀNG ${event.reward.label} — ĐÃ CÓ CHỦ NHÂN!`)
      .setDescription(
        `🎉 **CHÚC MỪNG CHIẾN THẮNG:** **${interaction.user.tag}** (\`@${username}\`) là người nhanh tay nhất server đã nhận được phần thưởng Khung ${event.hour}H!\n\n` +
          `💰 **Tiền Vàng Nhận Đón:** \`+${formatDong(event.reward.dong)}\`\n\n` +
          `🎁 **VẬT PHẨM ĐOẠT ĐƯỢC:**\n${itemRewardText}\n` +
          `⏰ *Mốc giờ tiếp theo từ 20:00 đến 00:00 sẽ tự động phát phần thưởng giá trị cao hơn!*`
      );

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`event_claim_${eventId}_done`)
        .setLabel(`🏆 ĐÃ CÓ CHỦ NHÂN: @${username}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    await interaction.update({ embeds: [updatedEmbed], components: [disabledRow] });
  }
}
