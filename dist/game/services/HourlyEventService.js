"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HourlyEventService = exports.activeEventsMap = exports.HOURLY_REWARDS = void 0;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../../utils/embedBuilder");
const UserService_1 = require("./UserService");
const formatters_1 = require("../../utils/formatters");
exports.HOURLY_REWARDS = {
    20: {
        hour: 20,
        label: '🌆 KHUNG 20:00 — KHỞI ĐỘNG ĐÊM GOTHIC',
        dong: 20000,
        items: [
            { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 5 },
            { itemId: 'crystal_01a', name: 'Tinh Thạch Thượng Cổ', icon: '🔮', qty: 2 },
        ],
    },
    21: {
        hour: 21,
        label: '🌙 KHUNG 21:00 — TĂNG TỐC TÀI NGUYÊN',
        dong: 40000,
        items: [
            { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 10 },
            { itemId: 'ingot_01a', name: 'Thỏi Đồng Cổ', icon: '🧱', qty: 5 },
            { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối', icon: '🗝️', qty: 1 },
        ],
    },
    22: {
        hour: 22,
        label: '✨ KHUNG 22:00 — SIÊU CẤP ĐẠI VIỆT',
        dong: 70000,
        items: [
            { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
            { itemId: 'crystal_01a', name: 'Tinh Thạch Thượng Cổ', icon: '🔮', qty: 3 },
            { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 2 },
        ],
    },
    23: {
        hour: 23,
        label: '🔥 KHUNG 23:00 — TIỀN ĐÊM HOÀNG GIA',
        dong: 120000,
        items: [
            { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
            { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 3 },
            { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối', icon: '🗝️', qty: 3 },
        ],
    },
    0: {
        hour: 0,
        label: '👑 KHUNG 00:00 — MIDNIGHT JACKPOT HOÀNG CUNG',
        dong: 250000,
        items: [
            { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 2 },
            { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 10 },
            { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 5 },
            { itemId: 'sword_01a', name: 'Kiếm Sơ Cấp Trung Cổ', icon: '⚔️', qty: 1 },
        ],
    },
};
// Store active event state: eventId -> { claimedBy: string | null, reward: HourlyRewardTier }
exports.activeEventsMap = new Map();
class HourlyEventService {
    static lastTriggeredHour = -1;
    /**
     * Khởi động Cron Timer kiểm tra mỗi phút (Khung 20h, 21h, 22h, 23h, 00h)
     */
    static startEventLoop(client) {
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
    static async broadcastHourlyEvent(client, hour, targetMessage) {
        const rewardTier = exports.HOURLY_REWARDS[hour] || exports.HOURLY_REWARDS[20];
        const eventId = `evt_${Date.now()}_${hour}`;
        exports.activeEventsMap.set(eventId, {
            eventId,
            hour,
            claimedBy: null,
            reward: rewardTier,
        });
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`⚡ SỰ KIỆN ĐIỂM DANH GIỜ VÀNG (20H - 00H) — ${rewardTier.label}`)
            .setDescription(`🚨 **CHỈ CÓ 1 NGƯỜI CHƠI NHANH TAY NHẤT MỚI NHẬN ĐƯỢC PHẦN THƯỞNG GIỜ NÀY!**\n\n` +
            `🎁 **PHẦN THƯỞNG KHUNG ${hour}:00 (TĂNG THEO GIỜ):**\n` +
            `💰 **Tiền Vàng:** \`+${(0, formatters_1.formatDong)(rewardTier.dong)}\`\n` +
            rewardTier.items.map((i) => `• **${i.qty}x** ${i.icon} **${i.name}** (\`${i.itemId}\`)`).join('\n') +
            `\n\n👇 **ẤN NÚT BÊN DƯỚI NGAY ĐỂ GIÀNH CHIẾN THẮNG!**`);
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`event_claim_${eventId}`)
            .setLabel(`🎉 ĐIỂM DANH NHẬN GIFTCODE KHUNG ${hour}H (#1 FASTEST)`)
            .setStyle(discord_js_1.ButtonStyle.Success));
        if (targetMessage) {
            await targetMessage.reply({ embeds: [embed], components: [row] });
            return;
        }
        // Broadcast across all text channels where bot has access
        const guilds = client.guilds.cache;
        for (const [, guild] of guilds) {
            const channel = guild.channels.cache.find((c) => c.isTextBased() && c.permissionsFor(guild.members.me)?.has('SendMessages'));
            if (channel) {
                await channel.send({ embeds: [embed], components: [row] }).catch(() => { });
            }
        }
    }
    /**
     * Xử lý khi người chơi bấm nút Điểm Danh Giờ Vàng
     */
    static async handleClaim(interaction, eventId) {
        const event = exports.activeEventsMap.get(eventId);
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
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        user.taiChinh.dong += event.reward.dong;
        let itemRewardText = '';
        for (const item of event.reward.items) {
            await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
            itemRewardText += `• **${item.qty}x** ${item.icon} **${item.name}** (\`${item.itemId}\`)\n`;
        }
        await user.save();
        // Update Embed to Disabled
        const updatedEmbed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`🏆 SỰ KIỆN GIỜ VÀNG ${event.reward.label} — ĐÃ CÓ CHỦ NHÂN!`)
            .setDescription(`🎉 **CHÚC MỪNG CHIẾN THẮNG:** **${interaction.user.tag}** (\`@${username}\`) là người nhanh tay nhất server đã nhận được phần thưởng Khung ${event.hour}H!\n\n` +
            `💰 **Tiền Vàng Nhận Đón:** \`+${(0, formatters_1.formatDong)(event.reward.dong)}\`\n\n` +
            `🎁 **VẬT PHẨM ĐOẠT ĐƯỢC:**\n${itemRewardText}\n` +
            `⏰ *Mốc giờ tiếp theo từ 20:00 đến 00:00 sẽ tự động phát phần thưởng giá trị cao hơn!*`);
        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(`event_claim_${eventId}_done`)
            .setLabel(`🏆 ĐÃ CÓ CHỦ NHÂN: @${username}`)
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true));
        await interaction.update({ embeds: [updatedEmbed], components: [disabledRow] });
    }
}
exports.HourlyEventService = HourlyEventService;
