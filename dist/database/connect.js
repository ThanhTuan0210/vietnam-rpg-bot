"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
async function connectDatabase() {
    try {
        const conn = await mongoose_1.default.connect(env_1.CONFIG.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] 🍃 Kết nối CSDL thành công đến: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.warn(`\n⚠️  [LỖI KẾT NỐI MONGODB]: Không thể kết nối tới '${env_1.CONFIG.MONGO_URI}'`);
        console.warn(`👉 Chi tiết lỗi: ${error?.message || error}`);
        console.warn(`\n💡 HƯỚNG DẪN KHẮC PHỤC:`);
        console.warn(`1. Nếu chạy MongoDB Local: Hãy bật dịch vụ MongoDB (mongod) trên máy tính của bạn.`);
        console.warn(`2. Nếu dùng MongoDB Atlas Cloud: Đảm bảo đã cập nhật MONGO_URI trong tệp .env thành chuỗi kết nối mongodb+srv://...\n`);
        throw error;
    }
}
