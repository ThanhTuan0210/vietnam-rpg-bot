import mongoose from 'mongoose';
import { CONFIG } from '../config/env';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(CONFIG.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] 🍃 Kết nối CSDL thành công đến: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.warn(`\n⚠️  [LỖI KẾT NỐI MONGODB]: Không thể kết nối tới '${CONFIG.MONGO_URI}'`);
    console.warn(`👉 Chi tiết lỗi: ${error?.message || error}`);
    console.warn(`\n💡 HƯỚNG DẪN KHẮC PHỤC:`);
    console.warn(`1. Nếu chạy MongoDB Local: Hãy bật dịch vụ MongoDB (mongod) trên máy tính của bạn.`);
    console.warn(`2. Nếu dùng MongoDB Atlas Cloud: Đảm bảo đã cập nhật MONGO_URI trong tệp .env thành chuỗi kết nối mongodb+srv://...\n`);
    throw error;
  }
}
