export interface Recipe {
  resultItemId: string;
  resultQty: number;
  requiredLevel: number;   // Yêu cầu Level nhân vật chi tiết (Fine-grained Level Lock)
  dongCost: number;        // Phí chế tạo (Đồng)
  materials: { itemId: string; quantity: number }[];
}

export const RECIPES: Recipe[] = [
  // =========================================================================
  // 🌿 TIER 1: VÙNG 1 - LÀNG XÓM SÔNG HỒNG (LEVEL 1 TO 9)
  // Nguyên liệu chuẩn Vùng 1: go_tre_gai, quang_dong, da_ca_sau
  // =========================================================================
  { resultItemId: 'dao_tre_gai', resultQty: 1, requiredLevel: 3, dongCost: 1000, materials: [{ itemId: 'go_tre_gai', quantity: 30 }] },
  { resultItemId: 'ao_la_chuoi', resultQty: 1, requiredLevel: 3, dongCost: 1000, materials: [{ itemId: 'go_tre_gai', quantity: 30 }] },
  { resultItemId: 'giao_tre_gai', resultQty: 1, requiredLevel: 5, dongCost: 2500, materials: [{ itemId: 'go_tre_gai', quantity: 45 }] },
  { resultItemId: 'non_la_chuoi', resultQty: 1, requiredLevel: 5, dongCost: 2000, materials: [{ itemId: 'go_tre_gai', quantity: 35 }] },
  { resultItemId: 'chuy_go_nhan', resultQty: 1, requiredLevel: 8, dongCost: 5000, materials: [{ itemId: 'go_tre_gai', quantity: 60 }] },
  { resultItemId: 'giap_tre_boc_mung', resultQty: 1, requiredLevel: 8, dongCost: 5000, materials: [{ itemId: 'go_tre_gai', quantity: 65 }] },

  // =========================================================================
  // 🌲 TIER 2: VÙNG 2 - RỪNG RẬM U MINH (LEVEL 10 TO 19)
  // Nguyên liệu chuẩn Vùng 2: go_nua_rung, go_tret, quang_bac, da_soi, nanh_ho_tin
  // =========================================================================
  { resultItemId: 'dao_mac_dong', resultQty: 1, requiredLevel: 10, dongCost: 10000, materials: [{ itemId: 'quang_dong', quantity: 40 }, { itemId: 'go_nua_rung', quantity: 30 }] },
  { resultItemId: 'giap_dong_co_loa', resultQty: 1, requiredLevel: 10, dongCost: 10000, materials: [{ itemId: 'quang_dong', quantity: 50 }] },
  { resultItemId: 'kinh_bat_quai', resultQty: 1, requiredLevel: 10, dongCost: 12000, materials: [{ itemId: 'quang_dong', quantity: 55 }] },
  { resultItemId: 'giao_dong_co_loa', resultQty: 1, requiredLevel: 12, dongCost: 15000, materials: [{ itemId: 'quang_dong', quantity: 65 }] },
  { resultItemId: 'no_bac_co_loa', resultQty: 1, requiredLevel: 12, dongCost: 18000, materials: [{ itemId: 'quang_bac', quantity: 45 }, { itemId: 'go_tret', quantity: 35 }] },
  { resultItemId: 'giap_bac_phong', resultQty: 1, requiredLevel: 12, dongCost: 18000, materials: [{ itemId: 'quang_bac', quantity: 50 }] },
  { resultItemId: 'ria_dong_co_loa', resultQty: 1, requiredLevel: 15, dongCost: 25000, materials: [{ itemId: 'quang_dong', quantity: 75 }, { itemId: 'go_nua_rung', quantity: 40 }] },
  { resultItemId: 'khien_dong_chim_lac', resultQty: 1, requiredLevel: 15, dongCost: 25000, materials: [{ itemId: 'quang_dong', quantity: 80 }] },
  { resultItemId: 'song_dao_dong', resultQty: 1, requiredLevel: 18, dongCost: 35000, materials: [{ itemId: 'quang_dong', quantity: 90 }] },
  { resultItemId: 'no_vang_co_loa', resultQty: 1, requiredLevel: 18, dongCost: 40000, materials: [{ itemId: 'quang_bac', quantity: 60 }, { itemId: 'nanh_ho_tin', quantity: 20 }] },
  { resultItemId: 'chuong_bac_bat_quai', resultQty: 1, requiredLevel: 18, dongCost: 40000, materials: [{ itemId: 'quang_bac', quantity: 70 }] },

  // =========================================================================
  // ⛰️ TIER 3: VÙNG 3 - THÁI NGUYÊN NÚI BA VÌ (LEVEL 20 TO 39)
  // Nguyên liệu chuẩn Vùng 3: quang_sat, quang_vang, go_lim_xanh, go_trac, ngoc_hong_bao, ngoc_bich, sung_ky_lan
  // =========================================================================
  { resultItemId: 'kiem_sat_ba_vi', resultQty: 1, requiredLevel: 20, dongCost: 50000, materials: [{ itemId: 'quang_sat', quantity: 55 }, { itemId: 'go_lim_xanh', quantity: 35 }] },
  { resultItemId: 'giap_sat_trao_phong', resultQty: 1, requiredLevel: 20, dongCost: 50000, materials: [{ itemId: 'quang_sat', quantity: 65 }] },
  { resultItemId: 'truy_sat_trao_phong', resultQty: 1, requiredLevel: 22, dongCost: 70000, materials: [{ itemId: 'quang_sat', quantity: 75 }] },
  { resultItemId: 'ao_da_soi', resultQty: 1, requiredLevel: 22, dongCost: 70000, materials: [{ itemId: 'da_soi', quantity: 50 }, { itemId: 'go_lim_xanh', quantity: 40 }] },
  { resultItemId: 'nhan_ngoc_bich', resultQty: 1, requiredLevel: 22, dongCost: 80000, materials: [{ itemId: 'ngoc_bich', quantity: 30 }, { itemId: 'quang_vang', quantity: 40 }] },
  { resultItemId: 'cung_no_sat', resultQty: 1, requiredLevel: 25, dongCost: 90000, materials: [{ itemId: 'quang_sat', quantity: 85 }, { itemId: 'go_lim_xanh', quantity: 45 }] },
  { resultItemId: 'kiem_hong_bao', resultQty: 1, requiredLevel: 25, dongCost: 100000, materials: [{ itemId: 'ngoc_hong_bao', quantity: 25 }, { itemId: 'quang_sat', quantity: 75 }] },
  { resultItemId: 'giap_vay_ca_sau', resultQty: 1, requiredLevel: 25, dongCost: 100000, materials: [{ itemId: 'da_ca_sau', quantity: 60 }, { itemId: 'quang_sat', quantity: 60 }] },
  { resultItemId: 'chuong_dong_phat', resultQty: 1, requiredLevel: 25, dongCost: 90000, materials: [{ itemId: 'quang_sat', quantity: 90 }] },
  { resultItemId: 'truy_dong_son', resultQty: 1, requiredLevel: 28, dongCost: 120000, materials: [{ itemId: 'quang_sat', quantity: 95 }, { itemId: 'go_lim_xanh', quantity: 50 }] },
  { resultItemId: 'giap_da_ca_sau', resultQty: 1, requiredLevel: 28, dongCost: 120000, materials: [{ itemId: 'da_ca_sau', quantity: 75 }, { itemId: 'quang_sat', quantity: 70 }] },
  { resultItemId: 'tram_ma_dao', resultQty: 1, requiredLevel: 30, dongCost: 180000, materials: [{ itemId: 'quang_sat', quantity: 110 }, { itemId: 'go_lim_xanh', quantity: 60 }] },
  { resultItemId: 'cung_go_trac', resultQty: 1, requiredLevel: 32, dongCost: 220000, materials: [{ itemId: 'go_trac', quantity: 65 }, { itemId: 'quang_sat', quantity: 95 }] },
  { resultItemId: 'giap_thep_tinh_luyen', resultQty: 1, requiredLevel: 32, dongCost: 220000, materials: [{ itemId: 'quang_sat', quantity: 130 }] },
  { resultItemId: 'song_tuyen_truy', resultQty: 1, requiredLevel: 35, dongCost: 300000, materials: [{ itemId: 'quang_sat', quantity: 150 }] },
  { resultItemId: 'song_dao_nanh_ho', resultQty: 1, requiredLevel: 38, dongCost: 400000, materials: [{ itemId: 'nanh_ho_tin', quantity: 50 }, { itemId: 'sung_ky_lan', quantity: 20 }] },
  { resultItemId: 'day_chuyen_ngoc_bich', resultQty: 1, requiredLevel: 38, dongCost: 400000, materials: [{ itemId: 'ngoc_bich', quantity: 55 }, { itemId: 'quang_vang', quantity: 60 }] },

  // =========================================================================
  // 🌌 TIER 4: VÙNG 4 - HẮC ẢM U MINH HẠ (LEVEL 40 TO 59)
  // Nguyên liệu chuẩn Vùng 4: huyen_thiet_thach, go_tram_huong, long_chim_lac
  // =========================================================================
  { resultItemId: 'thuong_huyen_thiet', resultQty: 1, requiredLevel: 40, dongCost: 500000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 75 }, { itemId: 'go_tram_huong', quantity: 55 }] },
  { resultItemId: 'giap_huyen_thiet', resultQty: 1, requiredLevel: 40, dongCost: 500000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 90 }] },
  { resultItemId: 'huyen_thiet_chuy', resultQty: 1, requiredLevel: 42, dongCost: 650000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 100 }] },
  { resultItemId: 'non_huyen_thiet', resultQty: 1, requiredLevel: 42, dongCost: 650000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 85 }] },
  { resultItemId: 'kiem_huyen_thiet', resultQty: 1, requiredLevel: 45, dongCost: 850000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 115 }] },
  { resultItemId: 'bua_thai_at', resultQty: 1, requiredLevel: 45, dongCost: 850000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 115 }] },
  { resultItemId: 'phap_bao_thai_at', resultQty: 1, requiredLevel: 48, dongCost: 1000000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 130 }, { itemId: 'go_tram_huong', quantity: 70 }] },
  { resultItemId: 'gay_tram_huong', resultQty: 1, requiredLevel: 50, dongCost: 1200000, materials: [{ itemId: 'go_tram_huong', quantity: 120 }] },
  { resultItemId: 'ao_tram_huong', resultQty: 1, requiredLevel: 50, dongCost: 1200000, materials: [{ itemId: 'go_tram_huong', quantity: 140 }] },
  { resultItemId: 'nhiem_giap_tram_huong', resultQty: 1, requiredLevel: 50, dongCost: 1350000, materials: [{ itemId: 'go_tram_huong', quantity: 150 }] },
  { resultItemId: 'truong_moc_tinh', resultQty: 1, requiredLevel: 52, dongCost: 1500000, materials: [{ itemId: 'go_tram_huong', quantity: 160 }, { itemId: 'huyen_thiet_thach', quantity: 90 }] },
  { resultItemId: 'nhan_than_kim', resultQty: 1, requiredLevel: 52, dongCost: 1600000, materials: [{ itemId: 'huyen_thiet_thach', quantity: 120 }, { itemId: 'long_chim_lac', quantity: 40 }] },
  { resultItemId: 'linh_moc_dao', resultQty: 1, requiredLevel: 55, dongCost: 1800000, materials: [{ itemId: 'go_tram_huong', quantity: 170 }, { itemId: 'huyen_thiet_thach', quantity: 100 }] },
  { resultItemId: 'no_long_chim_lac', resultQty: 1, requiredLevel: 58, dongCost: 2200000, materials: [{ itemId: 'long_chim_lac', quantity: 55 }, { itemId: 'huyen_thiet_thach', quantity: 110 }] },
  { resultItemId: 'giap_long_chim_lac', resultQty: 1, requiredLevel: 58, dongCost: 2200000, materials: [{ itemId: 'long_chim_lac', quantity: 65 }, { itemId: 'huyen_thiet_thach', quantity: 120 }] },

  // =========================================================================
  // 👑 TIER 5: VÙNG 5 - HOÀNG CUNG THẦN THOẠI NAM GIAO (LEVEL 60 TO 100+)
  // Nguyên liệu chuẩn Vùng 5: than_kim_thach, go_co_thu, vay_rong_bien, thien_thach_tinh, bup_sen
  // =========================================================================
  { resultItemId: 'cung_no_than', resultQty: 1, requiredLevel: 60, dongCost: 2800000, materials: [{ itemId: 'than_kim_thach', quantity: 80 }, { itemId: 'go_co_thu', quantity: 60 }] },
  { resultItemId: 'giap_moc_tinh', resultQty: 1, requiredLevel: 60, dongCost: 2800000, materials: [{ itemId: 'go_co_thu', quantity: 130 }] },
  { resultItemId: 'moc_tinh_tram_dao', resultQty: 1, requiredLevel: 65, dongCost: 3500000, materials: [{ itemId: 'go_co_thu', quantity: 160 }, { itemId: 'than_kim_thach', quantity: 95 }] },
  { resultItemId: 'trai_tim_my_chau', resultQty: 1, requiredLevel: 65, dongCost: 3500000, materials: [{ itemId: 'bup_sen', quantity: 35 }, { itemId: 'than_kim_thach', quantity: 95 }] },
  { resultItemId: 'kiem_vay_rong', resultQty: 1, requiredLevel: 68, dongCost: 4500000, materials: [{ itemId: 'vay_rong_bien', quantity: 55 }, { itemId: 'than_kim_thach', quantity: 115 }] },
  { resultItemId: 'giap_vay_rong', resultQty: 1, requiredLevel: 68, dongCost: 4500000, materials: [{ itemId: 'vay_rong_bien', quantity: 65 }, { itemId: 'than_kim_thach', quantity: 125 }] },
  { resultItemId: 'kiem_kim_quy', resultQty: 1, requiredLevel: 70, dongCost: 6000000, materials: [{ itemId: 'than_kim_thach', quantity: 170 }, { itemId: 'vay_rong_bien', quantity: 40 }] },
  { resultItemId: 'giap_kim_quy', resultQty: 1, requiredLevel: 70, dongCost: 6000000, materials: [{ itemId: 'than_kim_thach', quantity: 190 }, { itemId: 'go_co_thu', quantity: 80 }] },
  { resultItemId: 'thien_thach_kiem', resultQty: 1, requiredLevel: 75, dongCost: 8000000, materials: [{ itemId: 'thien_thach_tinh', quantity: 50 }, { itemId: 'than_kim_thach', quantity: 210 }] },
  { resultItemId: 'thien_thach_giap', resultQty: 1, requiredLevel: 75, dongCost: 8000000, materials: [{ itemId: 'thien_thach_tinh', quantity: 60 }, { itemId: 'than_kim_thach', quantity: 230 }] },
  { resultItemId: 'cung_chim_lac', resultQty: 1, requiredLevel: 80, dongCost: 10000000, materials: [{ itemId: 'than_kim_thach', quantity: 260 }, { itemId: 'vay_rong_bien', quantity: 70 }] },
  { resultItemId: 'chien_bao_chim_lac', resultQty: 1, requiredLevel: 80, dongCost: 10000000, materials: [{ itemId: 'than_kim_thach', quantity: 290 }, { itemId: 'go_co_thu', quantity: 100 }] },
  { resultItemId: 'dao_dong_son', resultQty: 1, requiredLevel: 85, dongCost: 14000000, materials: [{ itemId: 'than_kim_thach', quantity: 330 }, { itemId: 'thien_thach_tinh', quantity: 70 }] },
  { resultItemId: 'trong_dong_dong_son', resultQty: 1, requiredLevel: 85, dongCost: 14000000, materials: [{ itemId: 'than_kim_thach', quantity: 330 }, { itemId: 'bup_sen', quantity: 45 }] },
  { resultItemId: 'nam_giao_vu_khieu', resultQty: 1, requiredLevel: 88, dongCost: 18000000, materials: [{ itemId: 'vay_rong_bien', quantity: 85 }, { itemId: 'than_kim_thach', quantity: 370 }] },
  { resultItemId: 'nam_giao_chien_bao', resultQty: 1, requiredLevel: 88, dongCost: 18000000, materials: [{ itemId: 'vay_rong_bien', quantity: 95 }, { itemId: 'than_kim_thach', quantity: 390 }] },
  { resultItemId: 'kiem_thuan_thien', resultQty: 1, requiredLevel: 90, dongCost: 25000000, materials: [{ itemId: 'than_kim_thach', quantity: 460 }, { itemId: 'bup_sen', quantity: 65 }, { itemId: 'thien_thach_tinh', quantity: 90 }] },
  { resultItemId: 'chien_bao_au_lac', resultQty: 1, requiredLevel: 90, dongCost: 25000000, materials: [{ itemId: 'than_kim_thach', quantity: 460 }, { itemId: 'bup_sen', quantity: 65 }, { itemId: 'vay_rong_bien', quantity: 90 }] },
  { resultItemId: 'than_truy_lac_long', resultQty: 1, requiredLevel: 100, dongCost: 50000000, materials: [{ itemId: 'than_kim_thach', quantity: 620 }, { itemId: 'bup_sen', quantity: 110 }, { itemId: 'vay_rong_bien', quantity: 120 }] },
  { resultItemId: 'long_bao_nam_giao', resultQty: 1, requiredLevel: 100, dongCost: 50000000, materials: [{ itemId: 'than_kim_thach', quantity: 620 }, { itemId: 'bup_sen', quantity: 110 }, { itemId: 'thien_thach_tinh', quantity: 120 }] },
];
