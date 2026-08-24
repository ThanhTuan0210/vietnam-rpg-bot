export interface ItemDefinition {
  id: string;
  name: string;
  type: 'vukhi' | 'aogiap' | 'phapbao' | 'linhthu' | 'ngoc' | 'ruong' | 'duoclieu' | 'nguyenlieu' | 'tinh_nang' | 'mu' | 'giay' | 'nhan' | 'daychuyen';
  description: string;
  statBonus?: {
    satThuong?: number;
    phongThu?: number;
    sinhLucToiDa?: number;
    manaToiDa?: number;
    chiMang?: number;
  };
  requiredLevel?: number;
  sellPrice: number;
  icon: string;
}

export const CUSTOM_EMOJIS: Record<string, string> = {};

export function getItemIcon(itemId: string, defaultIcon = '📦'): string {
  if (CUSTOM_EMOJIS[itemId]) {
    return CUSTOM_EMOJIS[itemId];
  }
  const item = ITEMS[itemId];
  return item?.icon || defaultIcon;
}

export const ITEMS: Record<string, ItemDefinition> = {
  // ⚔️ 15 TOÀN BỘ KIẾM & DAO TRUNG CỔ (SWORDS & DAGGERS)
  sword_01a: { id: 'sword_01a', name: 'Thép Kiếm Gothic Tier 1', type: 'vukhi', description: 'Thanh kiếm sắt trung cổ của kị sĩ tập sự.', statBonus: { satThuong: 35 }, requiredLevel: 1, sellPrice: 300, icon: '⚔️' },
  sword_01b: { id: 'sword_01b', name: 'Dao Đoản Song Sát Tier 1', type: 'vukhi', description: 'Dao ngắn sắc bén dùng áp sát ám sát.', statBonus: { satThuong: 45, chiMang: 0.08 }, requiredLevel: 5, sellPrice: 450, icon: '🗡️' },
  sword_01c: { id: 'sword_01c', name: 'Trảm Kiếm Sói Rừng Tier 1', type: 'vukhi', description: 'Kiếm nặng đúc từ nanh sói âm linh.', statBonus: { satThuong: 65 }, requiredLevel: 10, sellPrice: 650, icon: '⚔️' },
  sword_01d: { id: 'sword_01d', name: 'Kiếm Thần Thép Sắt Tier 1', type: 'vukhi', description: 'Trường kiếm rèn từ thép tinh chế.', statBonus: { satThuong: 85 }, requiredLevel: 15, sellPrice: 850, icon: '⚔️' },
  sword_01e: { id: 'sword_01e', name: 'Trường Kiếm Hộ Vệ Tier 1', type: 'vukhi', description: 'Kiếm kị sĩ phòng thủ vương triều.', statBonus: { satThuong: 105, phongThu: 10 }, requiredLevel: 20, sellPrice: 1100, icon: '⚔️' },

  sword_02a: { id: 'sword_02a', name: 'Bảo Kiếm Hoàng Gia Tier 2', type: 'vukhi', description: 'Thanh kiếm thép tinh luyện của hoàng gia.', statBonus: { satThuong: 140 }, requiredLevel: 25, sellPrice: 1500, icon: '⚔️' },
  sword_02b: { id: 'sword_02b', name: 'Kiếm Rồng Lửa Tier 2', type: 'vukhi', description: 'Kiếm yểm linh khí rồng phun lửa.', statBonus: { satThuong: 180, chiMang: 0.12 }, requiredLevel: 35, sellPrice: 2200, icon: '🔥' },
  sword_02c: { id: 'sword_02c', name: 'Kiếm Băng Giá Tier 2', type: 'vukhi', description: 'Kiếm tẩm hàn khí làm chậm kẻ thù.', statBonus: { satThuong: 220 }, requiredLevel: 45, sellPrice: 3000, icon: '❄️' },
  sword_02d: { id: 'sword_02d', name: 'Kiếm Sấm Sét Tier 2', type: 'vukhi', description: 'Kiếm truyền lôi điện giáng sét.', statBonus: { satThuong: 270, chiMang: 0.15 }, requiredLevel: 55, sellPrice: 4200, icon: '⚡' },
  sword_02e: { id: 'sword_02e', name: 'Kiếm Ám Ảnh Tier 2', type: 'vukhi', description: 'Kiếm bóng tối của sát thủ huyền thoại.', statBonus: { satThuong: 330, chiMang: 0.18 }, requiredLevel: 65, sellPrice: 5800, icon: '🗡️' },

  sword_03a: { id: 'sword_03a', name: 'Kiếm Thần Thoại Tier 3', type: 'vukhi', description: 'Thần kiếm tỏa hào quang thiên giới.', statBonus: { satThuong: 390, chiMang: 0.20 }, requiredLevel: 75, sellPrice: 7500, icon: '👑' },
  sword_03b: { id: 'sword_03b', name: 'Kiếm Hoàng Kim Tier 3', type: 'vukhi', description: 'Kiếm vương giả mạ vàng ngọc báu.', statBonus: { satThuong: 430, phongThu: 25 }, requiredLevel: 80, sellPrice: 8800, icon: '✨' },
  sword_03c: { id: 'sword_03c', name: 'Kiếm Thánh Gothic Tier 3', type: 'vukhi', description: 'Thần khí chém tan tà khí.', statBonus: { satThuong: 480, chiMang: 0.22 }, requiredLevel: 85, sellPrice: 10000, icon: '⚔️' },
  sword_03d: { id: 'sword_03d', name: 'Kiếm Hủy Diệt Tier 3', type: 'vukhi', description: 'Ma kiếm xé rách không gian.', statBonus: { satThuong: 540, chiMang: 0.25 }, requiredLevel: 90, sellPrice: 12500, icon: '💥' },
  sword_03e: { id: 'sword_03e', name: 'Bảo Kiếm Excalibur Tier 3', type: 'vukhi', description: 'Thần kiếm Excalibur huyền thoại tối thượng.', statBonus: { satThuong: 650, chiMang: 0.30 }, requiredLevel: 99, sellPrice: 25000, icon: '🗡️' },

  // 🔮 10 PHÁP TRƯỢNG & PHÉP CẦU MA THUẬT (STAVES & ORBS)
  staff_01a: { id: 'staff_01a', name: 'Trượng Gỗ Rừng Tier 1', type: 'vukhi', description: 'Pháp trượng tích tụ linh khí đại ngàn.', statBonus: { satThuong: 40, manaToiDa: 50 }, requiredLevel: 1, sellPrice: 350, icon: '🔮' },
  staff_01b: { id: 'staff_01b', name: 'Phép Cầu Thuỷ Tinh Tier 1', type: 'vukhi', description: 'Quả cầu linh thạch dẫn truyền phép thuật.', statBonus: { satThuong: 55, manaToiDa: 80 }, requiredLevel: 10, sellPrice: 600, icon: '🔮' },
  staff_01c: { id: 'staff_01c', name: 'Trượng Tinh Tinh Tier 1', type: 'vukhi', description: 'Pháp trượng yểm bùa tinh linh.', statBonus: { satThuong: 75, manaToiDa: 120 }, requiredLevel: 20, sellPrice: 900, icon: '🔮' },

  staff_02a: { id: 'staff_02a', name: 'Trượng Bão Lửa Tier 2', type: 'vukhi', description: 'Trượng ma thuật triệu hồi bão lửa.', statBonus: { satThuong: 160, manaToiDa: 200 }, requiredLevel: 30, sellPrice: 2000, icon: '🔮' },
  staff_02b: { id: 'staff_02b', name: 'Phép Cầu Huyết Trăng Tier 2', type: 'vukhi', description: 'Quả cầu ma huyết tăng sát thương phép.', statBonus: { satThuong: 240, manaToiDa: 300 }, requiredLevel: 45, sellPrice: 3500, icon: '🔮' },
  staff_02c: { id: 'staff_02c', name: 'Trượng Băng Giáp Tier 2', type: 'vukhi', description: 'Trượng tuyết đóng băng kẻ thù.', statBonus: { satThuong: 310, manaToiDa: 400 }, requiredLevel: 60, sellPrice: 5500, icon: '🔮' },

  staff_03a: { id: 'staff_03a', name: 'Trượng Hoàng Gia Tier 3', type: 'vukhi', description: 'Trượng vương quyền hoàng cung.', statBonus: { satThuong: 400, manaToiDa: 500 }, requiredLevel: 75, sellPrice: 8000, icon: '🔮' },
  staff_03b: { id: 'staff_03b', name: 'Phép Cầu Vũ Trụ Tier 3', type: 'vukhi', description: 'Quả cầu hưng vong ngàn sao.', statBonus: { satThuong: 490, manaToiDa: 650 }, requiredLevel: 85, sellPrice: 11000, icon: '🔮' },
  staff_03c: { id: 'staff_03c', name: 'Trượng Thần Thoại Tier 3', type: 'vukhi', description: 'Thần trượng triệu hồi thiên lôi.', statBonus: { satThuong: 570, manaToiDa: 800 }, requiredLevel: 90, sellPrice: 15000, icon: '🔮' },
  staff_03e: { id: 'staff_03e', name: 'Trượng Linh Hồn Rồng Tier 3', type: 'vukhi', description: 'Pháp trượng triệu hồi quyền năng Rồng Thần ENDGAME.', statBonus: { satThuong: 700, manaToiDa: 1000 }, requiredLevel: 99, sellPrice: 30000, icon: '🔮' },

  // 🏹 10 CUNG & MŨI TÊN (BOWS & ARROWS)
  bow_01a: { id: 'bow_01a', name: 'Cung Tinh Linh Tier 1', type: 'vukhi', description: 'Cung thần uốn từ gỗ trắc ngàn năm.', statBonus: { satThuong: 32, chiMang: 0.1 }, requiredLevel: 1, sellPrice: 320, icon: '🏹' },
  bow_01b: { id: 'bow_01b', name: 'Cung Săn Rừng Tier 1', type: 'vukhi', description: 'Cung kị sĩ bắn cung xa.', statBonus: { satThuong: 60, chiMang: 0.12 }, requiredLevel: 15, sellPrice: 700, icon: '🏹' },

  bow_02a: { id: 'bow_02a', name: 'Cung Hoàng Gia Tier 2', type: 'vukhi', description: 'Cung mạ vàng bắn xuyên giáp.', statBonus: { satThuong: 150, chiMang: 0.15 }, requiredLevel: 30, sellPrice: 2100, icon: '🏹' },
  bow_02b: { id: 'bow_02b', name: 'Cung Bão Tên Tier 2', type: 'vukhi', description: 'Cung xả bão tên liên hoan.', statBonus: { satThuong: 280, chiMang: 0.18 }, requiredLevel: 50, sellPrice: 4800, icon: '🏹' },

  bow_03a: { id: 'bow_03a', name: 'Cung Thần Thoại Tier 3', type: 'vukhi', description: 'Thần cung tinh linh dải ngân hà.', statBonus: { satThuong: 450, chiMang: 0.22 }, requiredLevel: 75, sellPrice: 9000, icon: '🏹' },
  bow_03e: { id: 'bow_03e', name: 'Cung Vương Phủ Rồng Tier 3', type: 'vukhi', description: 'Thần cung Rồng Thần sát thương kinh thiên ENDGAME.', statBonus: { satThuong: 620, chiMang: 0.28 }, requiredLevel: 99, sellPrice: 28000, icon: '🏹' },

  arrow_01a: { id: 'arrow_01a', name: 'Mũi Tên Độc Sơ Cấp', type: 'nguyenlieu', description: 'Mũi tên tẩm độc bão kích.', sellPrice: 20, icon: '🏹' },
  arrow_01b: { id: 'arrow_01b', name: 'Mũi Tên Xuyên Giáp', type: 'nguyenlieu', description: 'Tên thép đâm thấu áo giáp.', sellPrice: 50, icon: '🏹' },
  arrow_02a: { id: 'arrow_02a', name: 'Mũi Tên Lửa Gothic', type: 'nguyenlieu', description: 'Tên thiêu đốt gây cháy.', sellPrice: 120, icon: '🏹' },
  arrow_03e: { id: 'arrow_03e', name: 'Mũi Tên Rồng Thần', type: 'nguyenlieu', description: 'Tên ma thuật Rồng Thần sát thương kinh thiên.', sellPrice: 500, icon: '🏹' },

  // 🛡️ 15 SHIELDS & HELMETS & ARMORS
  shield_01a: { id: 'shield_01a', name: 'Khiên Thép Gothic Tier 1', type: 'aogiap', description: 'Khiên giáp thép kiên cố bảo vệ kị sĩ.', statBonus: { phongThu: 25, sinhLucToiDa: 100 }, requiredLevel: 1, sellPrice: 280, icon: '🛡️' },
  shield_01b: { id: 'shield_01b', name: 'Khiên Sắt Kị Sĩ Tier 1', type: 'aogiap', description: 'Khiên sắt dập viền vàng.', statBonus: { phongThu: 45, sinhLucToiDa: 180 }, requiredLevel: 15, sellPrice: 650, icon: '🛡️' },
  shield_02a: { id: 'shield_02a', name: 'Khiên Rồng Lửa Tier 2', type: 'aogiap', description: 'Khiên vảy rồng đỡ mọi đòn đánh.', statBonus: { phongThu: 110, sinhLucToiDa: 400 }, requiredLevel: 40, sellPrice: 3200, icon: '🛡️' },
  shield_03e: { id: 'shield_03e', name: 'Khiên Thánh Hoàng Gia Tier 3', type: 'aogiap', description: 'Khiên thánh bảo hộ kị sĩ ENDGAME.', statBonus: { phongThu: 280, sinhLucToiDa: 1200 }, requiredLevel: 85, sellPrice: 15000, icon: '🛡️' },

  helmet_01a: { id: 'helmet_01a', name: 'Mũ Kị Sĩ Trung Cổ Tier 1', type: 'mu', description: 'Mũ chiến bảo vệ vương giả.', statBonus: { phongThu: 15, sinhLucToiDa: 60 }, requiredLevel: 1, sellPrice: 200, icon: '🪖' },
  helmet_02a: { id: 'helmet_02a', name: 'Mũ Giáp Hoàng Gia Tier 2', type: 'mu', description: 'Mũ sắt mạ vàng vương vãi.', statBonus: { phongThu: 65, sinhLucToiDa: 250 }, requiredLevel: 30, sellPrice: 1800, icon: '🪖' },
  helmet_03e: { id: 'helmet_03e', name: 'Mũ Vương Giả Rồng Tier 3', type: 'mu', description: 'Mũ vương quyền kị sĩ rồng.', statBonus: { phongThu: 180, sinhLucToiDa: 800 }, requiredLevel: 80, sellPrice: 11000, icon: '🪖' },

  armor_01a: { id: 'armor_01a', name: 'Áo Giáp Thép Kị Sĩ Tier 1', type: 'aogiap', description: 'Áo giáp thép tấm bảo hộ.', statBonus: { phongThu: 30, sinhLucToiDa: 120 }, requiredLevel: 1, sellPrice: 300, icon: '🛡️' },
  armor_02a: { id: 'armor_02a', name: 'Áo Giáp Vàng Hoàng Gia Tier 2', type: 'aogiap', description: 'Giáp vàng đúc niken hoàng cung.', statBonus: { phongThu: 120, sinhLucToiDa: 450 }, requiredLevel: 40, sellPrice: 3500, icon: '🛡️' },
  armor_03e: { id: 'armor_03e', name: 'Áo Giáp Thần Rồng ENDGAME Tier 3', type: 'aogiap', description: 'Bộ giáp vảy rồng huyền thoại tối thượng.', statBonus: { phongThu: 300, sinhLucToiDa: 1500 }, requiredLevel: 90, sellPrice: 20000, icon: '🛡️' },

  // 💍 JEWELRY & RINGS
  ring_01a: { id: 'ring_01a', name: 'Nhẫn Hộ Mệnh Rune Tier 1', type: 'nhan', description: 'Nhẫn thần tỏa hào quang bảo hộ.', statBonus: { phongThu: 10, chiMang: 0.05 }, requiredLevel: 1, sellPrice: 250, icon: '💍' },
  necklace_01a: { id: 'necklace_01a', name: 'Dây Chuyền Hoàng Gia Tier 1', type: 'daychuyen', description: 'Dây chuyền vàng hộ thân quý giá.', statBonus: { sinhLucToiDa: 120, manaToiDa: 50 }, requiredLevel: 1, sellPrice: 300, icon: '📿' },

  // 🧪 POTIONS & CATALYSTS
  potion_01a: { id: 'potion_01a', name: 'Bình Dược Hồi HP Sơ Cấp', type: 'duoclieu', description: 'Dược phép hồi 200 HP tức thì.', sellPrice: 50, icon: '🧪' },
  potion_02a: { id: 'potion_02a', name: 'Thuốc Kháng Độc Hang Mỏ', type: 'duoclieu', description: 'Dược phép bảo vệ Thợ Mỏ khỏi khí độc hang sâu.', sellPrice: 100, icon: '🧪' },
  potion_03a: { id: 'potion_03a', name: 'Ma Dược Kích Rèn Thượng Cổ', type: 'duoclieu', description: 'Dược liệu kích nhiệt dung nung rèn trang bị.', sellPrice: 200, icon: '🧪' },

  // 🪨 ORES, CRYSTALS & GEMS
  ingot_01a: { id: 'ingot_01a', name: 'Thỏi Đồng Tinh Luyện', type: 'nguyenlieu', description: 'Thỏi kim loại nguyên chất rèn đồ Tier 1.', sellPrice: 100, icon: '🧱' },
  ingot_01b: { id: 'ingot_01b', name: 'Thỏi Sắt Gothic', type: 'nguyenlieu', description: 'Thỏi sắt cường lực rèn giáp.', sellPrice: 250, icon: '🧱' },
  ingot_01e: { id: 'ingot_01e', name: 'Thỏi Huyền Thiết Thượng Cổ', type: 'nguyenlieu', description: 'Kim loại huyền thoại rèn Excalibur.', sellPrice: 2000, icon: '🧱' },

  wood_01a: { id: 'wood_01a', name: 'Gỗ Sồi Cổ Trung Cổ', type: 'nguyenlieu', description: 'Gỗ chắc chắn rèn trượng và cung.', sellPrice: 50, icon: '🪵' },
  wood_01b: { id: 'wood_01b', name: 'Gỗ Thông Gothic', type: 'nguyenlieu', description: 'Gỗ dẻo dai làm cung tên.', sellPrice: 100, icon: '🪵' },

  crystal_01a: { id: 'crystal_01a', name: 'Tinh Thạch Lam Tier 1', type: 'nguyenlieu', description: 'Tinh thạch ma thuật dùng chế tác.', sellPrice: 150, icon: '🔮' },
  crystal_01j: { id: 'crystal_01j', name: 'Tinh Thạch Hoàng Kim', type: 'nguyenlieu', description: 'Tinh thạch tối thượng ngục tối.', sellPrice: 1500, icon: '💎' },
  gem_01a: { id: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', type: 'ngoc', description: 'Viên ngọc đỏ khảm vũ khí +80 ATK.', sellPrice: 300, icon: '💎' },

  // 📜 SPECIAL SCROLLS & KEYS
  scroll_reset_job: { id: 'scroll_reset_job', name: '📜 Sách Xóa Nghề Trung Cổ', type: 'tinh_nang', description: 'Xóa bỏ ngay lập tức thời gian chờ 24h thực chuyển Class Sản Xuất (PP).', sellPrice: 25000, icon: '📜' },
  key_01a: { id: 'key_01a', name: 'Chìa Khóa Ngục Tối Tầng 1', type: 'nguyenlieu', description: 'Chìa khóa sắt mở rương kho thạch.', sellPrice: 500, icon: '🗝️' },
  gift_01a: { id: 'gift_01a', name: 'Rương Báu Thượng Cổ', type: 'ruong', description: 'Rương chứa vũ khí & vàng.', sellPrice: 1000, icon: '🧰' },
  giftopen_01f: { id: 'giftopen_01f', name: 'Rương Vô Địch Rồng ENDGAME', type: 'ruong', description: 'Rương báu tối thượng chứa Thần Kiếm Excalibur.', sellPrice: 20000, icon: '🎁' },

  // 📜 SPELLBOOKS & SCROLLS
  spellbook_01a: { id: 'spellbook_01a', name: 'Bí Kíp Bão Lửa Gothic', type: 'tinh_nang', description: 'Sách phép thi triển chiêu thức bão lửa.', sellPrice: 500, icon: '📜' },
  scroll_01a: { id: 'scroll_01a', name: 'Cuộn Bùa Cường Hóa Tier 1', type: 'tinh_nang', description: 'Bùa phép dùng tăng cấp trang bị.', sellPrice: 400, icon: '📜' },

  // 🐟 PROVISIONS & COINS
  coin_01a: { id: 'coin_01a', name: 'Tiền Vàng Cổ Trung Cổ', type: 'nguyenlieu', description: 'Đồng tiền vàng lưu hành thương mại.', sellPrice: 10, icon: '🪙' },
  fish_01a: { id: 'fish_01a', name: 'Cá Đầm Lầy Gothic', type: 'duoclieu', description: 'Cá tươi nướng hồi 50 HP.', sellPrice: 30, icon: '🐟' },
};
