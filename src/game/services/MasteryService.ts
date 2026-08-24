import { UserModelAdvanced, IUserAdvanced } from '../../database/models/User.model';

export type QualityTier = 0 | 1 | 2 | 3; // .0 Normal, .1 Uncommon 🟢 (+20%), .2 Rare 🔵 (+45%), .3 Exceptional 🟣 (+75%)

export interface MasteryLevelInfo {
  level: number;
  exp: number;
  maxExp: number;
  perks: string[];
}

export class MasteryService {
  /**
   * Cộng EXP Chuyên Môn Nghề (Mastery EXP) cho Miner / Alchemist / Blacksmith
   */
  public static async addMasteryExp(
    userId: string,
    jobKey: 'miner' | 'alchemist' | 'blacksmith',
    expAmount = 25
  ): Promise<{ levelUp: boolean; newLevel: number; oldLevel: number }> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { levelUp: false, newLevel: 1, oldLevel: 1 };

    const currentMastery = (user as any).producerMastery?.[jobKey] || { level: 1, exp: 0 };
    const oldLevel = currentMastery.level || 1;
    let level = oldLevel;
    let exp = (currentMastery.exp || 0) + expAmount;
    let maxExp = level * 100;
    let levelUp = false;

    while (exp >= maxExp) {
      exp -= maxExp;
      level += 1;
      maxExp = level * 100;
      levelUp = true;
    }

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $set: {
          [`producerMastery.${jobKey}.level`]: level,
          [`producerMastery.${jobKey}.exp`]: exp,
        },
      }
    );

    return { levelUp, newLevel: level, oldLevel };
  }

  /**
   * Tính toán Phẩm Chất Vật Phẩm (.0, .1, .2, .3) dựa trên Level Thông Thạo Nghề (Albion Quality System)
   */
  public static rollQualityTier(masteryLevel = 1): { qualityTier: QualityTier; suffix: string; multiplier: number } {
    const r = Math.random();

    // Tỷ lệ xuất hiện phẩm chất cao tăng theo Level Mastery
    const p3 = Math.min(0.15, 0.01 + masteryLevel * 0.01); // .3 Exceptional (🟣 +75%)
    const p2 = Math.min(0.30, 0.05 + masteryLevel * 0.02); // .2 Rare (🔵 +45%)
    const p1 = Math.min(0.45, 0.15 + masteryLevel * 0.03); // .1 Uncommon (🟢 +20%)

    if (r < p3) {
      return { qualityTier: 3, suffix: ' 🟣 [.3 Exceptional]', multiplier: 1.75 };
    } else if (r < p3 + p2) {
      return { qualityTier: 2, suffix: ' 🔵 [.2 Rare]', multiplier: 1.45 };
    } else if (r < p3 + p2 + p1) {
      return { qualityTier: 1, suffix: ' 🟢 [.1 Uncommon]', multiplier: 1.20 };
    } else {
      return { qualityTier: 0, suffix: '', multiplier: 1.0 };
    }
  }

  /**
   * Lấy thông tin Destiny Board Mastery của người chơi
   */
  public static getMasteryInfo(user: IUserAdvanced): Record<'miner' | 'alchemist' | 'blacksmith', MasteryLevelInfo> {
    const rawMastery = (user as any).producerMastery || {};

    const getJobInfo = (key: 'miner' | 'alchemist' | 'blacksmith', jobName: string) => {
      const lvl = rawMastery[key]?.level || 1;
      const exp = rawMastery[key]?.exp || 0;
      const maxExp = lvl * 100;

      const perks = [
        `🔨 **Cấp ${lvl} ${jobName}:** Tăng +${lvl * 3}% Tỷ lệ nhận Đồ Tuyệt Phẩm (.1, .2, .3)!`,
        `💰 **Trợ Giá Sản Xuất:** Giảm -${Math.min(30, lvl * 2)}% chi phí Vàng khi rèn & bào chế!`,
      ];

      return { level: lvl, exp, maxExp, perks };
    };

    return {
      miner: getJobInfo('miner', 'Thợ Mỏ'),
      alchemist: getJobInfo('alchemist', 'Thợ Bào Chế'),
      blacksmith: getJobInfo('blacksmith', 'Thợ Rèn'),
    };
  }
}
