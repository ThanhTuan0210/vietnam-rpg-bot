import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

interface BaucuaOption {
  id: string;
  name: string;
  emoji: string;
}

const OPTIONS: BaucuaOption[] = [
  { id: 'bau', name: 'Bầu', emoji: '🍐' },
  { id: 'cua', name: 'Cua', emoji: '🦀' },
  { id: 'tom', name: 'Tôm', emoji: '🦐' },
  { id: 'ca', name: 'Cá', emoji: '🐟' },
  { id: 'ga', name: 'Gà', emoji: '🐓' },
  { id: 'nai', name: 'Nai', emoji: '🦌' },
];

export async function bauCuaCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  // 1. Parse số tiền cược
  const betAmount = parseInt(args[0], 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vkl baucua [số tiền cược]` (Ví dụ: `vkl baucua 100`)');
    return;
  }

  // 2. Session Lock
  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một phiên cược / trận đấu chưa kết thúc! Hãy hoàn tất trước.');
    return;
  }

  // 3. Kiểm tra số dư và trừ tiền cược Atomic
  const deductSuccess = await UserService.deductDongAtomic(userId, betAmount);
  if (!deductSuccess) {
    session.unlock(userId);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để tham gia đặt cược!`);
    return;
  }

  // 4. Tạo 6 Nút bấm đại diện 6 linh vật dân gian
  const row1 = new ActionRowBuilder<ButtonBuilder>();
  const row2 = new ActionRowBuilder<ButtonBuilder>();

  OPTIONS.slice(0, 3).forEach((opt) => {
    row1.addComponents(
      new ButtonBuilder()
        .setCustomId(`baucua_${opt.id}`)
        .setLabel(opt.name)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Primary)
    );
  });

  OPTIONS.slice(3, 6).forEach((opt) => {
    row2.addComponents(
      new ButtonBuilder()
        .setCustomId(`baucua_${opt.id}`)
        .setLabel(opt.name)
        .setEmoji(opt.emoji)
        .setStyle(ButtonStyle.Primary)
    );
  });

  const embed = createDongSonEmbed()
    .setTitle('🎲 BẦU CUA TÔM CÁ DÂN GIAN')
    .setDescription(
      `Mức tiền cược: ${formatDong(betAmount)}\n\nHãy bấm chọn cửa cược của bạn dưới đây trong vòng **60 giây**:`
    );

  const replyMsg = await message.reply({ embeds: [embed], components: [row1, row2] });

  // 5. Collector lắng nghe thao tác Nút bấm
  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  collector.on('collect', async (i) => {
    const chosenId = i.customId.replace('baucua_', '');
    const chosenOption = OPTIONS.find((o) => o.id === chosenId)!;

    // Lắc 3 quân xúc xắc
    const roll1 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
    const roll2 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];
    const roll3 = OPTIONS[Math.floor(Math.random() * OPTIONS.length)];

    const results = [roll1, roll2, roll3];
    const matchCount = results.filter((r) => r.id === chosenId).length;

    // Tính tiền trả thưởng: Trúng 1 con ăn x1 (+bet), trúng 2 ăn x2 (+2bet), trúng 3 ăn x3 (+3bet)
    // Nếu matchCount > 0, hoàn tiền gốc + tiền thắng = betAmount + (matchCount * betAmount)
    let winAmount = 0;
    if (matchCount > 0) {
      winAmount = betAmount * (matchCount + 1);
      await UserService.addDongAtomic(userId, winAmount);
    }

    // Disable buttons
    const disabledRow1 = new ActionRowBuilder<ButtonBuilder>();
    const disabledRow2 = new ActionRowBuilder<ButtonBuilder>();
    row1.components.forEach((btn) => disabledRow1.addComponents(ButtonBuilder.from(btn).setDisabled(true)));
    row2.components.forEach((btn) => disabledRow2.addComponents(ButtonBuilder.from(btn).setDisabled(true)));

    const resultEmbed = createDongSonEmbed();

    if (matchCount > 0) {
      const netProfit = betAmount * matchCount;
      resultEmbed.setTitle('🎉 KẾT QUẢ: THẮNG LỚN BẦU CUA!');
      resultEmbed.setDescription(
        `Bạn đặt cược cửa: ${chosenOption.emoji} **${chosenOption.name}**\n\n` +
          `🎲 **Kết quả lắc xúc xắc:** ${roll1.emoji} ${roll2.emoji} ${roll3.emoji}\n\n` +
          `✨ Trúng **${matchCount}** hình! Bạn nhận về ${formatDong(winAmount)} (Lời +${formatDong(netProfit)})!`
      );
    } else {
      resultEmbed.setTitle('💸 KẾT QUẢ: THỦI THỦI CẢNH LÀNG');
      resultEmbed.setDescription(
        `Bạn đặt cược cửa: ${chosenOption.emoji} **${chosenOption.name}**\n\n` +
          `🎲 **Kết quả lắc xúc xắc:** ${roll1.emoji} ${roll2.emoji} ${roll3.emoji}\n\n` +
          `❌ Rất tiếc không có hình bạn chọn! Bạn mất ${formatDong(betAmount)}.`
      );
    }

    await i.update({ embeds: [resultEmbed], components: [disabledRow1, disabledRow2] });
    session.unlock(userId);
    collector.stop('completed');
  });

  collector.on('end', async (_, reason) => {
    session.unlock(userId);
    if (reason === 'time') {
      // Hết hạn 60s -> Hoàn tiền cược & disable buttons
      await UserService.addDongAtomic(userId, betAmount);
      const disabledRow1 = new ActionRowBuilder<ButtonBuilder>();
      const disabledRow2 = new ActionRowBuilder<ButtonBuilder>();
      row1.components.forEach((btn) => disabledRow1.addComponents(ButtonBuilder.from(btn).setDisabled(true)));
      row2.components.forEach((btn) => disabledRow2.addComponents(ButtonBuilder.from(btn).setDisabled(true)));

      await replyMsg.edit({
        content: '⏰ **Đã hết 60 giây!** Phiên cược bị hủy, tiền cược đã được hoàn lại.',
        components: [disabledRow1, disabledRow2],
      });
    }
  });
}
