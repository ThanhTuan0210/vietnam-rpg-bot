"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nangCapToolCommand = nangCapToolCommand;
const GatheringService_1 = require("../../game/services/GatheringService");
const User_model_1 = require("../../database/models/User.model");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function nangCapToolCommand(message, args) {
    const userId = message.author.id;
    const toolInput = args[0]?.toLowerCase();
    const mapTool = {
        riu: 'riu',
        cancau: 'canCau',
        cuoc: 'cuoc',
        gio: 'gioThuoc',
        giothuoc: 'gioThuoc',
    };
    const toolType = mapTool[toolInput];
    if (!toolType) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        const dungCu = user?.dungCu || { riu: 1, canCau: 1, cuoc: 1, gioThuoc: 1 };
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🪓 NÂNG CẤP DỤNG CỤ LAO ĐỘNG')
            .setDescription(`Cấp độ dụng cụ hiện tại của bạn:\n` +
            `• 🪓 Rìu đốn củi: **Bậc ${dungCu.riu}** (\`vn nangcap riu\`)\n` +
            `• 🎣 Cần câu cá: **Bậc ${dungCu.canCau}** (\`vn nangcap cancau\`)\n` +
            `• ⛏️ Cuốc khai mỏ: **Bậc ${dungCu.cuoc}** (\`vn nangcap cuoc\`)\n` +
            `• 🧺 Giỏ hái thuốc: **Bậc ${dungCu.gioThuoc}** (\`vn nangcap gio\`)\n\n` +
            `*Dụng cụ bậc cao giúp tăng sản lượng thu hoạch và mở khóa nguyên liệu quý hiếm!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const res = await GatheringService_1.GatheringService.upgradeTool(userId, toolType);
    await message.reply(res.message);
}
