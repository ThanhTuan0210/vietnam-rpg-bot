import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from './UserService';

export const TOOL_NAMES: Record<number, string> = {
  1: 'Cán Gỗ',
  2: 'Đúc Đồng',
  3: 'Rèn Sắt',
  4: 'Huyền Thiết',
  5: 'Thần Kim',
};

export const TOOL_MULTIPLIERS: Record<number, number> = {
  1: 1.15,
  2: 1.6,
  3: 2.3,
  4: 3.5,
  5: 5.0,
};

export const TOOL_RARE_CHANCES: Record<number, number> = {
  1: 0.05,
  2: 0.12,
  3: 0.22,
  4: 0.35,
  5: 0.5,
};

export class GatheringService {
  /**
   * Đốn củi / Chặt gỗ (Tỷ lệ tăng nhẹ 15%)
   */
  public static async woodcut(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);

    const toolTier = user.dungCu?.riu || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.15;
    const rareBonus = TOOL_RARE_CHANCES[toolTier] || 0.05;

    const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'go_tre_gai', name: 'Gỗ Tre Gai', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.35 + rareBonus) {
      itemsGained.push({ itemId: 'go_tram_huong', name: 'Gỗ Trầm Hương', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
    }

    if (toolTier >= 3 && Math.random() < 0.15 + rareBonus) {
      itemsGained.push({ itemId: 'go_co_thu', name: 'Gỗ Cổ Thụ Ngàn Năm', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Khai mỏ / Đào khoáng (Tỷ lệ tăng nhẹ 15%)
   */
  public static async mine(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);

    const toolTier = user.dungCu?.cuoc || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.15;
    const rareBonus = TOOL_RARE_CHANCES[toolTier] || 0.05;

    const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'quang_dong', name: 'Quặng Đồng', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.4 + rareBonus) {
      itemsGained.push({ itemId: 'quang_sat', name: 'Quặng Sắt', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
    }

    if (toolTier >= 3 && Math.random() < 0.15 + rareBonus) {
      itemsGained.push({ itemId: 'huyen_thiet_thach', name: 'Huyền Thiết Thạch', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Câu cá (Tỷ lệ tăng nhẹ 15%)
   */
  public static async fish(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);
    const toolTier = user.dungCu?.canCau || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.15;

    const baseQty = Math.floor((Math.floor(Math.random() * 2) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'ca_chep_song', name: 'Cá Chép Sông', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.25) {
      itemsGained.push({ itemId: 'ruong_bac', name: 'Rương Bạc Thượng Cổ', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Hái thảo dược (Tỷ lệ tăng nhẹ 15%)
   */
  public static async gatherHerbs(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);
    const toolTier = user.dungCu?.gioThuoc || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.15;

    const itemsGained = [
      { itemId: 'la_thuoc_nam', name: 'Lá Thuốc Nam', qty: Math.max(1, Math.floor((Math.floor(Math.random() * 2) + 2) * multiplier)) },
    ];

    if (Math.random() < 0.3) {
      itemsGained.push({ itemId: 'cu_nhiem_sam', name: 'Củ Nhân Sâm Núi', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  public static async upgradeTool(
    userId: string,
    toolType: 'riu' | 'canCau' | 'cuoc' | 'gioThuoc'
  ): Promise<{ success: boolean; newTier: number; message: string }> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { success: false, newTier: 0, message: 'Không tìm thấy người dùng.' };

    const currentTier = user.dungCu?.[toolType] || 1;
    if (currentTier >= 5) {
      return { success: false, newTier: 5, message: '🌟 Dụng cụ đã đạt Cấp Bậc Thần Kim Tối Đa (Bậc 5)!' };
    }

    const targetTier = currentTier + 1;

    let costDong = 0;
    let costKimBao = 0;
    let requiredMats: { itemId: string; name: string; qty: number }[] = [];

    if (targetTier === 2) {
      costDong = 50000;
      requiredMats = [
        { itemId: 'go_tre_gai', name: 'Gỗ Tre', qty: 100 },
        { itemId: 'quang_dong', name: 'Quặng Đồng', qty: 50 },
      ];
    } else if (targetTier === 3) {
      costDong = 250000;
      requiredMats = [
        { itemId: 'go_lim_xanh', name: 'Gỗ Lim', qty: 200 },
        { itemId: 'quang_sat', name: 'Quặng Sắt', qty: 100 },
      ];
    } else if (targetTier === 4) {
      costDong = 1200000;
      requiredMats = [
        { itemId: 'go_tram_huong', name: 'Gỗ Trầm', qty: 500 },
        { itemId: 'huyen_thiet_thach', name: 'Huyền Thiết Thạch', qty: 250 },
      ];
    } else if (targetTier === 5) {
      costDong = 5000000;
      costKimBao = 10;
      requiredMats = [
        { itemId: 'go_co_thu', name: 'Gỗ Cổ Thụ', qty: 1000 },
        { itemId: 'than_kim_thach', name: 'Thần Kim', qty: 500 },
      ];
    }

    if (user.taiChinh.dong < costDong) {
      return { success: false, newTier: currentTier, message: `❌ Bạn cần **${costDong.toLocaleString('vi-VN')} Đồng** để nâng lên Bậc ${targetTier}!` };
    }
    if (costKimBao > 0 && user.taiChinh.kimBao < costKimBao) {
      return { success: false, newTier: currentTier, message: `❌ Bạn cần **${costKimBao} Kim Bảo** để nâng lên Bậc ${targetTier}!` };
    }

    for (const mat of requiredMats) {
      const itemInBag = user.tuiDo.find((i) => i.itemId === mat.itemId);
      if (!itemInBag || itemInBag.soLuong < mat.qty) {
        return {
          success: false,
          newTier: currentTier,
          message: `❌ Bạn thiếu nguyên liệu **${mat.name}** (Cần ${mat.qty}, đang có ${itemInBag?.soLuong || 0})!`,
        };
      }
    }

    await UserService.deductDongAtomic(userId, costDong);
    if (costKimBao > 0) {
      await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': -costKimBao } });
    }
    for (const mat of requiredMats) {
      await UserService.consumeItemAtomic(userId, mat.itemId, mat.qty);
    }

    await UserModelAdvanced.updateOne({ userId }, { $set: { [`dungCu.${toolType}`]: targetTier } });

    return {
      success: true,
      newTier: targetTier,
      message: `🎉 **NÂNG CẤP THÀNH CÔNG!** Dụng cụ đã đạt **Bậc ${targetTier} (${TOOL_NAMES[targetTier]})** (Hệ số sản lượng ×${TOOL_MULTIPLIERS[targetTier]}, +${TOOL_RARE_CHANCES[targetTier] * 100}% Rớt Đồ Hiếm)!`,
    };
  }
}
