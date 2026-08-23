import { TowerSessionModel, ITowerSession } from '../../database/models/TowerSession.model';
import { TowerLeaderboardModel } from '../../database/models/TowerLeaderboard.model';
import { UserModelAdvanced } from '../../database/models/User.model';
import { CombatEngineAdvanced } from '../engines/CombatEngine';
import { TowerConfig, SIGNATURE_BOONS, BoonConfig } from '../config/TowerConfig';

export interface CombatSimulationResult {
  isVictory: boolean;
  isDead: boolean;
  playerHpAfter: number;
  playerMpAfter: number;
  enemyHpAfter: number;
  damageDealt: number;
  damageTaken: number;
  isCrit: boolean;
  isDodge: boolean;
  logs: string[];
}

export class TowerService {
  /**
   * Khởi tạo hoặc đọc phiên leo tháp dở dở của người chơi từ CSDL
   */
  public static async startOrResumeRun(userId: string): Promise<ITowerSession> {
    let session = await TowerSessionModel.findOne({ userId, isActive: true });

    if (!session) {
      const user = await UserModelAdvanced.findOne({ userId });
      if (!user) throw new Error('Không tìm thấy dữ liệu nhân vật.');

      const totalStats = CombatEngineAdvanced.calculateTotalStats(user);

      session = await TowerSessionModel.create({
        userId,
        currentFloor: 1,
        highestFloorThisRun: 1,
        currentHp: user.chiSo.hp > 0 ? user.chiSo.hp : totalStats.totalMaxHp,
        maxHp: totalStats.totalMaxHp,
        currentMp: user.chiSo.mp,
        maxMp: totalStats.totalMaxMp,
        activeBuffs: [],
        offeredBoons: [],
        isAwaitingBoon: false,
        isAtRestStation: false,
        trialPointsEarned: 0,
        monstersSlain: 0,
        isActive: true,
      });
    }

    return session;
  }

  /**
   * Thực hiện mô phỏng lượt giao tranh tầng tháp (Turn-based combat simulation)
   */
  public static async executeFloorCombat(userId: string): Promise<{
    session: ITowerSession;
    combatResult: CombatSimulationResult;
  }> {
    const session = await this.startOrResumeRun(userId);
    const user = await UserModelAdvanced.findOne({ userId });
    if (!user) throw new Error('User not found.');

    const enemy = TowerConfig.calculateEnemyStats(session.currentFloor);
    const baseStats = CombatEngineAdvanced.calculateTotalStats(user);

    // Bóc tách tổng chỉ số = Base + Gear + activeBuffs
    let atkMult = 1.0;
    let defMult = 1.0;
    let critBonus = 0.0;
    let critDmgBonus = 0.0;
    let lifeStealBonus = 0.0;
    let reflectRatio = 0.0;
    let mpRestoreAmount = 0;
    let dodgeBonus = 0.0;

    session.activeBuffs.forEach((b) => {
      if (b.type === 'ATK_PERCENT') atkMult += b.value;
      if (b.type === 'DEF_PERCENT') defMult += b.value;
      if (b.type === 'CRIT_RATE') critBonus += b.value;
      if (b.type === 'CRIT_DMG') critDmgBonus += b.value;
      if (b.type === 'LIFE_STEAL') lifeStealBonus += b.value;
      if (b.type === 'REFLECT_DMG') reflectRatio += b.value;
      if (b.type === 'MP_RESTORE') mpRestoreAmount += b.value;
      if (b.type === 'DODGE_STUN') dodgeBonus += b.value;
    });

    const playerAtk = Math.floor(baseStats.totalAtk * atkMult);
    const playerDef = Math.floor(baseStats.totalDef * defMult);
    const playerCritRate = Math.min(1.0, baseStats.totalCrit + critBonus - enemy.critRes);
    const playerDodgeRate = Math.min(0.40, baseStats.totalDodge + dodgeBonus);

    const logs: string[] = [];
    let pDmg = 0;
    let eDmg = 0;

    // 1. Lượt người chơi tấn công
    const isCrit = Math.random() < playerCritRate;
    pDmg = Math.max(1, Math.floor(playerAtk - enemy.def * 0.5));
    if (isCrit) pDmg = Math.floor(pDmg * (1.5 + critDmgBonus));

    // Hút máu
    if (lifeStealBonus > 0) {
      const heal = Math.floor(pDmg * lifeStealBonus);
      session.currentHp = Math.min(session.maxHp, session.currentHp + heal);
      logs.push(`🩸 **Hút Máu:** Bạn hồi phục **+${heal} HP** từ sát thương gây ra!`);
    }

    // Hồi MP sau đòn đánh
    if (mpRestoreAmount > 0) {
      session.currentMp = Math.min(session.maxMp, session.currentMp + mpRestoreAmount);
      logs.push(`🔷 **Hoàn Nguyên:** Bạn hồi **+${mpRestoreAmount} MP**!`);
    }

    let enemyHpAfter = Math.max(0, enemy.hp - pDmg);
    logs.push(
      isCrit
        ? `💥 **BẠO KÍCH CHÍ MẠNG!** Bạn gây **${pDmg} sát thương** lên ${enemy.name}!`
        : `⚔️ Bạn tấn công ${enemy.name} gây **${pDmg} sát thương**!`
    );

    // 2. Lượt Quái / Boss đánh trả (nếu chưa bị diệt)
    let isDodge = false;
    if (enemyHpAfter > 0) {
      // Check Né Tránh
      if (Math.random() < playerDodgeRate) {
        isDodge = true;
        logs.push(`💨 Bạn nhanh nhẹn **NÉ HỤT (MISS)** đòn tấn công của ${enemy.name}!`);
      } else {
        const eSkill = enemy.skillName && Math.random() < 0.35;
        const eMult = eSkill ? enemy.skillMultiplier || 1.4 : 1.0;
        eDmg = Math.max(1, Math.floor(enemy.atk * eMult - playerDef * 0.5));

        session.currentHp = Math.max(0, session.currentHp - eDmg);
        logs.push(
          eSkill
            ? `🔥 **${enemy.icon} ${enemy.name}** tung tuyệt kỹ **${enemy.skillName}** giáng **${eDmg} sát thương**!`
            : `👹 **${enemy.icon} ${enemy.name}** đánh trả gây **${eDmg} sát thương**!`
        );

        // Phản sát thương
        if (reflectRatio > 0) {
          const reflectDmg = Math.floor(eDmg * reflectRatio);
          enemyHpAfter = Math.max(0, enemyHpAfter - reflectDmg);
          logs.push(`🌀 **Quang Minh Phản Kích:** Phản lại **${reflectDmg} sát thương** về phía quái!`);
        }
      }
    }

    const isDead = session.currentHp <= 0;
    const isVictory = enemyHpAfter <= 0 && !isDead;

    if (isDead) {
      // PERMADEATH RUN: Set isActive = false, kết toán điểm thí luyện & Bảng Xếp Hạng
      const highestFloor = session.highestFloorThisRun;
      const pointsEarned = highestFloor * 15 + session.monstersSlain * 5;

      session.isActive = false;
      session.trialPointsEarned = pointsEarned;
      await session.save();

      // Cập nhật User model & Leaderboard
      await UserModelAdvanced.updateOne(
        { userId },
        {
          $inc: { 'taiChinh.kimBao': 0, 'tower.trialPoints': pointsEarned },
        }
      );

      await TowerLeaderboardModel.findOneAndUpdate(
        { userId },
        {
          $set: { username: user.userId, highestFloor: Math.max(highestFloor, (user.tower?.highestFloor || 0)) },
          $inc: { totalTrialPoints: pointsEarned },
        },
        { upsert: true }
      );
    } else if (isVictory) {
      session.monstersSlain += 1;

      // Hồi máu 20% nếu có Boon HEAL_PER_FLOOR
      const healBoon = session.activeBuffs.find((b) => b.type === 'HEAL_PER_FLOOR');
      if (healBoon) {
        const bonusHeal = Math.floor(session.maxHp * healBoon.value);
        session.currentHp = Math.min(session.maxHp, session.currentHp + bonusHeal);
        logs.push(`🌿 **Mộc Linh Hoàn Hồn:** Hồi phục **+${bonusHeal} HP** sau ải!`);
      }

      // Xử lý chuyển tầng hoặc roll Bùa / Trạm Nghỉ
      if (session.currentFloor % 5 === 0 && session.currentFloor % 10 !== 0) {
        // Tầng 5, 15, 25... ➔ Roll 3 Bùa ngẫu nhiên
        const rolled = TowerConfig.roll3Boons();
        session.offeredBoons = rolled.map((b) => b.buffId);
        session.isAwaitingBoon = true;
      } else if ([20, 40, 60, 80].includes(session.currentFloor)) {
        // Tầng 20, 40, 60, 80 ➔ Trạm Nghỉ Vọng Cảnh Đài
        session.isAtRestStation = true;
      } else {
        session.currentFloor += 1;
        session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
      }

      await session.save();
    } else {
      await session.save();
    }

    return {
      session,
      combatResult: {
        isVictory,
        isDead,
        playerHpAfter: session.currentHp,
        playerMpAfter: session.currentMp,
        enemyHpAfter,
        damageDealt: pDmg,
        damageTaken: eDmg,
        isCrit,
        isDodge,
        logs,
      },
    };
  }

  /**
   * Lựa chọn Bùa Chúc Phúc (Xác thực Anti-Cheat offeredBoons)
   */
  public static async chooseBoon(userId: string, boonId: string): Promise<{ success: boolean; message: string }> {
    const session = await TowerSessionModel.findOne({ userId, isActive: true });
    if (!session || !session.isAwaitingBoon) {
      return { success: false, message: '❌ Bạn không trong trạng thái chờ chọn Bùa!' };
    }

    // ANTI-CHEAT VALIDATION: Kiểm tra boonId có nằm trong mảng offeredBoons ở Database không!
    if (!session.offeredBoons.includes(boonId)) {
      return { success: false, message: '🛡️ **ANTI-CHEAT WARNING:** Bùa bạn chọn không nằm trong danh sách được cấp phép!' };
    }

    const boonDef = SIGNATURE_BOONS.find((b) => b.buffId === boonId);
    if (!boonDef) return { success: false, message: 'Bùa không tồn tại.' };

    session.activeBuffs.push({
      buffId: boonDef.buffId,
      name: boonDef.name,
      type: boonDef.type,
      value: boonDef.value,
      rarity: boonDef.rarity,
      icon: boonDef.icon,
    });

    session.isAwaitingBoon = false;
    session.offeredBoons = [];
    session.currentFloor += 1;
    session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
    await session.save();

    return {
      success: true,
      message: `🎉 **ĐÃ CHỌN BÙA:** ${boonDef.icon} **${boonDef.name}**! Tiến vào Tầng ${session.currentFloor}.`,
    };
  }

  /**
   * Lựa chọn tại Trạm Nghỉ Vọng Cảnh Đài (HEAL | RANDOM_BOON)
   */
  public static async claimRestAction(
    userId: string,
    action: 'HEAL' | 'RANDOM_BOON'
  ): Promise<{ success: boolean; message: string }> {
    const session = await TowerSessionModel.findOne({ userId, isActive: true });
    if (!session || !session.isAtRestStation) {
      return { success: false, message: '❌ Bạn không tại Trạm Nghỉ Vọng Cảnh Đài!' };
    }

    if (action === 'HEAL') {
      const healHp = Math.floor(session.maxHp * 0.4);
      const healMp = Math.floor(session.maxMp * 0.4);
      session.currentHp = Math.min(session.maxHp, session.currentHp + healHp);
      session.currentMp = Math.min(session.maxMp, session.currentMp + healMp);

      session.isAtRestStation = false;
      session.currentFloor += 1;
      session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
      await session.save();

      return {
        success: true,
        message: `💖 **DƯỠNG SỨC THÀNH CÔNG!** Hồi **+${healHp} HP** & **+${healMp} MP**. Tiến vào Tầng ${session.currentFloor}!`,
      };
    } else {
      const boonDef = SIGNATURE_BOONS[Math.floor(Math.random() * SIGNATURE_BOONS.length)];
      session.activeBuffs.push({
        buffId: boonDef.buffId,
        name: boonDef.name,
        type: boonDef.type,
        value: boonDef.value,
        rarity: boonDef.rarity,
        icon: boonDef.icon,
      });

      session.isAtRestStation = false;
      session.currentFloor += 1;
      session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
      await session.save();

      return {
        success: true,
        message: `🎲 **RÚT BÙA MAY MẮN!** Nhận Bùa ${boonDef.icon} **${boonDef.name}**! Tiến vào Tầng ${session.currentFloor}!`,
      };
    }
  }

  /**
   * Kết thúc lượt leo tháp (Rút lui / Tử trận)
   */
  public static async endRun(userId: string): Promise<{ pointsEarned: number; highestFloor: number }> {
    const session = await TowerSessionModel.findOne({ userId, isActive: true });
    if (!session) return { pointsEarned: 0, highestFloor: 0 };

    const highestFloor = session.highestFloorThisRun;
    const pointsEarned = highestFloor * 15 + session.monstersSlain * 5;

    session.isActive = false;
    session.trialPointsEarned = pointsEarned;
    await session.save();

    const user = await UserModelAdvanced.findOne({ userId });
    if (user) {
      const prevRecord = user.tower?.highestFloor || 0;
      await UserModelAdvanced.updateOne(
        { userId },
        {
          $set: { 'tower.highestFloor': Math.max(prevRecord, highestFloor) },
          $inc: { 'tower.trialPoints': pointsEarned },
        }
      );
    }

    return { pointsEarned, highestFloor };
  }
}
