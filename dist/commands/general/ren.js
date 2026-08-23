"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renCommand = renCommand;
const User_model_1 = require("../../database/models/User.model");
const recipes_1 = require("../../game/data/recipes");
const items_1 = require("../../game/data/items");
const CraftingService_1 = require("../../game/services/CraftingService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function renCommand(message, args) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn start`.');
        return;
    }
    const rawInput = args.join(' ').trim().toLowerCase();
    // 0. DANH SÁCH TRA CỨU MÃ NGUYÊN LIỆU FARMING: `vn craft items` / `vn craft mat` / `vn mat`
    if (rawInput === 'items' || rawInput === 'mat' || rawInput === 'materials' || rawInput === 'nguyenlieu') {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🪵 BẢNG TRA CỨU MÃ NGUYÊN LIỆU & ĐỊA ĐIỂM FARMING')
            .setDescription(`**DANH SÁCH TOÀN BỘ MÃ ID NGUYÊN LIỆU VÀ VÙNG FARM:**\n\n` +
            `🪵 __GỖ & NÔNG LÂM SẢN (\`vn chop\` - Đốn Củi):__\n` +
            `• 🪵 \`go_tre_gai\` (Gỗ Tre Gai) — Đốn củi Vùng 1\n` +
            `• 🎋 \`go_nua_rung\` (Gỗ Nứa Rừng) — Đốn củi Vùng 2\n` +
            `• 🪵 \`go_tret\` (Gỗ Trét Núi Cao) — Đốn củi Vùng 2\n` +
            `• 🪵 \`go_lim_xanh\` (Gỗ Lim Xanh) — Đốn củi Vùng 3\n` +
            `• 🪵 \`go_trac\` (Gỗ Trắc Ngàn Năm) — Đốn củi Vùng 4\n` +
            `• 🪵 \`go_tram_huong\` (Gỗ Trầm Hương) — Đốn củi Vùng 4-5\n` +
            `• 🌳 \`go_co_thu\` (Gỗ Cổ Thụ Ngàn Năm) — Đốn củi Vùng 5\n\n` +
            `🪨 __QUẶNG KHÁNG THẠCH (\`vn mine\` - Đào Khoáng):__\n` +
            `• 🪨 \`quang_dong\` (Quặng Đồng) — Đào khoáng Vùng 1-2\n` +
            `• 🪙 \`quang_bac\` (Quặng Bạc) — Đào khoáng Vùng 2\n` +
            `• 👑 \`quang_vang\` (Quặng Vàng) — Đào khoáng Vùng 3\n` +
            `• 🪨 \`quang_sat\` (Quặng Sắt) — Đào khoáng Vùng 2-3\n` +
            `• 💎 \`huyen_thiet_thach\` (Huyền Thiết Thạch) — Đào khoáng Vùng 4\n` +
            `• 👑 \`than_kim_thach\` (Thần Kim Thạch) — Đào khoáng Vùng 5\n\n` +
            `🐊 __DA SÚC & QUÝ VẬT (\`vn hunt\` - Đi Săn Quái):__\n` +
            `• 🐊 \`da_ca_sau\` (Da Cá Sấu Cổ) — Săn quái Vùng 1\n` +
            `• 🐺 \`da_soi\` (Da Sói Rừng) — Săn quái Vùng 2\n` +
            `• 🦴 \`nanh_ho_tin\` (Nanh Hổ Bạch) — Săn quái Vùng 2\n` +
            `• 🦄 \`sung_ky_lan\` (Sừng Kỳ Lân) — Săn quái Vùng 3\n` +
            `• 🪶 \`long_chim_lac\` (Lông Chim Lạc Hoàng Kim) — Săn Trùm Vùng 4\n` +
            `• 🐉 \`vay_rong_bien\` (Vảy Rồng Biển Nam Giao) — Săn Raid Boss Vùng 5\n` +
            `• 💎 \`ngoc_bich\` (Ngọc Bích Cổ) — Thám hiểm & Mở Rương\n` +
            `• 💎 \`ngoc_hong_bao\` (Hồng Ngọc Ba Vì) — Săn Trùm Vùng 3\n` +
            `• ⚡ \`thien_thach_tinh\` (Thiên Thạch Tinh Thạch) — Phụ Bản & Rương Báu\n` +
            `• 🪷 \`bup_sen\` (Búp Sen Vàng Linh Khí) — Trồng trọt \`vn farm\``);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 1. CƠ CHẾ CHẾ TẠO VIẾT TẮT CHUẨN (`vn craft sword` / `vn craft armor`)
    if (rawInput === 'sword' || rawInput === 'vukhi' || rawInput === 'kiem') {
        const userLevel = user.canhGioi.capDo;
        const bestWeaponRecipe = [...recipes_1.RECIPES]
            .reverse()
            .find((r) => r.requiredLevel <= userLevel && items_1.ITEMS[r.resultItemId]?.type === 'vukhi');
        if (!bestWeaponRecipe) {
            await message.reply('❌ Chưa tìm thấy công thức Vũ khí phù hợp với Level của bạn!');
            return;
        }
        const result = await CraftingService_1.CraftingService.craftItem(userId, bestWeaponRecipe.resultItemId);
        await message.reply(result.message);
        return;
    }
    else if (rawInput === 'armor' || rawInput === 'aogiap' || rawInput === 'giap') {
        const userLevel = user.canhGioi.capDo;
        const bestArmorRecipe = [...recipes_1.RECIPES]
            .reverse()
            .find((r) => r.requiredLevel <= userLevel && items_1.ITEMS[r.resultItemId]?.type === 'aogiap');
        if (!bestArmorRecipe) {
            await message.reply('❌ Chưa tìm thấy công thức Chiến Bào phù hợp với Level của bạn!');
            return;
        }
        const result = await CraftingService_1.CraftingService.craftItem(userId, bestArmorRecipe.resultItemId);
        await message.reply(result.message);
        return;
    }
    // 2. NẾU CÓ THAM SỐ VẬT PHẨM ➔ THỰC HIỆN RÈN
    if (rawInput.length > 0) {
        const result = await CraftingService_1.CraftingService.craftItem(userId, rawInput);
        await message.reply(result.message);
        return;
    }
    // 3. HIỂN THỊ DANH SÁCH CÔNG THỨC RÈN VỚI MÃ ID NGUYÊN LIỆU RÕ RÀNG
    const userLevel = user.canhGioi.capDo;
    // Group recipes by level
    const groupedRecipes = {};
    for (const r of recipes_1.RECIPES) {
        if (!groupedRecipes[r.requiredLevel])
            groupedRecipes[r.requiredLevel] = [];
        groupedRecipes[r.requiredLevel].push(r);
    }
    const sortedLevels = Object.keys(groupedRecipes)
        .map(Number)
        .sort((a, b) => a - b);
    let recipeBody = '';
    for (const lvl of sortedLevels) {
        if (lvl > userLevel + 15)
            continue;
        const recipesAtLevel = groupedRecipes[lvl];
        recipeBody += `**Level ${lvl} recipes**\n`;
        for (const r of recipesAtLevel) {
            const itemDef = items_1.ITEMS[r.resultItemId] || { name: r.resultItemId, icon: '⚔️', type: 'vukhi', statBonus: {} };
            let statStr = '';
            if (itemDef.type === 'vukhi') {
                const atk = itemDef.statBonus?.satThuong || 0;
                statStr = `**[${atk} at]**`;
            }
            else {
                const def = itemDef.statBonus?.phongThu || 0;
                const hp = itemDef.statBonus?.sinhLucToiDa ? `, ${itemDef.statBonus.sinhLucToiDa} hp` : '';
                statStr = `**[${def} def${hp}]**`;
            }
            // Hiển thị rõ Mã ID Nguyên liệu dạng codeblock để người chơi dễ farm
            const matStr = r.materials
                .map((m) => {
                const matDef = items_1.ITEMS[m.itemId] || { name: m.itemId, icon: '📦' };
                return `${matDef.icon} \`${m.itemId}\` x${m.quantity}`;
            })
                .join(' + ');
            const feeStr = r.dongCost > 0 ? ` + ${(0, formatters_1.formatDong)(r.dongCost)}` : '';
            recipeBody += `${itemDef.icon} \`${r.resultItemId}\` (${itemDef.name}) ${statStr} ➔ ${matStr}${feeStr}\n`;
        }
        recipeBody += '\n';
    }
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔨 BẢNG CÔNG THỨC RÈN ĐỒ & MÃ NGUYÊN LIỆU FARM')
        .setDescription(`• Gõ \`vn craft [mã_vật_phẩm]\` để rèn đồ (Ví dụ: \`vn craft dao_tre_gai\` hoặc \`vn craft sword\`)\n` +
        `• Gõ \`vn craft items\` để tra cứu toàn bộ địa điểm farm nguyên liệu!\n\n` +
        `${recipeBody.trim()}\n\n` +
        `ℹ️ **Đảm bảo bạn đủ Level, Nguyên Liệu & Tiền Đồng trước khi rèn!**`);
    await message.reply({ embeds: [embed] });
}
