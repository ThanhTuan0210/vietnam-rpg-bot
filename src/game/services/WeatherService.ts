import { UserModelAdvanced } from '../../database/models/User.model';

export type WeatherType = 'MUA_LU' | 'NANG_GAT' | 'HOA_PHONG' | 'THAN_SUONG';

export interface WeatherEffect {
  name: string;
  icon: string;
  desc: string;
  fishingMult: number;
  farmingTimeMult: number;
  miningSpeedMult: number;
}

export class WeatherService {
  /**
   * Lấy trạng thái thời tiết động hiện tại (Chu kỳ 4 giờ)
   */
  public static getCurrentWeather(): WeatherEffect {
    const cycleHour = Math.floor(Date.now() / (4 * 3600000)) % 4;

    const weathers: WeatherEffect[] = [
      {
        name: 'Mưa Lũ (Thủy Tinh giáng trần)',
        icon: '🌧️',
        desc: 'Sản lượng câu cá ×2, ruộng lúa nước bị ngập úng (+50% thời gian lớn).',
        fishingMult: 2.0,
        farmingTimeMult: 1.5,
        miningSpeedMult: 1.0,
      },
      {
        name: 'Nắng Gắt (Sơn Tinh trấn giữ)',
        icon: '☀️',
        desc: 'Tốc độ đào khoáng ×1.5, quái hệ Hỏa tăng +20% sát thương.',
        fishingMult: 1.0,
        farmingTimeMult: 1.0,
        miningSpeedMult: 1.5,
      },
      {
        name: 'Hòa Phong (Gió Lành Tây Bắc)',
        icon: '🌬️',
        desc: 'Tất cả hoạt động thu thập tăng +10% tỷ lệ rớt đồ hiếm.',
        fishingMult: 1.2,
        farmingTimeMult: 0.9,
        miningSpeedMult: 1.2,
      },
      {
        name: 'Thần Sương (Mù Sương Núi Ba Vì)',
        icon: '🌫️',
        desc: 'Quái vật tăng +15% né tránh, nhưng rương báu mở ra nhận thêm +20% tiền.',
        fishingMult: 1.0,
        farmingTimeMult: 1.0,
        miningSpeedMult: 1.0,
      },
    ];

    return weathers[cycleHour];
  }

  /**
   * Xin Xăm / Gieo Quẻ Kinh Dịch (vkl xinxam) - Mỗi ngày 1 lần
   */
  public static async drawDailyFortune(userId: string): Promise<{ success: boolean; type?: string; message: string }> {
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return { success: false, message: 'Không tìm thấy người dùng.' };

    const now = new Date();
    const lastDate = user.dailyFortune?.lastDate;

    if (lastDate && lastDate.toDateString() === now.toDateString()) {
      return {
        success: false,
        message: `⏰ Hôm nay bạn đã rút quẻ **${user.dailyFortune.type}** rồi! Vui lòng quay lại vào ngày mai.`,
      };
    }

    const fortunes: ('DAI_CAT' | 'TRUNG_CAT' | 'TIEU_HUNG' | 'DAI_HUNG')[] = [
      'DAI_CAT',
      'TRUNG_CAT',
      'TIEU_HUNG',
      'DAI_HUNG',
    ];
    const drawn = fortunes[Math.floor(Math.random() * fortunes.length)];

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $set: {
          'dailyFortune.type': drawn,
          'dailyFortune.lastDate': now,
        },
      }
    );

    const fortuneDescs: Record<string, string> = {
      DAI_CAT: '🎉 **ĐẠI CÁT:** Tăng **+15% Tỷ Lệ Cường Hóa** trang bị trong 24h!',
      TRUNG_CAT: '✨ **TRUNG CÁT:** Tăng **+10% EXP** và **+10% Tiền Đồng** đi săn trong 24h!',
      TIEU_HUNG: '⚠️ **TIỂU HUNG:** Giảm 5% DEF nhưng tăng **+10% Tỷ Lệ Né Tránh**.',
      DAI_HUNG: '💀 **ĐẠI HUNG:** Giảm 10% Sát thương nhưng **TĂNG GẤP ĐÔI TỶ LỆ RỚT ĐỒ HIẾM**!',
    };

    return {
      success: true,
      type: drawn,
      message: `⛩️ **BỐC QUẺ KINHI DỊCH ĐẦU NGÀY:**\n\n${fortuneDescs[drawn]}`,
    };
  }
}
