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
    "dongCost": 1050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 2550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 3300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 4050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 3
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "sword_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 4800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "sword_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 5550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "sword_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 6300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "sword_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 7050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "sword_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 7800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "sword_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 8550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "sword_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 9300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "sword_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 10050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "sword_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 10800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "sword_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 11550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 9
      },
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "sword_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 12300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "sword_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 13050,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "sword_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 13800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "sword_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 14550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "sword_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 15300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 16
      }
    ]
  },
  {
    "resultItemId": "staff_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 1150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 2750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
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
    "dongCost": 3550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
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
    "dongCost": 4350,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 5
      },
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "staff_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 5150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 5950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 6750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 7550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
      },
      {
        "itemId": "crystal_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "staff_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 8350,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 10
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
    "dongCost": 9150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "staff_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 9950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "staff_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 10750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "staff_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 11550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "staff_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 12350,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 15
      },
      {
        "itemId": "crystal_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "staff_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 13150,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "staff_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 13950,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "staff_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 14750,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "staff_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 15550,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "staff_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 16350,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 20
      },
      {
        "itemId": "crystal_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "bow_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 1000,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1700,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 2400,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 3100,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 3800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 6
      },
      {
        "itemId": "ingot_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "bow_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 4500,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 5200,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 5900,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 6600,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 7300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 8
      },
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "bow_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 8000,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "bow_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 8700,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "bow_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 9400,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "bow_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 10100,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "bow_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 10800,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 12
      },
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "bow_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 11500,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "bow_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 12200,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "bow_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 12900,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "bow_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 13600,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "bow_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 14300,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 16
      },
      {
        "itemId": "ingot_01a",
        "quantity": 8
      }
    ]
  },
  {
    "resultItemId": "shield_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 850,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "armor_01a",
    "resultQty": 1,
    "requiredLevel": 5,
    "dongCost": 1300,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "shield_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 1450,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "armor_01b",
    "resultQty": 1,
    "requiredLevel": 10,
    "dongCost": 2200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "shield_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 2050,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "armor_01c",
    "resultQty": 1,
    "requiredLevel": 15,
    "dongCost": 3100,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "shield_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 2650,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "armor_01d",
    "resultQty": 1,
    "requiredLevel": 20,
    "dongCost": 4000,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "shield_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 3250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "armor_01e",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 4900,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "shield_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 3850,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "armor_02a",
    "resultQty": 1,
    "requiredLevel": 30,
    "dongCost": 5800,
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
    "dongCost": 4450,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "armor_02b",
    "resultQty": 1,
    "requiredLevel": 35,
    "dongCost": 6700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      }
    ]
  },
  {
    "resultItemId": "shield_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 5050,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "armor_02c",
    "resultQty": 1,
    "requiredLevel": 40,
    "dongCost": 7600,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      }
    ]
  },
  {
    "resultItemId": "shield_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 5650,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "armor_02d",
    "resultQty": 1,
    "requiredLevel": 45,
    "dongCost": 8500,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      }
    ]
  },
  {
    "resultItemId": "shield_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 6250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 6
      }
    ]
  },
  {
    "resultItemId": "armor_02e",
    "resultQty": 1,
    "requiredLevel": 50,
    "dongCost": 9400,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 10
      }
    ]
  },
  {
    "resultItemId": "shield_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 6850,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "armor_03a",
    "resultQty": 1,
    "requiredLevel": 55,
    "dongCost": 10300,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 7450,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "armor_03b",
    "resultQty": 1,
    "requiredLevel": 60,
    "dongCost": 11200,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 8050,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "armor_03c",
    "resultQty": 1,
    "requiredLevel": 65,
    "dongCost": 12100,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 8650,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "armor_03d",
    "resultQty": 1,
    "requiredLevel": 70,
    "dongCost": 13000,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 9250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 9
      }
    ]
  },
  {
    "resultItemId": "armor_03e",
    "resultQty": 1,
    "requiredLevel": 75,
    "dongCost": 13900,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 15
      }
    ]
  },
  {
    "resultItemId": "shield_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 9850,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "armor_04a",
    "resultQty": 1,
    "requiredLevel": 80,
    "dongCost": 14800,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "shield_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 10450,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "armor_04b",
    "resultQty": 1,
    "requiredLevel": 85,
    "dongCost": 15700,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "shield_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 11050,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "armor_04c",
    "resultQty": 1,
    "requiredLevel": 90,
    "dongCost": 16600,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "shield_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 11650,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "armor_04d",
    "resultQty": 1,
    "requiredLevel": 95,
    "dongCost": 17500,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "shield_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 12250,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 12
      }
    ]
  },
  {
    "resultItemId": "armor_04e",
    "resultQty": 1,
    "requiredLevel": 100,
    "dongCost": 18400,
    "materials": [
      {
        "itemId": "ingot_01a",
        "quantity": 20
      }
    ]
  },
  {
    "resultItemId": "potion_01a",
    "resultQty": 3,
    "requiredLevel": 1,
    "dongCost": 200,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 2
      }
    ]
  },
  {
    "resultItemId": "potion_02a",
    "resultQty": 2,
    "requiredLevel": 10,
    "dongCost": 400,
    "materials": [
      {
        "itemId": "wood_01a",
        "quantity": 4
      }
    ]
  },
  {
    "resultItemId": "potion_03a",
    "resultQty": 1,
    "requiredLevel": 25,
    "dongCost": 1000,
    "materials": [
      {
        "itemId": "crystal_01a",
        "quantity": 2
      }
    ]
  }
];
