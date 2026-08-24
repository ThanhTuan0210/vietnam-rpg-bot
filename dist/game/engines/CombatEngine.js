"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatEngineAdvanced = void 0;
const items_1 = require("../data/items");
class CombatEngineAdvanced {
    /**
     * Tính toán toàn bộ chỉ số tổng hợp của nhân vật (Base + Class + Trang bị + Cường hóa)
     */
    static calculateTotalStats(user) {
        let totalAtk = user.chiSo.satThuong;
        let totalDef = user.chiSo.phongThu;
        let totalMaxHp = user.chiSo.maxHp;
        let totalMaxMp = user.chiSo.maxMp;
        let totalCrit = user.chiSo.chiMang;
        let totalDodge = user.chiSo.neTranh;
        const classType = (user.hePhai || '').toString().toLowerCase();
        // Bonus theo 4 Class Chiến Đấu Trung Cổ (Warrior, Mage, Ranger, Assassin)
        if (classType === 'warrior' || classType === 'dung_tuong') {
            totalMaxHp += 100;
            totalDef += 15;
        }
        else if (classType === 'mage' || classType === 'dao_si') {
            totalMaxMp += 80;
            totalAtk += 25;
        }
        else if (classType === 'ranger' || classType === 'tho_san') {
            totalCrit += 0.15;
            totalDodge += 0.10;
        }
        else if (classType === 'assassin') {
            totalCrit += 0.20;
            totalAtk += 30;
        }
        // Trang bị Vũ khí (+Cường hóa)
        if (user.trangBi?.vuKhi && items_1.ITEMS[user.trangBi.vuKhi.itemId]) {
            const item = items_1.ITEMS[user.trangBi.vuKhi.itemId];
            const bonusPct = (user.trangBi.vuKhi.bonusStat || 0) / 100;
            if (item.statBonus?.satThuong) {
                totalAtk += Math.floor(item.statBonus.satThuong * (1 + bonusPct));
            }
            if (item.statBonus?.chiMang) {
                totalCrit += item.statBonus.chiMang;
            }
        }
        // Trang bị Áo giáp (+Cường hóa)
        if (user.trangBi?.aoGiap && items_1.ITEMS[user.trangBi.aoGiap.itemId]) {
            const item = items_1.ITEMS[user.trangBi.aoGiap.itemId];
            const bonusPct = (user.trangBi.aoGiap.bonusStat || 0) / 100;
            if (item.statBonus?.phongThu) {
                totalDef += Math.floor(item.statBonus.phongThu * (1 + bonusPct));
            }
            if (item.statBonus?.sinhLucToiDa) {
                totalMaxHp += Math.floor(item.statBonus.sinhLucToiDa * (1 + bonusPct));
            }
        }
        return {
            totalAtk,
            totalDef,
            totalMaxHp,
            totalMaxMp,
            totalCrit: Math.min(0.75, totalCrit),
            totalDodge: Math.min(0.50, totalDodge),
        };
    }
    static executeNormalAttack(state, monsterName) {
        const isCrit = Math.random() < state.playerCrit;
        let dmg = Math.max(1, Math.floor(state.playerAtk - state.monsterDef * 0.4));
        if (isCrit)
            dmg = Math.floor(dmg * 1.5);
        state.monsterHp = Math.max(0, state.monsterHp - dmg);
        return {
            output: {
                attackerName: 'Bạn',
                defenderName: monsterName,
                actionName: 'Tấn Công Thường',
                damageDealt: dmg,
                isCrit,
                isDodge: false,
                logText: isCrit
                    ? `💥 **BẠN** giáng đòn **CHÍ MẠNG** gây **${dmg}** sát thương lên **${monsterName}**!`
                    : `⚔️ **BẠN** chém thường gây **${dmg}** sát thương lên **${monsterName}**!`,
            },
            updatedState: state,
        };
    }
    static executeMonsterTurn(state, monsterName) {
        const isDodge = Math.random() < state.playerDodge;
        if (isDodge) {
            return {
                output: {
                    attackerName: monsterName,
                    defenderName: 'Bạn',
                    actionName: 'Đòn Phản Công',
                    damageDealt: 0,
                    isCrit: false,
                    isDodge: true,
                    logText: `🍃 **BẠN** né tránh thành công đòn đánh của **${monsterName}**!`,
                },
                updatedState: state,
            };
        }
        const dmg = Math.max(1, Math.floor(state.monsterAtk - state.playerDef * 0.4));
        state.playerHp = Math.max(0, state.playerHp - dmg);
        return {
            output: {
                attackerName: monsterName,
                defenderName: 'Bạn',
                actionName: 'Đòn Phản Công',
                damageDealt: dmg,
                isCrit: false,
                isDodge: false,
                logText: `👺 **${monsterName}** vung nanh vuốt gây **${dmg}** sát thương lên **BẠN**!`,
            },
            updatedState: state,
        };
    }
    static processStatusEffects(state) {
        return { statusLogs: [], updatedState: state };
    }
    /**
     * Xử lý Tuyệt Kĩ Hệ Phái (Class Skills) trong Combat
     */
    static executeClassSkill(user, state, monsterName) {
        const classType = (user.hePhai || '').toString().toLowerCase();
        const updatedState = { ...state };
        if (!classType) {
            return {
                output: null,
                updatedState,
                mpDeducted: 0,
                errorMsg: '❌ Bạn chưa chọn Class Chiến Đấu! Hãy gõ `vkl` để chọn Class.',
            };
        }
        // ⚔️ WARRIOR (KỊ SĨ)
        if (classType === 'warrior' || classType === 'dung_tuong') {
            const mpCost = 15;
            if (updatedState.playerMp < mpCost) {
                return { output: null, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 15 MP)!' };
            }
            updatedState.playerMp -= mpCost;
            let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.4 - updatedState.monsterDef * 0.4));
            const isCrit = Math.random() < updatedState.playerCrit;
            if (isCrit)
                dmg = Math.floor(dmg * 1.5);
            updatedState.monsterHp = Math.max(0, updatedState.monsterHp - dmg);
            return {
                output: {
                    attackerName: 'Bạn',
                    defenderName: monsterName,
                    actionName: 'Trảm Kích Kị Sĩ',
                    damageDealt: dmg,
                    isCrit,
                    isDodge: false,
                    logText: isCrit
                        ? `🔥 **WARRIOR** giáng tuyệt kỹ **TRẢM KÍCH CHÍ MẠNG** gây **${dmg}** sát thương kinh thiên!`
                        : `⚔️ **WARRIOR** tung tuyệt kỹ **Trảm Kích Kị Sĩ (140% ATK)** gây **${dmg}** sát thương!`,
                },
                updatedState,
                mpDeducted: mpCost,
            };
        }
        // 🔮 MAGE (PHÁP SƯ)
        if (classType === 'mage' || classType === 'dao_si') {
            const mpCost = 25;
            if (updatedState.playerMp < mpCost) {
                return { output: null, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 25 MP)!' };
            }
            updatedState.playerMp -= mpCost;
            let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.8 - updatedState.monsterDef * 0.2));
            const isCrit = Math.random() < updatedState.playerCrit;
            if (isCrit)
                dmg = Math.floor(dmg * 1.5);
            updatedState.monsterHp = Math.max(0, updatedState.monsterHp - dmg);
            return {
                output: {
                    attackerName: 'Bạn',
                    defenderName: monsterName,
                    actionName: 'Ngũ Lôi Gothic',
                    damageDealt: dmg,
                    isCrit,
                    isDodge: false,
                    logText: `⚡ **MAGE** triệu hồi **NGŨ LÔI GOTHIC (180% Magic DMG)** giáng **${dmg}** sát thương lên **${monsterName}**!`,
                },
                updatedState,
                mpDeducted: mpCost,
            };
        }
        // 🏹 RANGER (CUNG THỦ)
        if (classType === 'ranger' || classType === 'tho_san') {
            const mpCost = 20;
            if (updatedState.playerMp < mpCost) {
                return { output: null, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 20 MP)!' };
            }
            updatedState.playerMp -= mpCost;
            let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.5 - updatedState.monsterDef * 0.3));
            const isCrit = Math.random() < updatedState.playerCrit;
            if (isCrit)
                dmg = Math.floor(dmg * 1.6);
            updatedState.monsterHp = Math.max(0, updatedState.monsterHp - dmg);
            return {
                output: {
                    attackerName: 'Bạn',
                    defenderName: monsterName,
                    actionName: 'Bão Tên Tinh Linh',
                    damageDealt: dmg,
                    isCrit,
                    isDodge: false,
                    logText: `🏹 **RANGER** xả **BÃO TÊN TINH LINH (150% ATK)** gây **${dmg}** sát thương lên **${monsterName}**!`,
                },
                updatedState,
                mpDeducted: mpCost,
            };
        }
        // 🗡️ ASSASSIN (SÁT THỦ)
        const mpCost = 20;
        if (updatedState.playerMp < mpCost) {
            return { output: null, updatedState, mpDeducted: 0, errorMsg: '💧 Không đủ Mana (Cần 20 MP)!' };
        }
        updatedState.playerMp -= mpCost;
        let dmg = Math.max(1, Math.floor(updatedState.playerAtk * 1.6 - updatedState.monsterDef * 0.1));
        const isCrit = Math.random() < updatedState.playerCrit;
        if (isCrit)
            dmg = Math.floor(dmg * 1.7);
        updatedState.monsterHp = Math.max(0, updatedState.monsterHp - dmg);
        return {
            output: {
                attackerName: 'Bạn',
                defenderName: monsterName,
                actionName: 'Đột Kích Ảo Ảnh',
                damageDealt: dmg,
                isCrit,
                isDodge: false,
                logText: `🗡️ **ASSASSIN** áp sát **ĐỘT KÍCH XUYÊN GIÁP** giáng **${dmg}** sát thương ám sát!`,
            },
            updatedState,
            mpDeducted: mpCost,
        };
    }
}
exports.CombatEngineAdvanced = CombatEngineAdvanced;
