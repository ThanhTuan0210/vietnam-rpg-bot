import { IUserAdvanced } from '../../database/models/User.model';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export interface CooldownDefinition {
  key: string;
  name: string;
  command: string;
  durationMs: number;
}

export class CooldownDashboardService {
  /**
   * Tạo Embed Bảng Thời Gian Hồi Chiêu (Cooldowns Dashboard) chuẩn 100% tính năng đang có
   */
  public static renderCooldownEmbed(user: IUserAdvanced, username: string) {
    const now = Date.now();

    const getStatusListText = (definitions: CooldownDefinition[]): string => {
      return definitions
        .map((k) => {
          const lastUsed = user.cooldowns?.get(k.key) || 0;
          const elapsed = now - lastUsed;

          if (k.durationMs === 0 || elapsed >= k.durationMs) {
            return `🟢 **${k.name}** (\`${k.command}\`) ➔ **✅ SẴN SÀNG!**`;
          } else {
            const remSec = Math.ceil((k.durationMs - elapsed) / 1000);
            const hours = Math.floor(remSec / 3600);
            const minutes = Math.floor((remSec % 3600) / 60);
            const seconds = remSec % 60;

            let timeStr = '';
            if (hours > 0) timeStr += `${hours}h `;
            if (minutes > 0) timeStr += `${minutes}m `;
            timeStr += `${seconds}s`;

            return `⏳ **${k.name}** (\`${k.command}\`) ➔ **🕒 Còn ${timeStr.trim()}**`;
          }
        })
        .join('\n');
    };

    // 1. 🎁 ĐIỂM DANH & THƯỞNG HÀNG NGÀY (4 Tính năng)
    const rewardKeys: CooldownDefinition[] = [
      { key: 'daily_reward', name: 'Điểm Danh Hàng Ngày', command: 'vkl daily', durationMs: 86400000 },
      { key: 'weekly_reward', name: 'Nhận Thưởng Hàng Tuần', command: 'vkl weekly', durationMs: 604800000 },
      { key: 'caothi', name: 'Nhiệm Vụ Cáo Thị', command: 'vkl caothi', durationMs: 10800000 },
      { key: 'xinxam', name: 'Xin Xăm May Mắn', command: 'vkl xinxam', durationMs: 86400000 },
    ];

    // 2. ⚔️ CHIẾN ĐẤU & NGỤC TỐI (6 Tính năng)
    const combatKeys: CooldownDefinition[] = [
      { key: 'combo_all', name: 'Lao Động Combo (Combat + Job)', command: 'vkl w', durationMs: 60000 },
      { key: 'san', name: 'Săn Quái Đơn Phái', command: 'vkl h', durationMs: 30000 },
      { key: 'phuban', name: 'Chinh Phục Ngục Tối (Tầng 1-7)', command: 'vkl d 1', durationMs: 3600000 },
      { key: 'pvp', name: 'Lôi Đài Thách Đấu PVP', command: 'vkl pvp', durationMs: 120000 },
      { key: 'leothap', name: 'Leo Tháp Rồng Roguelike', command: 'vkl thap', durationMs: 300000 },
      { key: 'boss', name: 'Trùm Khu Vực Thế Giới', command: 'vkl boss', durationMs: 7200000 },
    ];

    // 3. ⚒️ SẢN XUẤT & CHUYÊN MÔN (4 Tính năng)
    const producerKeys: CooldownDefinition[] = [
      { key: 'producer_job_change', name: 'Đổi Class Sản Xuất (PP)', command: 'vkl job', durationMs: 86400000 },
      { key: 'dao_khoang', name: 'Đào Khoáng Mỏ (Miner)', command: 'vkl m', durationMs: 30000 },
      { key: 'hai_thuoc', name: 'Bào Chế Thuốc (Alchemist)', command: 'vkl brew', durationMs: 30000 },
      { key: 'don_cui', name: 'Đốn Gỗ Sồi & Rèn Đồ (Blacksmith)', command: 'vkl craft', durationMs: 30000 },
    ];

    // 4. 🏰 BANG HỘI & TỔ ĐỘI (2 Tính năng)
    const socialKeys: CooldownDefinition[] = [
      { key: 'bang', name: 'Hoạt Động Bang Hội', command: 'vkl guild', durationMs: 3600000 },
      { key: 'vault', name: 'Kho Vault Tổ Đội (Squad Vault)', command: 'vkl vlt', durationMs: 0 },
    ];

    return createDongSonEmbed()
      .setTitle(`⏱️ BẢNG THỜI GIAN HỒI CHIÊU (COOLDOWNS) — ${username.toUpperCase()}`)
      .setDescription('🏛️ **Quản lý thời gian chờ toàn bộ tính năng đang hoạt động trong Medieval Kyrise RPG:**\n\n')
      .addFields(
        {
          name: '🎁 Điểm Danh & Nhận Thưởng (Daily & Rewards)',
          value: getStatusListText(rewardKeys),
          inline: false,
        },
        {
          name: '⚔️ Chiến Đấu & Ngục Tối (Combat & Dungeons)',
          value: getStatusListText(combatKeys),
          inline: false,
        },
        {
          name: '⚒️ Sản Xuất & Chuyên Môn (Producer Jobs)',
          value: getStatusListText(producerKeys),
          inline: false,
        },
        {
          name: '🏰 Bang Hội & Kho Vault Tổ Đội (Guild & Squad Vault)',
          value: getStatusListText(socialKeys),
          inline: false,
        }
      )
      .setFooter({ text: 'Kiểm tra nhanh bảng thời gian hồi chiêu bằng lệnh "vkl cd" hoặc "vkl cooldown"' });
  }
}
