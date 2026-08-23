import { Message } from 'discord.js';
import { WeatherService } from '../../game/services/WeatherService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function xinXamCommand(message: Message): Promise<void> {
  const userId = message.author.id;

  const fortuneRes = await WeatherService.drawDailyFortune(userId);
  const weather = WeatherService.getCurrentWeather();

  const embed = createDongSonEmbed()
    .setTitle('⛩️ XIN XĂM KINHI DỊCH & THỜI TIẾT ĐỘNG TOÀN CẦU')
    .setDescription(
      `${fortuneRes.message}\n\n` +
        `🌍 **THỜI TIẾT SERVER HIỆN TẠI (Chu kỳ 4h):**\n` +
        `${weather.icon} **${weather.name}**\n` +
        `💡 *${weather.desc}*`
    );

  await message.reply({ embeds: [embed] });
}
