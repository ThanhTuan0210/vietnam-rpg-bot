import { ActionRowBuilder, Message, StringSelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { RECIPES, Recipe } from '../../game/data/recipes';
import { getItemIcon, ITEMS } from '../../game/data/items';
import { CraftingService } from '../../game/services/CraftingService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function renCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const targetInput = args.join(' ').toLowerCase().trim();

  // Attempt crafting if target item passed
  if (targetInput) {
    const resolvedId = CraftingService.resolveItemId(targetInput);
    const recipe = RECIPES.find((r) => r.resultItemId.toLowerCase() === resolvedId.toLowerCase());

    if (recipe) {
      const craftResult = await CraftingService.craftItem(userId, resolvedId);

      if (!craftResult.success) {
        await message.reply(craftResult.message);
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
  }

  // Display Crafting Recipes Catalog (Default: Tier 1 & Popular Items)
  const categoryFilter = targetInput || 'all';
  const embed = buildCraftingCatalogEmbed(username, categoryFilter);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('craft_category_select')
    .setPlaceholder('🔍 Chọn danh mục công thức muốn xem...')
    .addOptions([
      { label: '⚔️ Kiếm & Vũ Khí Cận Chiến', value: 'craft_swords', description: 'Các công thức rèn Kiếm & Dao (sword_01a..04e)' },
      { label: '🔮 Trượng, Phép Cầu & Cung Tên', value: 'craft_ranged', description: 'Các công thức rèn Trượng, Cung & Mũi tên' },
      { label: '🛡️ Khiên, Áo Giáp & Mũ Chiến', value: 'craft_armors', description: 'Các công thức rèn Khiên, Áo giáp & Mũ kị sĩ' },
      { label: '🧪 Dược Phẩm & Ma Dược', value: 'craft_potions', description: 'Các công thức nung ma dược HP/MP' },
    ]);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await message.reply({ embeds: [embed], components: [row] });
}

export function buildCraftingCatalogEmbed(username: string, category: string) {
  let filteredRecipes: Recipe[] = RECIPES;

  if (category === 'swords' || category === 'craft_swords') {
    filteredRecipes = RECIPES.filter((r) => r.resultItemId.startsWith('sword_'));
  } else if (category === 'ranged' || category === 'craft_ranged') {
    filteredRecipes = RECIPES.filter((r) => r.resultItemId.startsWith('staff_') || r.resultItemId.startsWith('bow_') || r.resultItemId.startsWith('arrow_'));
  } else if (category === 'armors' || category === 'craft_armors') {
    filteredRecipes = RECIPES.filter((r) => r.resultItemId.startsWith('shield_') || r.resultItemId.startsWith('armor_') || r.resultItemId.startsWith('helmet_'));
  } else if (category === 'potions' || category === 'craft_potions') {
    filteredRecipes = RECIPES.filter((r) => r.resultItemId.startsWith('potion_'));
  } else {
    // Default preview: Tier 1 & Tier 2 starter items (top 15) to keep embed under 3500 chars
    filteredRecipes = RECIPES.filter((r) => r.requiredLevel <= 25).slice(0, 15);
  }

  let recipeListStr = '';
  filteredRecipes.forEach((r) => {
    const itemDef = ITEMS[r.resultItemId] || { name: r.resultItemId };
    const icon = getItemIcon(r.resultItemId);

    const matsText = r.materials
      .map((m) => {
        const mIcon = getItemIcon(m.itemId);
        const mName = ITEMS[m.itemId]?.name || m.itemId;
        return `${mIcon} **${mName}** x${m.quantity}`;
      })
      .join(' + ');

    recipeListStr += `${icon} **${itemDef.name}** (\`${r.resultItemId}\`) | Lv ${r.requiredLevel}\n` +
      `└ *Cần:* ${matsText} + 🪙 ${formatDong(r.dongCost)}\n\n`;
  });

  if (recipeListStr.length > 3500) {
    recipeListStr = recipeListStr.substring(0, 3450) + '\n... *(Còn nhiều công thức, hãy dùng Menu chọn bên dưới để xem chi tiết!)*';
  }

  return createDongSonEmbed()
    .setTitle('🔨 CÔNG XƯỞNG RÈN TRUNG CỔ (BLACKSMITH CRAFTING)')
    .setDescription(
      `🏛️ **THỢ RÈN GOTHIC: Chào ${username}!**\n\n` +
        `📌 **Cú pháp rèn đồ:** \`vkl craft <mã_vật_phẩm>\` (VD: \`vkl craft sword_01a\`)\n\n` +
        `📜 **DANH SÁCH BẢN VẼ RÈN (${category.toUpperCase()}):**\n\n${recipeListStr}`
    );
}

export async function handleCraftSelectInteraction(interaction: StringSelectMenuInteraction): Promise<void> {
  const value = interaction.values[0];
  const embed = buildCraftingCatalogEmbed(interaction.user.username, value);
  await interaction.update({ embeds: [embed] });
}
