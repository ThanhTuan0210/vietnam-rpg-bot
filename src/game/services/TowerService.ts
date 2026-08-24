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
   * Thực hiện mô phỏng toàn bộ trận giao tranh tầng tháp (Full Floor Combat Simulation)
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

    const playerAtk = Math.max(5, Math.floor(baseStats.totalAtk * atkMult));
    const playerDef = Math.max(1, Math.floor(baseStats.totalDef * defMult));
    const playerCritRate = Math.min(1.0, baseStats.totalCrit + critBonus - enemy.critRes);
    const playerDodgeRate = Math.min(0.40, baseStats.totalDodge + dodgeBonus);

    let enemyCurrentHp = enemy.hp;
    let isDead = false;
    let isVictory = false;
    const logs: string[] = [];

    let totalPDmg = 0;
    let totalEDmg = 0;
    let anyCrit = false;
    let anyDodge = false;

    // Vòng lặp giao tranh nhiều lượt cho đến khi phân định thắng bại (Tối đa 20 lượt)
    for (let turn = 1; turn <= 20; turn++) {
      if (session.currentHp <= 0 || enemyCurrentHp <= 0) break;

      // 1. Lượt người chơi tấn công
      const isCrit = Math.random() < playerCritRate;
      if (isCrit) anyCrit = true;

      let pDmg = Math.max(1, Math.floor(playerAtk - enemy.def * 0.5));
      if (isCrit) pDmg = Math.floor(pDmg * (1.5 + critDmgBonus));
      totalPDmg += pDmg;

      enemyCurrentHp = Math.max(0, enemyCurrentHp - pDmg);

      if (lifeStealBonus > 0) {
        const heal = Math.floor(pDmg * lifeStealBonus);
        session.currentHp = Math.min(session.maxHp, session.currentHp + heal);
      }

      if (mpRestoreAmount > 0) {
        session.currentMp = Math.min(session.maxMp, session.currentMp + mpRestoreAmount);
      }

      if (enemyCurrentHp <= 0) {
        logs.push(
          isCrit
            ? `💥 **Lượt ${turn}: BẠO KÍCH!** Bạn gây **${pDmg} ST** và hạ gục ${enemy.name}!`
            : `⚔️ **Lượt ${turn}:** Bạn tấn công gây **${pDmg} ST** kết liễu ${enemy.name}!`
        );
        isVictory = true;
        break;
      } else {
        if (turn <= 3 || isCrit) {
          logs.push(
            isCrit
              ? `💥 **Lượt ${turn}: BẠO KÍCH!** Gây **${pDmg} ST** lên ${enemy.name}!`
              : `⚔️ **Lượt ${turn}:** Bạn gây **${pDmg} ST** lên ${enemy.name}.`
          );
        }
      }

      // 2. Quái đánh trả nếu còn sống
      if (Math.random() < playerDodgeRate) {
        anyDodge = true;
        logs.push(`💨 **Lượt ${turn}:** Bạn nhanh nhẹn **NÉ HỤT (MISS)** đòn từ ${enemy.name}!`);
      } else {
        const eSkill = enemy.skillName && Math.random() < 0.35;
        const eMult = eSkill ? enemy.skillMultiplier || 1.4 : 1.0;
        const eDmg = Math.max(1, Math.floor(enemy.atk * eMult - playerDef * 0.5));
        totalEDmg += eDmg;

        session.currentHp = Math.max(0, session.currentHp - eDmg);

        if (eSkill && turn <= 3) {
          logs.push(`🔥 **Lượt ${turn}:** ${enemy.icon} ${enemy.name} tung **${enemy.skillName}** giáng **${eDmg} ST**!`);
        }

        if (reflectRatio > 0) {
          const reflectDmg = Math.floor(eDmg * reflectRatio);
          enemyCurrentHp = Math.max(0, enemyCurrentHp - reflectDmg);
        }

        if (session.currentHp <= 0) {
          logs.push(`💀 **Lượt ${turn}:** Bạn chịu đòn tàn bạo của ${enemy.name} và gục ngã!`);
          isDead = true;
          break;
        }
      }
    }

    // Nếu sau 20 lượt vẫn chưa phân thắng bại: Ai % HP cao hơn sẽ thắng!
    if (!isVictory && !isDead) {
      const playerHpRatio = session.currentHp / session.maxHp;
      const enemyHpRatio = enemyCurrentHp / enemy.hp;
      if (playerHpRatio >= enemyHpRatio) {
        isVictory = true;
        logs.push(`🛡️ **Sau 20 lượt:** Sinh lực bạn kiên cường hơn và khuất phục **${enemy.name}**!`);
      } else {
        isDead = true;
        logs.push(`💀 **Sau 20 lượt:** Bạn kiệt sức trước sự càn quét của **${enemy.name}**!`);
      }
    }

    if (isDead) {
      // PERMADEATH RUN: Kết toán điểm thí luyện
      const highestFloor = session.highestFloorThisRun;
      const pointsEarned = highestFloor * 15 + session.monstersSlain * 5;

      session.isActive = false;
      session.trialPointsEarned = pointsEarned;
      await session.save();

      await UserModelAdvanced.updateOne(
        { userId },
        {
          $inc: { 'taiChinh.kimBao': 0, 'tower.trialPoints': pointsEarned },
        }
      );

      await TowerLeaderboardModel.findOneAndUpdate(
        { userId },
        {
          $set: { username: user.userId, highestFloor: Math.max(highestFloor, user.tower?.highestFloor || 0) },
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
        enemyHpAfter: enemyCurrentHp,
        damageDealt: totalPDmg,
        damageTaken: totalEDmg,
        isCrit: anyCrit,
        isDodge: anyDodge,
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

    if (!session.offeredBoons.includes(boonId)) {
      return { success: false, message: '🛡️ **ANTI-CHEAT WARNING:** Bùa bạn chọn không nằm trong danh sách được cấp phép!' };
    }

    const boonDef = SIGNATURE_BOONS.find((b) => b.buffId === boonId);
    if (!boonDef) {
      return { success: false, message: '❌ Dữ liệu Bùa không tồn tại.' };
    }

    session.activeBuffs.push(boonDef);
    session.isAwaitingBoon = false;
    session.offeredBoons = [];
    session.currentFloor += 1;
    session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
    await session.save();

    return {
      success: true,
      message: `✨ **BẢO VẬT KÍCH HOẠT!** Bạn đã nhận chúc phúc **${boonDef.icon} ${boonDef.name}**!\n Tiến vào Tầng ${session.currentFloor}...`,
    };
  }

  /**
   * Nhận hành động tại Trạm Nghỉ Vọng Cảnh Đài
   */
  public static async claimRestAction(
    userId: string,
    action: 'HEAL' | 'RANDOM_BOON'
  ): Promise<{ success: boolean; message: string }> {
    const session = await TowerSessionModel.findOne({ userId, isActive: true });
    if (!session || !session.isAtRestStation) {
      return { success: false, message: '❌ Bạn không ở vị trí Trạm Nghỉ Vọng Cảnh Đài!' };
    }

    let msg = '';
    if (action === 'HEAL') {
      const healHp = Math.floor(session.maxHp * 0.4);
      const healMp = Math.floor(session.maxMp * 0.4);
      session.currentHp = Math.min(session.maxHp, session.currentHp + healHp);
      session.currentMp = Math.min(session.maxMp, session.currentMp + healMp);
      msg = `🌿 **TĨNH DƯỠNG THÀNH CÔNG!** Bạn hồi phục **+${healHp} HP** và **+${healMp} MP** tại Trạm Nghỉ!`;
    } else {
      const rolled = TowerConfig.roll3Boons()[0];
      session.activeBuffs.push(rolled);
      msg = `🎲 **RÚT BÙA MAY MẮN!** Bạn nhận được **${rolled.icon} ${rolled.name}** (*${rolled.desc}*)!`;
    }

    session.isAtRestStation = false;
    session.currentFloor += 1;
    session.highestFloorThisRun = Math.max(session.highestFloorThisRun, session.currentFloor);
    await session.save();

    return { success: true, message: `${msg}\n Tiến vào Tầng ${session.currentFloor}...` };
  }

  /**
   * Chủ động rút lui bảo lưu điểm thí luyện
   */
  public static async endRun(userId: string): Promise<{ highestFloor: number; pointsEarned: number }> {
    const session = await TowerSessionModel.findOne({ userId, isActive: true });
    if (!session) return { highestFloor: 0, pointsEarned: 0 };

    const highestFloor = session.highestFloorThisRun;
    const pointsEarned = highestFloor * 15 + session.monstersSlain * 5;

    session.isActive = false;
    session.trialPointsEarned = pointsEarned;
    await session.save();

    await UserModelAdvanced.updateOne(
      { userId },
      {
        $inc: { 'taiChinh.kimBao': 0, 'tower.trialPoints': pointsEarned },
      }
    );

    const user = await UserModelAdvanced.findOne({ userId });
    await TowerLeaderboardModel.findOneAndUpdate(
      { userId },
      {
        $set: { username: user?.userId || userId, highestFloor: Math.max(highestFloor, user?.tower?.highestFloor || 0) },
        $inc: { totalTrialPoints: pointsEarned },
      },
      { upsert: true }
    );

    return { highestFloor, pointsEarned };
  }
}
