import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong, formatKimBao } from '../../utils/formatters';

export async function codeCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const codeStr = args[0]?.toUpperCase();

  if (!codeStr) {
    const embed = createDongSonEmbed()
      .setTitle('🎁 NHẬP MÃ GIFTCODE QUÀ TẶNG')
      .setDescription(
        `• Cú pháp: \`vn code [mã_quà_tặng]\`\n\n` +
          `🔥 **GIFTCODE ĐẠI LỄ QUỐC KHÁNH 2/9 ĐANG MỞ:**\n` +
          `• Mã: \`QUOCKHANH29\` hoặc \`DOCLAP29\` — Nhận 3 Rương Báu Thượng Cổ + 29,000đ + 29 Kim Bảo!\n` +
          `• Mã: \`DAI_VIET_2026\` — Nhận Quà Tân Thủ Thần Thoại (50,000đ + 10 Kim Bảo)`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  const validCodes: Record<
    string,
    {
      rewardName: string;
      dong: number;
      kimBao: number;
      items: { itemId: string; name: string; icon: string; qty: number }[];
    }
  > = {
    QUOCKHANH29: {
      rewardName: '🇻🇳 Quà Mừng Đại Lễ Quốc Khánh 2/9',
      dong: 29000,
      kimBao: 29,
      items: [
        { itemId: 'ruong_vang', name: 'Rương Vàng Thượng Cổ', icon: '🔮', qty: 1 },
        { itemId: 'ruong_huyen_thiet', name: 'Rương Huyền Thiết Hoàng Cung', icon: '🏵️', qty: 1 },
        { itemId: 'ruong_bac', name: 'Rương Bạc Thượng Cổ', icon: '🟦', qty: 1 },
      ],
    },
    DOCLAP29: {
      rewardName: '🇻🇳 Quà Mừng Độc Lập 2/9',
      dong: 29000,
      kimBao: 29,
      items: [
        { itemId: 'ruong_vang', name: 'Rương Vàng Thượng Cổ', icon: '🔮', qty: 1 },
        { itemId: 'ruong_huyen_thiet', name: 'Rương Huyền Thiết Hoàng Cung', icon: '🏵️', qty: 1 },
        { itemId: 'ruong_bac', name: 'Rương Bạc Thượng Cổ', icon: '🟦', qty: 1 },
      ],
    },
    DAI_VIET_2026: {
      rewardName: '🌾 Quà Tân Thủ Đại Việt',
      dong: 50000,
      kimBao: 10,
      items: [{ itemId: 'ruong_go', name: 'Rương Gỗ Thượng Cổ', icon: '📦', qty: 2 }],
    },
  };

  const gift = validCodes[codeStr];
  if (!gift) {
    await message.reply('❌ Mã quà tặng không hợp lệ hoặc đã hết hạn!');
    return;
  }

  // Kiểm tra mã đã sử dụng chưa
  const cooldownKey = `code_${codeStr}`;
  const lastUsed = user.cooldowns?.get(cooldownKey) || 0;
  if (lastUsed > 0) {
    await message.reply(`❌ Bạn đã sử dụng mã quà tặng **${codeStr}** rồi! Mỗi mã chỉ được nhập 1 lần.`);
    return;
  }

  // Trao thưởng
  await UserService.addDongAtomic(userId, gift.dong);
  await UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': gift.kimBao } });
  for (const item of gift.items) {
    await UserService.addItemAtomic(userId, item.itemId, item.qty);
  }
  await UserService.updateCooldownAtomic(userId, cooldownKey, Date.now());

  const itemsStr = gift.items.map((i) => `• ${i.icon} **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');

  const embed = createDongSonEmbed()
    .setTitle(`🎉 KÍCH HOẠT GIFTCODE THÀNH CÔNG — ${codeStr}!`)
    .setDescription(
      `Chúc mừng **${message.author.username}** đã nhận thành công **${gift.rewardName}**!\n\n` +
        `💰 **Tiền Đồng:** +${formatDong(gift.dong)}\n` +
        `💎 **Kim Bảo:** +${formatKimBao(gift.kimBao)}\n` +
        `🎁 **Vật Phẩm:**\n${itemsStr}`
    );

  await message.reply({ embeds: [embed] });
}
