import { IUserAdvanced } from '../../database/models/User.model';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export interface CooldownItemStatus {
  key: string;
  name: string;
  cooldownMs: number;
}

export class CooldownDashboardService {
  /**
   * Tạo Embed Bảng Thời Gian Hồi Chiêu (Cooldowns Dashboard) chuẩn Epic RPG
   */
  public static renderCooldownEmbed(user: IUserAdvanced, username: string) {
    const now = Date.now();

    const getStatusStr = (keys: { key: string; name: string; durationMs: number }[]): string => {
      return keys
        .map((k) => {
          const lastUsed = user.cooldowns.get(k.key) || 0;
          const elapsed = now - lastUsed;

          if (elapsed >= k.durationMs) {
            return `✅ ~~~ **${k.name}**`;
          } else {
            const remSec = Math.ceil((k.durationMs - elapsed) / 1000);
            const hours = Math.floor(remSec / 3600);
            const minutes = Math.floor((remSec % 3600) / 60);
            const seconds = remSec % 60;

            let timeStr = '';
            if (hours > 0) timeStr += `${hours}h `;
            if (minutes > 0) timeStr += `${minutes}m `;
            timeStr += `${seconds}s`;

            return `🕒 ~~~ **${k.name}** (${timeStr.trim()})`;
          }
        })
        .join('\n');
    };

    // 1. Rewards
    const rewardKeys = [
      { key: 'daily_reward', name: 'diemdanh | daily', durationMs: 86400000 },
      { key: 'weekly_reward', name: 'hangtuan | weekly', durationMs: 604800000 },
      { key: 'mo_ruong', name: 'mo_ruong | lootbox', durationMs: 0 },
      { key: 'thu_duhi', name: 'thu_duhi | pet adventure', durationMs: 3600000 },
      { key: 'xinxam', name: 'xinxam | daily fortune', durationMs: 86400000 },
    ];

    // 2. Experience
    const expKeys = [
      { key: 'san', name: 'san | hunt', durationMs: 60000 },
      { key: 'thamhiem', name: 'thamhiem | adventure', durationMs: 300000 },
      { key: 'luyenvo', name: 'luyenvo | training', durationMs: 60000 },
      { key: 'pvp', name: 'pvp | duel', durationMs: 120000 },
      { key: 'caothi', name: 'caothi | quest', durationMs: 3600000 },
    ];

    // 3. Progress & Gathering (ĐÃ GIẢM XUỐNG 3 PHÚT = 180,000 ms)
    const progressKeys = [
      { key: 'don_cui', name: 'don_cui | chop', durationMs: 180000 },
      { key: 'cau_ca', name: 'cau_ca | fish', durationMs: 180000 },
      { key: 'hai_thuoc', name: 'hai_thuoc | pickup', durationMs: 180000 },
      { key: 'dao_khoang', name: 'dao_khoang | mine', durationMs: 180000 },
      { key: 'dua_linhthu', name: 'dua_linhthu | race', durationMs: 600000 },
      { key: 'leothap', name: 'leothap | arena tower', durationMs: 0 },
      { key: 'phuban', name: 'phuban | dungeon', durationMs: 3600000 },
    ];

    // 4. Farming & Guild
    const farmKeys = [
      { key: 'nongsang', name: 'nongsang | farm', durationMs: 0 },
      { key: 'bang', name: 'bang | guild', durationMs: 0 },
    ];

    return createDongSonEmbed()
      .setTitle(`⏱️ ${username} — THỜI GIAN HỒI CHIÊU (COOLDOWNS)`)
      .addFields(
        {
          name: '🎁 Phần Thưởng (Rewards)',
          value: getStatusStr(rewardKeys),
          inline: false,
        },
        {
          name: '⚔️ Chiến Đấu & EXP (Experience)',
          value: getStatusStr(expKeys),
          inline: false,
        },
        {
          name: '✨ Tiến Trình Lao Động (Progress)',
          value: getStatusStr(progressKeys),
          inline: false,
        },
        {
          name: '🌾 Điền Trang & Bang Hội (Farm & Guild)',
          value: getStatusStr(farmKeys),
          inline: false,
        }
      )
      .setFooter({ text: 'Kiểm tra nhanh bằng lệnh "vn cd" hoặc "vn cooldown"' });
  }
}
