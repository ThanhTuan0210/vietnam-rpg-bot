"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.congDucCommand = congDucCommand;
const User_model_1 = require("../../database/models/User.model");
const AreaBossService_1 = require("../../game/services/AreaBossService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function congDucCommand(message, args) {
    const userId = message.author.id;
    const subCmd = args[0]?.toLowerCase();
    if (subCmd === 'mua' || subCmd === 'doi') {
        const amount = parseInt(args[1], 10) || 1;
        const res = await AreaBossService_1.AreaBossService.buyMeritPoints(userId, amount);
        await message.reply(res.message);
        return;
    }
    // Hiển thị Điểm Công Đức hiện tại
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user)
        return;
    const currentMerit = user.suDo?.diemCongDuc || 0;
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('⛩️ ĐIỂM CÔNG ĐỨC & PHONG ẤN THẦN MA')
        .setDescription(`✨ Điểm Công Đức Hiện Tại: **${currentMerit} Điểm**\n\n` +
        `💡 **CÔNG DỤNG ĐIỂM CÔNG ĐỨC:**\n` +
        `• Dùng làm ấn chú giải mở Trận Pháp Phong Ấn để khiêu chiến **Boss Trùm Vùng** (\`vkl boss\`).\n` +
        `• Đả bại Boss Vùng sẽ giúp bạn **Đột phá sang Khu Vực tiếp theo** (\`khuVuc +1\`)!\n\n` +
        `📜 **QUY ĐỔI CÔNG ĐỨC:**\n` +
        `• **100,000 Đồng** = **1 Điểm Công Đức**\n` +
        `• Cú pháp: \`vkl congduc mua [số_lượng]\``);
    await message.reply({ embeds: [embed] });
}
