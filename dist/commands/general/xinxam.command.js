"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xinXamCommand = xinXamCommand;
const WeatherService_1 = require("../../game/services/WeatherService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function xinXamCommand(message) {
    const userId = message.author.id;
    const fortuneRes = await WeatherService_1.WeatherService.drawDailyFortune(userId);
    const weather = WeatherService_1.WeatherService.getCurrentWeather();
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('⛩️ XIN XĂM KINHI DỊCH & THỜI TIẾT ĐỘNG TOÀN CẦU')
        .setDescription(`${fortuneRes.message}\n\n` +
        `🌍 **THỜI TIẾT SERVER HIỆN TẠI (Chu kỳ 4h):**\n` +
        `${weather.icon} **${weather.name}**\n` +
        `💡 *${weather.desc}*`);
    await message.reply({ embeds: [embed] });
}
