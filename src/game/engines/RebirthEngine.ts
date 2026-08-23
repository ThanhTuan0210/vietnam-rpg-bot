import { UserModelAdvanced, IUserAdvanced } from '../../database/models/User.model';

export class RebirthEngine {
  /**
   * Kiểm tra xem người chơi có đủ điều kiện Trùng Sinh không
   * Điều kiện: Cấp độ >= 100 và Vùng đất >= 10
   */
  public static canRebirth(user: IUserAdvanced): { eligible: boolean; message: string } {
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
  public static async executeRebirth(userId: string): Promise<boolean> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return false;

    const check = this.canRebirth(user);
    if (!check.eligible) return false;

    const newRebirthCount = user.soLanTrungSinh + 1;
    const addedPoints = 10; // Mỗi lần Trùng sinh được 10 Điểm Cân Cốt

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $set: {
          'canhGioi.capDo': 1,
          'canhGioi.kinhNghiem': 0,
          'canhGioi.khuVuc': 1,
          'chiSo.hp': 100,
          'chiSo.mp': 50,
          'trangBi.vuKhi': { itemId: 'gay_tam_vong', capCuongHoa: 0, bonusStat: 0 },
          'trangBi.aoGiap': { itemId: 'ao_vai_tho', capCuongHoa: 0, bonusStat: 0 },
        },
        $inc: {
          soLanTrungSinh: 1,
          diemCanCot: addedPoints,
        },
      }
    );

    return true;
  }

  /**
   * Nâng điểm Tiềm Năng Cân Cốt
   */
  public static async upgradePotential(
    userId: string,
    statType: 'tocDoThuHoach' | 'giamCooldown' | 'tyLeDropHiem' | 'heSoExp'
  ): Promise<{ success: boolean; message: string }> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { success: false, message: 'Không tìm thấy người dùng.' };

    if (user.diemCanCot <= 0) {
      return { success: false, message: '❌ Bạn không có **Điểm Cân Cốt** để nâng cấp! Hãy Trùng Sinh để nhận điểm.' };
    }

    const updates: any = { $inc: { diemCanCot: -1 } };

    if (statType === 'tocDoThuHoach') {
      updates.$inc['diemTiemNang.tocDoThuHoach'] = 5; // +5%
    } else if (statType === 'giamCooldown') {
      updates.$inc['diemTiemNang.giamCooldown'] = 2;  // -2%
    } else if (statType === 'tyLeDropHiem') {
      updates.$inc['diemTiemNang.tyLeDropHiem'] = 3;  // +3%
    } else if (statType === 'heSoExp') {
      updates.$inc['diemTiemNang.heSoExp'] = 0.5;    // +0.5x
    }

    await UserModelAdvanced.updateOne({ userId }, updates);

    return {
      success: true,
      message: `🎉 **NÂNG CẤP THÀNH CÔNG!** Đã cộng điểm tiềm năng cho thuộc tính **${statType}**!`,
    };
  }
}
