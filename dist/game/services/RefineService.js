"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefineService = exports.RANDOM_ENCHANT_TIERS = void 0;
const UserService_1 = require("./UserService");
exports.RANDOM_ENCHANT_TIERS = [
    { name: 'Phẩm Cốt', icon: '⚪', percent: 5, chance: 0.40 }, // 40% cơ hội +5%
    { name: 'Phẩm Linh', icon: '🟢', percent: 15, chance: 0.30 }, // 30% cơ hội +15%
    { name: 'Phẩm Huyền', icon: '🟦', percent: 25, chance: 0.18 }, // 18% cơ hội +25%
    { name: 'Phẩm Địa', icon: '🟪', percent: 50, chance: 0.09 }, // 9% cơ hội +50%
    { name: 'Phẩm Thiên Thần Thoại', icon: '👑', percent: 75, chance: 0.03 }, // 3% cơ hội +75%
];
class RefineService {
    /**
     * Cường hóa ngẫu nhiên trang bị (vkl enchant)
     */
    static async randomEnchantGear(userId, slotType, cost = 5000) {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        if (user.taiChinh.dong < cost) {
            return { success: false, oldPercent: 0, tier: exports.RANDOM_ENCHANT_TIERS[0], message: 'Không đủ Tiền Vàng!' };
        }
        user.taiChinh.dong -= cost;
        if (!user.trangBi)
            user.trangBi = { vuKhi: { itemId: 'sword_01a', capCuongHoa: 0 }, aoGiap: { itemId: 'shield_01a', capCuongHoa: 0 } };
        if (!user.trangBi[slotType])
            user.trangBi[slotType] = { itemId: 'sword_01a', capCuongHoa: 0, bonusStat: 0 };
        const oldPercent = user.trangBi[slotType].bonusStat || 0;
        // Roll random tier
        const rand = Math.random();
        let accumulated = 0;
        let selectedTier = exports.RANDOM_ENCHANT_TIERS[0];
        for (const t of exports.RANDOM_ENCHANT_TIERS) {
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
    static async randomEnchantEquipment(userId, slotType) {
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
exports.RefineService = RefineService;
