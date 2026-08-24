import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from './UserService';

export interface RandomEnchantTier {
  name: string;
  icon: string;
  percent: number;
  chance: number; // Tỷ lệ xuất hiện (0.0 -> 1.0)
}

export const RANDOM_ENCHANT_TIERS: RandomEnchantTier[] = [
  { name: 'Phẩm Cốt', icon: '⚪', percent: 5, chance: 0.40 },     // 40% cơ hội +5%
  { name: 'Phẩm Linh', icon: '🟢', percent: 15, chance: 0.30 },    // 30% cơ hội +15%
  { name: 'Phẩm Huyền', icon: '🟦', percent: 25, chance: 0.18 },    // 18% cơ hội +25%
  { name: 'Phẩm Địa', icon: '🟪', percent: 50, chance: 0.09 },     // 9% cơ hội +50%
  { name: 'Phẩm Thiên Thần Thoại', icon: '👑', percent: 75, chance: 0.03 }, // 3% cơ hội +75%
];

export interface RefineResult {
  success: boolean;
  tierName: string;
  tierIcon: string;
  percentBonus: number;
  message: string;
}

export class RefineService {
  /**
   * Cường hóa ngẫu nhiên trang bị (vkl enchant)
   */
  public static async randomEnchantGear(
    userId: string,
    slotType: 'vuKhi' | 'aoGiap',
    cost = 5000
  ): Promise<{ success: boolean; oldPercent: number; tier: RandomEnchantTier; message?: string }> {
    const user = await UserService.getOrCreateUser(userId);

    if (user.taiChinh.dong < cost) {
      return { success: false, oldPercent: 0, tier: RANDOM_ENCHANT_TIERS[0], message: 'Không đủ Tiền Vàng!' };
    }

    user.taiChinh.dong -= cost;

    if (!user.trangBi) user.trangBi = { vuKhi: { itemId: 'sword_01a', capCuongHoa: 0 }, aoGiap: { itemId: 'shield_01a', capCuongHoa: 0 } };
    if (!user.trangBi[slotType]) user.trangBi[slotType] = { itemId: 'sword_01a', capCuongHoa: 0, bonusStat: 0 };

    const oldPercent = user.trangBi[slotType].bonusStat || 0;

    // Roll random tier
    const rand = Math.random();
    let accumulated = 0;
    let selectedTier = RANDOM_ENCHANT_TIERS[0];

    for (const t of RANDOM_ENCHANT_TIERS) {
      accumulated += t.chance;
      if (rand <= accumulated) {
        selectedTier = t;
        break;
      }
    }

    user.trangBi[slotType].bonusStat = selectedTier.percent;
    await user.save();

    return { success: true, oldPercent, tier: selectedTier };
  }

  /**
   * Thực hiện Cường hóa Ngẫu nhiên chỉ số (+5%, +15%, +25%, +50%, +75%)
   */
  public static async randomEnchantEquipment(
    userId: string,
    slotType: 'vuKhi' | 'aoGiap'
  ): Promise<RefineResult> {
    const res = await this.randomEnchantGear(userId, slotType, 5000);
    return {
      success: res.success,
      tierName: res.tier?.name || 'Thất bại',
      tierIcon: res.tier?.icon || '⚪',
      percentBonus: res.tier?.percent || 0,
      message: res.message || 'Cường hóa thành công!',
    };
  }
}
