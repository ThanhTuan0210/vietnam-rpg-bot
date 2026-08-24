import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function ruleCommand(message: Message): Promise<void> {
  const embed = createDongSonEmbed()
    .setTitle('📜 THÔNG BÁO QUY TẮC & HƯỚNG DẪN LUẬT CHƠI — MEDIEVAL KYRISE RPG')
    .setDescription(
      `🏛️ **CHÀO MỪNG ĐẾN VỚI VƯƠNG QUỐC TRUNG CỔ MEDIEVAL KYRISE!**\n` +
        `Dưới đây là tóm tắt toàn bộ **Quy Tắc Luật Chơi Hiện Tại** & **Định Hướng Cập Nhật Trong Tương Lai**:\n\n` +
        `⚔️ **I. NHỮNG VIỆC NGƯỜI CHƠI PHẢI LÀM (CURRENT GAMEPLAY LOOP):**\n\n` +
        `1️⃣ **Khởi Tạo Nhân Vật & Chọn Class Sản Xuất (PP):**\n` +
        `   • Gõ \`vkl\` để mở Menu Khởi Tạo và chọn 1 trong 3 Class Chuyên Môn Nghề: **🪨 Miner (Thợ Mỏ)**, **🧪 Alchemist (Thợ Bào Chế)**, **🔨 Blacksmith (Thợ Rèn)**.\n` +
        `   • Đổi Class Sản Xuất có **Cooldown 24 Giờ Thực** (Hoặc dùng \`📜 Sách Xóa Nghề\` để đổi ngay).\n\n` +
        `2️⃣ **Chiến Đấu & Lao Động Song Phái (\`vkl w\`):**\n` +
        `   • Gõ \`vkl w\` (Combo 60s) để thực hiện 1 Trận Săn Quái + 1 Công Việc Chuyên Môn duy nhất của Class mình.\n` +
        `   • Đánh quái sẽ bị **Trừ HP**. Nếu HP về 0 sẽ bị **Trọng Thương (-1 Level & Phạt 10% Vàng)**! Hãy luôn uống Thuốc HP (\`vkl use potion_01a\`).\n\n` +
        `3️⃣ **Phối Hợp Đồng Đội & Kho Vault chung (\`vkl vlt\`):**\n` +
        `   • Nhóm 3-5 người chơi hãy gửi tài nguyên vào **Kho Vault Tổ Đội (\`vkl vlt dep\`)** để Thợ Rèn rèn vũ khí giáp (\`vkl craft\`) và Thợ Bào Chế nung thuốc HP/MP (\`vkl brew\`) giúp cả đội!\n\n` +
        `4️⃣ **Thông Thạo Nghề (Destiny Board) & Phẩm Chất Đồ (.1/.2/.3):**\n` +
        `   • Gõ \`vkl mastery\` để xem cấp độ **Thông Thạo Nghề**. Cấp càng cao rèn ra đồ càng xịn: **🟢 .1 (+20% stat)**, **🔵 .2 (+45% stat)**, **🟣 .3 (+75% stat)**.\n\n` +
        `5️⃣ **Cơ Chế Kinh Tế Thị Trường Động Albion Online (\`vkl shop\`):**\n` +
        `   • Giá Tiệm Dự Trữ NPC tính cả Giá Nguyên Liệu + Công Lao Động + Phụ Phí Khẩn Cấp. Giới hạn mua tối đa **5x vật phẩm**.\n` +
        `   • Mua làm giá tăng **+10%**, Bán (\`vkl sell\`) được **Trợ Giá +8% Vàng** & giảm giá thị trường **-8%**.\n\n` +
        `🔮 **II. CÁC TÍNH NĂNG ĐẮC SẮC TRONG TƯƠNG LAI (UPCOMING EXPANSIONS):**\n\n` +
        `• 🔴 **Phân Vùng Red / Black Zone (Full-Loot PvP Risk):** Tử trận trong vùng đen bị rớt trang bị cho đối thủ nhặt!\n` +
        `• 📜 **Đánh Trùm Bang Hội & Chiếm Lãnh Thổ (\`vkl guild raid\`):** Chiếm thành phố thu Thuế Vàng khu vực.\n` +
        `• ⚖️ **Sàn Giao Dịch Tự Do (Player Market Order Book):** Treo lệnh bán/mua đồ tự do giữa các Kị Sĩ với nhau!`
    )
    .setFooter({ text: 'Gõ "vkl help" để xem danh sách câu lệnh hoặc "vkl cd" để kiểm tra thời gian hồi chiêu!' });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_master_menu').setLabel('🎮 Bảng Master Menu (vkl)').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('cmd_mastery').setLabel('📜 Thông Thạo Nghề (vkl mastery)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_cooldown').setLabel('⏱️ Bảng Cooldown (vkl cd)').setStyle(ButtonStyle.Secondary)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
