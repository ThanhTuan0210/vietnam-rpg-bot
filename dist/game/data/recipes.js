"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECIPES = void 0;
exports.RECIPES = [
    // =========================================================================
    // ⚔️ TIER 1: VÙNG 1 - RỪNG GOBLIN (LEVEL 1 TO 15)
    // =========================================================================
    {
        resultItemId: 'sword_01a',
        resultQty: 1,
        requiredLevel: 1,
        dongCost: 500,
        materials: [{ itemId: 'wood_01a', quantity: 5 }, { itemId: 'ingot_01a', quantity: 5 }],
    },
    {
        resultItemId: 'shield_01a',
        resultQty: 1,
        requiredLevel: 1,
        dongCost: 600,
        materials: [{ itemId: 'ingot_01a', quantity: 8 }],
    },
    {
        resultItemId: 'staff_01a',
        resultQty: 1,
        requiredLevel: 1,
        dongCost: 500,
        materials: [{ itemId: 'wood_01a', quantity: 10 }],
    },
    {
        resultItemId: 'bow_01a',
        resultQty: 1,
        requiredLevel: 1,
        dongCost: 800,
        materials: [{ itemId: 'wood_01a', quantity: 8 }, { itemId: 'wood_01b', quantity: 3 }],
    },
    // =========================================================================
    // 🧌 TIER 2: VÙNG 2 - ĐẦM LẦY ORC (LEVEL 15 TO 35)
    // =========================================================================
    {
        resultItemId: 'sword_02a',
        resultQty: 1,
        requiredLevel: 15,
        dongCost: 2000,
        materials: [{ itemId: 'ingot_01b', quantity: 10 }, { itemId: 'crystal_01a', quantity: 3 }],
    },
    {
        resultItemId: 'potion_01a',
        resultQty: 3,
        requiredLevel: 10,
        dongCost: 300,
        materials: [{ itemId: 'wood_01a', quantity: 3 }],
    },
    {
        resultItemId: 'potion_02a',
        resultQty: 3,
        requiredLevel: 15,
        dongCost: 500,
        materials: [{ itemId: 'crystal_01a', quantity: 1 }],
    },
    // =========================================================================
    // 👑 TIER 3: VÙNG 7 - VƯƠNG TỌA RỒNG ENDGAME (LEVEL 85 TO 100)
    // =========================================================================
    {
        resultItemId: 'sword_03e',
        resultQty: 1,
        requiredLevel: 85,
        dongCost: 50000,
        materials: [{ itemId: 'ingot_01e', quantity: 20 }, { itemId: 'crystal_01j', quantity: 10 }],
    },
];
