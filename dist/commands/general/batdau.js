"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batDauCommand = batDauCommand;
const discord_js_1 = require("discord.js");
const User_model_1 = require("../../database/models/User.model");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function batDauCommand(message) {
    const userId = message.author.id;
    let user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user) {
        user = await User_model_1.UserModelAdvanced.create({
            userId,
            danhHieu: 'Dân Làng',
            canhGioi: { capDo: 1, kinhNghiem: 0, khuVuc: 1 },
            chiSo: {
                hp: 100,
                maxHp: 100,
                mp: 50,
                maxMp: 50,
                satThuong: 15,
                phongThu: 5,
                chiMang: 0.05,
                neTranh: 0.05,
            },
            taiChinh: { dong: 5000, kimBao: 0 },
            trangBi: {
                vuKhi: { itemId: 'gay_tam_vong', capCuongHoa: 0, bonusStat: 0 },
                aoGiap: { itemId: 'ao_vai_tho', capCuongHoa: 0, bonusStat: 0 },
            },
            tuiDo: [
                { itemId: 'com_lam', soLuong: 2, doHiem: 'THUONG' },
                { itemId: 'go_tre_gai', soLuong: 5, doHiem: 'THUONG' },
            ],
            cooldowns: new Map(),
        });
    }
    if (user.hePhai) {
        const classNames = {
            DUNG_TUONG: '🛡️ Dũng Tướng (Tanker / Cận chiến)',
            DAO_SI: '🔮 Đạo Sĩ (Phép thuật / Burst)',
            THO_SAN: '🏹 Thợ Săn (Chí mạng / Tốc độ)',
        };
        await message.reply(`📜 Bạn đã chọn Hệ Phái **${classNames[user.hePhai]}**! Hãy gõ ` + '`vn nhanvat`' + ` để xem chi tiết thông số nhân vật.`);
        return;
    }
    // Tạo ActionRow chọn 1 trong 3 Hệ Phái
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId('class_DUNG_TUONG')
        .setLabel('🛡️ DŨNG TƯỚNG (Tank / HP cao)')
        .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
        .setCustomId('class_DAO_SI')
        .setLabel('🔮 ĐẠO SĨ (Magic / MP lớn)')
        .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
        .setCustomId('class_THO_SAN')
        .setLabel('🏹 THỢ SĂN (Crit / Né tránh)')
        .setStyle(discord_js_1.ButtonStyle.Success));
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🏛️ BÁCH TÍNH NHẬP THẾ - CHỌN HỆ PHÁI VÕ HỌC`)
        .setDescription(`Chào mừng **${message.author.username}** đã dấn thân vào thế giới thần thoại Đại Việt!\n\nHãy chọn **1 trong 3 Hệ Phái** bên dưới để thức tỉnh chân khí và bắt đầu hành trình:`)
        .addFields({
        name: '🛡️ Dũng Tướng',
        value: '• HP & Giáp cực cao, chống chịu tốt.\n• Chiêu 1: `Trảm Kích` (130% ATK)\n• Chiêu 2: `Kim Cang Hộ Thể` (+50% DEF, Hồi 10% HP)',
        inline: false,
    }, {
        name: '🔮 Đạo Sĩ',
        value: '• MP & Sát thương Phép màu kinh hoàng.\n• Chiêu 1: `Ngũ Lôi Trừ Tà` (180% DMG + 🔥 Thiêu Đốt)\n• Chiêu 2: `Hộ Thân Chú` (Hồi 35% HP + Khiên)',
        inline: false,
    }, {
        name: '🏹 Thợ Săn',
        value: '• Tốc độ, Tỷ lệ Chí mạng & Né tránh cao.\n• Chiêu 1: `Xuyên Vân Tiễn` (Bỏ qua 40% DEF, +30% Crit)\n• Chiêu 2: `Hư Ảnh Bộ` (+40% Né tránh)',
        inline: false,
    });
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 60000,
        filter: (i) => i.user.id === userId,
    });
    collector.on('collect', async (i) => {
        const selectedClass = i.customId.replace('class_', '');
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { hePhai: selectedClass } });
        const disabledRow = new discord_js_1.ActionRowBuilder();
        row.components.forEach((btn) => disabledRow.addComponents(discord_js_1.ButtonBuilder.from(btn).setDisabled(true)));
        const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎉 KHỞI TẠO BÁCH TÍNH THÀNH CÔNG!')
            .setDescription(`Chúc mừng bạn đã chọn Hệ Phái **${selectedClass}**! Bạn nhận được **${(0, formatters_1.formatDong)(5000)}** khởi đầu cùng bộ vũ khí tân thủ.\n\nGõ \`vn san\` để bắt đầu đi diệt quỷ!`);
        await i.update({ embeds: [resultEmbed], components: [disabledRow] });
        collector.stop('completed');
    });
}
