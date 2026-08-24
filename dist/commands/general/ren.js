"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renCommand = renCommand;
const UserService_1 = require("../../game/services/UserService");
const recipes_1 = require("../../game/data/recipes");
const items_1 = require("../../game/data/items");
const CraftingService_1 = require("../../game/services/CraftingService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function renCommand(message, args) {
    const userId = message.author.id;
    const username = message.author.username;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const targetRecipeId = args[0]?.toLowerCase();
    // If player types: vkl craft <itemId>
    if (targetRecipeId) {
        const recipe = recipes_1.RECIPES.find((r) => r.resultItemId.toLowerCase() === targetRecipeId);
        if (!recipe) {
            await message.reply('⚠️ **Bản vẽ rèn không tồn tại!** Gõ `vkl craft` để xem danh sách công thức rèn Trung Cổ.');
            return;
        }
        // Attempt crafting
        const craftResult = await CraftingService_1.CraftingService.craftItem(userId, recipe.resultItemId);
        if (!craftResult.success) {
            await message.reply(`⚠️ **Chế tạo thất bại!** ${craftResult.message || 'Không đủ nguyên liệu hoặc tiền vàng!'}`);
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
    // Display Crafting Recipes Catalog
    let recipeListStr = '';
    recipes_1.RECIPES.forEach((r) => {
        const itemDef = items_1.ITEMS[r.resultItemId] || { name: r.resultItemId };
        const icon = (0, items_1.getItemIcon)(r.resultItemId);
        const matsText = r.materials
            .map((m) => {
            const mIcon = (0, items_1.getItemIcon)(m.itemId);
            const mName = items_1.ITEMS[m.itemId]?.name || m.itemId;
            return `${mIcon} **${mName}** x${m.quantity}`;
        })
            .join(' + ');
        recipeListStr += `${icon} **${itemDef.name}** (\`${r.resultItemId}\`) | Yêu cầu Lv ${r.requiredLevel}\n` +
            `└ *Nguyên liệu:* ${matsText} + 💰 ${(0, formatters_1.formatDong)(r.dongCost)}\n\n`;
    });
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔨 CÔNG XƯỞNG RÈN TRUNG CỔ (BLACKSMITH CRAFTING)')
        .setDescription(`🏛️ **THỢ RÈN GOTHIC: Chào ${username}!**\n\n` +
        `📌 **Cú pháp rèn đồ:** \`vkl craft <mã_vũ_khí>\` (VD: \`vkl craft sword_01a\`)\n\n` +
        `📜 **DANH SÁCH BẢN VẼ RÈN TRUNG CỔ:**\n\n${recipeListStr}`);
    await message.reply({ embeds: [embed] });
}
