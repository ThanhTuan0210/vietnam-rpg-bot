"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
/**
 * SessionManager: Quản lý khóa phiên chơi (Session Lock) chống race condition và spam click.
 * Mỗi userId chỉ có thể mở 1 bàn cược / 1 trận đấu RPG tại một thời điểm.
 */
class SessionManager {
    static instance;
    activeSessions = new Set();
    constructor() { }
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    /**
     * Khóa phiên chơi của người dùng.
     * @returns true nếu khóa thành công, false nếu người dùng đã có phiên đang chạy.
     */
    lock(userId) {
        if (this.activeSessions.has(userId)) {
            return false;
        }
        this.activeSessions.add(userId);
        return true;
    }
    /**
     * Giải phóng phiên chơi của người dùng.
     */
    unlock(userId) {
        this.activeSessions.delete(userId);
    }
    /**
     * Kiểm tra xem người dùng có đang trong phiên chơi hay không.
     */
    isLocked(userId) {
        return this.activeSessions.has(userId);
    }
}
exports.SessionManager = SessionManager;
