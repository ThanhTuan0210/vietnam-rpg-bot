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
    potion_01a: {
      resultName: 'Bình Dược Hồi HP Sơ Cấp',
      resultQty: 2,
      dongCost: 100,
      materials: [{ itemId: 'wood_01a', qty: 2 }],
    },
    potion_03a: {
      resultName: 'Ma Dược Kích Rèn Thượng Cổ',
      resultQty: 1,
      dongCost: 500,
      materials: [{ itemId: 'crystal_01a', qty: 2 }],
    },
  };

  if (!targetId || !recipes[targetId]) {
    const embed = createDongSonEmbed()
      .setTitle('🧪 LÒ BÀO CHẾ MA DƯỢC GOTHIC — ALCHEMIST FORGE')
      .setDescription(
        `Bào chế dược liệu thần kỳ hồi sinh lực và ma dược kích rèn!\n\n` +
          `• Cú pháp: \`vkl brew [mã_vật_phẩm]\` (VD: \`vkl brew potion_01a\` hoặc \`vkl brew potion_03a\`)\n\n` +
          `🧪 **Thuốc Hồi Máu HP x2** (\`potion_01a\`) — Cần 2 Gỗ Sồi Cổ (\`wood_01a\`) + 100 Vàng *(Hồi 100% HP & MP)*\n` +
          `🔮 **Ma Dược Kích Rèn** (\`potion_03a\`) — Cần 2 Tinh Thạch Thượng Cổ (\`crystal_01a\`) + 500 Vàng`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const recipe = recipes[targetId];

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  if (user.taiChinh.dong < recipe.dongCost) {
    await message.reply(`❌ Bạn không đủ Tiền Vàng! Cần **${formatDong(recipe.dongCost)}**.`);
    return;
  }

  const inventory = user.inventory || [];
  for (const mat of recipe.materials) {
    const userItem = inventory.find((i) => i.itemId === mat.itemId);
    const hasQty = userItem?.quantity || userItem?.soLuong || 0;
    if (hasQty < mat.qty) {
      const matDef = ITEMS[mat.itemId] || { name: mat.itemId };
      await message.reply(`❌ Bạn thiếu nguyên liệu **${matDef.name}** (\`${mat.itemId}\`)! Cần ${mat.qty}, có ${hasQty}.`);
      return;
    }
  }

  user.taiChinh.dong -= recipe.dongCost;
  for (const mat of recipe.materials) {
    await UserService.consumeItemAtomic(userId, mat.itemId, mat.qty);
  }

  await UserService.addItemAtomic(userId, targetId, recipe.resultQty);
  await user.save();

  const embed = createDongSonEmbed()
    .setTitle('🧪 BÀO CHẾ THÀNH CÔNG!')
    .setDescription(`Bạn đã bào chế thành công **${recipe.resultQty}x ${recipe.resultName}** (\`${targetId}\`)!`);

  await message.reply({ embeds: [embed] });
}
