import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function codeCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const codeStr = args[0]?.toUpperCase();

  const validCodes: Record<
    string,
    {
      rewardName: string;
      dong: number;
      items: { itemId: string; name: string; icon: string; qty: number }[];
    }
  > = {
    VKL2026: {
      rewardName: '🎁 Quà Tân Thủ Gothic vkl2026',
      dong: 50000,
      items: [
        { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 10 },
        { itemId: 'ingot_01a', name: 'Thỏi Đồng Cổ', icon: '🧱', qty: 10 },
        { itemId: 'crystal_01a', name: 'Tinh Thạch Thượng Cổ', icon: '🔮', qty: 5 },
      ],
    },
    EXCALIBUR: {
      rewardName: '⚔️ Quà Hoàng Gia Excalibur',
      dong: 30000,
      items: [
        { itemId: 'sword_01a', name: 'Kiếm Sơ Cấp Trung Cổ', icon: '⚔️', qty: 1 },
        { itemId: 'shield_01a', name: 'Khiên Thép Kị Sĩ', icon: '🛡️', qty: 1 },
        { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối Tầng 1', icon: '🗝️', qty: 5 },
        { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 3 },
      ],
    },
    MEDIEVALVIP: {
      rewardName: '👑 Quà Siêu VIP Medieval',
      dong: 100000,
      items: [
        { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
        { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 5 },
        { itemId: 'potion_03a', name: 'Ma Dược Kích Rèn Thượng Cổ', icon: '🧪', qty: 5 },
      ],
    },
  };

  if (!codeStr || !validCodes[codeStr]) {
    const embed = createDongSonEmbed()
      .setTitle('🎁 DANH SÁCH 3 MÃ GIFTCODE SIÊU XỊN (PREFIX: vkl)')
      .setDescription(
        `📌 **Cú pháp nhận quà:** \`vkl code <mã_giftcode>\`\n\n` +
          `🔥 **3 MÃ CODE ĐANG KÍCH HOẠT THÀNH CÔNG:**\n\n` +
          `1. 🎁 **\`VKL2026\`** — Nhận 50.000 Vàng + 10x Thuốc HP + 10x Thỏi Đồng + 5x Tinh Thạch\n` +
          `2. ⚔️ **\`EXCALIBUR\`** — Nhận 1x Kiếm Kị Sĩ + 1x Khiên Thép + 5x Chìa Khóa Ngục Tối + 3x Rương Báu\n` +
          `3. 👑 **\`MEDIEVALVIP\`** — Nhận 100.000 Vàng + 1x 📜 Sách Xóa Nghề (50k) + 5x Hồng Ngọc + 5x Ma Dược`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const user = await UserService.getOrCreateUser(userId);
  const claimedKey = `code_${codeStr.toLowerCase()}`;

  const hasClaimed = user.cooldowns?.get(claimedKey);
  if (hasClaimed) {
    await message.reply(`⚠️ **Bạn đã nhận mã Giftcode \`${codeStr}\` rồi!** Mỗi người chơi chỉ được nhận 1 lần.`);
    return;
  }

  const codeData = validCodes[codeStr];

  user.taiChinh.dong += codeData.dong;
  await UserService.updateCooldownAtomic(userId, claimedKey, Date.now());

  let itemRewardText = '';
  for (const item of codeData.items) {
    await UserService.addItemAtomic(userId, item.itemId, item.qty);
    itemRewardText += `• **${item.qty}x** ${item.icon} **${item.name}** (\`${item.itemId}\`)\n`;
  }
  await user.save();

  const embed = createDongSonEmbed()
    .setTitle(`🎉 NHẬP CODE THÀNH CÔNG — ${codeData.rewardName.toUpperCase()}`)
    .setDescription(
      `✨ **Chúc mừng ${message.author.username} đã nhận thưởng từ Mã Giftcode \`${codeStr}\`!**\n\n` +
        `💰 **Vàng Thưởng:** \`+${formatDong(codeData.dong)}\`\n\n` +
        `🎁 **VẬT PHẨM ĐOẠT ĐƯỢC:**\n${itemRewardText}\n` +
        `💡 *Vật phẩm đã được chuyển trực tiếp vào Túi Đồ (\`vkl i\`)!*`
    );

  await message.reply({ embeds: [embed] });
}
