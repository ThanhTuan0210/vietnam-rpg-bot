import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong, formatKimBao } from '../../utils/formatters';
import { UserModelAdvanced } from '../../database/models/User.model';
import { ITEMS } from '../../game/data/items';

export interface ChestDefinition {
  id: string;
  name: string;
  icon: string;
  dropRateStr: string;
  fuseCostDong: number;
  fuseCostKimBao: number;
  nextTier?: string;
}

export const CHESTS_BALANCED: Record<string, ChestDefinition> = {
  ruong_go: {
    id: 'ruong_go',
    name: 'Rương Gỗ Thượng Cổ (common lootbox)',
    icon: '📦',
    dropRateStr: '18% (Săn quái)',
    fuseCostDong: 0,
    fuseCostKimBao: 0,
    nextTier: 'ruong_dong',
  },
  ruong_dong: {
    id: 'ruong_dong',
    name: 'Rương Đồng Thượng Cổ (uncommon lootbox)',
    icon: '📦',
    dropRateStr: '6% (Săn quái)',
    fuseCostDong: 2500,
    fuseCostKimBao: 0,
    nextTier: 'ruong_bac',
  },
  ruong_bac: {
    id: 'ruong_bac',
    name: 'Rương Bạc Thượng Cổ (rare lootbox)',
    icon: '🟦',
    dropRateStr: '2% (Thám hiểm)',
    fuseCostDong: 20000,
    fuseCostKimBao: 0,
    nextTier: 'ruong_vang',
  },
  ruong_vang: {
    id: 'ruong_vang',
    name: 'Rương Vàng Thượng Cổ (EPIC lootbox)',
    icon: '🔮',
    dropRateStr: '0.5% (Trùm Vùng)',
    fuseCostDong: 100000,
    fuseCostKimBao: 0,
    nextTier: 'ruong_huyen_thiet',
  },
  ruong_huyen_thiet: {
    id: 'ruong_huyen_thiet',
    name: 'Rương Huyền Thiết Hoàng Cung (EDGY lootbox)',
    icon: '🏵️',
    dropRateStr: 'Chỉ nhận từ Raid Boss / Cáo Thị Cực Khó',
    fuseCostDong: 500000,
    fuseCostKimBao: 2,
  },
};

// HÀM TẠO NHIỆM VỤ CÁO THỊ NGẪU NHIÊN THEO MỖI CHU KỲ 3 GIỜ DÀNH RIÊNG CHO TỪNG NGƯỜI CHƠI
function generateRandomQuestsForUser(userId: string) {
  const cycleIndex = Math.floor(Date.now() / (3 * 3600 * 1000));
  const userNum = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seed = cycleIndex * 1000 + userNum;

  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const pool1 = [
    `🪵 **Chặt 20 Gỗ Tre Gai** — Thưởng: ${formatDong(5000)}, 💎 **2 Kim Bảo**`,
    `⛏️ **Đào 15 Quặng Đồng** — Thưởng: ${formatDong(6000)}, 💎 **3 Kim Bảo**`,
    `🎣 **Câu 10 Cá Trắm Bến Thôn** — Thưởng: ${formatDong(4500)}, 💎 **2 Kim Bảo**`,
    `🍃 **Hái 20 Lá Thuốc Nam** — Thưởng: ${formatDong(4000)}, 💎 **2 Kim Bảo**`,
    `🌾 **Gieo 3 Hạt Giống Điền Trang** — Thưởng: ${formatDong(7000)}, 💎 **3 Kim Bảo**`,
  ];

  const pool2 = [
    `⚔️ **Hạ 10 Ma Da Sông Hồng (Vùng 1)** — Thưởng: ${formatDong(10000)}, 📦 **1 Rương Gỗ**`,
    `🐺 **Hạ 8 Sói Rừng U Minh (Vùng 2)** — Thưởng: ${formatDong(15000)}, 📦 **1 Rương Đồng**`,
    `🦄 **Hạ 5 Kỳ Lân Cổ Thạch (Vùng 3)** — Thưởng: ${formatDong(25000)}, 🟦 **1 Rương Bạc**`,
    `👑 **Hạ 3 Tướng Quỷ Hắc Ám (Vùng 4)** — Thưởng: ${formatDong(40000)}, 🔮 **1 Rương Vàng**`,
    `🐉 **Khiêu Chiến Phụ Bản Trùm Vùng 1 Lần** — Thưởng: ${formatDong(30000)}, 💎 **5 Kim Bảo**`,
  ];

  const pool3 = [
    `🎲 **Thắng 3 ván Bầu Cua Dân Gian** — Thưởng: ⛩️ **1 Bùa Trừ Tà**, ${formatDong(5000)}`,
    `🎲 **Thắng 2 ván Tài Xỉu Quan Phủ** — Thưởng: 🧪 **1 Thuốc x2 EXP**, ${formatDong(8000)}`,
    `🔨 **Tự Rèn 1 Vũ Khí Hoặc Áo Giáp Tại Lò Rèn** — Thưởng: 📜 **1 Lá Bùa Hộ Mệnh**`,
    `✨ **Cường Hóa Trang Bị Thành Công 1 Lần** — Thưởng: ⚡ **1 Bùa Hồi Cooldown**`,
    `🍙 **Thưởng Thức 2 Bữa Cơm Lam Linh Khí** — Thưởng: 🍷 **1 Thuốc Huyết Long**`,
  ];

  const idx1 = Math.floor(pseudoRandom(1) * pool1.length);
  const idx2 = Math.floor(pseudoRandom(2) * pool2.length);
  const idx3 = Math.floor(pseudoRandom(3) * pool3.length);

  return [pool1[idx1], pool2[idx2], pool3[idx3]];
}

export async function caoThiCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const quests = generateRandomQuestsForUser(userId);

  // Tính thời gian còn lại của chu kỳ 3 giờ
  const cycleMs = 3 * 3600 * 1000;
  const currentCycleStart = Math.floor(Date.now() / cycleMs) * cycleMs;
  const nextCycleStart = currentCycleStart + cycleMs;
  const remMs = nextCycleStart - Date.now();

  const remHours = Math.floor(remMs / (3600 * 1000));
  const remMinutes = Math.floor((remMs % (3600 * 1000)) / (60 * 1000));
  const timeRemStr = remHours > 0 ? `${remHours} giờ ${remMinutes} phút` : `${remMinutes} phút`;

  const embed = createDongSonEmbed()
    .setTitle('📜 BẢNG CÁO THỊ NHIỆM VỤ ĐẠI VIỆT (NGẪU NHIÊN 3H)')
    .setDescription(
      `**QUAN PHỦ CÁO THỊ**: Nhiệm vụ tự động đổi mới ngẫu nhiên mỗi **3 Giờ**!\n` +
        `⏳ **Làm mới nhiệm vụ tiếp theo sau:** \`${timeRemStr}\`\n\n` +
        `1. ${quests[0]}\n` +
        `2. ${quests[1]}\n` +
        `3. ${quests[2]}\n\n` +
        `*Nhiệm vụ tự động ghi nhận khi bạn thực hiện các thao tác tương ứng!*\n` +
        `*Dùng thẻ \`vn dung the_skip_nhiem_vu\` để hoàn thành ngay và nhận quà!*`
    );

  await message.reply({ embeds: [embed] });
}

export async function ghepRuongCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const chestKey = args[0]?.toLowerCase() || 'ruong_go';
  const qty = parseInt(args[1], 10) || 1;

  const currentChest = CHESTS_BALANCED[chestKey];
  if (!currentChest || !currentChest.nextTier) {
    await message.reply('❌ Loại rương không hợp lệ hoặc đã đạt cấp cao nhất!');
    return;
  }

  const nextChest = CHESTS_BALANCED[currentChest.nextTier];
  const requiredCount = qty * 5;
  const totalCostDong = nextChest.fuseCostDong * qty;
  const totalCostKimBao = nextChest.fuseCostKimBao * qty;

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  if (user.taiChinh.dong < totalCostDong) {
    await message.reply(`❌ Bạn cần **${formatDong(totalCostDong)}** để ghép rương!`);
    return;
  }
  if (totalCostKimBao > 0 && user.taiChinh.kimBao < totalCostKimBao) {
    await message.reply(`❌ Bạn cần **${formatKimBao(totalCostKimBao)}** để ghép rương!`);
    return;
  }

  const consumed = await UserService.consumeItemAtomic(userId, chestKey, requiredCount);
  if (!consumed) {
    await message.reply(`❌ Bạn cần **${requiredCount} ${currentChest.name}** để ghép thành **${qty} ${nextChest.name}**!`);
    return;
  }

  await UserService.deductDongAtomic(userId, totalCostDong);
  if (totalCostKimBao > 0) {
    await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': -totalCostKimBao } });
  }

  await UserService.addItemAtomic(userId, currentChest.nextTier, qty);

  const embed = createDongSonEmbed()
    .setTitle('✨ DUNG HỢP RƯƠNG BÁU THÀNH CÔNG!')
    .setDescription(
      `Bạn đã tiêu tốn **${requiredCount} ${currentChest.name}** + ${formatDong(totalCostDong)}${
        totalCostKimBao > 0 ? ` + ${formatKimBao(totalCostKimBao)}` : ''
      } để ghép thành **${qty} ${nextChest.icon} ${nextChest.name}**!`
    );

  await message.reply({ embeds: [embed] });
}

export async function moRuongCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const rawInput = args.join(' ').toLowerCase().trim() || 'ruong_go';

  const aliases: Record<string, string> = {
    common: 'ruong_go',
    common_lootbox: 'ruong_go',
    'common lootbox': 'ruong_go',
    uncommon: 'ruong_dong',
    uncommon_lootbox: 'ruong_dong',
    'uncommon lootbox': 'ruong_dong',
    rare: 'ruong_bac',
    rare_lootbox: 'ruong_bac',
    'rare lootbox': 'ruong_bac',
    epic: 'ruong_vang',
    epic_lootbox: 'ruong_vang',
    'epic lootbox': 'ruong_vang',
    edgy: 'ruong_huyen_thiet',
    edgy_lootbox: 'ruong_huyen_thiet',
    'edgy lootbox': 'ruong_huyen_thiet',
    hom_ngoc: 'ruong_huyen_thiet',
  };

  const chestKey = aliases[rawInput] || rawInput;

  const chest = CHESTS_BALANCED[chestKey];
  if (!chest) {
    await message.reply('❌ Loại rương không hợp lệ! Cú pháp: `vn open ruong_go` hoặc `vn open common_lootbox`.');
    return;
  }

  const consumed = await UserService.consumeItemAtomic(userId, chestKey, 1);
  if (!consumed) {
    await message.reply(`❌ Bạn không sở hữu **${chest.name}** trong túi đồ!`);
    return;
  }

  const embed = createDongSonEmbed().setTitle(`🎉 MỞ ${chest.icon} ${chest.name.toUpperCase()}!`);
  const lootItems: { itemId: string; name: string; icon: string; qty: number }[] = [];
  let dongGained = 0;
  let kbGained = 0;

  if (chestKey === 'ruong_go') {
    // 100% rớt 350 ~ 3,500 Đồng (Giảm 30%)
    dongGained = Math.floor(Math.random() * 3150) + 350;

    // 100% rớt Món #1 (Gỗ Tre / Lá Thuốc / Cơm Lam)
    const r1 = Math.random();
    let m1 = 'go_tre_gai';
    let q1 = Math.floor(Math.random() * 3) + 1;
    if (r1 > 0.6 && r1 <= 0.85) {
      m1 = 'la_thuoc_nam';
      q1 = Math.floor(Math.random() * 3) + 1;
    } else if (r1 > 0.85) {
      m1 = 'com_lam';
      q1 = 1;
    }
    const def1 = ITEMS[m1] || { name: m1, icon: '📦' };
    lootItems.push({ itemId: m1, name: def1.name, icon: def1.icon, qty: q1 });

    // 20% cơ hội rớt thêm Món Buff #2 (Kèm Bùa Trừ Tà)
    if (Math.random() < 0.2) {
      const pool2 = ['thuoc_huyet_long', 'thuoc_linh_khi', 'bua_tru_ta'];
      const m2 = pool2[Math.floor(Math.random() * pool2.length)];
      const def2 = ITEMS[m2] || { name: m2, icon: '⛩️' };
      lootItems.push({ itemId: m2, name: def2.name, icon: def2.icon, qty: 1 });
    }
  } else if (chestKey === 'ruong_dong') {
    // 100% rớt 3,500 ~ 21,000 Đồng (Giảm 30%)
    dongGained = Math.floor(Math.random() * 17500) + 3500;

    // 100% rớt Món #1 (Quặng Đồng / Da Cá Sấu / Thẻ Skip Nhiệm Vụ)
    const r1 = Math.random();
    let m1 = 'quang_dong';
    let q1 = Math.floor(Math.random() * 3) + 2;
    if (r1 > 0.6 && r1 <= 0.9) {
      m1 = 'da_ca_sau';
      q1 = Math.floor(Math.random() * 2) + 1;
    } else if (r1 > 0.9) {
      m1 = 'the_skip_nhiem_vu';
      q1 = 1;
    }
    const def1 = ITEMS[m1] || { name: m1, icon: '📦' };
    lootItems.push({ itemId: m1, name: def1.name, icon: def1.icon, qty: q1 });

    // 25% cơ hội rớt thêm Món Buff #2 (Kèm Bùa Trừ Tà)
    if (Math.random() < 0.25) {
      const pool2 = ['dan_cuong_no', 'thuoc_kim_cuong', 'bua_tru_ta'];
      const m2 = pool2[Math.floor(Math.random() * pool2.length)];
      const def2 = ITEMS[m2] || { name: m2, icon: '⛩️' };
      lootItems.push({ itemId: m2, name: def2.name, icon: def2.icon, qty: 1 });
    }
  } else if (chestKey === 'ruong_bac') {
    // 100% rớt 14,000 ~ 70,000 Đồng (Giảm 30%) + 25% rớt Kim Bảo
    dongGained = Math.floor(Math.random() * 56000) + 14000;
    if (Math.random() < 0.25) kbGained = Math.floor(Math.random() * 2) + 1;

    // 100% rớt Món #1 (Quặng Sắt / Da Sói / Bùa Hồi Cooldown)
    const r1 = Math.random();
    let m1 = 'quang_sat';
    let q1 = Math.floor(Math.random() * 3) + 2;
    if (r1 > 0.5 && r1 <= 0.8) {
      m1 = 'da_soi';
      q1 = Math.floor(Math.random() * 2) + 1;
    } else if (r1 > 0.8) {
      m1 = 'bua_hoi_cooldown';
      q1 = 1;
    }
    const def1 = ITEMS[m1] || { name: m1, icon: '📦' };
    lootItems.push({ itemId: m1, name: def1.name, icon: def1.icon, qty: q1 });

    // 30% cơ hội rớt thêm Món Buff #2 (Kèm Bùa Trừ Tà)
    if (Math.random() < 0.3) {
      const pool2 = ['bua_bao_kich', 'thuoc_than_toc', 'thien_linh_dan', 'bua_tru_ta', 'la_bua_ho_menh'];
      const m2 = pool2[Math.floor(Math.random() * pool2.length)];
      const def2 = ITEMS[m2] || { name: m2, icon: '⛩️' };
      lootItems.push({ itemId: m2, name: def2.name, icon: def2.icon, qty: 1 });
    }
  } else if (chestKey === 'ruong_vang') {
    // 100% rớt 70,000 ~ 350,000 Đồng (Giảm 30%) + 50% rớt Kim Bảo
    dongGained = Math.floor(Math.random() * 280000) + 70000;
    if (Math.random() < 0.5) kbGained = Math.floor(Math.random() * 4) + 2;

    // 100% rớt Món #1 (Huyền Thiết Thạch / Sừng Kỳ Lân / Thuốc x2 EXP)
    const r1 = Math.random();
    let m1 = 'huyen_thiet_thach';
    let q1 = Math.floor(Math.random() * 3) + 2;
    if (r1 > 0.4 && r1 <= 0.7) {
      m1 = 'sung_ky_lan';
      q1 = Math.floor(Math.random() * 2) + 1;
    } else if (r1 > 0.7) {
      m1 = 'thuoc_nhan_doi_exp';
      q1 = Math.floor(Math.random() * 2) + 1;
    }
    const def1 = ITEMS[m1] || { name: m1, icon: '📦' };
    lootItems.push({ itemId: m1, name: def1.name, icon: def1.icon, qty: q1 });

    // 70% cơ hội rớt thêm Món Buff #2 (Kèm Bùa Trừ Tà)
    if (Math.random() < 0.7) {
      const pool2 = ['bua_chieu_tai', 'bua_may_man', 'bua_tru_ta'];
      const m2 = pool2[Math.floor(Math.random() * pool2.length)];
      const def2 = ITEMS[m2] || { name: m2, icon: '⛩️' };
      lootItems.push({ itemId: m2, name: def2.name, icon: def2.icon, qty: Math.floor(Math.random() * 2) + 1 });
    }
  } else if (chestKey === 'ruong_huyen_thiet') {
    // 100% rớt 210,000 ~ 1,050,000 Đồng (Giảm 30%) + 100% rớt 10~25 Kim Bảo
    dongGained = Math.floor(Math.random() * 840000) + 210000;
    kbGained = Math.floor(Math.random() * 16) + 10;

    // 100% chắc chắn rớt 2 món nguyên liệu & buff thần thoại cùng lúc
    const pool1 = ['than_kim_thach', 'bua_chieu_tai', 'bua_may_man'];
    const pool2 = ['thuoc_nhan_doi_exp', 'bua_hoi_cooldown', 'bua_tru_ta'];

    const m1 = pool1[Math.floor(Math.random() * pool1.length)];
    const m2 = pool2[Math.floor(Math.random() * pool2.length)];

    const def1 = ITEMS[m1] || { name: m1, icon: '✨' };
    const def2 = ITEMS[m2] || { name: m2, icon: '⛩️' };

    lootItems.push({ itemId: m1, name: def1.name, icon: def1.icon, qty: Math.floor(Math.random() * 3) + 2 });
    lootItems.push({ itemId: m2, name: def2.name, icon: def2.icon, qty: Math.floor(Math.random() * 3) + 2 });
  }

  // 🎁 7% CƠ HỘI MAY MẮN RỚT THÊM 1 RƯƠNG BÁU MỚI (LUCKY EXTRA CHEST DROP)
  if (Math.random() < 0.07) {
    const bonusChestPool = ['ruong_go', 'ruong_dong', 'ruong_bac', 'ruong_vang', 'ruong_huyen_thiet'];
    const weights = [0.40, 0.30, 0.18, 0.09, 0.03]; // Tỷ lệ ra rương từ Gỗ đến Huyền Thiết
    const randChest = Math.random();
    let acc = 0;
    let selectedBonusChest = bonusChestPool[0];

    for (let i = 0; i < bonusChestPool.length; i++) {
      acc += weights[i];
      if (randChest <= acc) {
        selectedBonusChest = bonusChestPool[i];
        break;
      }
    }

    const bonusDef = CHESTS_BALANCED[selectedBonusChest] || { name: selectedBonusChest, icon: '📦' };
    lootItems.push({ itemId: selectedBonusChest, name: `[🍀 CHÍ MẠNG 7%] ${bonusDef.name}`, icon: bonusDef.icon, qty: 1 });
  }

  // Trao thưởng vào CSDL
  if (dongGained > 0) await UserService.addDongAtomic(userId, dongGained);
  if (kbGained > 0) await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': kbGained } });
  for (const item of lootItems) {
    await UserService.addItemAtomic(userId, item.itemId, item.qty);
  }

  const lootStr = lootItems.map((i) => `• ${i.icon} **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
  const kbStr = kbGained > 0 ? `\n• 💎 **+${formatKimBao(kbGained)}**` : '';

  embed.setDescription(
    `Bạn dùng lực mở ${chest.icon} **${chest.name}** và nhận được quà ngẫu nhiên phong phú:\n\n` +
      `• 🪙 **+${formatDong(dongGained)}**${kbStr}\n` +
      `${lootStr}`
  );

  await message.reply({ embeds: [embed] });
}
