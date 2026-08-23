"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoguelikeTowerEngine = exports.BOON_CATALOG = void 0;
exports.BOON_CATALOG = [
    // Thường
    {
        buffId: 'boon_atk_1',
        name: '🗡️ Cuồng Cuộn Chân Khí',
        type: 'ATK_PERCENT',
        value: 0.15,
        rarity: 'THUONG',
        icon: '🗡️',
        desc: 'Tăng +15% Sát Thương Tấn Công',
    },
    {
        buffId: 'boon_def_1',
        name: '🛡️ Kim Cang Kiên Cố',
        type: 'DEF_PERCENT',
        value: 0.20,
        rarity: 'THUONG',
        icon: '🛡️',
        desc: 'Tăng +20% Phòng Thủ',
    },
    {
        buffId: 'boon_crit_1',
        name: '🎯 Ưu Tiên Chí Mạng',
        type: 'CRIT_RATE',
        value: 0.15,
        rarity: 'THUONG',
        icon: '🎯',
        desc: 'Tăng +15% Tỷ Lệ Chí Mạng',
    },
    {
        buffId: 'boon_heal_1',
        name: '🌿 Hồi Sinh Trút Nợ',
        type: 'HEAL_PER_FLOOR',
        value: 0.15,
        rarity: 'THUONG',
        icon: '🌿',
        desc: 'Hồi phục 15% Sinh Lực sau khi qua mỗi tầng',
    },
    // Hiếm
    {
        buffId: 'boon_atk_2',
        name: '🔥 Lửa Thần Ba Vì',
        type: 'ATK_PERCENT',
        value: 0.30,
        rarity: 'HIEM',
        icon: '🔥',
        desc: 'Tăng +30% Sát Thương Tấn Công',
    },
    {
        buffId: 'boon_lifesteal_2',
        name: '🩸 Huyết Tộc Thôn Phệ',
        type: 'LIFE_STEAL',
        value: 0.15,
        rarity: 'HIEM',
        icon: '🩸',
        desc: 'Tăng +15% Hút Máu theo sát thương gây ra',
    },
    {
        buffId: 'boon_critdmg_2',
        name: '💥 Bạo Kích Thần Tốc',
        type: 'CRIT_DMG',
        value: 0.40,
        rarity: 'HIEM',
        icon: '💥',
        desc: 'Tăng +40% Sát Thương Bạo Kích',
    },
    // Thần Thoại
    {
        buffId: 'boon_atk_3',
        name: '⚡ BÁ VƯƠNG TRỰC TIẾP',
        type: 'ATK_PERCENT',
        value: 0.50,
        rarity: 'THAN_THOAI',
        icon: '⚡',
        desc: 'Tăng +50% Sát Thương Tấn Công Tối Đại',
    },
    {
        buffId: 'boon_reflect_3',
        name: '🌀 BÁT QUÁI PHẢN PHỆ',
        type: 'REFLECT_DMG',
        value: 0.30,
        rarity: 'THAN_THOAI',
        icon: '🌀',
        desc: 'Phản lại 30% sát thương đòn đánh của quái tháp',
    },
];
class RoguelikeTowerEngine {
    /**
     * Sinh quái / Boss theo số tầng tháp
     */
    static generateTowerEnemy(floor) {
        const isMajorBoss = floor % 10 === 0;
        const isMiniBoss = !isMajorBoss && floor % 5 === 0;
        const baseHp = 100 + floor * 45;
        const baseAtk = 20 + floor * 12;
        const baseDef = 5 + floor * 4;
        if (isMajorBoss) {
            const bossNames = {
                10: { name: 'Mộc Tinh Cổ Tháp', icon: '🌳', skill: 'Vạn Cây Trói Hồn' },
                20: { name: 'Bạch Xà Tinh Thượng Cổ', icon: '🐍', skill: 'Độc Sương Tàn Phế' },
                30: { name: 'Hắc Long Vương U Minh', icon: '🐉', skill: 'Long Nộ Diệt Vong' },
                40: { name: 'Quỷ Vương Phong Ấn', icon: '👹', skill: 'Ma Khí Voi Tội' },
                50: { name: 'Cửu Vĩ Yêu Hồ Thần Cấp', icon: '🦊', skill: 'Huyễn Mộng Đoạt Mạng' },
            };
            const info = bossNames[floor] || {
                name: `Trùm Tháp Tầng ${floor}: Thần Sát Cổ Tháp`,
                icon: '👑',
                skill: 'Thiên Địa Diệt Vong',
            };
            return {
                name: info.name,
                floor,
                isMiniBoss: false,
                isMajorBoss: true,
                hp: Math.floor(baseHp * 2.5),
                maxHp: Math.floor(baseHp * 2.5),
                atk: Math.floor(baseAtk * 1.6),
                def: Math.floor(baseDef * 1.5),
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
                atk: Math.floor(baseAtk * 1.3),
                def: Math.floor(baseDef * 1.2),
                icon: '🛡️',
                skillName: 'Trầm Trảm',
                skillMultiplier: 1.4,
            };
        }
        // Quái thường
        const normalMonsters = [
            { name: 'Âm Binh Cổ Tháp', icon: '🧟' },
            { name: 'Dị Tộc Sơn Cước', icon: '👺' },
            { name: 'Yêu Ma Bến Nước', icon: '👻' },
        ];
        const picked = normalMonsters[Math.floor(Math.random() * normalMonsters.length)];
        return {
            name: `${picked.name} (Tầng ${floor})`,
            floor,
            isMiniBoss: false,
            isMajorBoss: false,
            hp: baseHp,
            maxHp: baseHp,
            atk: baseAtk,
            def: baseDef,
            icon: picked.icon,
        };
    }
    /**
     * Roll ngẫu nhiên 3 Bùa Chúc Phúc (Boons) cho người chơi chọn
     */
    static roll3Boons() {
        const shuffled = [...exports.BOON_CATALOG].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
}
exports.RoguelikeTowerEngine = RoguelikeTowerEngine;
