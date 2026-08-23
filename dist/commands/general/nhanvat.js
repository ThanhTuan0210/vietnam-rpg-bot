"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nhanVatCommandAdvanced = nhanVatCommandAdvanced;
const User_model_1 = require("../../database/models/User.model");
const CombatEngine_1 = require("../../game/engines/CombatEngine");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const CLASS_DISPLAY = {
    DUNG_TUONG: '🛡️ Dũng Tướng',
    DAO_SI: '🔮 Đạo Sĩ',
    THO_SAN: '🏹 Thợ Săn',
};
async function nhanVatCommandAdvanced(message) {
    const userId = message.author.id;
    let user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
        return;
    }
    const { totalAtk, totalDef, totalMaxHp, totalMaxMp, totalCrit, totalDodge } = CombatEngine_1.CombatEngineAdvanced.calculateTotalStats(user);
    const wSlot = user.trangBi.vuKhi;
    const aSlot = user.trangBi.aoGiap;
    const wItem = items_1.ITEMS[wSlot.itemId] || { name: 'Tay Không', icon: '👊' };
    const aItem = items_1.ITEMS[aSlot.itemId] || { name: 'Áo Vải Thô', icon: '🥋' };
    const wLvlStr = wSlot.capCuongHoa > 0 ? ` (+${wSlot.capCuongHoa})` : '';
    const aLvlStr = aSlot.capCuongHoa > 0 ? ` (+${aSlot.capCuongHoa})` : '';
    const expNeeded = user.canhGioi.capDo * 100;
    const className = user.hePhai ? CLASS_DISPLAY[user.hePhai] : 'Chưa chọn';
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🛡️ HỒ SƠ ANH HÙNG - ${message.author.username.toUpperCase()}`)
        .setThumbnail(message.author.displayAvatarURL())
        .addFields({ name: '👤 Danh Hiệu & Phái', value: `🏅 **${user.danhHieu}**\n${className}`, inline: true }, { name: '⭐ Cấp Độ', value: `🌟 **Cấp ${user.canhGioi.capDo}**`, inline: true }, { name: '🗺️ Vùng Đất', value: `📍 **Vùng ${user.canhGioi.khuVuc}**`, inline: true }, {
        name: '❤️ Sinh Lực (HP)',
        value: (0, formatters_1.renderHpBar)(user.chiSo.hp, totalMaxHp),
        inline: false,
    }, {
        name: '💧 Chân Khí (MP)',
        value: (0, formatters_1.renderProgressBar)(user.chiSo.mp, totalMaxMp, 10, '🟦', '⬛'),
        inline: false,
    }, {
        name: '✨ Kinh Nghiệm (EXP)',
        value: (0, formatters_1.renderProgressBar)(user.canhGioi.kinhNghiem, expNeeded, 10, '🟨', '⬛'),
        inline: false,
    }, {
        name: '⚔️ Sát Thương (ATK)',
        value: `**${totalAtk}**`,
        inline: true,
    }, {
        name: '🛡️ Phòng Thủ (DEF)',
        value: `**${totalDef}**`,
        inline: true,
    }, {
        name: '⚡ Chí Mạng / Né',
        value: `🎯 **${Math.round(totalCrit * 100)}%** Crit | 💨 **${Math.round(totalDodge * 100)}%** Dodge`,
        inline: true,
    }, {
        name: '💰 Ngân Khố',
        value: `${(0, formatters_1.formatDong)(user.taiChinh.dong)}\n${(0, formatters_1.formatKimBao)(user.taiChinh.kimBao)}`,
        inline: true,
    }, {
        name: '🗡️ Trang Bị Đang Mặc',
        value: `${wItem.icon} **${wItem.name}${wLvlStr}**\n${aItem.icon} **${aItem.name}${aLvlStr}**`,
        inline: true,
    });
    await message.reply({ embeds: [embed] });
}
