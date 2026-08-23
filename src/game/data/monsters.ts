export interface MonsterDrop {
  itemId: string;
  chance: number; // 0.20 = 20%
  minQty: number;
  maxQty: number;
}

export interface Monster {
  id: string;
  name: string;
  area: number;
  isBoss: boolean;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  expReward: number;
  dongReward: number;
  dropTable: MonsterDrop[];
  icon: string;
  description: string;
}

export const MONSTERS: Monster[] = [
  // --- VÙNG 1: RỪNG ĐẦM LẦY (CẤP 1 - 10) ---
  {
    id: 'ma_da',
    name: 'Ma Da Đầm Lầy',
    area: 1,
    isBoss: false,
    hp: 80,
    maxHp: 80,
    atk: 15,
    def: 3,
    expReward: 60,
    dongReward: 180,
    dropTable: [
      { itemId: 'da_ca_sau', chance: 0.20, minQty: 1, maxQty: 1 },
      { itemId: 'go_tre_gai', chance: 0.20, minQty: 1, maxQty: 2 },
    ],
    icon: '🧟',
    description: 'Oan hồn vương vấn dưới làn nước sông Hồng tàn khốc.',
  },
  {
    id: 'heo_rung_tinh',
    name: 'Heo Rừng Tinh Hắc Sơn',
    area: 1,
    isBoss: false,
    hp: 120,
    maxHp: 120,
    atk: 22,
    def: 5,
    expReward: 100,
    dongReward: 320,
    dropTable: [
      { itemId: 'da_ca_sau', chance: 0.20, minQty: 1, maxQty: 1 },
      { itemId: 'go_tre_gai', chance: 0.20, minQty: 1, maxQty: 2 },
    ],
    icon: '🐗',
    description: 'Con nanh lợn lòi hung tợn bị ma khí xâm nhập.',
  },
  {
    id: 'boss_quy_thon',
    name: 'Quỷ Thôn Sông Hồng (Trùm Vùng 1)',
    area: 1,
    isBoss: true,
    hp: 800,
    maxHp: 800,
    atk: 45,
    def: 12,
    expReward: 1200,
    dongReward: 12000,
    dropTable: [
      { itemId: 'ruong_dong', chance: 0.8, minQty: 1, maxQty: 1 },
      { itemId: 'dao_mac_dong', chance: 0.5, minQty: 1, maxQty: 1 },
      { itemId: 'quang_dong', chance: 1.0, minQty: 5, maxQty: 10 },
    ],
    icon: '👹',
    description: 'Đại ma đầu gieo rắc tai ấu khắp xóm làng sông Hồng.',
  },

  // --- VÙNG 2: PHONG CHÂU NÚI TẢN (CẤP 11 - 25) ---
  {
    id: 'soi_tuyet_am_linh',
    name: 'Sói Rừng Âm Linh',
    area: 2,
    isBoss: false,
    hp: 250,
    maxHp: 250,
    atk: 38,
    def: 10,
    expReward: 220,
    dongReward: 700,
    dropTable: [
      { itemId: 'da_soi', chance: 0.20, minQty: 1, maxQty: 1 },
      { itemId: 'quang_dong', chance: 0.20, minQty: 1, maxQty: 2 },
      { itemId: 'nanh_ho_tin', chance: 0.20, minQty: 1, maxQty: 1 },
    ],
    icon: '🐺',
    description: 'Bầy sói hoang săn mồi dưới sương mù Ba Vì.',
  },
  {
    id: 'boss_moc_tinh_ngan_nam',
    name: 'Mộc Tinh U Minh Ngàn Năm (Trùm Vùng 2)',
    area: 2,
    isBoss: true,
    hp: 2500,
    maxHp: 2500,
    atk: 110,
    def: 35,
    expReward: 3500,
    dongReward: 35000,
    dropTable: [
      { itemId: 'ruong_bac', chance: 0.8, minQty: 1, maxQty: 1 },
      { itemId: 'no_bac_co_loa', chance: 0.5, minQty: 1, maxQty: 1 },
      { itemId: 'quang_sat', chance: 1.0, minQty: 8, maxQty: 15 },
    ],
    icon: '🌳',
    description: 'Yêu tinh cây cổ thụ ngàn năm hóa thần dữ tợn.',
  },

  // --- VÙNG 3: BẠCH ĐẰNG GIANG (CẤP 26 - 40) ---
  {
    id: 'ky_lan_hac_ha',
    name: 'Kỳ Lân Hắc Hà',
    area: 3,
    isBoss: false,
    hp: 450,
    maxHp: 450,
    atk: 65,
    def: 18,
    expReward: 480,
    dongReward: 1500,
    dropTable: [
      { itemId: 'sung_ky_lan', chance: 0.20, minQty: 1, maxQty: 1 },
      { itemId: 'quang_sat', chance: 0.20, minQty: 1, maxQty: 2 },
      { itemId: 'ngoc_hong_bao', chance: 0.20, minQty: 1, maxQty: 1 },
    ],
    icon: '🦄',
    description: 'Linh thú bị ma hóa biến thành mãnh thú cuồng sát.',
  },
  {
    id: 'boss_thuy_tinh_hung_do',
    name: 'Thủy Tinh Hung Đồ Ba Vì (Trùm Vùng 3)',
    area: 3,
    isBoss: true,
    hp: 8000,
    maxHp: 8000,
    atk: 280,
    def: 80,
    expReward: 10000,
    dongReward: 100000,
    dropTable: [
      { itemId: 'ruong_vang', chance: 0.8, minQty: 1, maxQty: 1 },
      { itemId: 'tram_ma_dao', chance: 0.4, minQty: 1, maxQty: 1 },
      { itemId: 'ngoc_hong_bao', chance: 1.0, minQty: 8, maxQty: 12 },
    ],
    icon: '🌊',
    description: 'Chúa tể sông biển dâng nước cuồng nộ đánh phá Sơn Tinh.',
  },

  // --- VÙNG 4: U MINH CỔ CỐC (CẤP 41 - 60) ---
  {
    id: 'than_huyen_thiet_quy',
    name: 'Quỷ Huyền Thiết',
    area: 4,
    isBoss: false,
    hp: 800,
    maxHp: 800,
    atk: 100,
    def: 30,
    expReward: 950,
    dongReward: 3000,
    dropTable: [
      { itemId: 'huyen_thiet_thach', chance: 0.20, minQty: 1, maxQty: 1 },
      { itemId: 'go_tram_huong', chance: 0.20, minQty: 1, maxQty: 2 },
      { itemId: 'long_chim_lac', chance: 0.20, minQty: 1, maxQty: 1 },
    ],
    icon: '👹',
    description: 'Quỷ sắt đen mình đồng da sắt canh giữ hầm mỏ cổ.',
  },
  {
    id: 'boss_quy_vuong_u_minh',
    name: 'Quỷ Vương U Minh Hạ (Trùm Vùng 4)',
    area: 4,
    isBoss: true,
    hp: 25000,
    maxHp: 25000,
    atk: 650,
    def: 200,
    expReward: 25000,
    dongReward: 300000,
    dropTable: [
      { itemId: 'ruong_huyen_thiet', chance: 0.8, minQty: 1, maxQty: 1 },
      { itemId: 'thuong_huyen_thiet', chance: 0.4, minQty: 1, maxQty: 1 },
      { itemId: 'huyen_thiet_thach', chance: 1.0, minQty: 10, maxQty: 15 },
    ],
    icon: '👑',
    description: 'Quỷ vương tàn bạo xưng bá cõi U Minh Hạ.',
  },

  // --- VÙNG 5: HOÀNG CUNG THẦN THOẠI (CẤP 61 - 100+) ---
  {
    id: 'boss_nam_giao_raider',
    name: 'Thần Long Thượng Cổ Nam Giao (Trùm Vùng 5 - Bá Chủ)',
    area: 5,
    isBoss: true,
    hp: 80000,
    maxHp: 80000,
    atk: 1800,
    def: 500,
    expReward: 75000,
    dongReward: 1000000,
    dropTable: [
      { itemId: 'ruong_huyen_thiet', chance: 1.0, minQty: 1, maxQty: 1 },
      { itemId: 'kiem_vay_rong', chance: 0.4, minQty: 1, maxQty: 1 },
      { itemId: 'vay_rong_bien', chance: 1.0, minQty: 10, maxQty: 15 },
      { itemId: 'bup_sen', chance: 1.0, minQty: 10, maxQty: 15 },
    ],
    icon: '🐉',
    description: 'Thượng cổ thần long ngàn năm bá chủ vùng biển Nam Giao.',
  },
];
