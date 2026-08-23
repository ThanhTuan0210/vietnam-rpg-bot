# 🏛️ Discord Text-based RPG Bot - Dân Gian & Thần Thoại Việt Nam 🐉

Một dự án Discord Bot RPG hoàn chỉnh mang đậm bản sắc văn hóa Việt Nam (Trừ tà diệt quái, săn quái tích truyền kỳ) kết hợp sòng bài Mini-game Dân gian & Quốc tế được xây dựng bằng **Node.js (TypeScript)**, **discord.js v14**, và **MongoDB (Mongoose)**.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Thần Thoại & Dân Gian Việt Nam**:
   - Tiền tệ: `🪙 Đồng` (tiền cơ bản) & `💎 Kim Bảo` (tiền hiếm).
   - Vũ khí: Gậy Tầm Vông ➔ Dao Mác Cổ ➔ Cung Nỏ Thần Cổ Loa ➔ Kiếm Thuận Thiên.
   - Giáp trụ: Áo Vải Thô ➔ Áo Tơi Lá ➔ Giáp Trống Đồng ➔ Chiến Bào Âu Lạc.
   - Nguyên liệu & Dược liệu: Gỗ Tre Gai, Gỗ Trầm Hương, Gỗ Lim Cổ Thụ, Cơm Lam, Cá Chép Sông, Củ Cải Ngàn Năm, Lá Bùa Hộ Mệnh, Bùa Trừ Tà.
   - 3 Vùng đất & Quái vật dân gian:
     - **Vùng 1 (Làng Thôn Dã):** Ma Da, Cương Thi Thôn, Chồn Tinh | Boss: Quỷ Thôn Cổ.
     - **Vùng 2 (Đầm Dạ Trạch):** Thuồng Luồng Con, Cá Trê Khổng Lồ, Mộc Tinh | Boss: Mộc Tinh Ngàn Năm.
     - **Vùng 3 (Đỉnh Ba Vì):** Voi Chín Ngà, Gà Chín Cựa, Ngựa Chín Hồng Mao, Thần Rừng | Boss: Thủy Tinh Hung Đồ.

2. **Hệ Thống Lệnh Cốt Lõi**:
   - `vn batdau` / `vn nhanvat`: Tạo nhân vật & Xem Embed Trống Đồng Đông Sơn.
   - `vn tuido`: Kiểm tra kho hành trang.
   - `vn duongthuong`: Hồi 100% HP bằng Cơm Lam hoặc trả 20 Đồng cho Lang Y.
   - `vn san` & `vn san kho`: Săn quái thường/khó (60s cooldown, tính sát thương 2 chiều $\max(1, \text{ATK} - \text{DEF})$).
   - `vn thamhiem`: Thám hiểm rừng thâm U Minh/Tây Bắc (1h cooldown, mở rương báu).
   - `vn luyenvo`: Luyện võ nhanh đố vui dân gian bằng Buttons.
   - `vn phuban`: Khiêu chiến Boss Trùm Vùng tiêu hao 1 Bùa Trừ Tà để đột phá lên vùng mới.

3. **Module Mini-Game 100% Discord Action Rows (Buttons & Select Menu)**:
   - 🎲 **Bầu Cua Tôm Cá**: 6 Buttons (Bầu, Cua, Tôm, Cá, Gà, Nai), animation 3 xúc xắc, trả thưởng x1, x2, x3.
   - 🎲 **Tài Xỉu**: 2 Buttons (Tài 11-17 / Xỉu 4-10), tính Bão đồng nhất.
   - 🃏 **Xì Dách (Blackjack 21)**: 3 Buttons (Hit, Stand, Double), Xì Bàng, Xì Dách, Ngũ Linh.
   - ✌️✊✋ **Oẳn Tù Tì**: PvP hoặc PvE với nút ẩn chọn nước đi bí mật.
   - 📖 **Đố Vui Trạng Quỳnh**: 4 Nút trắc nghiệm, 15s timer, nhận EXP & Bùa Hộ Mệnh.
   - 🎰 **Nổ Hũ Hoàng Cung (Slots)**: Quay 3 trục, Jackpot x50 cho 3x Rồng Vàng.
   - 🎡 **Roulette Quốc Tế**: Tương tác Select Menu (Cửa Đỏ/Đen/Chẵn/Lẻ/Số 0-36).

4. **Kỹ Thuật & An Toàn**:
   - **Session Lock**: Khóa 1 bàn cược / 1 lượt chơi cho mỗi người dùng, chống spam click nhân bản tiền.
   - **MongoDB Atomic Operations**: Sử dụng `$inc`, `$set`, `$push` với điều kiện số dư `taiChinh.dong >= betAmount` triệt tiêu triệt để race conditions & dupe bug.
   - **Cooldown Manager**: Thông báo hồi chiêu tiếng Việt đếm ngược thân thiện.

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Yêu cầu hệ thống
- Node.js version >= 18.0.0
- MongoDB Server đang hoạt động (Local hoặc MongoDB Atlas URI)

### 2. Cài đặt các thư viện
```bash
cd d:/vietnam-rpg-bot
npm install
```

### 3. Cấu hình biến môi trường
Tạo tệp `.env` dựa trên `.env.example`:
```env
DISCORD_TOKEN=your_discord_bot_token_here
PREFIX=vn
MONGO_URI=mongodb://127.0.0.1:27017/vietnam_rpg_bot
```

### 4. Biên dịch & Chạy Bot
- Chạy môi trường phát triển (Dev mode):
  ```bash
  npm run dev
  ```
- Biên dịch ra JavaScript & Chạy Production:
  ```bash
  npm run build
  npm start
  ```
