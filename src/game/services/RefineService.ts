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
   * Thực hiện Cường hóa Ngẫu nhiên chỉ số (+5%, +15%, +25%, +50%, +75%)
   */
  public static async randomEnchantEquipment(
    userId: string,
    slotType: 'vuKhi' | 'aoGiap'
  ): Promise<RefineResult> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) {
      return {
        success: false,
        tierName: '',
        tierIcon: '',
        percentBonus: 0,
        message: '❌ Không tìm thấy thông tin nhân vật!',
      };
    }

    const gearSlot = user.trangBi[slotType];
    if (!gearSlot || !gearSlot.itemId) {
      return {
        success: false,
        tierName: '',
        tierIcon: '',
        percentBonus: 0,
        message: `❌ Bạn chưa trang bị ${slotType === 'vuKhi' ? 'Vũ khí' : 'Áo giáp'} để cường hóa!`,
      };
    }

    const cost = 5000; // 5,000 Đồng / lần gieo ngẫu nhiên

    // Trừ tiền cược Atomic
    const paid = await UserService.deductDongAtomic(userId, cost);
    if (!paid) {
      return {
        success: false,
        tierName: '',
        tierIcon: '',
        percentBonus: gearSlot.bonusStat || 0,
        message: `❌ Bạn không đủ **5,000 Đồng** để thực hiện gieo ngẫu nhiên cường hóa!`,
      };
    }

    // Quay ngẫu nhiên Phẩm chất từ Bảng tỷ lệ
    const rand = Math.random();
    let accumulated = 0;
    let selectedTier = RANDOM_ENCHANT_TIERS[0];

    for (const tier of RANDOM_ENCHANT_TIERS) {
      accumulated += tier.chance;
      if (rand <= accumulated) {
        selectedTier = tier;
        break;
      }
    }

    // Cập nhật CSDL
    await UserModelAdvanced.updateOne(
      { userId },
      {
        $set: {
          [`trangBi.${slotType}.capCuongHoa`]: selectedTier.percent, // Lưu phần trăm
          [`trangBi.${slotType}.bonusStat`]: selectedTier.percent,
        },
      }
    );

    const statTypeStr = slotType === 'vuKhi' ? 'Sát Thương (ATK)' : 'Sinh Lực (HP)';

    return {
      success: true,
      tierName: selectedTier.name,
      tierIcon: selectedTier.icon,
      percentBonus: selectedTier.percent,
      message:
        `🎉 **CƯỜNG HÓA THÀNH CÔNG!**\n` +
        `Trang bị đã nhận linh khí ${selectedTier.icon} **${selectedTier.name}**!\n` +
        `🔥 Tăng thêm **+${selectedTier.percent}% ${statTypeStr}** cho nhân vật!`,
    };
  }
}
