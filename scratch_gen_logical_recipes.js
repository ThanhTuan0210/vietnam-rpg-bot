const fs = require('fs');

const subSuffixes = ['a', 'b', 'c', 'd', 'e'];

function generateLogicalRecipes() {
  const recipes = [];

  // =========================================================================
  // ⚔️ 1. RECIPES FOR ALL 20 SWORDS (Kiếm = Thỏi Kim Loại + Gỗ cán + Vàng)
  // =========================================================================
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `sword_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const dongCost = level * 100 + 200;

      const ingQty = tier * 3 + sIdx + 1;
      const woodQty = Math.max(1, tier + Math.floor(sIdx / 2));
      const ingType = tier <= 2 ? 'ingot_01a' : tier === 3 ? 'ingot_01b' : 'ingot_01e';

      const materials = [
        { itemId: ingType, quantity: ingQty },
        { itemId: 'wood_01a', quantity: woodQty },
      ];

      if (tier >= 3) {
        materials.push({ itemId: 'gem_01a', quantity: sIdx + 1 });
      }

      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost,
        materials,
      });
    }
  }

  // =========================================================================
  // 🔮 2. RECIPES FOR ALL 20 STAVES & ORBS (Trượng = Gỗ thân + Tinh thạch/Ngọc đầu trượng + Vàng)
  // =========================================================================
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `staff_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const dongCost = level * 110 + 250;

      const woodQty = tier * 4 + sIdx + 1;
      const cryQty = Math.max(1, tier + Math.floor(sIdx / 2));

      const materials = [
        { itemId: 'wood_01a', quantity: woodQty },
        { itemId: 'crystal_01a', quantity: cryQty },
      ];

      if (tier >= 3) {
        materials.push({ itemId: 'crystal_01j', quantity: sIdx + 1 });
      }

      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost,
        materials,
      });
    }
  }

  // =========================================================================
  // 🏹 3. RECIPES FOR ALL 20 BOWS & ARROWS (Cung = Gỗ uốn + Thỏi kim loại nẹp + Vàng)
  // =========================================================================
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `bow_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const dongCost = level * 95 + 200;

      const woodQty = tier * 5 + sIdx;
      const ingQty = Math.max(1, tier);

      const materials = [
        { itemId: 'wood_01a', quantity: woodQty },
        { itemId: 'ingot_01a', quantity: ingQty },
      ];

      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost,
        materials,
      });
    }
  }

  // Mũi Tên (2 Gỗ + 1 Thỏi Đồng = 10 Mũi Tên)
  recipes.push({
    resultItemId: 'arrow_01a',
    resultQty: 10,
    requiredLevel: 1,
    dongCost: 50,
    materials: [{ itemId: 'wood_01a', quantity: 2 }, { itemId: 'ingot_01a', quantity: 1 }],
  });

  // =========================================================================
  // 🛡️ 4. RECIPES FOR SHIELDS, HELMETS & ARMORS
  // =========================================================================
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const shId = `shield_0${tier}${sub}`;
      const arId = `armor_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;

      const ingType = tier <= 2 ? 'ingot_01a' : tier === 3 ? 'ingot_01b' : 'ingot_01e';

      // Khiên = Thỏi kim loại + Gỗ quai cầm
      recipes.push({
        resultItemId: shId,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: level * 90 + 200,
        materials: [
          { itemId: ingType, quantity: tier * 3 + sIdx },
          { itemId: 'wood_01a', quantity: 2 },
        ],
      });

      // Áo Giáp = Thỏi kim loại
      recipes.push({
        resultItemId: arId,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: level * 130 + 300,
        materials: [{ itemId: ingType, quantity: tier * 5 + sIdx * 2 }],
      });
    }
  }

  // =========================================================================
  // 🧪 5. RECIPES FOR POTIONS
  // =========================================================================
  recipes.push({
    resultItemId: 'potion_01a',
    resultQty: 3,
    requiredLevel: 1,
    dongCost: 100,
    materials: [{ itemId: 'fish_01a', quantity: 2 }, { itemId: 'wood_01a', quantity: 1 }],
  });

  recipes.push({
    resultItemId: 'potion_02a',
    resultQty: 2,
    requiredLevel: 10,
    dongCost: 250,
    materials: [{ itemId: 'crystal_01a', quantity: 1 }, { itemId: 'wood_01a', quantity: 2 }],
  });

  recipes.push({
    resultItemId: 'potion_03a',
    resultQty: 1,
    requiredLevel: 25,
    dongCost: 500,
    materials: [{ itemId: 'crystal_01a', quantity: 3 }],
  });

  return recipes;
}

const logicalRecipes = generateLogicalRecipes();
console.log(`Generated ${logicalRecipes.length} logical recipes!`);

const fileContent = `export interface Recipe {
  resultItemId: string;
  resultQty: number;
  requiredLevel: number;
  dongCost: number;
  materials: { itemId: string; quantity: number }[];
}

export const RECIPES: Recipe[] = ${JSON.stringify(logicalRecipes, null, 2)};
`;

fs.writeFileSync('src/game/data/recipes.ts', fileContent);
console.log('Successfully updated src/game/data/recipes.ts with highly realistic RPG recipes!');
