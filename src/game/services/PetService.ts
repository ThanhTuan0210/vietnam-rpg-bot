import { PetModel, IPet, PetLoaiType } from '../../database/models/Pet.model';
import { UserService } from './UserService';
import { UserModelAdvanced } from '../../database/models/User.model';

const PET_NAMES: Record<PetLoaiType, string> = {
  BACH_HO: 'Bạch Hổ Thượng Ngàn',
  HUYEN_VU: 'Huyền Vũ Trấn Hải',
  HAC_LONG: 'Hắc Long U Minh',
  CHIM_LAC: 'Chim Lạc Đông Sơn',
};

export class PetService {
  /**
   * Bắt linh thú hoang dã
   */
  public static async catchPet(ownerId: string, loai: PetLoaiType): Promise<{ success: boolean; pet?: IPet; message: string }> {
    const existingCount = await PetModel.countDocuments({ ownerId });
    if (existingCount >= 3) {
      return { success: false, message: '❌ Bạn đã sở hữu tối đa 3 Linh Thú!' };
    }

    const petId = `pet_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const pet = await PetModel.create({
      petId,
      ownerId,
      ten: PET_NAMES[loai],
      loai,
      bac: 1,
      capDo: 1,
      doNo: 100,
      kyNangNoiTai: 'Tự cứu sinh khi 0 HP (Hồi 30% HP)',
    });

    return {
      success: true,
      pet,
      message: `🎉 **THU PHỤC THÀNH CÔNG!** Bạn đã nhận được Linh Thú **${pet.ten}** (Bậc 1)!`,
    };
  }

  /**
   * Cho Linh Thú ăn
   */
  public static async feedPet(ownerId: string, petId: string): Promise<{ success: boolean; message: string }> {
    const pet = await PetModel.findOne({ ownerId, petId });
    if (!pet) return { success: false, message: 'Không tìm thấy Linh Thú.' };

    if (pet.doNo >= 100) {
      return { success: false, message: '🍗 Linh Thú của bạn đã no căng bụng (100/100)!' };
    }

    const consumed = await UserService.consumeItemAtomic(ownerId, 'ca_chep_song', 1);
    if (!consumed) {
      return { success: false, message: '❌ Bạn cần **1 Cá Chép Sông** trong túi đồ để cho Linh Thú ăn!' };
    }

    pet.doNo = Math.min(100, pet.doNo + 30);
    pet.capDo += 1;
    await pet.save();

    return {
      success: true,
      message: `🍖 **CHO ĂN THÀNH CÔNG!** **${pet.ten}** tăng Độ No lên **${pet.doNo}/100** và thăng cấp **Cấp ${pet.capDo}**!`,
    };
  }

  /**
   * Cử Linh Thú đi Du Ngoạn (Pet Adventure)
   */
  public static async sendAdventure(ownerId: string, petId: string, hours = 1): Promise<{ success: boolean; message: string }> {
    const pet = await PetModel.findOne({ ownerId, petId });
    if (!pet) return { success: false, message: 'Không tìm thấy Linh Thú.' };

    if (pet.dangThuDuHi) {
      return { success: false, message: '🐾 Linh Thú của bạn đang trong hành trình Du Ngoạn!' };
    }

    const returnTime = new Date(Date.now() + hours * 3600000);
    pet.dangThuDuHi = true;
    pet.thoiGianTroVe = returnTime;
    await pet.save();

    return {
      success: true,
      message: `🚀 **XUẤT PHÁT!** **${pet.ten}** đã lên đường Du Ngoạn trong **${hours} giờ**!`,
    };
  }

  /**
   * Nhận quà khi Linh Thú Du Ngoạn trở về
   */
  public static async claimAdventureRewards(ownerId: string, petId: string): Promise<{ success: boolean; message: string }> {
    const pet = await PetModel.findOne({ ownerId, petId });
    if (!pet || !pet.dangThuDuHi) return { success: false, message: 'Linh Thú không trong trạng thái du ngoạn.' };

    if (pet.thoiGianTroVe && new Date() < pet.thoiGianTroVe) {
      const remMinutes = Math.ceil((pet.thoiGianTroVe.getTime() - Date.now()) / 60000);
      return { success: false, message: `⏳ **${pet.ten}** vẫn đang du ngoạn! Vui lòng chờ thêm **${remMinutes} phút**.` };
    }

    // Thưởng khi trở về
    const dongEarned = Math.floor(Math.random() * 500) + 300;
    await UserService.addDongAtomic(ownerId, dongEarned);
    await UserService.addItemAtomic(ownerId, 'go_tram_huong', 2);

    pet.dangThuDuHi = false;
    pet.thoiGianTroVe = undefined;
    await pet.save();

    return {
      success: true,
      message: `🎉 **LINH THÚ TRỞ VỀ!** **${pet.ten}** trở về mang theo **${dongEarned} Đồng** và 🪵 **Gỗ Trầm Hương x2**!`,
    };
  }

  /**
   * Nội tại Linh Thú: Tự cứu sinh chủ nhân khi HP về 0 (Hồi 30% HP)
   */
  public static async checkPassiveRescue(ownerId: string): Promise<boolean> {
    const pet = await PetModel.findOne({ ownerId });
    if (!pet || pet.doNo < 20) return false;

    // Trừ 20 độ no để cứu chủ
    pet.doNo -= 20;
    await pet.save();

    const user = await UserModelAdvanced.findOne({ userId: ownerId });
    if (user) {
      const healHp = Math.floor(user.chiSo.maxHp * 0.3);
      await UserModelAdvanced.updateOne({ userId: ownerId }, { $set: { 'chiSo.hp': healHp } });
    }

    return true;
  }
}
