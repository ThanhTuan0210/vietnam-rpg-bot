const fs = require('fs');

const subSuffixes = ['a', 'b', 'c', 'd', 'e'];

function generateFullRecipes() {
  const recipes = [];

  // Crafting recipes for all 20 Swords
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `sword_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const cost = level * 150 + 300;
      const matTier = `ingot_0${Math.min(3, tier)}${sub}`;
      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: cost,
        materials: [
          { itemId: 'wood_01a', quantity: Math.max(2, tier * 3) },
          { itemId: 'ingot_01a', quantity: Math.max(3, tier * 4) },
        ],
      });
    }
  }

  // Crafting recipes for all 20 Staves
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `staff_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const cost = level * 160 + 350;
      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: cost,
        materials: [
          { itemId: 'wood_01a', quantity: Math.max(5, tier * 5) },
          { itemId: 'crystal_01a', quantity: Math.max(2, tier * 2) },
        ],
      });
    }
  }

  // Crafting recipes for all 20 Bows
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `bow_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const cost = level * 140 + 300;
      recipes.push({
        resultItemId: id,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: cost,
        materials: [
          { itemId: 'wood_01a', quantity: Math.max(6, tier * 4) },
          { itemId: 'ingot_01a', quantity: Math.max(2, tier * 2) },
        ],
      });
    }
  }

  // Crafting recipes for all 20 Shields & Armors
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const shId = `shield_0${tier}${sub}`;
      const arId = `armor_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;

      recipes.push({
        resultItemId: shId,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: level * 120 + 250,
        materials: [{ itemId: 'ingot_01a', quantity: Math.max(4, tier * 3) }],
      });

      recipes.push({
        resultItemId: arId,
        resultQty: 1,
        requiredLevel: Math.max(1, level),
        dongCost: level * 180 + 400,
        materials: [{ itemId: 'ingot_01a', quantity: Math.max(6, tier * 5) }],
      });
    }
  }

  // Potions
  recipes.push({ resultItemId: 'potion_01a', resultQty: 3, requiredLevel: 1, dongCost: 200, materials: [{ itemId: 'wood_01a', quantity: 2 }] });
  recipes.push({ resultItemId: 'potion_02a', resultQty: 2, requiredLevel: 10, dongCost: 400, materials: [{ itemId: 'wood_01a', quantity: 4 }] });
  recipes.push({ resultItemId: 'potion_03a', resultQty: 1, requiredLevel: 25, dongCost: 1000, materials: [{ itemId: 'crystal_01a', quantity: 2 }] });

  return recipes;
}

const allRecipes = generateFullRecipes();
console.log(`Generated ${allRecipes.length} total recipes!`);

const fileContent = `export interface Recipe {
  resultItemId: string;
  resultQty: number;
  requiredLevel: number;
  dongCost: number;
  materials: { itemId: string; quantity: number }[];
}

export const RECIPES: Recipe[] = ${JSON.stringify(allRecipes, null, 2)};
`;

fs.writeFileSync('src/game/data/recipes.ts', fileContent);
console.log('Successfully written all recipes to src/game/data/recipes.ts!');
