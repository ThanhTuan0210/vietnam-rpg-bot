import { Message, TextChannel } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { CooldownEngine } from '../../game/engines/CooldownEngine';
import { UserService } from '../../game/services/UserService';
import { RIDDLES } from '../../game/data/riddles';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function luyenVoCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserModelAdvanced.findOne({ userId });

  if (!user || !user.hePhai) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vn batdau`.');
    return;
  }

  const cooldownCheck = CooldownEngine.checkCooldown(user, 'luyenvo', 60000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
  const correctAnswer = riddle.options[riddle.correctIndex];

  const embed = createDongSonEmbed()
    .setTitle('✍️ LUYỆN VÕ THI TRÍ — ĐỐ VUI TRẠNG QUỲNH')
    .setDescription(
      `**Câu đố:** ${riddle.question}\n\n` +
        `💡 *Hãy gõ câu trả lời của bạn vào kênh chat trong vòng **30 giây**!*`
    );

  await message.reply({ embeds: [embed] });

  const filter = (m: Message) => m.author.id === userId;
  try {
    const channel = message.channel as TextChannel;
    const collected = await channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
    const ans = collected.first()?.content.trim().toLowerCase();

    const isCorrect = ans === correctAnswer.toLowerCase();

    if (isCorrect) {
      const rewardExp = 150 + user.canhGioi.capDo * 10;
      const rewardDong = 500 + user.canhGioi.capDo * 50;

      await UserService.addDongAtomic(userId, rewardDong);
      await UserService.updateCooldownAtomic(userId, 'luyenvo', Date.now());

      const winEmbed = createDongSonEmbed()
        .setTitle('🎉 TRẢ LỜI CHÍNH XÁC!')
        .setDescription(
          `Bạn đã giải đáp xuất sắc câu đố Trạng Quỳnh!\n\n` +
            `✨ Thưởng: **+${rewardExp} EXP** & ${formatDong(rewardDong)}!\n` +
            `💡 *Giải thích:* ${riddle.explanation}`
        );
      await message.reply({ embeds: [winEmbed] });
    } else {
      await UserService.updateCooldownAtomic(userId, 'luyenvo', Date.now());
      await message.reply(`❌ Trả lời chưa chính xác! Đáp án đúng là: **${correctAnswer}**.`);
    }
  } catch (e) {
    await UserService.updateCooldownAtomic(userId, 'luyenvo', Date.now());
    await message.reply(`⏰ Đã hết 30 giây mà bạn chưa đưa ra câu trả lời! Đáp án đúng là: **${correctAnswer}**.`);
  }
}
