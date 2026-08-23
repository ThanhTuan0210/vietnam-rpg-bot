import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong, formatKimBao } from '../../utils/formatters';
import { UserModelAdvanced } from '../../database/models/User.model';

export const BUA_TRU_TA_REGION_PRICES: Record<number, number> = {
  1: 10000,
  2: 25000,
  3: 60000,
  4: 150000,
  5: 400000,
};

export async function shopCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const firstArg = args[0]?.toLowerCase();

  // GIAN HÀNG KIM BẢO ĐỘC QUYỀN CATALOG
  const kimBaoCatalog: Record<string, { name: string; priceKB: number }> = {
    // === VẬT PHẨM ĐỘC QUYỀN CHỈ CÓ TẠI SHOP KIM BẢO ===
    dan_dot_pha: { name: 'Đan Dược Đột Phá Cảnh Giới (+1 Level)', priceKB: 25 },
    ngoc_hoang_cung: { name: 'Ngọc Hoàng Cung Vương Giả (+100 ATK, +50 DEF)', priceKB: 40 },
    thien_ha_vo_dich: { name: 'Thiên Hạ Vô Địch Chi Chiếu (Đập đồ 100% đỗ)', priceKB: 30 },
    long_bao_nam_giao: { name: 'Long Bào Nam Giao Thần Cấp (+100 DEF, +500 HP)', priceKB: 60 },
    linh_moc_uu_dam: { name: 'Linh Mộc Ưu Đàm Hộ Thể (Hồi full 24h)', priceKB: 20 },

    // === CÁC BÙA CHÚ & RƯƠNG THƯỢNG CỔ KHÁC ===
    ruong_huyen_thiet: { name: 'Rương Huyền Thiết Hoàng Cung', priceKB: 35 },
    ruong_vang: { name: 'Rương Vàng Thượng Cổ', priceKB: 15 },
    la_bua_ho_menh: { name: 'Lá Bùa Hộ Mệnh Cường Hóa', priceKB: 5 },
    bua_hoi_cooldown: { name: 'Bùa Hồi Cooldown Siêu Tốc', priceKB: 4 },
    thuoc_nhan_doi_exp: { name: 'Thuốc Nhân Đôi EXP (1 Giờ)', priceKB: 6 },
    bua_may_man: { name: 'Bùa May Mắn Rớt Đồ 100%', priceKB: 7 },
    thuoc_huyet_long: { name: 'Thuốc Huyết Long (+50% Max HP)', priceKB: 3 },
    thuoc_linh_khi: { name: 'Thuốc Linh Khí (+50% Max MP)', priceKB: 3 },
  };

  // CỬA HÀNG TIỀN ĐỒNG CATALOG
  const dongCatalog: Record<string, { name: string; price: number }> = {
    com_lam: { name: 'Cơm Lam Bổ Dưỡng', price: 100 },
    ao_vai_tho: { name: 'Áo Vải Thô', price: 200 },
    gay_tam_vong: { name: 'Gậy Tầm Vông', price: 150 },
    linh_ma: { name: 'Linh Mã Bát Tuấn', price: 500 },
    chia_khoa_phu_ban: { name: 'Chìa Khóa Phụ Bản', price: 35000 },
    bua_tru_ta: { name: 'Bùa Trừ Tà Tiến Phụ Bản (Tăng theo Vùng)', price: 10000 },
    ve_so: { name: 'Vé Số May Mắn', price: 25000 },
    hat_giong: { name: 'Hạt Giống Nông Sản', price: 4000 },
    the_skip_nhiem_vu: { name: 'Thẻ Bỏ Qua Nhiệm Vụ', price: 50000 },
    bua_hoi_cooldown: { name: 'Bùa Hồi Cooldown Siêu Tốc', price: 35000 },
    thuoc_nhan_doi_exp: { name: 'Thuốc Nhân Đôi EXP (1 Giờ)', price: 45000 },
    thien_linh_dan: { name: 'Thiên Linh Đan Hộ Thể (+30% Stats)', price: 25000 },
    bua_may_man: { name: 'Bùa May Mắn Rớt Đồ 100%', price: 50000 },
    la_bua_ho_menh: { name: 'Lá Bùa Hộ Mệnh Cường Hóa', price: 40000 },
    ruong_go: { name: 'Rương Gỗ Thượng Cổ', price: 2000 },
    ruong_dong: { name: 'Rương Đồng Thượng Cổ', price: 15000 },
    ruong_bac: { name: 'Rương Bạc Thượng Cổ', price: 100000 },
    ruong_vang: { name: 'Rương Vàng Thượng Cổ', price: 400000 },
    ruong_huyen_thiet: { name: 'Rương Huyền Thiết Hoàng Cung', price: 1000000 },
  };

  // =========================================================================
  // 💎 1. LỆNH CHUYÊN DỤNG MUA BẰNG KIM BẢO: `vn kimbao [mã_id]` HOẶC `vn kb [mã_id]`
  // =========================================================================
  if (firstArg === 'kimbao' || firstArg === 'kb') {
    const subArg = args[1]?.toLowerCase();

    // NẾU KHÔNG TRUYỀN MÃ ITEM ➔ HIỂN THỊ EMBED GIAN HÀNG KIM BẢO
    if (!subArg) {
      const embed = createDongSonEmbed()
        .setTitle(`💎 GIAN HÀNG KIM BẢO ĐỘC QUYỀN HOÀNG CUNG`)
        .setDescription(
          `**QUAN PHỦ NPC**: Dùng **Kim Bảo** 💎 tích lũy để sở hữu báu vật độc quyền!\n` +
            `• Cú pháp mua: \`vn kimbao [mã_vật_phẩm]\` (Hoặc rút gọn: \`vn kb [mã_vật_phẩm]\`)\n` +
            `• Ví dụ: \`vn kimbao dan_dot_pha\` hoặc \`vn kb 2 dan_dot_pha\`\n\n` +
            `👑 __VẬT PHẨM ĐỘC QUYỀN CHIÊM BÁO:__\n` +
            `🌸 \`dan_dot_pha\` | **25 💎 Kim Bảo** *(ĐỘC QUYỀN)*\n` +
            `Thăng thẳng **+1 Level ngay lập tức** không cần cày EXP!\n\n` +
            `👑 \`ngoc_hoang_cung\` | **40 💎 Kim Bảo** *(ĐỘC QUYỀN)*\n` +
            `Khảm vào vũ khí để nhận **+100 ATK & +50 DEF** thượng thừa\n\n` +
            `📜 \`thien_ha_vo_dich\` | **30 💎 Kim Bảo** *(ĐỘC QUYỀN)*\n` +
            `Cường hóa nâng cấp trang bị lên 1 cấp **100% THÀNH CÔNG**\n\n` +
            `🐉 \`long_bao_nam_giao\` | **60 💎 Kim Bảo** *(ĐỘC QUYỀN)*\n` +
            `Áo Long Bào Nam Giao Thần Cấp **[+100 DEF, +500 HP]**\n\n` +
            `🪷 \`linh_moc_uu_dam\` | **20 💎 Kim Bảo** *(ĐỘC QUYỀN)*\n` +
            `Tự động hồi **100% HP & MP mỗi khi đi săn** trong 24 Giờ!\n\n` +
            `🎁 __RƯƠNG & BÙA CHÚ CAO CẤP:__\n` +
            `🏵️ \`ruong_huyen_thiet\` | **35 💎** | 🔮 \`ruong_vang\` | **15 💎**\n` +
            `📜 \`la_bua_ho_menh\` | **5 💎** | ⚡ \`bua_hoi_cooldown\` | **4 💎**\n` +
            `🧪 \`thuoc_nhan_doi_exp\` | **6 💎** | 🍀 \`bua_may_man\` | **7 💎**`
        );
      await message.reply({ embeds: [embed] });
      return;
    }

    // NẾU CÓ TRUYỀN MÃ ITEM ➔ XỬ LÝ MUA BẰNG KIM BẢO
    let qty = parseInt(subArg, 10);
    let rawItemId = args[2]?.toLowerCase();

    if (isNaN(qty)) {
      rawItemId = subArg;
      qty = parseInt(args[2], 10) || 1;
    }

    const item = kimBaoCatalog[rawItemId];
    if (!item) {
      await message.reply(
        `❌ Vật phẩm \`${rawItemId}\` không có trong Gian Hàng Kim Bảo!\n` +
          `💡 Gõ \`vn kimbao\` để xem danh sách vật phẩm bán bằng Kim Bảo 💎.`
      );
      return;
    }

    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return;

    const totalKB = item.priceKB * qty;
    if (user.taiChinh.kimBao < totalKB) {
      await message.reply(
        `❌ Bạn không đủ Kim Bảo! Cần **${formatKimBao(totalKB)}** để mua ${qty}x **${item.name}** (Bạn đang có: **${formatKimBao(user.taiChinh.kimBao)}**)!`
      );
      return;
    }

    await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': -totalKB } });
    await UserService.addItemAtomic(userId, rawItemId, qty);

    const embed = createDongSonEmbed()
      .setTitle('💎 MUA HÀNG KIM BẢO THÀNH CÔNG!')
      .setDescription(`Bạn đã sử dụng **${formatKimBao(totalKB)}** để mua thành công ${qty}x **${item.name}** (\`${rawItemId}\`)!`);
    await message.reply({ embeds: [embed] });
    return;
  }

  // =========================================================================
  // 🪙 2. LỆNH MUA BẰNG TIỀN ĐỒNG: `vn buy [mã_id]` HOẶC `vn mua [mã_id]`
  // =========================================================================
  if (firstArg === 'mua' || firstArg === 'buy') {
    let qty = parseInt(args[1], 10);
    let rawItemId = args[2]?.toLowerCase();

    if (isNaN(qty)) {
      rawItemId = args[1]?.toLowerCase();
      qty = parseInt(args[2], 10) || 1;
    }

    if (!rawItemId) {
      await message.reply('⚠️ **Cú pháp mua bằng Tiền Đồng:** `vn buy [mã_vật_phẩm]` (Ví dụ: `vn buy bua_tru_ta` hoặc `vn buy 2 com_lam`)');
      return;
    }

    // NẾU NGƯỜI CHƠI NHẦM MÃ KIM BẢO VÀO LỆNH VN BUY
    if (kimBaoCatalog[rawItemId] && !dongCatalog[rawItemId]) {
      await message.reply(
        `💎 **VẬT PHẨM BÁN BẰNG KIM BẢO!**\n` +
          `Vật phẩm **${kimBaoCatalog[rawItemId].name}** được bán tại Shop Kim Bảo.\n` +
          `👉 Vui lòng sử dụng cú pháp: \`vn kimbao ${rawItemId}\` (hoặc \`vn kb ${rawItemId}\`)`
      );
      return;
    }

    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) return;

    // MUA BÙA TRỪ TÀ (GIÁ ĐỘNG THEO VÙNG)
    if (rawItemId === 'bua_tru_ta') {
      const region = user.canhGioi.khuVuc || 1;
      const unitPrice = BUA_TRU_TA_REGION_PRICES[region] || 10000;
      const totalCost = unitPrice * qty;

      if (user.taiChinh.dong < totalCost) {
        await message.reply(`❌ Bạn hiện đang ở **Vùng ${region}**. Giá **Bùa Trừ Tà** là **${formatDong(unitPrice)}/cái** (Tổng: **${formatDong(totalCost)}**)!`);
        return;
      }

      const success = await UserService.deductDongAtomic(userId, totalCost);
      if (!success) {
        await message.reply('❌ Giao dịch thất bại do không đủ tiền!');
        return;
      }

      await UserService.addItemAtomic(userId, 'bua_tru_ta', qty);

      const embed = createDongSonEmbed()
        .setTitle('⛩️ MUA BÙA TRỪ TÀ THÀNH CÔNG!')
        .setDescription(
          `Bạn thuộc **Vùng ${region}** đã chi **${formatDong(totalCost)}** (Giá: \`${formatDong(unitPrice)}/cái\`) để mua ${qty}x **Bùa Trừ Tà Tiến Phụ Bản**!`
        );
      await message.reply({ embeds: [embed] });
      return;
    }

    // MUA VẬT PHẨM TRONG DONG CATALOG
    if (dongCatalog[rawItemId]) {
      const item = dongCatalog[rawItemId];
      const totalCost = item.price * qty;

      if (user.taiChinh.dong < totalCost) {
        await message.reply(`❌ Bạn cần **${formatDong(totalCost)}** để mua ${qty}x **${item.name}**!`);
        return;
      }

      const success = await UserService.deductDongAtomic(userId, totalCost);
      if (!success) {
        await message.reply('❌ Giao dịch thất bại do không đủ tiền!');
        return;
      }

      await UserService.addItemAtomic(userId, rawItemId, qty);

      const embed = createDongSonEmbed()
        .setTitle('🛒 MUA HÀNG THÀNH CÔNG!')
        .setDescription(`Bạn đã chi **${formatDong(totalCost)}** để mua ${qty}x **${item.name}** (\`${rawItemId}\`) cất vào túi đồ!`);
      await message.reply({ embeds: [embed] });
      return;
    }

    await message.reply('❌ Mã vật phẩm không tồn tại trong Cửa Hàng Tiền Đồng! Hãy gõ `vn shop` để xem danh sách.');
    return;
  }

  // =========================================================================
  // 🏪 3. HIỂN THỊ CỬA HÀNG TIỀN ĐỒNG: `vn shop`
  // =========================================================================
  let currentPage = 1;

  const userDoc = await UserModelAdvanced.findOne({ userId });
  const userRegion = userDoc?.canhGioi.khuVuc || 1;
  const buaPriceCurrent = BUA_TRU_TA_REGION_PRICES[userRegion] || 10000;

  const renderPage = (page: number) => {
    if (page === 1) {
      return createDongSonEmbed()
        .setTitle(`Tiệm Quan Phủ — Page 1/3 (Trang Bị & Nông Sản)`)
        .setDescription(
          `**QUAN PHỦ NPC**: Hế lô, **${username}**!\n` +
            `• Mua bằng Tiền Đồng 🪙: \`vn buy [mã_vật_phẩm]\` (Ví dụ: \`vn buy bua_tru_ta\`)\n` +
            `• Mua bằng Kim Bảo 💎: \`vn kimbao [mã_vật_phẩm]\` (Ví dụ: \`vn kimbao dan_dot_pha\`)\n\n` +
            `🍙 __com_lam__ | **100 🪙**\n` +
            `Cơm lam linh khí hồi phục **100% HP & MP** khi mang theo\n\n` +
            `🥋 __ao_vai_tho__ | **200 🪙**\n` +
            `**[+2 def]** Áo vải thô đơn sơ bảo vệ thân thể\n\n` +
            `🎋 __gay_tam_vong__ | **150 🪙**\n` +
            `**[+5 at]** Cậy gậy tre dẻo dai làng quê\n\n` +
            `🐴 __linh_ma__ | **500 🪙**\n` +
            `**[tier I]** Linh mã cưỡi thám hiểm rừng rậm\n\n` +
            `🔑 __chia_khoa_phu_ban__ | **35,000 🪙**\n` +
            `Chìa khóa mở cổng tháp trial\n\n` +
            `🎟️ __ve_so__ | **25,000 🪙**\n` +
            `Tham gia quay số trúng thưởng xổ số\n\n` +
            `🌱 __hat_giong__ | **4,000 🪙**\n` +
            `Dùng để gieo trồng nông sản tại \`vn farm\``
        );
    } else if (page === 2) {
      return createDongSonEmbed()
        .setTitle(`Tiệm Quan Phủ — Page 2/3 (Vật Phẩm Tính Năng & Bùa Chú)`)
        .setDescription(
          `**QUAN PHỦ NPC**: Hế lô, **${username}**! Mua bằng lệnh \`vn buy [mã_vật_phẩm]\`\n\n` +
            `⛩️ __bua_tru_ta__ | **${formatDong(buaPriceCurrent)}** *(Giá Vùng ${userRegion})*\n` +
            `Bùa Trừ Tà mở cổng khiêu chiến \`vn phuban\` (Giá Vùng 1: 10k, V2: 25k, V3: 60k, V4: 150k, V5: 400k)\n\n` +
            `📜 __the_skip_nhiem_vu__ | **50,000 🪙**\n` +
            `Hoàn thành ngay lập tức nhiệm vụ active trong \`vn quest\`\n\n` +
            `⚡ __bua_hoi_cooldown__ | **35,000 🪙**\n` +
            `Xóa bỏ ngay lập tức thời gian chờ của \`hunt\`, \`chop\`, \`mine\`, \`fish\`\n\n` +
            `🧪 __thuoc_nhan_doi_exp__ | **45,000 🪙**\n` +
            `Nhận **+100% EXP (x2 EXP)** khi đi săn & vượt ải trong 1 Giờ\n\n` +
            `🔮 __thien_linh_dan__ | **25,000 🪙**\n` +
            `Tăng **+30% Sát Thương (ATK) & +30% Giáp (DEF)** cho nhân vật\n\n` +
            `🍀 __bua_may_man__ | **50,000 🪙**\n` +
            `Đảm bảo **100% Rớt Nguyên Liệu Hiếm** cho 10 lần \`hunt\` tiếp theo\n\n` +
            `📦 __ruong_go__ | **2,000 🪙** | 🟦 __ruong_bac__ | **100,000 🪙**`
        );
    } else {
      return createDongSonEmbed()
        .setTitle(`🇻🇳 GIAN HÀNG SỰ KIỆN QUỐC KHÁNH 2/9 — Page 3/3`)
        .setDescription(
          `🎆 **CHÀO MỪNG ĐẠI LỄ QUỐC KHÁNH 2/9!** (Vật phẩm giảm giá đặc biệt & Rương Thượng Cổ)\n\n` +
            `📜 __la_bua_ho_menh__ | **40,000 🪙** *(HOT)*\n` +
            `Bảo vệ trang bị không bị tụt cấp khi cường hóa tại Lò Rèn!\n\n` +
            `⛩️ __bua_tru_ta__ | **${formatDong(buaPriceCurrent)}** *(Giá Vùng ${userRegion})*\n` +
            `Vé vào Phụ Bản Trùm Vùng săn trang bị thần thoại\n\n` +
            `⚡ __bua_hoi_cooldown__ | **35,000 🪙**\n` +
            `Xóa ngay lập tức hồi chiêu săn bắt & đốn củi/đào khoáng\n\n` +
            `🧪 __thuoc_nhan_doi_exp__ | **45,000 🪙**\n` +
            `Nhân đôi EXP (+100%) cày level siêu tốc\n\n` +
            `🔮 __ruong_vang__ | **400,000 🪙** | 🏵️ __ruong_huyen_thiet__ | **1,000,000 🪙**`
        );
    }
  };

  const buildButtons = (page: number) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('shop_prev')
        .setLabel('◀️ Trang Trước')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 1),
      new ButtonBuilder()
        .setCustomId('shop_next')
        .setLabel('Trang Sau ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page === 3)
    );
  };

  const replyMsg = await message.reply({
    embeds: [renderPage(currentPage)],
    components: [buildButtons(currentPage)],
  });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'shop_prev') {
      currentPage = Math.max(1, currentPage - 1);
    } else if (i.customId === 'shop_next') {
      currentPage = Math.min(3, currentPage + 1);
    }

    await i.update({
      embeds: [renderPage(currentPage)],
      components: [buildButtons(currentPage)],
    });
  });

  collector.on('end', async () => {
    const disabledRow = new ActionRowBuilder<ButtonBuilder>();
    buildButtons(currentPage).components.forEach((btn) =>
      disabledRow.addComponents(ButtonBuilder.from(btn).setDisabled(true))
    );
    await replyMsg.edit({ components: [disabledRow] }).catch(() => {});
  });
}
