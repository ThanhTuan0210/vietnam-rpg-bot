const fs = require('fs');
const path = require('path');

const dir = "C:/Users/so44s/Downloads/kyrises_icons/Kyrise's 16x16 RPG Icon Pack - V1.2/icons/32x32";
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));

console.log('Total PNG files found:', files.length);

const itemsCode = [];
itemsCode.push(`export interface ItemDefinition {
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

export const ITEMS: Record<string, ItemDefinition> = {`);

files.forEach((f) => {
  const id = f.replace('.png', '');
  let type = 'nguyenlieu';
  let name = id;
  let desc = 'Vat pham ' + id;
  let price = 50;
  let statBonusStr = '';
  let requiredLevel = 1;

  if (id.startsWith('sword')) {
    type = 'vukhi';
    name = 'Bao Kiem ' + id.toUpperCase();
    desc = 'Thach bao kiem ren tu thep tinh luyen ' + id;
    statBonusStr = 'satThuong: 35';
    price = 300;
  } else if (id.startsWith('staff')) {
    type = 'vukhi';
    name = 'Truong Phep ' + id.toUpperCase();
    desc = 'Phap truong tich tu linh khi dai ngan ' + id;
    statBonusStr = 'satThuong: 40';
    price = 350;
  } else if (id.startsWith('bow')) {
    type = 'vukhi';
    name = 'Cung Than ' + id.toUpperCase();
    desc = 'Cung than uon tu go trac ngan nam ' + id;
    statBonusStr = 'satThuong: 32, chiMang: 0.1';
    price = 320;
  } else if (id.startsWith('arrow')) {
    type = 'nguyenlieu';
    name = 'Mui Ten ' + id.toUpperCase();
    desc = 'Mui ten tam doc ' + id;
    price = 20;
  } else if (id.startsWith('shield')) {
    type = 'aogiap';
    name = 'Khien Giap ' + id.toUpperCase();
    desc = 'Khien giap kien co ' + id;
    statBonusStr = 'phongThu: 25, sinhLucToiDa: 100';
    price = 280;
  } else if (id.startsWith('helmet')) {
    type = 'mu';
    name = 'Mu Mao ' + id.toUpperCase();
    desc = 'Mu chien bao ve vuong gia ' + id;
    statBonusStr = 'phongThu: 15, sinhLucToiDa: 60';
    price = 200;
  } else if (id.startsWith('ring')) {
    type = 'nhan';
    name = 'Nhan Ho Menh ' + id.toUpperCase();
    desc = 'Nhan than toa hao quang linh khi ' + id;
    statBonusStr = 'phongThu: 10, chiMang: 0.05';
    price = 250;
  } else if (id.startsWith('necklace')) {
    type = 'daychuyen';
    name = 'Day Chuyen ' + id.toUpperCase();
    desc = 'Day chuyen vang ho than ' + id;
    statBonusStr = 'sinhLucToiDa: 120, manaToiDa: 50';
    price = 300;
  } else if (id.startsWith('potion')) {
    type = 'duoclieu';
    name = 'Thuoc Phep ' + id.toUpperCase();
    desc = 'Binh duoc phep hoi HP MP va tang suc manh ' + id;
    price = 100;
  } else if (id.startsWith('crystal')) {
    type = 'nguyenlieu';
    name = 'Tinh Thach ' + id.toUpperCase();
    desc = 'Tinh thach khoang san ren do ' + id;
    price = 150;
  } else if (id.startsWith('gem')) {
    type = 'ngoc';
    name = 'Ngoc Quy ' + id.toUpperCase();
    desc = 'Vien ngoc quy kham trang bi ' + id;
    price = 250;
  } else if (id.startsWith('ingot')) {
    type = 'nguyenlieu';
    name = 'Thoi Kim Loai ' + id.toUpperCase();
    desc = 'Thoi kim loai tinh che ren do ' + id;
    price = 180;
  } else if (id.startsWith('key')) {
    type = 'tinh_nang';
    name = 'Chia Khoa ' + id.toUpperCase();
    desc = 'Chia khoa mo ruong nguc toi ' + id;
    price = 200;
  } else if (id.startsWith('gift') || id.startsWith('giftopen')) {
    type = 'ruong';
    name = 'Ruong Bau ' + id.toUpperCase();
    desc = 'Ruong bau chua tai bao nguc toi ' + id;
    price = 500;
  } else if (id.startsWith('scroll') || id.startsWith('spellbook') || id.startsWith('book')) {
    type = 'tinh_nang';
    name = 'Bi Kip ' + id.toUpperCase();
    desc = 'Bi kip phap thuat va cuon bua cuong hoa ' + id;
    price = 300;
  } else if (id.startsWith('fish')) {
    type = 'duoclieu';
    name = 'Ca Dam Lay ' + id.toUpperCase();
    desc = 'Ca tuoi cau tu ho thuy sinh ' + id;
    price = 80;
  }

  const statPart = statBonusStr ? `, statBonus: { ${statBonusStr} }` : '';
  itemsCode.push(`  ${id}: { id: '${id}', name: '${name}', type: '${type}', description: '${desc}'${statPart}, requiredLevel: ${requiredLevel}, sellPrice: ${price}, icon: '📦' },`);
});

// Also keep custom item IDs like hat_giong, lua_nuoc_hat, dau_xanh_hat, bua_com_lam, ca_chep_song
itemsCode.push(`  hat_giong: { id: 'hat_giong', name: 'Hạt Giống Nông Nghiệp', type: 'nguyenlieu', description: 'Hạt giống nông nghiệp dùng gieo trồng ở điền trang.', sellPrice: 50, icon: '🌱' },`);
itemsCode.push(`  lua_nuoc_hat: { id: 'lua_nuoc_hat', name: 'Hạt Lúa Nước', type: 'nguyenlieu', description: 'Nông sản lúa nước thu hoạch từ điền trang.', sellPrice: 240, icon: '🌾' },`);
itemsCode.push(`  dau_xanh_hat: { id: 'dau_xanh_hat', name: 'Hạt Đậu Xanh', type: 'nguyenlieu', description: 'Nông sản đậu xanh thu hoạch từ điền trang.', sellPrice: 625, icon: '🫘' },`);
itemsCode.push(`  bua_com_lam: { id: 'bua_com_lam', name: 'Bữa Cơm Lam Thượng Hạng', type: 'duoclieu', description: 'Bữa cơm lam thơm ngon hồi 100% HP & MP.', sellPrice: 250, icon: '🍱' },`);
itemsCode.push(`  ca_chep_song: { id: 'ca_chep_song', name: 'Cá Chép Sông', type: 'duoclieu', description: 'Cá chép đánh bắt từ sông hồ.', sellPrice: 20, icon: '🐟' },`);

itemsCode.push(`};`);

fs.writeFileSync('src/game/data/items.ts', itemsCode.join('\n'));
console.log('Successfully written src/game/data/items.ts with all PNG items!');
