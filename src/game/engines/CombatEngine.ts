import { IUserAdvanced, HePhaiType } from '../../database/models/User.model';
import { IMonsterAdvanced, IMonsterSkill, StatusEffectType } from '../../database/models/Monster.model';
import { ITEMS } from '../data/items';

export interface CombatActionOutput {
  attackerName: string;
  defenderName: string;
  actionName: string;
  damageDealt: number;
  isCrit: boolean;
  isDodge: boolean;
  isEnraged?: boolean;
  statusApplied?: StatusEffectType;
  logText: string;
}

export interface ActiveStatusEffect {
  type: StatusEffectType;
  duration: number; // Lượt còn lại
  value?: number;
}

export interface CombatState {
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  playerAtk: number;
  playerDef: number;
  playerCrit: number;
  playerDodge: number;
  playerStatus: ActiveStatusEffect[];

  monsterHp: number;
  monsterMaxHp: number;
  monsterAtk: number;
  monsterDef: number;
  monsterDodge?: number;
  monsterStatus: ActiveStatusEffect[];
  isEnraged: boolean;
}

export class CombatEngineAdvanced {
  /**
   * Tính toán chỉ số tổng của người chơi (Gốc + Phân loại Hệ Phái + Cường hóa Vũ khí/Giáp)
   */
  public static calculateTotalStats(user: IUserAdvanced): {
    totalAtk: number;
    totalDef: number;
    totalMaxHp: number;
    totalMaxMp: number;
    totalCrit: number;
    totalDodge: number;
  } {
    let totalAtk = user.chiSo.satThuong;
    let totalDef = user.chiSo.phongThu;
    let totalMaxHp = user.chiSo.maxHp;
    let totalMaxMp = user.chiSo.maxMp;
    let totalCrit = user.chiSo.chiMang;
    let totalDodge = user.chiSo.neTranh;

    // Bonus theo Hệ Phái
    if (user.hePhai === 'DUNG_TUONG') {
      totalMaxHp += 50;
      totalDef += 10;
    } else if (user.hePhai === 'DAO_SI') {
      totalMaxMp += 40;
      totalAtk += 15;
    } else if (user.hePhai === 'THO_SAN') {
      totalCrit += 0.15;  // +15% Crit
      totalDodge += 0.10; // +10% Dodge
    }

    // Trang bị Vũ khí (+Cường hóa)
    if (user.trangBi.vuKhi && ITEMS[user.trangBi.vuKhi.itemId]) {
      const w = ITEMS[user.trangBi.vuKhi.itemId];
      if (w.statBonus?.satThuong) totalAtk += w.statBonus.satThuong;
      if (user.trangBi.vuKhi.bonusStat) totalAtk += user.trangBi.vuKhi.bonusStat;
    }

    // Trang bị Áo giáp (+Cường hóa)
    if (user.trangBi.aoGiap && ITEMS[user.trangBi.aoGiap.itemId]) {
      const a = ITEMS[user.trangBi.aoGiap.itemId];
      if (a.statBonus?.phongThu) totalDef += a.statBonus.phongThu;
      if (a.statBonus?.sinhLucToiDa) totalMaxHp += a.statBonus.sinhLucToiDa;
      if (user.trangBi.aoGiap.bonusStat) totalDef += user.trangBi.aoGiap.bonusStat;
    }

    return { totalAtk, totalDef, totalMaxHp, totalMaxMp, totalCrit, totalDodge };
  }

  /**
   * Tính toán đòn đánh thường (Normal Attack)
   */
  public static executeNormalAttack(
    attackerName: string,
    defenderName: string,
    atk: number,
    critRate: number,
    defenderDef: number,
    defenderDodge: number
  ): CombatActionOutput {
    // 1. Kiểm tra Né Tránh
    if (Math.random() < defenderDodge) {
      return {
        attackerName,
        defenderName,
        actionName: 'Đánh Thường',
        damageDealt: 0,
        isCrit: false,
        isDodge: true,
        logText: `💨 **${defenderName}** linh hoạt thân thủ **NÉ HỤT (MISS)** đòn đánh của **${attackerName}**!`,
      };
    }

    // 2. Tính Sát Thương Base
    let damage = Math.max(1, Math.floor(atk - defenderDef * 0.5));

    // 3. Tính Chí Mạng
    const isCrit = Math.random() < critRate;
    if (isCrit) {
      damage = Math.floor(damage * 1.5);
    }

    return {
      attackerName,
      defenderName,
      actionName: 'Đánh Thường',
      damageDealt: damage,
      isCrit,
      isDodge: false,
      logText: isCrit
        ? `💥 **${attackerName}** vung đòn **CHÍ MẠNG (CRIT 150%)** gây **${damage}** sát thương lên **${defenderName}**!`
        : `⚔️ **${attackerName}** tấn công **${defenderName}** gây **${damage}** sát thương!`,
    };
  }

  /**
   * Xử lý thi triển Kỹ Năng Hệ Phái của Người chơi
   */
  public static executeClassSkill(
    user: IUserAdvanced,
    state: CombatState,
    monsterName: string
  ): { output: CombatActionOutput; updatedState: CombatState; mpDeducted: number; errorMsg?: string } {
    const updatedState = { ...state };
    const classType = user.hePhai;

    if (!classType) {
      return {
        output: null as any,
        updatedState,
        mpDeducted: 0,
        errorMsg: '❌ Bạn chưa chọn Hệ Phái! Hãy gõ `vn batdau` để chọn Hệ Phái.',
      };
    }

    // DŨNG TƯỚNG
    if (classType === 'DUNG_TUONG') {
      const mpCost = 15;
      if (updatedState.playerMp < mpCost) {
        return { output: null as any, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 15 MP)!' };
      }

      updatedState.playerMp -= mpCost;

      // Chiêu 1: Trảm Kích (130% ATK)
      if (Math.random() < (updatedState.monsterDodge || 0.05)) {
        return {
          output: {
            attackerName: 'Bạn',
            defenderName: monsterName,
            actionName: 'Trảm Kích',
            damageDealt: 0,
            isCrit: false,
            isDodge: true,
            logText: `💨 **${monsterName}** né tránh thành công tuyệt chiêu **Trảm Kích** của Dũng Tướng!`,
          },
          updatedState,
          mpDeducted: mpCost,
        };
      }

      let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.3 - updatedState.monsterDef * 0.5));
      const isCrit = Math.random() < updatedState.playerCrit;
      if (isCrit) dmg = Math.floor(dmg * 1.5);

      return {
        output: {
          attackerName: 'Bạn',
          defenderName: monsterName,
          actionName: 'Trảm Kích',
          damageDealt: dmg,
          isCrit,
          isDodge: false,
          logText: isCrit
        ? `🔥 **DŨNG TƯỚNG** giáng tuyệt kỹ **TRẢM KÍCH CHÍ MẠNG** gây **${dmg}** sát thương kinh thiên!`
        : `⚔️ **DŨNG TƯỚNG** tung tuyệt kỹ **Trảm Kích (130% ATK)** gây **${dmg}** sát thương!`,
        },
        updatedState,
        mpDeducted: mpCost,
      };
    }

    // ĐẠO SĨ
    if (classType === 'DAO_SI') {
      const mpCost = 25;
      if (updatedState.playerMp < mpCost) {
        return { output: null as any, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 25 MP)!' };
      }

      updatedState.playerMp -= mpCost;

      // Chiêu 1: Ngũ Lôi Trừ Tà (180% Magic DMG + Thiêu Đốt)
      let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.8 - updatedState.monsterDef * 0.3));
      const isCrit = Math.random() < updatedState.playerCrit;
      if (isCrit) dmg = Math.floor(dmg * 1.5);

      // Áp dụng Thiêu Đốt 3 lượt
      updatedState.monsterStatus.push({ type: 'THIEU_DOT', duration: 3, value: Math.floor(updatedState.monsterMaxHp * 0.05) });

      return {
        output: {
          attackerName: 'Bạn',
          defenderName: monsterName,
          actionName: 'Ngũ Lôi Trừ Tà',
          damageDealt: dmg,
          isCrit,
          isDodge: false,
          statusApplied: 'THIEU_DOT',
          logText: `⚡ **ĐẠO SĨ** triệu hồi **NGŨ LÔI TRỪ TÀ (180% Magic DMG)** giáng **${dmg}** sát thương và yểm **🔥 Thiêu Đốt** lên **${monsterName}**!`,
        },
        updatedState,
        mpDeducted: mpCost,
      };
    }

    // THỢ SĂN
    if (classType === 'THO_SAN') {
      const mpCost = 20;
      if (updatedState.playerMp < mpCost) {
        return { output: null as any, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 20 MP)!' };
      }

      updatedState.playerMp -= mpCost;

      // Chiêu 1: Xuyên Vân Tiễn (Bỏ qua 40% DEF, +30% Crit)
      const effectiveDef = updatedState.monsterDef * 0.6;
      let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.4 - effectiveDef * 0.5));
      const isCrit = Math.random() < (updatedState.playerCrit + 0.3);
      if (isCrit) dmg = Math.floor(dmg * 1.5);

      return {
        output: {
          attackerName: 'Bạn',
          defenderName: monsterName,
          actionName: 'Xuyên Vân Tiễn',
          damageDealt: dmg,
          isCrit,
          isDodge: false,
          logText: isCrit
        ? `🏹 **THỢ SĂN** bắn **XUYÊN VÂN TIỄN CHÍ MẠNG** xuyên qua giáp giáng **${dmg}** sát thương!`
        : `🏹 **THỢ SĂN** giương nỏ thần bắn **Xuyên Vân Tiễn (Xuyên 40% Giáp)** gây **${dmg}** sát thương!`,
        },
        updatedState,
        mpDeducted: mpCost,
      };
    }

    return { output: null as any, updatedState, mpDeducted: 0, errorMsg: 'Hệ phái không hợp lệ.' };
  }

  /**
   * Xử lý lượt tấn công của Quái / Boss (bao gồm Giai đoạn Cuồng Bạo Enrage)
   */
  public static executeMonsterTurn(
    monster: IMonsterAdvanced,
    state: CombatState
  ): { output: CombatActionOutput; updatedState: CombatState } {
    const updatedState = { ...state };

    // Kiểm tra kích hoạt Cuồng Bạo (Enrage) nếu Boss HP < 30%
    if (monster.isBoss && !updatedState.isEnraged && updatedState.monsterHp / updatedState.monsterMaxHp <= 0.3) {
      updatedState.isEnraged = true;
      updatedState.monsterAtk = Math.floor(updatedState.monsterAtk * 1.5); // +50% ATK
      updatedState.monsterDef = Math.floor(updatedState.monsterDef * 0.8); // -20% DEF
    }

    // Chọn Skill hoặc Đánh thường
    const useSkill = monster.skills.length > 0 && Math.random() < 0.4;
    const skill = useSkill ? monster.skills[Math.floor(Math.random() * monster.skills.length)] : null;

    if (skill) {
      const atkMultiplier = updatedState.isEnraged ? skill.satThuongHeSo * 1.2 : skill.satThuongHeSo;
      let dmg = Math.max(1, Math.floor(updatedState.monsterAtk * atkMultiplier - updatedState.playerDef * 0.5));

      // Check Dodge
      if (Math.random() < updatedState.playerDodge) {
        return {
          output: {
            attackerName: monster.ten,
            defenderName: 'Bạn',
            actionName: skill.tenChieu,
            damageDealt: 0,
            isCrit: false,
            isDodge: true,
            isEnraged: updatedState.isEnraged,
            logText: `💨 Bạn khéo léo **NÉ HỤT** kỹ năng **${skill.tenChieu}** của ${monster.ten}!`,
          },
          updatedState,
        };
      }

      if (skill.hieuUng) {
        updatedState.playerStatus.push({ type: skill.hieuUng, duration: 2 });
      }

      return {
        output: {
          attackerName: monster.ten,
          defenderName: 'Bạn',
          actionName: skill.tenChieu,
          damageDealt: dmg,
          isCrit: false,
          isDodge: false,
          isEnraged: updatedState.isEnraged,
          statusApplied: skill.hieuUng,
          logText: updatedState.isEnraged
            ? `🔥 **[CUỒNG BẠO] ${monster.ten}** xả tuyệt chiêu **${skill.tenChieu}** giáng **${dmg}** sát thương cực lớn lên bạn!`
            : `👹 **${monster.ten}** sử dụng chiêu **${skill.tenChieu}** gây **${dmg}** sát thương!`,
        },
        updatedState,
      };
    }

    // Đánh thường của Quái
    const normalAttack = this.executeNormalAttack(
      monster.ten,
      'Bạn',
      updatedState.monsterAtk,
      0.05,
      updatedState.playerDef,
      updatedState.playerDodge
    );

    return { output: normalAttack, updatedState };
  }

  /**
   * Xử lý sát thương trầm tích từ Status Effects (Thiêu Đốt, Độc...) vào đầu lượt
   */
  public static processStatusEffects(state: CombatState): { logs: string[]; updatedState: CombatState } {
    const updatedState = { ...state };
    const logs: string[] = [];

    // Xử lý Status trên Quái
    updatedState.monsterStatus = updatedState.monsterStatus
      .map((effect) => {
        if (effect.type === 'THIEU_DOT') {
          const dotDmg = effect.value || Math.floor(updatedState.monsterMaxHp * 0.05);
          updatedState.monsterHp = Math.max(0, updatedState.monsterHp - dotDmg);
          logs.push(`🔥 Quái vật bốc cháy bởi **Thiêu Đốt** mất **${dotDmg} HP**!`);
        }
        return { ...effect, duration: effect.duration - 1 };
      })
      .filter((e) => e.duration > 0);

    return { logs, updatedState };
  }
}
