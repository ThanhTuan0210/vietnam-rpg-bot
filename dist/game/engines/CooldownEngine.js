"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownEngine = void 0;
class CooldownEngine {
    /**
     * Kiểm tra xem lệnh có đang trong thời gian hồi chiêu (Cooldown) không
     * @returns object chứa trạng thái và chuỗi thông báo đếm ngược bằng tiếng Việt
     */
    static checkCooldown(user, commandKey, cooldownMs) {
        const lastUsed = user?.cooldowns?.get(commandKey) || 0;
        const now = Date.now();
        const elapsed = now - lastUsed;
        if (elapsed < cooldownMs) {
            const remainingMs = cooldownMs - elapsed;
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            let timeStr = '';
            if (hours > 0)
                timeStr += `${hours} giờ `;
            if (minutes > 0)
                timeStr += `${minutes} phút `;
            if (seconds > 0 || timeStr === '')
                timeStr += `${seconds} giây`;
            return {
                isReady: false,
                remainingSeconds,
                message: `⏰ **Thầy Phù Thủy nhắn:** Bạn cần nghỉ ngơi trút bớt ma khí! Hãy chờ **${timeStr.trim()}** nữa mới có thể tiếp tục hành động.`,
            };
        }
        return {
            isReady: true,
            remainingSeconds: 0,
            message: '',
        };
    }
}
exports.CooldownEngine = CooldownEngine;
