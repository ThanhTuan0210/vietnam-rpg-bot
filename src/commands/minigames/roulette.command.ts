import { Message, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export async function rouletteCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  const betAmount = parseInt(args[0], 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vkl roulette [số tiền cược]` (Ví dụ: `vkl roulette 200`)');
    return;
  }

  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một phiên cược chưa hoàn thành!');
    return;
  }

  const deductSuccess = await UserService.deductDongAtomic(userId, betAmount);
  if (!deductSuccess) {
    session.unlock(userId);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để quay Roulette!`);
    return;
  }

  // Select Menu lựa chọn cửa cược
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('roulette_select')
    .setPlaceholder('🎯 Chọn cửa cược Roulette của bạn...')
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel('🔴 Cửa Đỏ (Red - Thưởng x2)').setValue('red').setEmoji('🔴'),
      new StringSelectMenuOptionBuilder().setLabel('⚫ Cửa Đen (Black - Thưởng x2)').setValue('black').setEmoji('⚫'),
      new StringSelectMenuOptionBuilder().setLabel('🔢 Cửa Chẵn (Even - Thưởng x2)').setValue('even').setEmoji('⚖️'),
      new StringSelectMenuOptionBuilder().setLabel('⚡ Cửa Lẻ (Odd - Thưởng x2)').setValue('odd').setEmoji('⚡'),
      new StringSelectMenuOptionBuilder().setLabel('🟢 Con Số May Mắn 0 (Thưởng x36)').setValue('num_0').setEmoji('🟢'),
      new StringSelectMenuOptionBuilder().setLabel('🔥 Con Số May Mắn 7 (Thưởng x36)').setValue('num_7').setEmoji('🔥'),
      new StringSelectMenuOptionBuilder().setLabel('👑 Con Số May Mắn 18 (Thưởng x36)').setValue('num_18').setEmoji('👑')
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const embed = createDongSonEmbed()
    .setTitle('🎡 ROULETTE QUỐC TẾ')
    .setDescription(`Mức cược: ${formatDong(betAmount)}\n\nHãy chọn cửa cược trong Select Menu bên dưới (60s):`);

  const replyMsg = await message.reply({ embeds: [embed], components: [row] });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  collector.on('collect', async (i) => {
    const choice = i.values[0];

    // Quay số ngẫu nhiên từ 0 đến 36
    const landedNumber = Math.floor(Math.random() * 37);
    const isRed = RED_NUMBERS.includes(landedNumber);
    const isZero = landedNumber === 0;

    let isWin = false;
    let multiplier = 0;

    if (choice === 'red' && isRed && !isZero) {
      isWin = true;
      multiplier = 2;
    } else if (choice === 'black' && !isRed && !isZero) {
      isWin = true;
      multiplier = 2;
    } else if (choice === 'even' && landedNumber % 2 === 0 && !isZero) {
      isWin = true;
      multiplier = 2;
    } else if (choice === 'odd' && landedNumber % 2 !== 0 && !isZero) {
      isWin = true;
      multiplier = 2;
    } else if (choice.startsWith('num_')) {
      const targetNum = parseInt(choice.replace('num_', ''), 10);
      if (landedNumber === targetNum) {
        isWin = true;
        multiplier = 36;
      }
    }

    const winAmount = betAmount * multiplier;
    if (winAmount > 0) {
      await UserService.addDongAtomic(userId, winAmount);
    }

    const colorEmoji = isZero ? '🟢' : isRed ? '🔴' : '⚫';
    const disabledRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu.setDisabled(true)
    );

    const resultEmbed = createDongSonEmbed();

    if (isWin) {
      resultEmbed.setTitle('🎉 KẾT QUẢ ROULETTE: THẮNG CƯỢC!');
      resultEmbed.setDescription(
        `🎡 **Quả bóng rơi vào số:** ${colorEmoji} **${landedNumber}**\n\n` +
          `✨ Bạn chọn cửa cược chính xác! Nhận về ${formatDong(winAmount)} (Lời +${formatDong(
            winAmount - betAmount
          )})!`
      );
    } else {
      resultEmbed.setTitle('💸 KẾT QUẢ ROULETTE: THẤT BẠI');
      resultEmbed.setDescription(
        `🎡 **Quả bóng rơi vào số:** ${colorEmoji} **${landedNumber}**\n\n` +
          `❌ Rất tiếc bạn đã đoán sai! Mất ${formatDong(betAmount)}.`
      );
    }

    await i.update({ embeds: [resultEmbed], components: [disabledRow] });
    session.unlock(userId);
    collector.stop('completed');
  });

  collector.on('end', async (_, reason) => {
    session.unlock(userId);
    if (reason === 'time') {
      await UserService.addDongAtomic(userId, betAmount);
      await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Phiên quay hủy và hoàn tiền cược.', components: [] });
    }
  });
}
