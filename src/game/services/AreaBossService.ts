import { UserModelAdvanced } from '../../database/models/User.model';

export interface AreaBossInfo {
  area: number;
  name: string;
  icon: string;
  requiredMerit: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  skillName: string;
  rewardExp: number;
  rewardDong: number;
  rewardKimBao: number;
}

export const AREA_BOSSES: Record<number, AreaBossInfo> = {
  1: {
    area: 1,
    name: 'Mộc Tinh Sơn Lâm (Trùm Vùng 1)',
    icon: '🌳',
    requiredMerit: 5,
    hp: 800,
    maxHp: 800,
    atk: 90,
    def: 25,
    skillName: 'Rễ Cây Trói Hồn',
    rewardExp: 500,
    rewardDong: 20000,
    rewardKimBao: 2,
  },
  2: {
    area: 2,
    name: 'Bạch Xà Tinh Đầm Lầy (Trùm Vùng 2)',
    icon: '🐍',
    requiredMerit: 10,
    hp: 2500,
    maxHp: 2500,
    atk: 220,
    def: 60,
    skillName: 'Độc Sương Tàn Phế',
    rewardExp: 1500,
    rewardDong: 80000,
    rewardKimBao: 5,
  },
  3: {
    area: 3,
    name: 'Hắc Long Vương U Minh (Trùm Vùng 3)',
    icon: '🐉',
    requiredMerit: 20,
    hp: 8000,
    maxHp: 8000,
    atk: 550,
    def: 150,
    skillName: 'Long Nộ Diệt Vong',
    rewardExp: 5000,
    rewardDong: 250000,
    rewardKimBao: 10,
  },
  4: {
    area: 4,
    name: 'Quỷ Vương Phong Ấn (Trùm Vùng 4)',
    icon: '👹',
    requiredMerit: 30,
    hp: 20000,
    maxHp: 20000,
    atk: 1200,
    def: 300,
    skillName: 'Ma Khí Tội Lỗi',
    rewardExp: 12000,
    rewardDong: 600000,
    rewardKimBao: 15,
  },
  5: {
    area: 5,
    name: 'Cửu Vĩ Yêu Hồ Thần Cấp (Trùm Vùng 5)',
    icon: '🦊',
    requiredMerit: 50,
    hp: 50000,
    maxHp: 50000,
    atk: 2500,
    def: 600,
    skillName: 'Huyễn Mộng Đoạt Mạng',
    rewardExp: 30000,
    rewardDong: 1500000,
    rewardKimBao: 25,
  },
  6: {
    area: 6,
    name: 'Trâu Vàng Thần Cốc (Trùm Vùng 6)',
    icon: '🐂',
    requiredMerit: 75,
    hp: 120000,
    maxHp: 120000,
    atk: 5000,
    def: 1200,
    skillName: 'Kim Ngưu Chấn Đất',
    rewardExp: 75000,
    rewardDong: 3500000,
    rewardKimBao: 40,
  },
  7: {
    area: 7,
    name: 'Chim Lạc Thượng Cổ (Trùm Vùng 7)',
    icon: '🦅',
    requiredMerit: 100,
    hp: 280000,
    maxHp: 280000,
    atk: 9500,
    def: 2200,
    skillName: 'Đông Sơn Vũ Điệu',
    rewardExp: 180000,
    rewardDong: 8000000,
    rewardKimBao: 60,
  },
  8: {
    area: 8,
    name: 'Thần Ngư Hóa Long (Trùm Vùng 8)',
    icon: '🐉',
    requiredMerit: 150,
    hp: 650000,
    maxHp: 650000,
    atk: 18000,
    def: 4500,
    skillName: 'Hồng Thủy Sóng Thần',
    rewardExp: 450000,
    rewardDong: 18000000,
    rewardKimBao: 100,
  },
  9: {
    area: 9,
    name: 'Phượng Hoàng Lửa Tây Bắc (Trùm Vùng 9)',
    icon: '🔥',
    requiredMerit: 200,
    hp: 1500000,
    maxHp: 1500000,
    atk: 35000,
    def: 9000,
    skillName: 'Xích Hỏa Tái Sinh',
    rewardExp: 1000000,
    rewardDong: 40000000,
    rewardKimBao: 150,
  },
};

export class AreaBossService {
  /**
   * Đổi Tiền Đồng lấy Điểm Công Đức (100,000 Đồng = 1 Điểm Công Đức)
   */
  public static async buyMeritPoints(
    userId: string,
    amount: number
  ): Promise<{ success: boolean; message: string }> {
    if (amount <= 0) return { success: false, message: 'Số lượng không hợp lệ.' };

    const costPerPoint = 100000;
    const totalCost = amount * costPerPoint;

    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { success: false, message: 'Không tìm thấy dữ liệu người chơi.' };

    if (user.taiChinh.dong < totalCost) {
      return {
        success: false,
        message: `❌ Bạn cần **${totalCost.toLocaleString('vi-VN')} Đồng** để quy đổi **${amount} Điểm Công Đức**!`,
      };
    }

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $inc: {
          'taiChinh.dong': -totalCost,
          'suDo.diemCongDuc': amount,
        },
      }
    );

    return {
      success: true,
      message: `🎉 **ĐỔI CÔNG ĐỨC THÀNH CÔNG!** Bạn đã quy đổi **${totalCost.toLocaleString(
        'vi-VN'
      )} Đồng** thành **+${amount} Điểm Công Đức**!`,
    };
  }

  /**
   * Kiểm tra điều kiện & trừ Điểm Công Đức khi khiêu chiến Boss Vùng
   */
  public static async checkAndConsumeMeritForBoss(
    userId: string,
    area: number
  ): Promise<{ canChallenge: boolean; bossInfo?: AreaBossInfo; message: string }> {
    const boss = AREA_BOSSES[area] || {
      area,
      name: `Thần Ma Trấn Cột Vùng ${area}`,
      icon: '👑',
      requiredMerit: area * 15,
      hp: area * 100000,
      maxHp: area * 100000,
      atk: area * 3000,
      def: area * 800,
      skillName: 'Thiên Địa Diệt Vong',
      rewardExp: area * 100000,
      rewardDong: area * 5000000,
      rewardKimBao: area * 20,
    };

    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { canChallenge: false, message: 'Không tìm thấy dữ liệu người chơi.' };

    const currentMerit = user.suDo?.diemCongDuc || 0;
    if (currentMerit < boss.requiredMerit) {
      return {
        canChallenge: false,
        bossInfo: boss,
        message: `❌ Để mở phong ấn khiêu chiến **${boss.name}**, bạn cần **${boss.requiredMerit} Điểm Công Đức** (Hiện có: ${currentMerit} Điểm)! Hãy dùng lệnh \`vn congduc mua [số_lượng]\` để quy đổi!`,
      };
    }

    // Trừ Điểm Công Đức
    await UserModelAdvanced.updateOne(
      { userId },
      { $inc: { 'suDo.diemCongDuc': -boss.requiredMerit } }
    );

    return {
      canChallenge: true,
      bossInfo: boss,
      message: `⛩️ **ĐÃ GIẢI PHONG ẤN!** Bạn tiêu tốn **${boss.requiredMerit} Điểm Công Đức** để khiêu chiến **${boss.name}**!`,
    };
  }
}
