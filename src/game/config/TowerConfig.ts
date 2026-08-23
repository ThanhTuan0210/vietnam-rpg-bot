import { BoonType, BoonRarity } from '../../database/models/TowerSession.model';

export interface BoonConfig {
  buffId: string;
  name: string;
  type: BoonType;
  value: number;
  secondaryValue?: number;
  rarity: BoonRarity;
  icon: string;
  desc: string;
}

export interface TowerEnemyStats {
  name: string;
  floor: number;
  isMiniBoss: boolean;
  isMajorBoss: boolean;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  critRes: number;
  icon: string;
  skillName?: string;
  skillMultiplier?: number;
}

export const SIGNATURE_BOONS: BoonConfig[] = [
  {
    buffId: 'huyet_ma_quy_quyet',
    name: '🩸 Huyết Ma Quỷ Quyết',
    type: 'ATK_PERCENT',
    value: 0.35,
    secondaryValue: -0.10,
    rarity: 'HIEM',
    icon: '🩸',
    desc: '+35% Ngoại công, nhưng trừ 10% Máu tối đa',
  },
  {
    buffId: 'kim_cang_bat_hoai',
    name: '🛡️ Kim Cang Bất Hoại',
    type: 'DEF_PERCENT',
    value: 0.45,
    rarity: 'THUONG',
    icon: '🛡️',
    desc: '+45% Hộ giáp phòng thủ',
  },
  {
    buffId: 'hap_huyet_than_cong',
    name: '🩸 Cửu Âm Hấp Huyết',
    type: 'LIFE_STEAL',
    value: 0.18,
    rarity: 'THAN_THOAI',
    icon: '🩸',
    desc: 'Hút 18% sát thương chuyển hóa thành Máu',
  },
  {
    buffId: 'cuu_thien_loi_kich',
    name: '⚡ Cửu Thiên Lôi Kích',
    type: 'CRIT_RATE',
    value: 0.25,
    secondaryValue: 0.60,
    rarity: 'HIEM',
    icon: '⚡',
    desc: '+25% Tỷ lệ Chí Mạng & +60% Sát thương Bạo kích',
  },
  {
    buffId: 'moc_linh_hoan_hon',
    name: '🌿 Mộc Linh Hoàn Hồn',
    type: 'HEAL_PER_FLOOR',
    value: 0.20,
    rarity: 'THUONG',
    icon: '🌿',
    desc: 'Hồi phục 20% Máu tối đa mỗi khi qua tầng',
  },
  {
    buffId: 'chan_khi_hoan_nguyen',
    name: '🔷 Chân Khí Hoàn Nguyên',
    type: 'MP_RESTORE',
    value: 40,
    rarity: 'THUONG',
    icon: '🔷',
    desc: 'Hồi 40 MP sau mỗi lượt đánh',
  },
  {
    buffId: 'quang_minh_phan_kich',
    name: '🌀 Quang Minh Phản Kích',
    type: 'REFLECT_DMG',
    value: 0.25,
    rarity: 'HIEM',
    icon: '🌀',
    desc: 'Phản lại 25% sát thương gánh chịu về phía quái',
  },
  {
    buffId: 'than_hath_vo_anh',
    name: '💨 Thần Hành Vô Ảnh',
    type: 'DODGE_STUN',
    value: 0.20,
    rarity: 'THAN_THOAI',
    icon: '💨',
    desc: '+20% Tỷ Lệ Né Đòn, khi né thành công gây choáng quái 1 lượt',
  },
];

export class TowerConfig {
  public static calculateEnemyStats(floor: number): TowerEnemyStats {
    const isMajorBoss = floor % 10 === 0;
    const isMiniBoss = !isMajorBoss && floor % 5 === 0;

    const baseHp = Math.floor(160 * Math.pow(1.075, floor - 1));
    const baseAtk = Math.floor(28 * Math.pow(1.068, floor - 1));
    const baseDef = Math.floor(18 * Math.pow(1.055, floor - 1));

    if (isMajorBoss) {
      const bossNames: Record<number, { name: string; icon: string; skill: string }> = {
        10: { name: 'Mộc Tinh Cổ Tháp', icon: '🌳', skill: 'Vạn Cây Trói Hồn' },
        20: { name: 'Bạch Xà Tinh Thượng Cổ', icon: '🐍', skill: 'Độc Sương Tàn Phế' },
        30: { name: 'Hắc Long Vương U Minh', icon: '🐉', skill: 'Long Nộ Diệt Vong' },
        40: { name: 'Quỷ Vương Phong Ấn', icon: '👹', skill: 'Ma Khí Tội Lỗi' },
        50: { name: 'Cửu Vĩ Yêu Hồ Thần Cấp', icon: '🦊', skill: 'Huyễn Mộng Đoạt Mạng' },
        60: { name: 'Trâu Vàng Thần Cốc', icon: '🐂', skill: 'Kim Ngưu Chấn Đất' },
        70: { name: 'Chim Lạc Thượng Cổ', icon: '🦅', skill: 'Đông Sơn Vũ Điệu' },
        80: { name: 'Thần Ngư Hóa Long', icon: '🐉', skill: 'Hồng Thủy Sóng Thần' },
        90: { name: 'Phượng Hoàng Lửa Tây Bắc', icon: '🔥', skill: 'Xích Hỏa Tái Sinh' },
        100: { name: 'Thần Sát Cổ Tháp Thượng Cổ (Tầng Tối Đại)', icon: '👑', skill: 'Thiên Địa Diệt Vong' },
      };

      const info = bossNames[floor] || {
        name: `Đại Trùm Thần Thoại Tầng ${floor}`,
        icon: '👑',
        skill: 'Thiên Địa Diệt Vong',
      };

      return {
        name: info.name,
        floor,
        isMiniBoss: false,
        isMajorBoss: true,
        hp: Math.floor(baseHp * 2.6),
        maxHp: Math.floor(baseHp * 2.6),
        atk: Math.floor(baseAtk * 2.6),
        def: Math.floor(baseDef * 2.6),
        critRes: 0.20,
        icon: info.icon,
        skillName: info.skill,
        skillMultiplier: 1.8,
      };
    }

    if (isMiniBoss) {
      return {
        name: `Thủ Vệ Tinh Anh Tầng ${floor}`,
        floor,
        isMiniBoss: true,
        isMajorBoss: false,
        hp: Math.floor(baseHp * 1.6),
        maxHp: Math.floor(baseHp * 1.6),
        atk: Math.floor(baseAtk * 1.6),
        def: Math.floor(baseDef * 1.6),
        critRes: 0.05,
        icon: '🛡️',
        skillName: 'Trầm Trảm',
        skillMultiplier: 1.4,
      };
    }

    const names = [
      { name: 'Âm Binh Dị Tộc', icon: '🧟' },
      { name: 'Sơn Tinh Ma Nữ', icon: '👺' },
      { name: 'Quỷ Tháp Cổ Tự', icon: '👻' },
    ];
    const picked = names[Math.floor(Math.random() * names.length)];

    return {
      name: `${picked.name} (Tầng ${floor})`,
      floor,
      isMiniBoss: false,
      isMajorBoss: false,
      hp: baseHp,
      maxHp: baseHp,
      atk: baseAtk,
      def: baseDef,
      critRes: 0.0,
      icon: picked.icon,
    };
  }

  public static roll3Boons(): BoonConfig[] {
    const shuffled = [...SIGNATURE_BOONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}
