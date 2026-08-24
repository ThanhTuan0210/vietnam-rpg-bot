import { UserService } from './UserService';

export interface FlashSaleItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  stock: number;
}

export class MerchantService {
  private static flashSaleStock: Record<string, FlashSaleItem> = {
    ngoc_tinh_xao: {
      id: 'ngoc_tinh_xao',
      name: 'Ngọc Tinh Xảo',
      icon: '💎',
      price: 50000,
      stock: 3, // Chỉ có 3 viên trên toàn server
    },
    bua_cuong_hoa_dac_biet: {
      id: 'bua_cuong_hoa_dac_biet',
      name: 'Bùa Cường Hóa +5',
      icon: '📜',
      price: 150000,
      stock: 2,
    },
  };

  /**
   * Lấy danh sách hàng Flash Sale của Thương Lái
   */
  public static getFlashSaleItems(): FlashSaleItem[] {
    return Object.values(this.flashSaleStock);
  }

  /**
   * Mua hàng Flash Sale số lượng có hạn trên toàn Server
   */
  public static async buyFlashSale(
    userId: string,
    itemId: string
  ): Promise<{ success: boolean; message: string }> {
    const item = this.flashSaleStock[itemId];
    if (!item) return { success: false, message: 'Vật phẩm không tồn tại.' };

    if (item.stock <= 0) {
      return { success: false, message: '❌ Vật phẩm này đã bị người chơi khác mua hết sạch (Hết hàng)!' };
    }

    const paid = await UserService.deductDongAtomic(userId, item.price);
    if (!paid) {
      return { success: false, message: `❌ Bạn không đủ **${item.price.toLocaleString('vi-VN')} Đồng**!` };
    }

    item.stock -= 1;
    await UserService.addItemAtomic(userId, item.id, 1);

    return {
      success: true,
      message: `🎉 **MUA THÀNH CÔNG!** Bạn đã nhanh tay sở hữu **${item.icon} ${item.name}**! (Còn lại: ${item.stock})`,
    };
  }
}
