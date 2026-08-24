export interface Recipe {
  resultItemId: string;
  resultQty: number;
  requiredLevel: number;
  dongCost: number;
  materials: { itemId: string; quantity: number }[];
}

export const RECIPES: Recipe[] = [
  {
    "resultItemId": "sword_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      },
      {
        "itemId": "wood_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "sword_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 5
      },
      {
        "itemId": "wood_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "sword_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 1700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 7
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 2700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 8
      },
      {
        "itemId": "wood_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "sword_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 3200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 7
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 3700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 8
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 4200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      },
      {
        "itemId": "wood_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "sword_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 4700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      },
      {
        "itemId": "wood_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "sword_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 5200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 11
      },
      {
        "itemId": "wood_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 5700,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 10
      },
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "gem_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "sword_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 6200,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 11
      },
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "gem_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 6700,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 12
      },
      {
        "itemId": "wood_01a",
        "quantity": 4
      },
      {
        "itemId": "gem_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "sword_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 7200,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 13
      },
      {
        "itemId": "wood_01a",
        "quantity": 4
      },
      {
        "itemId": "gem_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 7700,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 14
      },
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "gem_01a",
        "quantity": 5
      }
    ]
  },
  {
    "resultItemId": "sword_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 8200,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 13
      },
      {
        "itemId": "wood_01a",
        "quantity": 4
      },
      {
        "itemId": "gem_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "sword_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 8700,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 14
      },
      {
        "itemId": "wood_01a",
        "quantity": 4
      },
      {
        "itemId": "gem_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "sword_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 9200,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 15
      },
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "gem_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "sword_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 9700,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 16
      },
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "gem_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 10200,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 17
      },
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "gem_01a",
        "quantity": 5
      }
    ]
  },
  {
    "resultItemId": "staff_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "staff_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1350,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "crystal_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "staff_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 1900,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 7
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2450,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 3000,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "crystal_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "staff_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 3550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 4100,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 4650,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 11
      },
      {
        "itemId": "crystal_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "staff_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 5200,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "crystal_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "staff_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 5750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 13
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 6300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 13
      },
      {
        "itemId": "crystal_01a",
        "quantity": 3
      },
      {
        "itemId": "crystal_01j",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "staff_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 6850,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 14
      },
      {
        "itemId": "crystal_01a",
        "quantity": 3
      },
      {
        "itemId": "crystal_01j",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 7400,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      },
      {
        "itemId": "crystal_01j",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "staff_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 7950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      },
      {
        "itemId": "crystal_01j",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 8500,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 17
      },
      {
        "itemId": "crystal_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01j",
        "quantity": 5
      }
    ]
  },
  {
    "resultItemId": "staff_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 9050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 17
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      },
      {
        "itemId": "crystal_01j",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "staff_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 9600,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 18
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      },
      {
        "itemId": "crystal_01j",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 10150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 19
      },
      {
        "itemId": "crystal_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01j",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "staff_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 10700,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01j",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 11250,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 21
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      },
      {
        "itemId": "crystal_01j",
        "quantity": 5
      }
    ]
  },
  {
    "resultItemId": "bow_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 675,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "bow_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "bow_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 1625,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 7
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "bow_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2100,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "bow_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 2575,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "bow_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 3050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 3525,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 11
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 4000,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 4475,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 13
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 4950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 14
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 5425,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "ingot_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "bow_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 5900,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "bow_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 6375,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 17
      },
      {
        "itemId": "ingot_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "bow_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 6850,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 18
      },
      {
        "itemId": "ingot_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "bow_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 7325,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 19
      },
      {
        "itemId": "ingot_01a",
        "quantity": 3
      }
    ]
  },
  {
    "resultItemId": "bow_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 7800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 8275,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 21
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 8750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 22
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 9225,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 23
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 9700,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 24
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "arrow_01a",
    "resultQty": 10,
    "requiredLevel": 1,
    "dongCost": 50,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 2
      },
      {
        "itemId": "ingot_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "shield_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 650,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 3
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 950,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 5
      }
    ]
  },
  {
    "resultItemId": "shield_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1100,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1600,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 7
      }
    ]
  },
  {
    "resultItemId": "shield_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 1550,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 5
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 2250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "shield_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2000,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2900,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 11
      }
    ]
  },
  {
    "resultItemId": "shield_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 2450,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 7
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 3550,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 13
      }
    ]
  },
  {
    "resultItemId": "shield_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 2900,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 4200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      }
    ]
  },
  {
    "resultItemId": "shield_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 3350,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 7
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 4850,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "shield_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 3800,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 8
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 5500,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 14
      }
    ]
  },
  {
    "resultItemId": "shield_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 4250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 6150,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "shield_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 4700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 6800,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 18
      }
    ]
  },
  {
    "resultItemId": "shield_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 5150,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 9
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 7450,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 5600,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 10
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 8100,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 17
      }
    ]
  },
  {
    "resultItemId": "shield_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 6050,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 11
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 8750,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 19
      }
    ]
  },
  {
    "resultItemId": "shield_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 6500,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 12
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 9400,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 21
      }
    ]
  },
  {
    "resultItemId": "shield_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 6950,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 13
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 10050,
    "materials": [
      {
        "itemId": "ingot_01b",
        "quantity": 23
      }
    ]
  },
  {
    "resultItemId": "shield_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 7400,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 12
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 10700,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "shield_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 7850,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 13
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 11350,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 22
      }
    ]
  },
  {
    "resultItemId": "shield_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 8300,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 14
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 12000,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 24
      }
    ]
  },
  {
    "resultItemId": "shield_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 8750,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 15
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 12650,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 26
      }
    ]
  },
  {
    "resultItemId": "shield_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 9200,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 16
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "armor_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 13300,
    "materials": [
      {
        "itemId": "ingot_01e",
        "quantity": 28
      }
    ]
  },
  {
    "resultItemId": "potion_01a",
    "resultQty": 3,
    "requiredLevel": 1,
    "dongCost": 100,
    "materials": [
      {
        "itemId": "fish_01a",
        "quantity": 2
      },
      {
        "itemId": "wood_01a",
        "quantity": 1
      }
    ]
  },
  {
    "resultItemId": "potion_02a",
    "resultQty": 2,
    "requiredLevel": 10,
    "dongCost": 250,
    "materials": [
      {
        "itemId": "crystal_01a",
        "quantity": 1
      },
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "potion_03a",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 500,
    "materials": [
      {
        "itemId": "crystal_01a",
        "quantity": 3
      }
    ]
  }
];
