"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thamHiemCommand = thamHiemCommand;
const User_model_1 = require("../../database/models/User.model");
const CooldownEngine_1 = require("../../game/engines/CooldownEngine");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function thamHiemCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl batdau`.');
        return;
    }
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'thamhiem', 300000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    await UserService_1.UserService.updateCooldownAtomic(userId, 'thamhiem', Date.now());
    const rand = Math.random();
    const embed = (0, embedBuilder_1.createDongSonEmbed)().setTitle('🌄 THÁM HIỂM VÙNG ĐẤT CỔ');
    if (rand < 0.4) {
        const dongFound = Math.floor(Math.random() * 3000) + 1000;
        await UserService_1.UserService.addDongAtomic(userId, dongFound);
        embed.setDescription(`Bạn băng qua rừng thâm và phát hiện một hũ tiền đồng cổ chứa ${(0, formatters_1.formatDong)(dongFound)}!`);
    }
    else if (rand < 0.7) {
        await UserService_1.UserService.addItemAtomic(userId, 'go_tram_huong', 2);
        embed.setDescription('Bạn nhặt được 🪵 **Gỗ Trầm Hương x2** bên ngọn thác Ba Vì!');
    }
    else if (rand < 0.9) {
        await UserService_1.UserService.addItemAtomic(userId, 'ruong_bac', 1);
        embed.setDescription('✨ **MAY MẮN!** Bạn thám hiểm phát hiện **1 Rương Bạc Thượng Cổ**!');
    }
    else {
        await UserService_1.UserService.addItemAtomic(userId, 'bua_cuong_hoa_2', 1);
        embed.setDescription('🔮 Bạn phát hiện hang đá thần ma và nhặt được **1 Bùa Cường Hóa +2**!');
    }
    await message.reply({ embeds: [embed] });
}
