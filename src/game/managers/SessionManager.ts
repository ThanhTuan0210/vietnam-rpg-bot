/**
 * SessionManager: Quản lý khóa phiên chơi (Session Lock) chống race condition và spam click.
 * Mỗi userId chỉ có thể mở 1 bàn cược / 1 trận đấu RPG tại một thời điểm.
 */
export class SessionManager {
  private static instance: SessionManager;
  private activeSessions: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Khóa phiên chơi của người dùng.
   * @returns true nếu khóa thành công, false nếu người dùng đã có phiên đang chạy.
   */
  public lock(userId: string): boolean {
    if (this.activeSessions.has(userId)) {
      return false;
    }
    this.activeSessions.add(userId);
    return true;
  }

  /**
   * Giải phóng phiên chơi của người dùng.
   */
  public unlock(userId: string): void {
    this.activeSessions.delete(userId);
  }

  /**
   * Kiểm tra xem người dùng có đang trong phiên chơi hay không.
   */
  public isLocked(userId: string): boolean {
    return this.activeSessions.has(userId);
  }
}
