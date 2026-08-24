"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatheringService = exports.TOOL_RARE_CHANCES = exports.TOOL_MULTIPLIERS = exports.TOOL_NAMES = void 0;
const UserService_1 = require("./UserService");
const items_1 = require("../data/items");
exports.TOOL_NAMES = {
    1: 'Gỗ Sơ Cấp',
    2: 'Sắt Rèn Trung Cổ',
    3: 'Huyền Thiết Gothic',
    4: 'Tinh Thạch Thượng Cổ',
    5: 'Bảo Kiếm Excalibur Tier',
};
exports.TOOL_MULTIPLIERS = {
    1: 1.2,
    2: 1.8,
    3: 2.5,
    4: 3.8,
    5: 5.0,
};
exports.TOOL_RARE_CHANCES = {
    1: 0.08,
    2: 0.15,
    3: 0.25,
    4: 0.4,
    5: 0.6,
};
class GatheringService {
    /**
     * Đốn củi / Chặt gỗ Medieval Dark Fantasy (Rớt wood_01a, wood_01b, wood_02a)
     */
    static async woodcut(userId) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const toolTier = user.dungCu?.riu || 1;
        const multiplier = exports.TOOL_MULTIPLIERS[toolTier] || 1.2;
        const rareBonus = exports.TOOL_RARE_CHANCES[toolTier] || 0.08;
        const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);
        const itemsGained = [
            { itemId: 'wood_01a', name: items_1.ITEMS['wood_01a']?.name || 'Gỗ Sồi Cổ Trung Cổ', qty: Math.max(1, baseQty) },
        ];
        if (Math.random() < 0.4 + rareBonus) {
            itemsGained.push({ itemId: 'wood_01b', name: items_1.ITEMS['wood_01b']?.name || 'Gỗ Thông Gothic', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
        }
        if (toolTier >= 3 && Math.random() < 0.2 + rareBonus) {
            itemsGained.push({ itemId: 'wood_02a', name: items_1.ITEMS['wood_02a']?.name || 'Gỗ Sắt Cổ Thần', qty: 1 });
        }
        for (const item of itemsGained) {
            await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
        }
        return { itemsGained };
    }
    /**
     * Khai mỏ / Đào khoáng Medieval Dark Fantasy (Rớt ingot_01a, ingot_01b, crystal_01a, gem_01a)
     */
    static async mine(userId) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const toolTier = user.dungCu?.cuoc || 1;
        const multiplier = exports.TOOL_MULTIPLIERS[toolTier] || 1.2;
        const rareBonus = exports.TOOL_RARE_CHANCES[toolTier] || 0.08;
        const baseQty = Math.floor((Math.floor(Math.random() * 3) + 1) * multiplier);
        const itemsGained = [
            { itemId: 'ingot_01a', name: items_1.ITEMS['ingot_01a']?.name || 'Thỏi Đồng Cổ', qty: Math.max(1, baseQty) },
        ];
        if (Math.random() < 0.4 + rareBonus) {
            itemsGained.push({ itemId: 'ingot_01b', name: items_1.ITEMS['ingot_01b']?.name || 'Thỏi Sắt Trung Cổ', qty: Math.max(1, Math.floor(1.5 * multiplier)) });
        }
        if (Math.random() < 0.25 + rareBonus) {
            itemsGained.push({ itemId: 'crystal_01a', name: items_1.ITEMS['crystal_01a']?.name || 'Tinh Thạch Thượng Cổ', qty: 1 });
        }
        if (toolTier >= 3 && Math.random() < 0.15 + rareBonus) {
            itemsGained.push({ itemId: 'gem_01a', name: items_1.ITEMS['gem_01a']?.name || 'Hồng Ngọc Vua Gothic', qty: 1 });
        }
        for (const item of itemsGained) {
            await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
        }
        return { itemsGained };
    }
    /**
     * Câu cá Biển Sâu Gothic (Rớt potion_01a, potion_02a, crystal_01b)
     */
    static async fish(userId) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const toolTier = user.dungCu?.canCau || 1;
        const multiplier = exports.TOOL_MULTIPLIERS[toolTier] || 1.2;
        const baseQty = Math.floor((Math.floor(Math.random() * 2) + 1) * multiplier);
        const itemsGained = [
            { itemId: 'potion_01a', name: items_1.ITEMS['potion_01a']?.name || 'Thuốc Hồi Máu HP', qty: Math.max(1, baseQty) },
        ];
        if (Math.random() < 0.35) {
            itemsGained.push({ itemId: 'potion_02a', name: items_1.ITEMS['potion_02a']?.name || 'Thuốc Hồi Mana MP', qty: 1 });
        }
        if (Math.random() < 0.15) {
            itemsGained.push({ itemId: 'crystal_01b', name: items_1.ITEMS['crystal_01b']?.name || 'Tinh Thạch Biển Sâu', qty: 1 });
        }
        for (const item of itemsGained) {
            await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
        }
        return { itemsGained };
    }
    /**
     * Hái thảo dược Ma Pháp Gothic (Rớt potion_01a, potion_03a)
     */
    static async gatherHerbs(userId) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        const itemsGained = [
            { itemId: 'potion_01a', name: items_1.ITEMS['potion_01a']?.name || 'Cỏ Thảo Dược HP', qty: 2 },
        ];
        if (Math.random() < 0.3) {
            itemsGained.push({ itemId: 'potion_03a', name: items_1.ITEMS['potion_03a']?.name || 'Dược Thảo Ma Pháp MP', qty: 1 });
        }
        for (const item of itemsGained) {
            await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
        }
        return { itemsGained };
    }
    /**
     * Nâng cấp dụng cụ (Tool Upgrade)
     */
    static async upgradeTool(userId, toolType) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        if (!user.dungCu)
            user.dungCu = { cuoc: 1, riu: 1, canCau: 1, gioThuoc: 1 };
        const currentTier = user.dungCu[toolType] || 1;
        const newTier = currentTier + 1;
        user.dungCu[toolType] = newTier;
        await user.save();
        return {
            success: true,
            newTier,
            message: `🎉 Nâng cấp Dụng Cụ **${toolType.toUpperCase()}** thành công lên Tier ${newTier}!`,
        };
    }
}
exports.GatheringService = GatheringService;
