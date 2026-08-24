"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nhanVatCommandAdvanced = nhanVatCommandAdvanced;
const User_model_1 = require("../../database/models/User.model");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function nhanVatCommandAdvanced(message) {
    const userId = message.author.id;
    let user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl`.');
        return;
    }
    const { totalAtk, totalDef, totalMaxHp, totalMaxMp, totalCrit, totalDodge } = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    const wSlot = user.trangBi?.vuKhi || { itemId: 'sword_01a', capCuongHoa: 0 };
    const aSlot = user.trangBi?.aoGiap || { itemId: 'shield_01a', capCuongHoa: 0 };
    const wDef = items_1.ITEMS[wSlot.itemId] || { name: 'Kiếm Sơ Cấp Trung Cổ', icon: '⚔️' };
    const aDef = items_1.ITEMS[aSlot.itemId] || { name: 'Khiên Thép Kị Sĩ', icon: '🛡️' };
    const wIcon = (0, items_1.getItemIcon)(wSlot.itemId);
    const aIcon = (0, items_1.getItemIcon)(aSlot.itemId);
    const expNeeded = user.canhGioi.capDo * 100;
    const validClasses = ['WARRIOR', 'MAGE', 'RANGER', 'ASSASSIN', 'warrior', 'mage', 'ranger', 'assassin'];
    const rawCombat = (user.hePhai || '').toString();
    const combatClass = validClasses.includes(rawCombat) ? rawCombat.toUpperCase() : 'CHƯA CHỌN';
    const producerClass = (user.producerJob || 'CHƯA CHỌN').toUpperCase();
    // Calculate Combat Power (CP)
    const cp = (totalAtk * 2) + (totalDef * 3) + Math.floor(totalMaxHp / 10) + Math.floor(totalMaxMp / 5) + Math.floor(totalCrit * 50);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🛡️ HỒ SƠ ANH HÙNG TRUNG CỔ — ${message.author.username.toUpperCase()}`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`📊 **LỰC CHIẾN TỔNG HỢP (CP):** \`${cp.toLocaleString('vi-vkl')} CP\`\n\n` +
        `⚔️ **Class Chiến Đấu:** \`${combatClass}\`\n` +
        `🔨 **Class Sản Xuất (PP):** \`${producerClass}\`\n` +
        `🌟 **Level:** \`${user.canhGioi.capDo}\` | 🗺️ **Vùng Ngục Tối:** \`Tầng ${user.canhGioi.khuVuc}\`\n\n` +
        `❤️ **HP:** ${(0, formatters_1.renderHpBar)(user.chiSo.hp, totalMaxHp)}\n` +
        `💧 **MP:** ${(0, formatters_1.renderProgressBar)(user.chiSo.mp, totalMaxMp, 10, '🟦', '⬛')}\n` +
        `✨ **EXP:** ${(0, formatters_1.renderProgressBar)(user.canhGioi.kinhNghiem, expNeeded, 10, '🟨', '⬛')}\n\n` +
        `⚔️ **Sát Thương (ATK):** \`${totalAtk}\` | 🛡️ **Phòng Thủ (DEF):** \`${totalDef}\`\n` +
        `💥 **Bạo Kích:** \`${Math.round(totalCrit * 100)}%\` | 🍃 **Né Tránh:** \`${Math.round(totalDodge * 100)}%\`\n\n` +
        `🎒 **TRANG BỊ ĐANG MẶC:**\n` +
        `• **Vũ Khí:** ${wIcon} **${wDef.name}** (\`${wSlot.itemId}\`)\n` +
        `• **Áo Giáp:** ${aIcon} **${aDef.name}** (\`${aSlot.itemId}\`)\n\n` +
        `💰 **Ví Tiền Vàng:** \`${(0, formatters_1.formatDong)(user.taiChinh.dong)}\``);
    await message.reply({ embeds: [embed] });
}
