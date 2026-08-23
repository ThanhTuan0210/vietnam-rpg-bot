"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarmaService = void 0;
const User_model_1 = require("../../database/models/User.model");
class KarmaService {
    /**
     * Cập nhật điểm Nghiệp Lực (+: Chính Đạo, -: Tà Đạo)
     */
    static async updateKarma(userId, amount) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return;
        const newScore = (user.karma?.score || 0) + amount;
        let alignment = 'TRUNG_LAP';
        if (newScore >= 50)
            alignment = 'CHINH_DAO';
        else if (newScore <= -50)
            alignment = 'TA_DAO';
        await User_model_1.UserModelAdvanced.updateOne({ userId }, {
            $set: {
                'karma.score': newScore,
                'karma.alignment': alignment,
            },
        });
    }
    /**
     * Xử lý ngẫu nhiên Vệ Binh Làng chặn đánh nếu là Tà Đạo (10% cơ hội khi đi săn)
     */
    static checkGuardIntercept(userAlignment) {
        if (userAlignment === 'TA_DAO' && Math.random() < 0.1) {
            return {
                intercepted: true,
                log: '👮 **VỆ BINH QUAN PHỦ CHẶN ĐÁNH!** Do bạn mang nghiệp lực **Tà Đạo**, Vệ Binh Quan Phủ đã xuất hiện truy nã!',
            };
        }
        return { intercepted: false, log: '' };
    }
}
exports.KarmaService = KarmaService;
