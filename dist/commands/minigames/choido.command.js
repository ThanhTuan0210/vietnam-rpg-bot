"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choiDoCommand = choiDoCommand;
const User_model_1 = require("../../database/models/User.model");
const CooldownEngine_1 = require("../../game/engines/CooldownEngine");
const UserService_1 = require("../../game/services/UserService");
const riddles_1 = require("../../game/data/riddles");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function choiDoCommand(message) {
    const userId = message.author.id;
    const user = await User_model_1.UserModelAdvanced.findOne({ userId });
    if (!user || !user.hePhai) {
        await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl batdau`.');
        return;
    }
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'choido', 60000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    const riddle = riddles_1.RIDDLES[Math.floor(Math.random() * riddles_1.RIDDLES.length)];
    const correctAnswer = riddle.options[riddle.correctIndex];
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('✍️ ĐỐ VUI TRẠNG QUỲNH')
        .setDescription(`**Câu đố:** ${riddle.question}\n\n` +
        `💡 *Hãy gõ câu trả lời của bạn vào kênh chat trong vòng **30 giây**!*`);
    await message.reply({ embeds: [embed] });
    const filter = (m) => m.author.id === userId;
    try {
        const channel = message.channel;
        const collected = await channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        const ans = collected.first()?.content.trim().toLowerCase();
        const isCorrect = ans === correctAnswer.toLowerCase();
        if (isCorrect) {
            const rewardExp = 150 + user.canhGioi.capDo * 10;
            const rewardDong = 500 + user.canhGioi.capDo * 50;
            await UserService_1.UserService.addDongAtomic(userId, rewardDong);
            await UserService_1.UserService.updateCooldownAtomic(userId, 'choido', Date.now());
            const winEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle('🎉 TRẢ LỜI CHÍNH XÁC!')
                .setDescription(`Bạn đã giải đáp xuất sắc câu đố Trạng Quỳnh!\n\n` +
                `✨ Thưởng: **+${rewardExp} EXP** & ${(0, formatters_1.formatDong)(rewardDong)}!\n` +
                `💡 *Giải thích:* ${riddle.explanation}`);
            await message.reply({ embeds: [winEmbed] });
        }
        else {
            await UserService_1.UserService.updateCooldownAtomic(userId, 'choido', Date.now());
            await message.reply(`❌ Trả lời chưa chính xác! Đáp án đúng là: **${correctAnswer}**.`);
        }
    }
    catch (e) {
        await UserService_1.UserService.updateCooldownAtomic(userId, 'choido', Date.now());
        await message.reply(`⏰ Đã hết 30 giây mà bạn chưa đưa ra câu trả lời! Đáp án đúng là: **${correctAnswer}**.`);
    }
}
