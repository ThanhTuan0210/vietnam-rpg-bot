export interface Recipe {
  resultItemId: string;
  resultQty: number;
  requiredLevel: number;
  dongCost: number;
  materials: { itemId: string; quantity: number }[];
}

export const RECIPES: Recipe[] = [
  // =========================================================================
  // ⚔️ TIER 1: LEVEL 1 - 20 (KIẾM, TRƯỢNG, CUNG, KHIÊN, MŨ, GIÁP)
  // =========================================================================
  { resultItemId: 'sword_01a', resultQty: 1, requiredLevel: 1, dongCost: 500, materials: [{ itemId: 'wood_01a', quantity: 5 }, { itemId: 'ingot_01a', quantity: 5 }] },
  { resultItemId: 'sword_01b', resultQty: 1, requiredLevel: 5, dongCost: 750, materials: [{ itemId: 'ingot_01a', quantity: 8 }] },
  { resultItemId: 'sword_01c', resultQty: 1, requiredLevel: 10, dongCost: 1000, materials: [{ itemId: 'wood_01a', quantity: 10 }, { itemId: 'ingot_01a', quantity: 10 }] },
  { resultItemId: 'sword_01d', resultQty: 1, requiredLevel: 15, dongCost: 1500, materials: [{ itemId: 'ingot_01a', quantity: 15 }] },
  { resultItemId: 'sword_01e', resultQty: 1, requiredLevel: 20, dongCost: 2000, materials: [{ itemId: 'ingot_01b', quantity: 5 }] },

  { resultItemId: 'staff_01a', resultQty: 1, requiredLevel: 1, dongCost: 500, materials: [{ itemId: 'wood_01a', quantity: 8 }] },
  { resultItemId: 'staff_01b', resultQty: 1, requiredLevel: 10, dongCost: 1000, materials: [{ itemId: 'wood_01a', quantity: 12 }, { itemId: 'crystal_01a', quantity: 2 }] },
  { resultItemId: 'staff_01c', resultQty: 1, requiredLevel: 20, dongCost: 2000, materials: [{ itemId: 'wood_01b', quantity: 10 }, { itemId: 'crystal_01a', quantity: 5 }] },

  { resultItemId: 'bow_01a', resultQty: 1, requiredLevel: 1, dongCost: 500, materials: [{ itemId: 'wood_01a', quantity: 8 }] },
  { resultItemId: 'bow_01b', resultQty: 1, requiredLevel: 15, dongCost: 1200, materials: [{ itemId: 'wood_01b', quantity: 8 }] },
  { resultItemId: 'arrow_01a', resultQty: 10, requiredLevel: 1, dongCost: 100, materials: [{ itemId: 'wood_01a', quantity: 2 }] },

  { resultItemId: 'shield_01a', resultQty: 1, requiredLevel: 1, dongCost: 500, materials: [{ itemId: 'ingot_01a', quantity: 8 }] },
  { resultItemId: 'shield_01b', resultQty: 1, requiredLevel: 15, dongCost: 1200, materials: [{ itemId: 'ingot_01a', quantity: 12 }] },
  { resultItemId: 'helmet_01a', resultQty: 1, requiredLevel: 1, dongCost: 400, materials: [{ itemId: 'ingot_01a', quantity: 5 }] },
  { resultItemId: 'armor_01a', resultQty: 1, requiredLevel: 1, dongCost: 600, materials: [{ itemId: 'ingot_01a', quantity: 10 }] },

  // =========================================================================
  // 🧌 TIER 2: LEVEL 25 - 65 (BẢO KIẾM, PHÉP CẦU, CUNG BÃO TÊN, GIÁP VÀNG)
  // =========================================================================
  { resultItemId: 'sword_02a', resultQty: 1, requiredLevel: 25, dongCost: 3000, materials: [{ itemId: 'ingot_01b', quantity: 10 }, { itemId: 'crystal_01a', quantity: 3 }] },
  { resultItemId: 'sword_02b', resultQty: 1, requiredLevel: 35, dongCost: 5000, materials: [{ itemId: 'ingot_01b', quantity: 15 }, { itemId: 'gem_01a', quantity: 1 }] },
  { resultItemId: 'sword_02c', resultQty: 1, requiredLevel: 45, dongCost: 8000, materials: [{ itemId: 'ingot_01b', quantity: 20 }, { itemId: 'crystal_01a', quantity: 8 }] },
  { resultItemId: 'sword_02d', resultQty: 1, requiredLevel: 55, dongCost: 12000, materials: [{ itemId: 'ingot_01b', quantity: 25 }, { itemId: 'gem_01a', quantity: 3 }] },
  { resultItemId: 'sword_02e', resultQty: 1, requiredLevel: 65, dongCost: 18000, materials: [{ itemId: 'ingot_01e', quantity: 5 }, { itemId: 'gem_01a', quantity: 5 }] },

  { resultItemId: 'staff_02a', resultQty: 1, requiredLevel: 30, dongCost: 4000, materials: [{ itemId: 'wood_01b', quantity: 15 }, { itemId: 'crystal_01a', quantity: 5 }] },
  { resultItemId: 'staff_02b', resultQty: 1, requiredLevel: 45, dongCost: 7500, materials: [{ itemId: 'wood_01b', quantity: 20 }, { itemId: 'gem_01a', quantity: 2 }] },
  { resultItemId: 'staff_02c', resultQty: 1, requiredLevel: 60, dongCost: 15000, materials: [{ itemId: 'wood_01b', quantity: 30 }, { itemId: 'crystal_01j', quantity: 2 }] },

  { resultItemId: 'bow_02a', resultQty: 1, requiredLevel: 30, dongCost: 4000, materials: [{ itemId: 'wood_01b', quantity: 15 }] },
  { resultItemId: 'bow_02b', resultQty: 1, requiredLevel: 50, dongCost: 10000, materials: [{ itemId: 'wood_01b', quantity: 25 }, { itemId: 'crystal_01a', quantity: 5 }] },
  { resultItemId: 'arrow_01b', resultQty: 10, requiredLevel: 15, dongCost: 300, materials: [{ itemId: 'ingot_01a', quantity: 5 }] },
  { resultItemId: 'arrow_02a', resultQty: 10, requiredLevel: 40, dongCost: 800, materials: [{ itemId: 'ingot_01b', quantity: 5 }] },

  { resultItemId: 'shield_02a', resultQty: 1, requiredLevel: 40, dongCost: 6000, materials: [{ itemId: 'ingot_01b', quantity: 15 }] },
  { resultItemId: 'helmet_02a', resultQty: 1, requiredLevel: 30, dongCost: 3500, materials: [{ itemId: 'ingot_01b', quantity: 10 }] },
  { resultItemId: 'armor_02a', resultQty: 1, requiredLevel: 40, dongCost: 7000, materials: [{ itemId: 'ingot_01b', quantity: 18 }] },

  // =========================================================================
  // 👑 TIER 3: LEVEL 75 - 99 ENDGAME (EXCALIBUR, TRƯỢNG RỒNG, CUNG RỒNG)
  // =========================================================================
  { resultItemId: 'sword_03a', resultQty: 1, requiredLevel: 75, dongCost: 25000, materials: [{ itemId: 'ingot_01e', quantity: 10 }, { itemId: 'gem_01a', quantity: 8 }] },
  { resultItemId: 'sword_03b', resultQty: 1, requiredLevel: 80, dongCost: 35000, materials: [{ itemId: 'ingot_01e', quantity: 15 }, { itemId: 'crystal_01j', quantity: 3 }] },
  { resultItemId: 'sword_03c', resultQty: 1, requiredLevel: 85, dongCost: 50000, materials: [{ itemId: 'ingot_01e', quantity: 20 }, { itemId: 'crystal_01j', quantity: 5 }] },
  { resultItemId: 'sword_03d', resultQty: 1, requiredLevel: 90, dongCost: 75000, materials: [{ itemId: 'ingot_01e', quantity: 30 }, { itemId: 'crystal_01j', quantity: 8 }] },
  { resultItemId: 'sword_03e', resultQty: 1, requiredLevel: 99, dongCost: 150000, materials: [{ itemId: 'ingot_01e', quantity: 50 }, { itemId: 'crystal_01j', quantity: 15 }, { itemId: 'gem_01a', quantity: 20 }] },

  { resultItemId: 'staff_03a', resultQty: 1, requiredLevel: 75, dongCost: 25000, materials: [{ itemId: 'wood_01b', quantity: 40 }, { itemId: 'crystal_01j', quantity: 3 }] },
  { resultItemId: 'staff_03b', resultQty: 1, requiredLevel: 85, dongCost: 50000, materials: [{ itemId: 'wood_01b', quantity: 60 }, { itemId: 'crystal_01j', quantity: 8 }] },
  { resultItemId: 'staff_03c', resultQty: 1, requiredLevel: 90, dongCost: 80000, materials: [{ itemId: 'wood_01b', quantity: 80 }, { itemId: 'crystal_01j', quantity: 12 }] },
  { resultItemId: 'staff_03e', resultQty: 1, requiredLevel: 99, dongCost: 160000, materials: [{ itemId: 'wood_01b', quantity: 100 }, { itemId: 'crystal_01j', quantity: 20 }] },

  { resultItemId: 'bow_03a', resultQty: 1, requiredLevel: 75, dongCost: 25000, materials: [{ itemId: 'wood_01b', quantity: 40 }, { itemId: 'gem_01a', quantity: 5 }] },
  { resultItemId: 'bow_03e', resultQty: 1, requiredLevel: 99, dongCost: 150000, materials: [{ itemId: 'wood_01b', quantity: 100 }, { itemId: 'crystal_01j', quantity: 15 }] },
  { resultItemId: 'arrow_03e', resultQty: 10, requiredLevel: 80, dongCost: 3000, materials: [{ itemId: 'ingot_01e', quantity: 5 }] },

  { resultItemId: 'shield_03e', resultQty: 1, requiredLevel: 85, dongCost: 60000, materials: [{ itemId: 'ingot_01e', quantity: 25 }] },
  { resultItemId: 'helmet_03e', resultQty: 1, requiredLevel: 80, dongCost: 40000, materials: [{ itemId: 'ingot_01e', quantity: 18 }] },
  { resultItemId: 'armor_03e', resultQty: 1, requiredLevel: 90, dongCost: 100000, materials: [{ itemId: 'ingot_01e', quantity: 40 }, { itemId: 'crystal_01j', quantity: 10 }] },

  // =========================================================================
  // 🧪 DƯỢC LIỆU VÀ MÓN ĂN
  // =========================================================================
  { resultItemId: 'potion_01a', resultQty: 3, requiredLevel: 1, dongCost: 200, materials: [{ itemId: 'wood_01a', quantity: 2 }] },
  { resultItemId: 'potion_02a', resultQty: 2, requiredLevel: 10, dongCost: 400, materials: [{ itemId: 'wood_01a', quantity: 4 }] },
  { resultItemId: 'potion_03a', resultQty: 1, requiredLevel: 25, dongCost: 1000, materials: [{ itemId: 'crystal_01a', quantity: 2 }] },
];
