import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { RECIPES } from '../../game/data/recipes';
import { getItemIcon, ITEMS } from '../../game/data/items';
import { CraftingService } from '../../game/services/CraftingService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function renCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const user = await UserService.getOrCreateUser(userId);
  const targetRecipeId = args[0]?.toLowerCase();

  // If player types: vkl craft <itemId>
  if (targetRecipeId) {
    const recipe = RECIPES.find((r) => r.resultItemId.toLowerCase() === targetRecipeId);

    if (!recipe) {
      await message.reply('⚠️ **Bản vẽ rèn không tồn tại!** Gõ `vkl craft` để xem danh sách công thức rèn Trung Cổ.');
      return;
    }

    // Attempt crafting
    const craftResult = await CraftingService.craftItem(userId, recipe.resultItemId);

    if (!craftResult.success) {
      await message.reply(`⚠️ **Chế tạo thất bại!** ${craftResult.message || 'Không đủ nguyên liệu hoặc tiền vàng!'}`);
      return;
    }

    const resultItemDef = ITEMS[recipe.resultItemId] || { name: recipe.resultItemId };
    const icon = getItemIcon(recipe.resultItemId);

    const embed = createDongSonEmbed()
      .setTitle('🔨 RÈN ĐỒ THÀNH CÔNG (MEDIEVAL BLACKSMITH)')
      .setDescription(
        `🎉 **${username}** đã rèn thành công:\n\n` +
          `• **${recipe.resultQty}x** ${icon} **${resultItemDef.name}** (\`${recipe.resultItemId}\`)\n\n` +
          `💡 *Vũ khí/Trang bị mới đã sẵn sàng trong Túi Đồ (\`vkl i\`)!*`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // Display Crafting Recipes Catalog
  let recipeListStr = '';
  RECIPES.forEach((r) => {
    const itemDef = ITEMS[r.resultItemId] || { name: r.resultItemId };
    const icon = getItemIcon(r.resultItemId);

    const matsText = r.materials
      .map((m) => {
        const mIcon = getItemIcon(m.itemId);
        const mName = ITEMS[m.itemId]?.name || m.itemId;
        return `${mIcon} **${mName}** x${m.quantity}`;
      })
      .join(' + ');

    recipeListStr += `${icon} **${itemDef.name}** (\`${r.resultItemId}\`) | Yêu cầu Lv ${r.requiredLevel}\n` +
      `└ *Nguyên liệu:* ${matsText} + 💰 ${formatDong(r.dongCost)}\n\n`;
  });

  const embed = createDongSonEmbed()
    .setTitle('🔨 CÔNG XƯỞNG RÈN TRUNG CỔ (BLACKSMITH CRAFTING)')
    .setDescription(
      `🏛️ **THỢ RÈN GOTHIC: Chào ${username}!**\n\n` +
        `📌 **Cú pháp rèn đồ:** \`vkl craft <mã_vũ_khí>\` (VD: \`vkl craft sword_01a\`)\n\n` +
        `📜 **DANH SÁCH BẢN VẼ RÈN TRUNG CỔ:**\n\n${recipeListStr}`
    );

  await message.reply({ embeds: [embed] });
}
