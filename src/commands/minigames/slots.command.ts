import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

const REELS = ['🪙', '🏺', '🐉', '👑'];

export async function slotsCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  const betAmount = parseInt(args[0], 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vn slots [số tiền cược]` (Ví dụ: `vn slots 100`)');
    return;
  }

  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một phiên chơi chưa kết thúc!');
    return;
  }

  const deductSuccess = await UserService.deductDongAtomic(userId, betAmount);
  if (!deductSuccess) {
    session.unlock(userId);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để quay Slots!`);
    return;
  }

  // Quay 3 trục ngẫu nhiên
  const r1 = REELS[Math.floor(Math.random() * REELS.length)];
  const r2 = REELS[Math.floor(Math.random() * REELS.length)];
  const r3 = REELS[Math.floor(Math.random() * REELS.length)];

  let multiplier = 0;
  let title = '💸 KHÔNG TRÚNG THƯỞNG';

  if (r1 === '🐉' && r2 === '🐉' && r3 === '🐉') {
    multiplier = 50;
    title = '🔥 JACKPOT NỔ HŨ HOÀNG CUNG x50!';
  } else if (r1 === '👑' && r2 === '👑' && r3 === '👑') {
    multiplier = 20;
    title = '👑 THẮNG VƯƠNG MIỆN x20!';
  } else if (r1 === '🏺' && r2 === '🏺' && r3 === '🏺') {
    multiplier = 10;
    title = '🏺 THẮNG CỔ VẬT x10!';
  } else if (r1 === '🪙' && r2 === '🪙' && r3 === '🪙') {
    multiplier = 5;
    title = '🪙 THẮNG ĐỒNG XU x5!';
  } else if (r1 === r2 || r2 === r3 || r1 === r3) {
    multiplier = 2;
    title = '✨ THẮNG ĐÔI x2!';
  }

  const winAmount = betAmount * multiplier;
  if (winAmount > 0) {
    await UserService.addDongAtomic(userId, winAmount);
  }

  session.unlock(userId);

  const embed = createDongSonEmbed()
    .setTitle(title)
    .setDescription(
      `🎰 **VÒNG QUAY NỔ HŨ HOÀNG CUNG** 🎰\n\n` +
        `[  ${r1}  |  ${r2}  |  ${r3}  ]\n\n` +
        (winAmount > 0
          ? `🎉 Chúc mừng! Bạn cược ${formatDong(betAmount)} và nhận về ${formatDong(winAmount)} (Lời +${formatDong(
              winAmount - betAmount
            )})!`
          : `❌ Rất tiếc không có hàng trùng! Bạn mất ${formatDong(betAmount)}.`)
    );

  await message.reply({ embeds: [embed] });
}
