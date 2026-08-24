"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEMS = exports.CUSTOM_EMOJIS = void 0;
exports.getItemIcon = getItemIcon;
exports.CUSTOM_EMOJIS = {};
function getItemIcon(itemId, defaultIcon = '📦') {
    if (exports.CUSTOM_EMOJIS[itemId]) {
        return exports.CUSTOM_EMOJIS[itemId];
    }
    const item = exports.ITEMS[itemId];
    return item?.icon || defaultIcon;
}
exports.ITEMS = {
    // ⚔️ WEAPONS (SWORDS, STAVES, BOWS)
    sword_01a: { id: 'sword_01a', name: 'Thép Kiếm Gothic Tier 1', type: 'vukhi', description: 'Thanh kiếm sắt trung cổ của kị sĩ tập sự.', statBonus: { satThuong: 35 }, requiredLevel: 1, sellPrice: 300, icon: '⚔️' },
    sword_02a: { id: 'sword_02a', name: 'Bảo Kiếm Hoàng Gia Tier 2', type: 'vukhi', description: 'Thanh kiếm thép tinh luyện của hoàng gia.', statBonus: { satThuong: 120 }, requiredLevel: 25, sellPrice: 1500, icon: '⚔️' },
    sword_03e: { id: 'sword_03e', name: 'Bảo Kiếm Excalibur Tier 3', type: 'vukhi', description: 'Thần kiếm Excalibur huyền thoại của Vương Quốc Trung Cổ.', statBonus: { satThuong: 450, chiMang: 0.25 }, requiredLevel: 85, sellPrice: 10000, icon: '⚔️' },
    staff_01a: { id: 'staff_01a', name: 'Trượng Gỗ Rừng Tier 1', type: 'vukhi', description: 'Pháp trượng tích tụ linh khí đại ngàn.', statBonus: { satThuong: 40, manaToiDa: 50 }, requiredLevel: 1, sellPrice: 350, icon: '🔮' },
    staff_03e: { id: 'staff_03e', name: 'Trượng Linh Hồn Rồng Tier 3', type: 'vukhi', description: 'Pháp trượng triệu hồi quyền năng Rồng Thần.', statBonus: { satThuong: 500, manaToiDa: 400 }, requiredLevel: 85, sellPrice: 12000, icon: '🔮' },
    bow_01a: { id: 'bow_01a', name: 'Cung Tinh Linh Tier 1', type: 'vukhi', description: 'Cung thần uốn từ gỗ trắc ngàn năm.', statBonus: { satThuong: 32, chiMang: 0.1 }, requiredLevel: 1, sellPrice: 320, icon: '🏹' },
    arrow_01a: { id: 'arrow_01a', name: 'Mũi Tên Độc Trung Cổ', type: 'nguyenlieu', description: 'Mũi tên tẩm độc bão kích.', sellPrice: 20, icon: '🏹' },
    // 🛡️ ARMOR & HELMETS
    shield_01a: { id: 'shield_01a', name: 'Khiên Thép Gothic Tier 1', type: 'aogiap', description: 'Khiên giáp thép kiên cố bảo vệ kị sĩ.', statBonus: { phongThu: 25, sinhLucToiDa: 100 }, requiredLevel: 1, sellPrice: 280, icon: '🛡️' },
    helmet_01a: { id: 'helmet_01a', name: 'Mũ Kị Sĩ Trung Cổ Tier 1', type: 'mu', description: 'Mũ chiến bảo vệ vương giả.', statBonus: { phongThu: 15, sinhLucToiDa: 60 }, requiredLevel: 1, sellPrice: 200, icon: '🪖' },
    // 💍 JEWELRY
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
    crystal_01a: { id: 'crystal_01a', name: 'Tinh Thạch Lam Tier 1', type: 'nguyenlieu', description: 'Tinh thạch ma thuật dùng chế tác.', sellPrice: 150, icon: '🔮' },
    crystal_01j: { id: 'crystal_01j', name: 'Tinh Thạch Hoàng Kim', type: 'nguyenlieu', description: 'Tinh thạch tối thượng ngục tối.', sellPrice: 1500, icon: '💎' },
    gem_01a: { id: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', type: 'ngoc', description: 'Viên ngọc đỏ khảm vũ khí +80 ATK.', sellPrice: 300, icon: '💎' },
    // 🗝️ KEYS & CHESTS
    key_01a: { id: 'key_01a', name: 'Chìa Khóa Rừng Goblin', type: 'tinh_nang', description: 'Chìa khóa mở rương ngục tối tầng 1.', sellPrice: 150, icon: '🗝️' },
    key_02b: { id: 'key_02b', name: 'Chìa Khóa Vương Tọa Rồng', type: 'tinh_nang', description: 'Chìa khóa mở Rương Thần Thoại tầng 7.', sellPrice: 3000, icon: '🗝️' },
    gift_01a: { id: 'gift_01a', name: 'Rương Gỗ Gothic', type: 'ruong', description: 'Rương báu tầng 1 chứa ngọc & vàng.', sellPrice: 300, icon: '📦' },
    giftopen_01f: { id: 'giftopen_01f', name: 'Rương Vô Địch Rồng ENDGAME', type: 'ruong', description: 'Rương báu tối thượng chứa Thần Kiếm Excalibur.', sellPrice: 20000, icon: '🎁' },
    // 📜 SPELLBOOKS & SCROLLS
    spellbook_01a: { id: 'spellbook_01a', name: 'Bí Kíp Bão Lửa Gothic', type: 'tinh_nang', description: 'Sách phép thi triển chiêu thức bão lửa.', sellPrice: 500, icon: '📜' },
    scroll_01a: { id: 'scroll_01a', name: 'Cuộn Bùa Cường Hóa Tier 1', type: 'tinh_nang', description: 'Bùa phép dùng tăng cấp trang bị.', sellPrice: 400, icon: '📜' },
    // 🐟 PROVISIONS & COINS
    coin_01a: { id: 'coin_01a', name: 'Tiền Vàng Cổ Trung Cổ', type: 'nguyenlieu', description: 'Đồng tiền vàng lưu hành thương mại.', sellPrice: 10, icon: '🪙' },
    fish_01a: { id: 'fish_01a', name: 'Cá Đầm Lầy Gothic', type: 'duoclieu', description: 'Cá tươi nướng hồi 50 HP.', sellPrice: 30, icon: '🐟' },
};
