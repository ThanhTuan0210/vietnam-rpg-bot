"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuongHoaCommand = cuongHoaCommand;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const RefineService_1 = require("../../game/services/RefineService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const SessionManager_1 = require("../../game/managers/SessionManager");
async function cuongHoaCommand(message, args) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
        return;
    }
    let slotInput = args[0]?.toLowerCase();
    let slotType = 'vuKhi';
    if (slotInput === 'aogiap' || slotInput === 'giap' || slotInput === 'armor') {
        slotType = 'aoGiap';
    }
    const gearSlot = user.trangBi[slotType];
    const itemDef = items_1.ITEMS[gearSlot.itemId];
    if (!itemDef) {
        await message.reply(`❌ Bạn chưa trang bị ${slotType === 'vuKhi' ? 'Vũ khí' : 'Áo giáp'} để cường hóa! (Gõ \`vkl enchant vukhi\` hoặc \`vkl enchant aogiap\`)`);
        return;
    }
    const session = SessionManager_1.SessionManager.getInstance();
    if (!session.lock(userId)) {
        await message.reply('⚠️ Bạn đang có một thao tác chưa hoàn thành!');
        return;
    }
    const currentPercent = gearSlot.bonusStat || 0;
    const statTypeStr = slotType === 'vuKhi' ? 'ATK' : 'HP';
    const cost = 5000;
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('random_enchant')
        .setLabel(`🎲 Cường Hóa Tinh Thạch (-${cost.toLocaleString('vi-VN')} Vàng)`)
        .setStyle(discord_js_1.ButtonStyle.Primary));
    const tierListStr = RefineService_1.RANDOM_ENCHANT_TIERS.map((t) => `• ${t.icon} **${t.name}**: **+${t.percent}% ${statTypeStr}** (Tỷ lệ rớt: ${Math.round(t.chance * 100)}%)`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🔥 LÒ RÈN CƯỜNG HÓA TRUNG CỔ - ${itemDef.icon} ${itemDef.name.toUpperCase()}`)
        .setDescription(`Trang bị đang chọn: ${itemDef.icon} **${itemDef.name}** (\`${gearSlot.itemId}\`)\n` +
        `📊 **Chỉ số linh khí hiện tại:** **+${currentPercent}% ${statTypeStr}**\n` +
        `💰 **Chi phí 1 lần gieo:** ${(0, formatters_1.formatDong)(cost)}\n\n` +
        `🎲 **BẢNG TỶ LỆ CƯỜNG HÓA TISNH THẠCH:**\n${tierListStr}`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 30000,
    });
    collector.on('collect', async (i) => {
        if (i.user.id !== userId) {
            await i.reply({ content: '⚠️ Bạn không thể điều khiển lò rèn của người khác!', ephemeral: true });
            return;
        }
        const res = await RefineService_1.RefineService.randomEnchantGear(userId, slotType, cost);
        if (!res.success) {
            await i.reply({ content: `❌ ${res.message}`, ephemeral: true });
            return;
        }
        const tierDef = res.tier;
        const newEmbed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`✨ KẾT QUẢ CƯỜNG HÓA TRUNG CỔ — ${itemDef.name.toUpperCase()}`)
            .setDescription(`🎉 **Cường hóa thành công!**\n\n` +
            `• Phẩm cấp đạt được: ${tierDef.icon} **${tierDef.name}**\n` +
            `• Chỉ số gia tăng: **+${tierDef.percent}% ${statTypeStr}** (Cũ: +${res.oldPercent}%)\n\n` +
            `💡 *Chỉ số mới đã được áp dụng trực tiếp vào Lực chiến CP (\`vkl p\`)!*`);
        await i.update({ embeds: [newEmbed], components: [row] });
    });
    collector.on('end', () => {
        session.unlock(userId);
    });
}
