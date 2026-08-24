"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duaLinhThuCommand = duaLinhThuCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function duaLinhThuCommand(message, args) {
    const userId = message.author.id;
    const betDong = parseInt(args[0], 10) || 5000;
    const chosenPet = parseInt(args[1], 10) || 1;
    if (betDong <= 0 || chosenPet < 1 || chosenPet > 4) {
        await message.reply('⚠️ **Cú pháp:** `vkl dua_linhthu [tiền_cược] [số_linh_thú 1-4]` (Ví dụ: `vkl dua_linhthu 10000 2`)');
        return;
    }
    const paid = await UserService_1.UserService.deductDongAtomic(userId, betDong);
    if (!paid) {
        await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(betDong)} để tham gia cuộc đua Linh Thú!`);
        return;
    }
    const pets = [
        { num: 1, name: '🐅 Bạch Hổ Thượng Ngàn', speed: Math.random() },
        { num: 2, name: '🐢 Huyền Vũ Trấn Hải', speed: Math.random() },
        { num: 3, name: '🐉 Hắc Long U Minh', speed: Math.random() },
        { num: 4, name: '🦅 Chim Lạc Đông Sơn', speed: Math.random() },
    ];
    pets.sort((a, b) => b.speed - a.speed);
    const winner = pets[0];
    await UserService_1.UserService.updateCooldownAtomic(userId, 'dua_linhthu', Date.now());
    const isWin = winner.num === chosenPet;
    const reward = isWin ? betDong * 3 : 0;
    if (isWin) {
        await UserService_1.UserService.addDongAtomic(userId, reward);
    }
    const rankStr = pets.map((p, i) => `${i + 1}. **${p.name}** (Tùy chọn #${p.num})`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🏁 HỘI THI ĐUA LINH THÚ TỐC ĐỘ')
        .setDescription(`📊 **KẾT QUẢ ĐẠI HỘI ĐUA LINH THÚ:**\n${rankStr}\n\n` +
        (isWin
            ? `🎉 **ĐẠI THẮNG!** Linh thú **#${chosenPet}** của bạn đã xuất sắc về đích **HẠNG 1**! Nhận thưởng **+${(0, formatters_1.formatDong)(reward)}** (x3 cược)!`
            : `💔 **THẤT BẠI!** Linh thú của bạn đã bị vượt mặt bởi **${winner.name}**! Mất ${(0, formatters_1.formatDong)(betDong)}.`));
    await message.reply({ embeds: [embed] });
}
