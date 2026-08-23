import { UserModelAdvanced } from '../../database/models/User.model';

export class KarmaService {
  /**
   * Cập nhật điểm Nghiệp Lực (+: Chính Đạo, -: Tà Đạo)
   */
  public static async updateKarma(userId: string, amount: number): Promise<void> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return;

    const newScore = (user.karma?.score || 0) + amount;
    let alignment: 'CHINH_DAO' | 'TA_DAO' | 'TRUNG_LAP' = 'TRUNG_LAP';

    if (newScore >= 50) alignment = 'CHINH_DAO';
    else if (newScore <= -50) alignment = 'TA_DAO';

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $set: {
          'karma.score': newScore,
          'karma.alignment': alignment,
        },
      }
    );
  }

  /**
   * Xử lý ngẫu nhiên Vệ Binh Làng chặn đánh nếu là Tà Đạo (10% cơ hội khi đi săn)
   */
  public static checkGuardIntercept(userAlignment: string): { intercepted: boolean; log: string } {
    if (userAlignment === 'TA_DAO' && Math.random() < 0.1) {
      return {
        intercepted: true,
        log: '👮 **VỆ BINH QUAN PHỦ CHẶN ĐÁNH!** Do bạn mang nghiệp lực **Tà Đạo**, Vệ Binh Quan Phủ đã xuất hiện truy nã!',
      };
    }
    return { intercepted: false, log: '' };
  }
}
