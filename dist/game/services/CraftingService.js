"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftingService = void 0;
const User_model_1 = require("../../database/models/User.model");
const recipes_1 = require("../data/recipes");
const items_1 = require("../data/items");
const UserService_1 = require("./UserService");
const MasteryService_1 = require("./MasteryService");
const formatters_1 = require("../../utils/formatters");
class CraftingService {
    /**
     * Bảng Ánh Xạ Tên Tiếng Anh & Tên Viết Cách (Aliases)
     */
    static resolveItemId(input) {
        const cleanInput = input.trim().toLowerCase().replace(/ +/g, '_');
        const aliases = {
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
    static async craftItem(userId, rawInput) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user) {
            return { success: false, message: '❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.' };
        }
        const targetItemId = this.resolveItemId(rawInput);
        const recipe = recipes_1.RECIPES.find((r) => r.resultItemId.toLowerCase() === targetItemId.toLowerCase());
        if (!recipe) {
            return { success: false, message: `❌ Công thức rèn \`${rawInput}\` không tồn tại! Gõ \`vkl craft\` để xem danh sách.` };
        }
        const resultItem = items_1.ITEMS[recipe.resultItemId];
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
                const matDef = items_1.ITEMS[mat.itemId] || { name: mat.itemId, icon: '📦' };
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
                message: `❌ Bạn không đủ Tiền Vàng! Chi phí rèn là **${(0, formatters_1.formatDong)(recipe.dongCost)}** (Hiện có: ${(0, formatters_1.formatDong)(user.taiChinh.dong)}).`,
            };
        }
        // Deduct Materials & Gold
        user.taiChinh.dong -= recipe.dongCost;
        for (const mat of recipe.materials) {
            await UserService_1.UserService.consumeItemAtomic(userId, mat.itemId, mat.quantity);
        }
        // Roll Albion Quality Tier (.0, .1, .2, .3) based on Blacksmith Mastery Level
        const blacksmithLevel = user.producerMastery?.blacksmith?.level || 1;
        const quality = MasteryService_1.MasteryService.rollQualityTier(blacksmithLevel);
        // Add Result Item
        await UserService_1.UserService.addItemAtomic(userId, recipe.resultItemId, recipe.resultQty);
        // Award Blacksmith Mastery EXP (+30 EXP)
        const masteryRes = await MasteryService_1.MasteryService.addMasteryExp(userId, 'blacksmith', 30);
        const levelUpStr = masteryRes.levelUp ? `\n🎉 **THĂNG CẤP THÔNG THẠO!** Blacksmith của bạn đã đạt **Level ${masteryRes.newLevel}**!` : '';
        return {
            success: true,
            qualitySuffix: quality.suffix,
            message: `🎉 **Rèn thành công ${recipe.resultQty}x ${resultItem.icon} ${resultItem.name}**${quality.suffix}!${levelUpStr}`,
        };
    }
}
exports.CraftingService = CraftingService;
