const fs = require('fs');

const subSuffixes = ['a', 'b', 'c', 'd', 'e'];

function generateFullCatalog() {
  const items = {};

  // 1. SWORDS (20 Swords: sword_01a to sword_04e)
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `sword_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const atk = level * 6 + 25;
      const price = level * 100 + 200;
      let name = `Kiếm Trung Cổ Tier ${tier}.${sIdx + 1}`;
      if (id === 'sword_01a') name = 'Thép Kiếm Gothic Tier 1';
      if (id === 'sword_02a') name = 'Bảo Kiếm Hoàng Gia Tier 2';
      if (id === 'sword_04e') name = 'Bảo Kiếm Excalibur ENDGAME';

      items[id] = {
        id,
        name,
        type: 'vukhi',
        description: `Thanh kiếm thép Kyrise Gothic cấp ${level}.`,
        statBonus: { satThuong: atk, chiMang: Number((0.05 + sIdx * 0.03 + tier * 0.02).toFixed(2)) },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: sIdx === 1 ? '🗡️' : sIdx === 3 ? '💥' : '⚔️',
      };
    }
  }

  // 2. STAVES & ORBS (20 Staves & Orbs: staff_01a to staff_04e)
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `staff_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const atk = level * 7 + 30;
      const mp = level * 10 + 50;
      const price = level * 120 + 250;
      let name = `Trượng Ma Pháp Tier ${tier}.${sIdx + 1}`;
      if (id === 'staff_01a') name = 'Trượng Gỗ Rừng Tier 1';
      if (id === 'staff_04e') name = 'Trượng Linh Hồn Rồng ENDGAME';

      items[id] = {
        id,
        name,
        type: 'vukhi',
        description: `Pháp trượng / Quả cầu phép thuật Kyrise Gothic cấp ${level}.`,
        statBonus: { satThuong: atk, manaToiDa: mp },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: sIdx % 2 === 1 ? '🔮' : '🪄',
      };
    }
  }

  // 3. BOWS (20 Bows: bow_01a to bow_04e)
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `bow_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const atk = level * 6 + 20;
      const crit = Number((0.08 + sIdx * 0.02 + tier * 0.02).toFixed(2));
      const price = level * 110 + 220;
      let name = `Cung Tinh Linh Tier ${tier}.${sIdx + 1}`;
      if (id === 'bow_01a') name = 'Cung Tinh Linh Tier 1';
      if (id === 'bow_04e') name = 'Cung Vương Phủ Rồng ENDGAME';

      items[id] = {
        id,
        name,
        type: 'vukhi',
        description: `Cung bão tên Kyrise Gothic cấp ${level}.`,
        statBonus: { satThuong: atk, chiMang: crit },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: '🏹',
      };
    }
  }

  // 4. SHIELDS (20 Shields: shield_01a to shield_04e)
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `shield_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const def = level * 4 + 20;
      const hp = level * 15 + 80;
      const price = level * 90 + 200;
      let name = `Khiên Giáp Tier ${tier}.${sIdx + 1}`;
      if (id === 'shield_01a') name = 'Khiên Thép Gothic Tier 1';
      if (id === 'shield_04e') name = 'Khiên Thánh Hoàng Gia ENDGAME';

      items[id] = {
        id,
        name,
        type: 'aogiap',
        description: `Khiên giáp thép Kyrise Gothic cấp ${level}.`,
        statBonus: { phongThu: def, sinhLucToiDa: hp },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: '🛡️',
      };
    }
  }

  // 5. HELMETS (15 Helmets: helmet_01a to helmet_03e)
  for (let tier = 1; tier <= 3; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `helmet_0${tier}${sub}`;
      const level = (tier - 1) * 30 + (sIdx + 1) * 5;
      const def = level * 3 + 12;
      const hp = level * 10 + 50;
      const price = level * 80 + 150;

      items[id] = {
        id,
        name: `Mũ Kị Sĩ Tier ${tier}.${sIdx + 1}`,
        type: 'mu',
        description: `Mũ chiến bảo vệ kị sĩ cấp ${level}.`,
        statBonus: { phongThu: def, sinhLucToiDa: hp },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: '🪖',
      };
    }
  }

  // 6. ARMORS (20 Armors: armor_01a to armor_04e)
  for (let tier = 1; tier <= 4; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `armor_0${tier}${sub}`;
      const level = (tier - 1) * 25 + (sIdx + 1) * 5;
      const def = level * 5 + 25;
      const hp = level * 20 + 100;
      const price = level * 120 + 300;
      let name = `Áo Giáp Thép Tier ${tier}.${sIdx + 1}`;
      if (id === 'armor_01a') name = 'Áo Giáp Thép Kị Sĩ Tier 1';
      if (id === 'armor_04e') name = 'Áo Giáp Thần Rồng ENDGAME';

      items[id] = {
        id,
        name,
        type: 'aogiap',
        description: `Áo giáp thép Kyrise Gothic cấp ${level}.`,
        statBonus: { phongThu: def, sinhLucToiDa: hp },
        requiredLevel: Math.max(1, level),
        sellPrice: price,
        icon: '🛡️',
      };
    }
  }

  // 7. POTIONS (15 Potions: potion_01a..01e, potion_02a..02e, potion_03a..03e)
  for (let tier = 1; tier <= 3; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const id = `potion_0${tier}${sub}`;
      const price = tier * 50 + sIdx * 20;
      const pName = tier === 1 ? 'Thuốc Hồi Máu HP' : tier === 2 ? 'Thuốc Hồi Mana MP' : 'Ma Dược Kích Rèn';
      items[id] = {
        id,
        name: `${pName} Tier ${tier}.${sIdx + 1}`,
        type: 'duoclieu',
        description: `Dược liệu phép thuật Kyrise Gothic.`,
        sellPrice: price,
        icon: '🧪',
      };
    }
  }

  // 8. ORES, CRYSTALS & GEMS (ingot_01a..03e, crystal_01a..03e, gem_01a..03e)
  for (let tier = 1; tier <= 3; tier++) {
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const sub = subSuffixes[sIdx];
      const ingId = `ingot_0${tier}${sub}`;
      const cryId = `crystal_0${tier}${sub}`;
      const gemId = `gem_0${tier}${sub}`;

      items[ingId] = {
        id: ingId,
        name: `Thỏi Kim Loại Tier ${tier}.${sIdx + 1}`,
        type: 'nguyenlieu',
        description: 'Thỏi kim loại rèn đồ Kyrise.',
        sellPrice: tier * 100 + sIdx * 50,
        icon: '🧱',
      };

      items[cryId] = {
        id: cryId,
        name: `Tinh Thạch Ma Thuật Tier ${tier}.${sIdx + 1}`,
        type: 'nguyenlieu',
        description: 'Tinh thạch ma thuật Kyrise.',
        sellPrice: tier * 150 + sIdx * 60,
        icon: '🔮',
      };

      items[gemId] = {
        id: gemId,
        name: `Hồng Ngọc Khảm Giáp Tier ${tier}.${sIdx + 1}`,
        type: 'ngoc',
        description: 'Viên ngọc quý dùng khảm nạm.',
        sellPrice: tier * 200 + sIdx * 80,
        icon: '💎',
      };
    }
  }

  // 9. WOODS, ARROWS, KEYS, CHESTS & UTILITIES
  for (let sIdx = 0; sIdx < 5; sIdx++) {
    const sub = subSuffixes[sIdx];
    items[`wood_01${sub}`] = { id: `wood_01${sub}`, name: `Gỗ Sồi Cổ Tier 1.${sIdx + 1}`, type: 'nguyenlieu', description: 'Gỗ chế tác.', sellPrice: 50 + sIdx * 20, icon: '🪵' };
    items[`arrow_01${sub}`] = { id: `arrow_01${sub}`, name: `Mũi Tên Độc Tier 1.${sIdx + 1}`, type: 'nguyenlieu', description: 'Tên bắn cung.', sellPrice: 30 + sIdx * 10, icon: '🏹' };
    items[`key_01${sub}`] = { id: `key_01${sub}`, name: `Chìa Khóa Ngục Tối Tier 1.${sIdx + 1}`, type: 'nguyenlieu', description: 'Chìa khóa ngục.', sellPrice: 300 + sIdx * 100, icon: '🗝️' };
    items[`gift_01${sub}`] = { id: `gift_01${sub}`, name: `Rương Báu Thượng Cổ Tier 1.${sIdx + 1}`, type: 'ruong', description: 'Rương báu chứa đồ.', sellPrice: 800 + sIdx * 200, icon: '🧰' };
  }

  items['scroll_reset_job'] = { id: 'scroll_reset_job', name: '📜 Sách Xóa Nghề Trung Cổ', type: 'tinh_nang', description: 'Xóa bỏ ngay 24h chờ đổi nghề.', sellPrice: 25000, icon: '📜' };
  items['giftopen_01f'] = { id: 'giftopen_01f', name: 'Rương Vô Địch Rồng ENDGAME', type: 'ruong', description: 'Rương báu chứa Thần Kiếm Excalibur.', sellPrice: 20000, icon: '🎁' };
  items['coin_01a'] = { id: 'coin_01a', name: 'Tiền Vàng Cổ Trung Cổ', type: 'nguyenlieu', description: 'Vàng.', sellPrice: 10, icon: '🪙' };
  items['fish_01a'] = { id: 'fish_01a', name: 'Cá Đầm Lầy Gothic', type: 'duoclieu', description: 'Cá nướng.', sellPrice: 30, icon: '🐟' };

  return items;
}

const allItems = generateFullCatalog();
console.log(`Generated ${Object.keys(allItems).length} total Kyrise items!`);

const fileContent = `export interface ItemDefinition {
  id: string;
  name: string;
  type: 'vukhi' | 'aogiap' | 'phapbao' | 'linhthu' | 'ngoc' | 'ruong' | 'duoclieu' | 'nguyenlieu' | 'tinh_nang' | 'mu' | 'giay' | 'nhan' | 'daychuyen';
  description: string;
  statBonus?: {
    satThuong?: number;
    phongThu?: number;
    sinhLucToiDa?: number;
    manaToiDa?: number;
    chiMang?: number;
  };
  requiredLevel?: number;
  sellPrice: number;
  icon: string;
}

export const CUSTOM_EMOJIS: Record<string, string> = {};

export function getItemIcon(itemId: string, defaultIcon = '📦'): string {
  if (CUSTOM_EMOJIS[itemId]) {
    return CUSTOM_EMOJIS[itemId];
  }
  const item = ITEMS[itemId];
  return item?.icon || defaultIcon;
}

export const ITEMS: Record<string, ItemDefinition> = ${JSON.stringify(allItems, null, 2)};
`;

fs.writeFileSync('src/game/data/items.ts', fileContent);
console.log('Successfully written 150+ Kyrise PNG items to src/game/data/items.ts!');
