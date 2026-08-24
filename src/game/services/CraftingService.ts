import { UserModelAdvanced } from '../../database/models/User.model';
import { RECIPES } from '../data/recipes';
import { ITEMS } from '../data/items';
import { UserService } from './UserService';
import { MasteryService } from './MasteryService';
import { formatDong } from '../../utils/formatters';

export class CraftingService {
  /**
   * Bảng Ánh Xạ Tên Tiếng Anh & Tên Viết Cách (Aliases)
   */
  public static resolveItemId(input: string): string {
    const cleanInput = input.trim().toLowerCase().replace(/ +/g, '_');

    const aliases: Record<string, string> = {
      sword: 'sword_01a',
      shield: 'shield_01a',
      staff: 'staff_01a',
      bow: 'bow_01a',
      excalibur: 'sword_03e',
      potion: 'potion_01a',
      antidote: 'potion_02a',
      elixir: 'potion_03a',
    };

    return aliases[cleanInput] || cleanInput;
  }

  /**
   * Chế tạo vật phẩm theo công thức với kiểm tra Level Lock & Phẩm Chất Tuyệt Phẩm Albion (.1, .2, .3 Tiers)
   */
  public static async craftItem(
    userId: string,
    rawInput: string
  ): Promise<{ success: boolean; message: string; qualitySuffix?: string }> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) {
      return { success: false, message: '❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.' };
    }

    const targetItemId = this.resolveItemId(rawInput);

    const recipe = RECIPES.find((r) => r.resultItemId.toLowerCase() === targetItemId.toLowerCase());
    if (!recipe) {
      return { success: false, message: `❌ Công thức rèn \`${rawInput}\` không tồn tại! Gõ \`vkl craft\` để xem danh sách.` };
    }

    const resultItem = ITEMS[recipe.resultItemId];
    if (!resultItem) {
      return { success: false, message: '❌ Vật phẩm không hợp lệ!' };
    }

    // Check Level Lock
    if (user.canhGioi.capDo < recipe.requiredLevel) {
      return {
        success: false,
        message: `🔒 **Level chưa đủ!** Bạn cần **Level ${recipe.requiredLevel}** để chế tạo ${resultItem.icon} **${resultItem.name}**. (Cấp hiện tại: Lv ${user.canhGioi.capDo})`,
      };
    }

    // Check Materials
    const inventory = user.inventory || [];
    for (const mat of recipe.materials) {
      const userItem = inventory.find((i) => i.itemId.toLowerCase() === mat.itemId.toLowerCase());
      const hasQty = userItem?.quantity || userItem?.soLuong || 0;
      if (hasQty < mat.quantity) {
        const matDef = ITEMS[mat.itemId] || { name: mat.itemId, icon: '📦' };
        return {
          success: false,
          message: `❌ Bạn thiếu nguyên liệu ${matDef.icon} **${matDef.name}**! (Cần \`${mat.quantity}\`, hiện có \`${hasQty}\`)`,
        };
      }
    }

    // Check Gold
    if (user.taiChinh.dong < recipe.dongCost) {
      return {
        success: false,
        message: `❌ Bạn không đủ Tiền Vàng! Chi phí rèn là **${formatDong(recipe.dongCost)}** (Hiện có: ${formatDong(user.taiChinh.dong)}).`,
      };
    }

    // Deduct Materials & Gold
    user.taiChinh.dong -= recipe.dongCost;
    for (const mat of recipe.materials) {
      await UserService.consumeItemAtomic(userId, mat.itemId, mat.quantity);
    }

    // Roll Albion Quality Tier (.0, .1, .2, .3) based on Blacksmith Mastery Level
    const blacksmithLevel = (user as any).producerMastery?.blacksmith?.level || 1;
    const quality = MasteryService.rollQualityTier(blacksmithLevel);

    // Add Result Item
    await UserService.addItemAtomic(userId, recipe.resultItemId, recipe.resultQty);

    // Award Blacksmith Mastery EXP (+30 EXP)
    const masteryRes = await MasteryService.addMasteryExp(userId, 'blacksmith', 30);
    const levelUpStr = masteryRes.levelUp ? `\n🎉 **THĂNG CẤP THÔNG THẠO!** Blacksmith của bạn đã đạt **Level ${masteryRes.newLevel}**!` : '';

    return {
      success: true,
      qualitySuffix: quality.suffix,
      message: `🎉 **Rèn thành công ${recipe.resultQty}x ${resultItem.icon} ${resultItem.name}**${quality.suffix}!${levelUpStr}`,
    };
  }
}
