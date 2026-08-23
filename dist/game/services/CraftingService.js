"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftingService = void 0;
const User_model_1 = require("../../database/models/User.model");
const recipes_1 = require("../data/recipes");
const items_1 = require("../data/items");
const UserService_1 = require("./UserService");
const formatters_1 = require("../../utils/formatters");
class CraftingService {
    /**
     * Bảng Ánh Xạ Tên Tiếng Anh & Tên Viết Cách (Aliases)
     */
    static resolveItemId(input) {
        const cleanInput = input.trim().toLowerCase().replace(/ +/g, '_');
        const aliases = {
            // Level 1
            wooden_sword: 'dao_tre_gai',
            fish_armor: 'ao_la_chuoi',
            // Level 3
            fish_sword: 'giao_tre_gai',
            wolf_armor: 'ao_toi_la',
            // Level 5
            apple_sword: 'chuy_go_nhan',
            eye_armor: 'giap_tre_boc_mung',
            // Level 10
            zombie_sword: 'dao_mac_dong',
            banana_armor: 'giap_dong_co_loa',
            // Level 15
            spear_bronze: 'giao_dong_co_loa',
            shield_bronze: 'khien_dong_chim_lac',
            // Level 20
            ruby_sword: 'kiem_sat_ba_vi',
            epic_armor: 'giap_sat_trao_phong',
        };
        return aliases[cleanInput] || cleanInput;
    }
    /**
     * Chế tạo vật phẩm theo công thức với kiểm tra Level Lock chi tiết
     */
    static async craftItem(userId, rawInput) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user) {
            return { success: false, message: '❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn start`.' };
        }
        const targetItemId = this.resolveItemId(rawInput);
        const recipe = recipes_1.RECIPES.find((r) => r.resultItemId === targetItemId);
        if (!recipe) {
            return { success: false, message: `❌ Công thức chế tạo \`${rawInput}\` không tồn tại! Gõ \`vn craft\` để xem danh sách.` };
        }
        const resultItem = items_1.ITEMS[recipe.resultItemId];
        if (!resultItem) {
            return { success: false, message: '❌ Vật phẩm không hợp lệ!' };
        }
        // 1. Kiểm tra Level Lock chi tiết
        if (user.canhGioi.capDo < recipe.requiredLevel) {
            return {
                success: false,
                message: `🔒 **CHƯA ĐỦ CẤP ĐỘ CHẾ TẠO!** Bạn cần đạt **Level ${recipe.requiredLevel}** mới mở khóa công thức chế tạo **${resultItem.name}** (Hiện tại: Level ${user.canhGioi.capDo}).`,
            };
        }
        // 2. Kiểm tra Phí Tiền Đồng
        if (user.taiChinh.dong < recipe.dongCost) {
            return {
                success: false,
                message: `❌ Bạn không đủ **${(0, formatters_1.formatDong)(recipe.dongCost)}** phí lò rèn!`,
            };
        }
        // 3. Kiểm tra Nguyên liệu trong Túi Đồ
        for (const mat of recipe.materials) {
            const userItem = user.tuiDo.find((i) => i.itemId === mat.itemId);
            const matDef = items_1.ITEMS[mat.itemId] || { name: mat.itemId };
            if (!userItem || userItem.soLuong < mat.quantity) {
                return {
                    success: false,
                    message: `❌ Bạn thiếu nguyên liệu **${matDef.name}** (Cần ${mat.quantity}, đang có ${userItem?.soLuong || 0}).`,
                };
            }
        }
        // 4. Khấu trừ Nguyên Liệu & Tiền Đồng
        await UserService_1.UserService.deductDongAtomic(userId, recipe.dongCost);
        for (const mat of recipe.materials) {
            await UserService_1.UserService.consumeItemAtomic(userId, mat.itemId, mat.quantity);
        }
        // 5. Nhận Vật Phẩm
        await UserService_1.UserService.addItemAtomic(userId, recipe.resultItemId, recipe.resultQty);
        return {
            success: true,
            message: `🔨 **CHẾ TẠO THÀNH CÔNG!** Bạn đã đúc thành công ${resultItem.icon} **${resultItem.name} x${recipe.resultQty}** với phí ${(0, formatters_1.formatDong)(recipe.dongCost)}!`,
        };
    }
}
exports.CraftingService = CraftingService;
