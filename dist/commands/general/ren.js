"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renCommand = renCommand;
exports.buildCraftingCatalogEmbed = buildCraftingCatalogEmbed;
exports.handleCraftSelectInteraction = handleCraftSelectInteraction;
const discord_js_1 = require("discord.js");
const recipes_1 = require("../../game/data/recipes");
const items_1 = require("../../game/data/items");
const CraftingService_1 = require("../../game/services/CraftingService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function renCommand(message, args) {
    const userId = message.author.id;
    const username = message.author.username;
    const targetInput = args.join(' ').toLowerCase().trim();
    // Attempt crafting if target item passed
    if (targetInput) {
        const resolvedId = CraftingService_1.CraftingService.resolveItemId(targetInput);
        const recipe = recipes_1.RECIPES.find((r) => r.resultItemId.toLowerCase() === resolvedId.toLowerCase());
        if (recipe) {
            const craftResult = await CraftingService_1.CraftingService.craftItem(userId, resolvedId);
            if (!craftResult.success) {
                await message.reply(craftResult.message);
                return;
            }
            const resultItemDef = items_1.ITEMS[recipe.resultItemId] || { name: recipe.resultItemId };
            const icon = (0, items_1.getItemIcon)(recipe.resultItemId);
            const embed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle('🔨 RÈN ĐỒ THÀNH CÔNG (MEDIEVAL BLACKSMITH)')
                .setDescription(`🎉 **${username}** đã rèn thành công:\n\n` +
                `• **${recipe.resultQty}x** ${icon} **${resultItemDef.name}** (\`${recipe.resultItemId}\`)\n\n` +
                `💡 *Vũ khí/Trang bị mới đã sẵn sàng trong Túi Đồ (\`vkl i\`)!*`);
            await message.reply({ embeds: [embed] });
            return;
        }
    }
    // Display Crafting Recipes Catalog (Default: Tier 1 & Popular Items)
    const categoryFilter = targetInput || 'all';
    const embed = buildCraftingCatalogEmbed(username, categoryFilter);
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('craft_category_select')
        .setPlaceholder('🔍 Chọn danh mục công thức muốn xem...')
        .addOptions([
        { label: '⚔️ Kiếm & Vũ Khí Cận Chiến', value: 'craft_swords', description: 'Các công thức rèn Kiếm & Dao (sword_01a..04e)' },
        { label: '🔮 Trượng, Phép Cầu & Cung Tên', value: 'craft_ranged', description: 'Các công thức rèn Trượng, Cung & Mũi tên' },
        { label: '🛡️ Khiên, Áo Giáp & Mũ Chiến', value: 'craft_armors', description: 'Các công thức rèn Khiên, Áo giáp & Mũ kị sĩ' },
        { label: '🧪 Dược Phẩm & Ma Dược', value: 'craft_potions', description: 'Các công thức nung ma dược HP/MP' },
    ]);
    const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
    await message.reply({ embeds: [embed], components: [row] });
}
function buildCraftingCatalogEmbed(username, category) {
    let filteredRecipes = recipes_1.RECIPES;
    if (category === 'swords' || category === 'craft_swords') {
        filteredRecipes = recipes_1.RECIPES.filter((r) => r.resultItemId.startsWith('sword_'));
    }
    else if (category === 'ranged' || category === 'craft_ranged') {
        filteredRecipes = recipes_1.RECIPES.filter((r) => r.resultItemId.startsWith('staff_') || r.resultItemId.startsWith('bow_') || r.resultItemId.startsWith('arrow_'));
    }
    else if (category === 'armors' || category === 'craft_armors') {
        filteredRecipes = recipes_1.RECIPES.filter((r) => r.resultItemId.startsWith('shield_') || r.resultItemId.startsWith('armor_') || r.resultItemId.startsWith('helmet_'));
    }
    else if (category === 'potions' || category === 'craft_potions') {
        filteredRecipes = recipes_1.RECIPES.filter((r) => r.resultItemId.startsWith('potion_'));
    }
    else {
        // Default preview: Tier 1 & Tier 2 starter items (top 15) to keep embed under 3500 chars
        filteredRecipes = recipes_1.RECIPES.filter((r) => r.requiredLevel <= 25).slice(0, 15);
    }
    let recipeListStr = '';
    filteredRecipes.forEach((r) => {
        const itemDef = items_1.ITEMS[r.resultItemId] || { name: r.resultItemId };
        const icon = (0, items_1.getItemIcon)(r.resultItemId);
        const matsText = r.materials
            .map((m) => {
            const mIcon = (0, items_1.getItemIcon)(m.itemId);
            const mName = items_1.ITEMS[m.itemId]?.name || m.itemId;
            return `${mIcon} **${mName}** x${m.quantity}`;
        })
            .join(' + ');
        recipeListStr += `${icon} **${itemDef.name}** (\`${r.resultItemId}\`) | Lv ${r.requiredLevel}\n` +
            `└ *Cần:* ${matsText} + 🪙 ${(0, formatters_1.formatDong)(r.dongCost)}\n\n`;
    });
    if (recipeListStr.length > 3500) {
        recipeListStr = recipeListStr.substring(0, 3450) + '\n... *(Còn nhiều công thức, hãy dùng Menu chọn bên dưới để xem chi tiết!)*';
    }
    return (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔨 CÔNG XƯỞNG RÈN TRUNG CỔ (BLACKSMITH CRAFTING)')
        .setDescription(`🏛️ **THỢ RÈN GOTHIC: Chào ${username}!**\n\n` +
        `📌 **Cú pháp rèn đồ:** \`vkl craft <mã_vật_phẩm>\` (VD: \`vkl craft sword_01a\`)\n\n` +
        `📜 **DANH SÁCH BẢN VẼ RÈN (${category.toUpperCase()}):**\n\n${recipeListStr}`);
}
async function handleCraftSelectInteraction(interaction) {
    const value = interaction.values[0];
    const embed = buildCraftingCatalogEmbed(interaction.user.username, value);
    await interaction.update({ embeds: [embed] });
}
