"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefineService = exports.RANDOM_ENCHANT_TIERS = void 0;
const User_model_1 = require("../../database/models/User.model");
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
     * Thực hiện Cường hóa Ngẫu nhiên chỉ số (+5%, +15%, +25%, +50%, +75%)
     */
    static async randomEnchantEquipment(userId, slotType) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
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
        const paid = await UserService_1.UserService.deductDongAtomic(userId, cost);
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
        let selectedTier = exports.RANDOM_ENCHANT_TIERS[0];
        for (const tier of exports.RANDOM_ENCHANT_TIERS) {
            accumulated += tier.chance;
            if (rand <= accumulated) {
                selectedTier = tier;
                break;
            }
        }
        // Cập nhật CSDL
        await User_model_1.UserModelAdvanced.updateOne({ userId }, {
            $set: {
                [`trangBi.${slotType}.capCuongHoa`]: selectedTier.percent, // Lưu phần trăm
                [`trangBi.${slotType}.bonusStat`]: selectedTier.percent,
            },
        });
        const statTypeStr = slotType === 'vuKhi' ? 'Sát Thương (ATK)' : 'Sinh Lực (HP)';
        return {
            success: true,
            tierName: selectedTier.name,
            tierIcon: selectedTier.icon,
            percentBonus: selectedTier.percent,
            message: `🎉 **CƯỜNG HÓA THÀNH CÔNG!**\n` +
                `Trang bị đã nhận linh khí ${selectedTier.icon} **${selectedTier.name}**!\n` +
                `🔥 Tăng thêm **+${selectedTier.percent}% ${statTypeStr}** cho nhân vật!`,
        };
    }
}
exports.RefineService = RefineService;
