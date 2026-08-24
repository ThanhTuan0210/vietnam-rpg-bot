"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RebirthEngine = void 0;
const User_model_1 = require("../../database/models/User.model");
class RebirthEngine {
    /**
     * Kiểm tra xem người chơi có đủ điều kiện Trùng Sinh không
     * Điều kiện: Cấp độ >= 100 và Vùng đất >= 10
     */
    static canRebirth(user) {
        if (user.canhGioi.capDo < 100 || user.canhGioi.khuVuc < 10) {
            return {
                eligible: false,
                message: `❌ **Chưa đủ điều kiện Trùng Sinh!** Bạn cần đạt **Level 100** và chinh phục đến **Vùng 10** (Hiện tại: Level ${user.canhGioi.capDo}, Vùng ${user.canhGioi.khuVuc}).`,
            };
        }
        return { eligible: true, message: '✅ Bạn đã đủ điều kiện Trùng Sinh Luân Hồi!' };
    }
    /**
     * Thực hiện Luân Hồi / Trùng Sinh
     */
    static async executeRebirth(userId) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return false;
        const check = this.canRebirth(user);
        if (!check.eligible)
            return false;
        const newRebirthCount = user.soLanTrungSinh + 1;
        const addedPoints = 10; // Mỗi lần Trùng sinh được 10 Điểm Cân Cốt
        await User_model_1.UserModelAdvanced.updateOne({ userId }, {
            $set: {
                'canhGioi.capDo': 1,
                'canhGioi.kinhNghiem': 0,
                'canhGioi.khuVuc': 1,
                'chiSo.hp': 100,
                'chiSo.mp': 50,
                'trangBi.vuKhi': { itemId: 'sword_01a', capCuongHoa: 0, bonusStat: 0 },
                'trangBi.aoGiap': { itemId: 'shield_01a', capCuongHoa: 0, bonusStat: 0 },
            },
            $inc: {
                soLanTrungSinh: 1,
                diemCanCot: addedPoints,
            },
        });
        return true;
    }
    /**
     * Nâng điểm Tiềm Năng Cân Cốt
     */
    static async upgradePotential(userId, statType) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return { success: false, message: 'Không tìm thấy người dùng.' };
        if (user.diemCanCot <= 0) {
            return { success: false, message: '❌ Bạn không có **Điểm Cân Cốt** để nâng cấp! Hãy Trùng Sinh để nhận điểm.' };
        }
        const updates = { $inc: { diemCanCot: -1 } };
        if (statType === 'tocDoThuHoach') {
            updates.$inc['diemTiemNang.tocDoThuHoach'] = 5; // +5%
        }
        else if (statType === 'giamCooldown') {
            updates.$inc['diemTiemNang.giamCooldown'] = 2; // -2%
        }
        else if (statType === 'tyLeDropHiem') {
            updates.$inc['diemTiemNang.tyLeDropHiem'] = 3; // +3%
        }
        else if (statType === 'heSoExp') {
            updates.$inc['diemTiemNang.heSoExp'] = 0.5; // +0.5x
        }
        await User_model_1.UserModelAdvanced.updateOne({ userId }, updates);
        return {
            success: true,
            message: `🎉 **NÂNG CẤP THÀNH CÔNG!** Đã cộng điểm tiềm năng cho thuộc tính **${statType}**!`,
        };
    }
}
exports.RebirthEngine = RebirthEngine;
