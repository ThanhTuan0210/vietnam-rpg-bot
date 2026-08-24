import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { ITEMS } from '../../game/data/items';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function phaCheCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const targetId = args[0]?.toLowerCase();

  const recipes: Record<
    string,
    { resultName: string; resultQty: number; dongCost: number; materials: { itemId: string; qty: number }[] }
  > = {
    com_lam: {
      resultName: 'Cơm Lam Bổ Dưỡng',
      resultQty: 2,
      dongCost: 100,
      materials: [
        { itemId: 'bo_nep', qty: 1 },
        { itemId: 'go_tre_gai', qty: 2 },
      ],
    },
    binh_kim_dan: {
      resultName: 'Bình Kim Đan Hộ Thể',
      resultQty: 1,
      dongCost: 500,
      materials: [
        { itemId: 'la_thuoc_nam', qty: 10 },
        { itemId: 'cu_nhiem_sam', qty: 2 },
      ],
    },
  };

  if (!targetId) {
    const embed = createDongSonEmbed()
      .setTitle('🧪 DƯỢC LÒ PHA CHẾ — DÂN GIAN Y THUẬT')
      .setDescription(
        `Luyện dược liệu thuốc nam và nướng Cơm Lam dẻo thơm linh khí!\n\n` +
          `• Cú pháp: \`vkl phache [mã_vật_phẩm]\` (Ví dụ: \`vkl phache com_lam\` hoặc \`vkl phache binh_kim_dan\`)\n\n` +
          `🍙 **Cơm Lam x2** (\`com_lam\`) — Cần 1 Bó Nếp + 2 Gỗ Tre (\`go_tre_gai\`) + 100đ *(Hồi 100% HP & MP)*\n` +
          `🔮 **Bình Kim Đan** (\`binh_kim_dan\`) — Cần 10 Lá Thuốc Nam (\`la_thuoc_nam\`) + 2 Củ Nhân Sâm (\`cu_nhiem_sam\`) + 500đ *(+100% DEF trong 30p)*`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const recipe = recipes[targetId];
  if (!recipe) {
    await message.reply('❌ Công thức pha chế không tồn tại! Gõ `vkl phache` để xem danh sách.');
    return;
  }

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  if (user.taiChinh.dong < recipe.dongCost) {
    await message.reply(`❌ Bạn không đủ ${formatDong(recipe.dongCost)} phí pha chế!`);
    return;
  }

  for (const mat of recipe.materials) {
    const uItem = user.tuiDo.find((i) => i.itemId === mat.itemId);
    const mDef = ITEMS[mat.itemId] || { name: mat.itemId };
    if (!uItem || uItem.soLuong < mat.qty) {
      await message.reply(`❌ Bạn thiếu **${mDef.name}** (\`${mat.itemId}\`) (Cần ${mat.qty}, đang có ${uItem?.soLuong || 0})!`);
      return;
    }
  }

  await UserService.deductDongAtomic(userId, recipe.dongCost);
  for (const mat of recipe.materials) {
    await UserService.consumeItemAtomic(userId, mat.itemId, mat.qty);
  }
  await UserService.addItemAtomic(userId, targetId, recipe.resultQty);

  const embed = createDongSonEmbed()
    .setTitle('🧪 PHA CHẾ DƯỢC LIỆU THÀNH CÔNG!')
    .setDescription(`Bạn đã luyện thành công **${recipe.resultName}** (\`${targetId}\`) **x${recipe.resultQty}** với phí ${formatDong(recipe.dongCost)}!`);

  await message.reply({ embeds: [embed] });
}
