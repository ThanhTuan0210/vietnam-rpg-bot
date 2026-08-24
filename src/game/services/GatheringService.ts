import { UserService } from './UserService';
import { getItemIcon, ITEMS } from '../data/items';
import { MasteryService } from './MasteryService';

export const TOOL_NAMES: Record<number, string> = {
  1: 'Gỗ Sơ Cấp',
  2: 'Sắt Rèn Trung Cổ',
  3: 'Huyền Thiết Gothic',
  4: 'Tinh Thạch Thượng Cổ',
  5: 'Bảo Kiếm Excalibur Tier',
};

export const TOOL_MULTIPLIERS: Record<number, number> = {
  1: 1.2,
  2: 1.8,
  3: 2.5,
  4: 3.8,
  5: 5.0,
};

export const TOOL_RARE_CHANCES: Record<number, number> = {
  1: 0.08,
  2: 0.15,
  3: 0.25,
  4: 0.4,
  5: 0.6,
};

export class GatheringService {
  /**
   * Đốn củi / Chặt gỗ Medieval Dark Fantasy (Rớt wood_01a, wood_01b, wood_02a)
   */
  public static async woodcut(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);

    const toolTier = user.dungCu?.riu || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.2;
    const rareBonus = TOOL_RARE_CHANCES[toolTier] || 0.08;

    const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'wood_01a', name: ITEMS['wood_01a']?.name || 'Gỗ Sồi Cổ Trung Cổ', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.4 + rareBonus) {
      itemsGained.push({ itemId: 'wood_01b', name: ITEMS['wood_01b']?.name || 'Gỗ Thông Gothic', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
    }

    if (toolTier >= 3 && Math.random() < 0.2 + rareBonus) {
      itemsGained.push({ itemId: 'wood_02a', name: ITEMS['wood_02a']?.name || 'Gỗ Sắt Cổ Thần', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Khai mỏ / Đào khoáng Medieval Dark Fantasy (Rớt ingot_01a, ingot_01b, crystal_01a, gem_01a)
   */
  public static async mine(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);

    const toolTier = user.dungCu?.cuoc || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.2;
    const rareBonus = TOOL_RARE_CHANCES[toolTier] || 0.08;

    const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'ingot_01a', name: ITEMS['ingot_01a']?.name || 'Thỏi Đồng Cổ', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.4 + rareBonus) {
      itemsGained.push({ itemId: 'ingot_01b', name: ITEMS['ingot_01b']?.name || 'Thỏi Sắt Trung Cổ', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
    }

    if (Math.random() < 0.25 + rareBonus) {
      itemsGained.push({ itemId: 'crystal_01a', name: ITEMS['crystal_01a']?.name || 'Tinh Thạch Thượng Cổ', qty: 1 });
    }

    if (toolTier >= 3 && Math.random() < 0.15 + rareBonus) {
      itemsGained.push({ itemId: 'gem_01a', name: ITEMS['gem_01a']?.name || 'Hồng Ngọc Vua Gothic', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    // Cộng EXP Thông Thạo Thợ Mỏ Destiny Board
    await MasteryService.addMasteryExp(userId, 'miner', 25);

    return { itemsGained };
  }

  /**
   * Câu cá Biển Sâu Gothic (Rớt potion_01a, potion_02a, crystal_01b)
   */
  public static async fish(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);
    const toolTier = user.dungCu?.canCau || 1;
    const multiplier = TOOL_MULTIPLIERS[toolTier] || 1.2;

    const baseQty = Math.floor((Math.floor(Math.random() * 2) + 1) * multiplier);

    const itemsGained = [
      { itemId: 'potion_01a', name: ITEMS['potion_01a']?.name || 'Thuốc Hồi Máu HP', qty: Math.max(1, baseQty) },
    ];

    if (Math.random() < 0.35) {
      itemsGained.push({ itemId: 'potion_02a', name: ITEMS['potion_02a']?.name || 'Thuốc Hồi Mana MP', qty: 1 });
    }

    if (Math.random() < 0.15) {
      itemsGained.push({ itemId: 'crystal_01b', name: ITEMS['crystal_01b']?.name || 'Tinh Thạch Biển Sâu', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Hái thảo dược Ma Pháp Gothic (Rớt potion_01a, potion_03a)
   */
  public static async gatherHerbs(userId: string): Promise<{ itemsGained: { itemId: string; name: string; qty: number }[] }> {
    const user = await UserService.getOrCreateUser(userId);

    const itemsGained = [
      { itemId: 'potion_01a', name: ITEMS['potion_01a']?.name || 'Cỏ Thảo Dược HP', qty: 2 },
    ];

    if (Math.random() < 0.3) {
      itemsGained.push({ itemId: 'potion_03a', name: ITEMS['potion_03a']?.name || 'Dược Thảo Ma Pháp MP', qty: 1 });
    }

    for (const item of itemsGained) {
      await UserService.addItemAtomic(userId, item.itemId, item.qty);
    }

    return { itemsGained };
  }

  /**
   * Nâng cấp dụng cụ (Tool Upgrade)
   */
  public static async upgradeTool(
    userId: string,
    toolType: 'cuoc' | 'riu' | 'canCau' | 'gioThuoc'
  ): Promise<{ success: boolean; newTier: number; message: string }> {
    const user = await UserService.getOrCreateUser(userId);
    if (!user.dungCu) user.dungCu = { cuoc: 1, riu: 1, canCau: 1, gioThuoc: 1 };
    const currentTier = (user.dungCu as any)[toolType] || 1;
    const newTier = currentTier + 1;
    (user.dungCu as any)[toolType] = newTier;
    await user.save();
    return {
      success: true,
      newTier,
      message: `🎉 Nâng cấp Dụng Cụ **${toolType.toUpperCase()}** thành công lên Tier ${newTier}!`,
    };
  }
}
