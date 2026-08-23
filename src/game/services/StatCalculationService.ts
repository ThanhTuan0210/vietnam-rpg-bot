import { IUserAdvanced, NguHanhType } from '../../database/models/User.model';
import { ITEMS } from '../data/items';

export interface StatMatrix {
  // Sinh tồn
  totalMaxHp: number;
  totalMaxMp: number;

  // Công kích
  physicalAtk: number;
  magicAtk: number;
  atkBreakdown: { base: number; weapon: number; bonus: number; gem: number };
  critRate: number;        // 0.0 -> 1.0 (ví dụ: 0.285 = 28.5%)
  critDmg: number;         // 1.50 -> 2.50 (ví dụ: 1.75 = 175%)
  armorPen: number;        // 0.0 -> 0.50 (ví dụ: 0.15 = 15%)

  // Phòng vệ & Cơ động
  physicalDef: number;
  magicRes: number;
  dmgReductionPercent: number; // Ví dụ: 38.5%
  dodgeRate: number;       // 0.0 -> 0.40 (ví dụ: 0.12 = 12%)
  lifeSteal: number;       // 0.0 -> 0.30 (ví dụ: 0.05 = 5%)

  // Bản Mệnh Ngũ Hành
  nguHanh: NguHanhType;
  nguHanhDesc: string;

  // Cảnh Giới & Lực Chiến
  realmName: string;
  combatPower: number;
}

export class StatCalculationService {
  /**
   * Tính toán toàn bộ Ma Trận Chỉ Số của Người Chơi
   */
  public static calculateFullMatrix(user: IUserAdvanced): StatMatrix {
    const level = user.canhGioi.capDo;

    // 1. Chỉ số Sinh Tồn
    let gearHp = 0;
    let gemHp = 0;
    let gearMp = 0;

    // Vũ khí
    let weaponAtk = 0;
    if (user.trangBi.vuKhi && ITEMS[user.trangBi.vuKhi.itemId]) {
      const w = ITEMS[user.trangBi.vuKhi.itemId];
      if (w.statBonus?.satThuong) weaponAtk = w.statBonus.satThuong;
    }

    // Giáp
    let armorDef = 0;
    if (user.trangBi.aoGiap && ITEMS[user.trangBi.aoGiap.itemId]) {
      const a = ITEMS[user.trangBi.aoGiap.itemId];
      if (a.statBonus?.phongThu) armorDef = a.statBonus.phongThu;
      if (a.statBonus?.sinhLucToiDa) gearHp += a.statBonus.sinhLucToiDa;
    }

    // Tính % HP từ Cường hóa Áo Giáp (+5%, +15%, +25%, +50%, +75%)
    const armorBonusHpPercent = user.trangBi.aoGiap?.bonusStat || 0;
    const baseMaxHp = 100 + level * 25 + gearHp + gemHp;
    const totalMaxHp = Math.floor(baseMaxHp * (1 + armorBonusHpPercent / 100));

    const totalMaxMp = Math.floor(50 + level * 10 + gearMp);

    // 2. Chỉ số Công Kích & Sát Thương
    const baseAtk = user.chiSo.satThuong;
    const gemAtk = user.trangBi.vuKhi?.khamNgoc ? 20 : 0; // Ngọc khảm cộng 20 ATK

    // Tính % ATK từ Cường hóa Vũ Khí (+5%, +15%, +25%, +50%, +75%)
    const weaponBonusAtkPercent = user.trangBi.vuKhi?.bonusStat || 0;
    const basePhysicalAtk = baseAtk + weaponAtk + gemAtk;
    const physicalAtk = Math.floor(basePhysicalAtk * (1 + weaponBonusAtkPercent / 100));

    const magicAtk = user.chiSo.magicAtk + Math.floor(physicalAtk * 0.4);

    let critRate = user.chiSo.chiMang;
    if (user.hePhai === 'THO_SAN') critRate += 0.15;
    critRate = Math.min(1.0, Math.max(0.05, critRate));

    const critDmg = user.chiSo.critDmg || 1.50; // Mặc định 150%
    const armorPen = user.chiSo.armorPen || 0.0;

    // 3. Chỉ số Phòng Vệ & Cơ Động
    const baseDef = user.chiSo.phongThu;
    const physicalDef = baseDef + armorDef;
    const magicRes = user.chiSo.magicRes + Math.floor(physicalDef * 0.5);

    // Công thức đường cong giảm sát thương nhận vào (Damage Reduction %)
    const dmgReduction = (physicalDef / (physicalDef + 100 + level * 10)) * 100;
    const dmgReductionPercent = Math.min(85, Math.max(0, parseFloat(dmgReduction.toFixed(1))));

    let dodgeRate = user.chiSo.neTranh;
    if (user.hePhai === 'THO_SAN') dodgeRate += 0.10;
    dodgeRate = Math.min(0.40, Math.max(0.0, dodgeRate)); // Max 40%

    let lifeSteal = user.chiSo.lifeSteal;
    if (user.hePhai === 'THO_SAN') lifeSteal += 0.05;

    // 4. Bản Mệnh Ngũ Hành
    const nguHanh = user.nguHanh || 'KIM';
    const nguHanhMap: Record<NguHanhType, string> = {
      KIM: 'Kim - Sát Thương Vật Lý & Chí Mạng',
      MOC: 'Mộc - Sinh Lực & Tự Hồi Phục',
      THUY: 'Thủy - Mana & Giảm Cooldown',
      HOA: 'Hỏa - Sát Thương Bạo Kích & Xuyên Giáp',
      THO: 'Thổ - Giáp Kiên Cố & Kháng Phép',
    };

    // 5. Cảnh Giới & Lực Chiến
    const realmNames = [
      'Phàm Nhân (Luyện Thể)',
      'Luyện Khí Kỳ',
      'Trúc Cơ Kỳ',
      'Kim Đan Kỳ',
      'Nguyên Anh Kỳ',
      'Hóa Thần Kỳ',
      'Luyện Hư Kỳ',
      'Hợp Thể Kỳ',
      'Đại Thừa Kỳ',
      'Độ Kiếp Thành Tiên',
    ];
    const realmIndex = Math.min(realmNames.length - 1, Math.floor((level - 1) / 10));
    const realmName = realmNames[realmIndex];

    const combatPower = Math.floor(
      physicalAtk * 2.5 +
        physicalDef * 2.0 +
        totalMaxHp * 0.5 +
        critRate * 500 +
        critDmg * 300 +
        dodgeRate * 400 +
        level * 50
    );

    return {
      totalMaxHp,
      totalMaxMp,
      physicalAtk,
      magicAtk,
      atkBreakdown: {
        base: baseAtk,
        weapon: weaponAtk,
        bonus: Math.floor(basePhysicalAtk * (weaponBonusAtkPercent / 100)),
        gem: gemAtk,
      },
      critRate,
      critDmg,
      armorPen,
      physicalDef,
      magicRes,
      dmgReductionPercent,
      dodgeRate,
      lifeSteal,
      nguHanh,
      nguHanhDesc: nguHanhMap[nguHanh],
      realmName,
      combatPower,
    };
  }
}
