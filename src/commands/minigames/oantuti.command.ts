import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

type Move = 'keo' | 'bua' | 'bao';

const MOVE_NAMES: Record<Move, { name: string; emoji: string }> = {
  keo: { name: 'Kéo', emoji: '✌️' },
  bua: { name: 'Búa', emoji: '✊' },
  bao: { name: 'Bao', emoji: '✋' },
};

function getWinner(move1: Move, move2: Move): 'p1' | 'p2' | 'tie' {
  if (move1 === move2) return 'tie';
  if (
    (move1 === 'keo' && move2 === 'bao') ||
    (move1 === 'bua' && move2 === 'keo') ||
    (move1 === 'bao' && move2 === 'bua')
  ) {
    return 'p1';
  }
  return 'p2';
}

export async function oanTuTiCommand(message: Message, args: string[]): Promise<void> {
  const p1Id = message.author.id;
  const targetUser = message.mentions.users.first();

  let betAmount = 0;
  if (targetUser) {
    betAmount = parseInt(args[1], 10);
  } else {
    betAmount = parseInt(args[0], 10);
  }

  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vn oantuti [@user/bot] [tiền cược]` (Ví dụ: `vn oantuti 100` hoặc `vn oantuti @BanThan 200`)');
    return;
  }

  const session = SessionManager.getInstance();

  if (!session.lock(p1Id)) {
    await message.reply('⚠️ Bạn đang có một phiên cược chưa kết thúc!');
    return;
  }

  // Deduct P1 bet
  const p1Success = await UserService.deductDongAtomic(p1Id, betAmount);
  if (!p1Success) {
    session.unlock(p1Id);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để cược!`);
    return;
  }

  // --- TRƯỜNG HỢP 1: CHƠI VỚI BOT ---
  if (!targetUser || targetUser.bot) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('ott_keo').setLabel('Kéo').setEmoji('✌️').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ott_bua').setLabel('Búa').setEmoji('✊').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ott_bao').setLabel('Bao').setEmoji('✋').setStyle(ButtonStyle.Primary)
    );

    const embed = createDongSonEmbed()
      .setTitle('✌️✊✋ OẰN TÙ TÌ VỚI THẦY CÚNG (BOT)')
      .setDescription(`Mức cược: ${formatDong(betAmount)}\n\nHãy chọn nước đi của bạn dưới đây (60s):`);

    const replyMsg = await message.reply({ embeds: [embed], components: [row] });

    const collector = replyMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
      filter: (i) => i.user.id === p1Id,
    });

    collector.on('collect', async (i) => {
      const p1Move = i.customId.replace('ott_', '') as Move;
      const botMoves: Move[] = ['keo', 'bua', 'bao'];
      const botMove = botMoves[Math.floor(Math.random() * 3)];

      const winner = getWinner(p1Move, botMove);

      const disabledRow = new ActionRowBuilder<ButtonBuilder>();
      row.components.forEach((btn) => disabledRow.addComponents(ButtonBuilder.from(btn).setDisabled(true)));

      const resultEmbed = createDongSonEmbed();

      if (winner === 'p1') {
        const winAmount = betAmount * 2;
        await UserService.addDongAtomic(p1Id, winAmount);
        resultEmbed.setTitle('🎉 BẠN ĐÃ THẮNG OẰN TÙ TÌ!');
        resultEmbed.setDescription(
          `Bạn ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\nBot ra: ${MOVE_NAMES[botMove].emoji} **${MOVE_NAMES[botMove].name}**\n\n✨ Bạn nhận về ${formatDong(winAmount)}!`
        );
      } else if (winner === 'p2') {
        resultEmbed.setTitle('💸 THẤT BẠI TRƯỚC THẦY CÚNG!');
        resultEmbed.setDescription(
          `Bạn ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\nBot ra: ${MOVE_NAMES[botMove].emoji} **${MOVE_NAMES[botMove].name}**\n\n❌ Bạn mất ${formatDong(betAmount)}.`
        );
      } else {
        await UserService.addDongAtomic(p1Id, betAmount);
        resultEmbed.setTitle('🤝 HÒA NƯỚC ĐI!');
        resultEmbed.setDescription(
          `Cả hai cùng ra: ${MOVE_NAMES[p1Move].emoji} **${MOVE_NAMES[p1Move].name}**\n\nHoàn tiền cược ${formatDong(betAmount)}.`
        );
      }

      await i.update({ embeds: [resultEmbed], components: [disabledRow] });
      session.unlock(p1Id);
      collector.stop('completed');
    });

    collector.on('end', async (_, reason) => {
      session.unlock(p1Id);
      if (reason === 'time') {
        await UserService.addDongAtomic(p1Id, betAmount);
        await replyMsg.edit({ content: '⏰ Hết giờ! Đã hoàn tiền cược.', components: [] });
      }
    });

    return;
  }

  // --- TRƯỜNG HỢP 2: CHƠI PVP VỚI NGƯỜI CHƠI KHÁC ---
  const p2Id = targetUser.id;
  if (p2Id === p1Id) {
    session.unlock(p1Id);
    await UserService.addDongAtomic(p1Id, betAmount);
    await message.reply('❌ Bạn không thể tự thách đấu chính mình!');
    return;
  }

  if (!session.lock(p2Id)) {
    session.unlock(p1Id);
    await UserService.addDongAtomic(p1Id, betAmount);
    await message.reply(`❌ **${targetUser.username}** đang trong một trận đấu khác!`);
    return;
  }

  // Trừ tiền P2
  const p2Success = await UserService.deductDongAtomic(p2Id, betAmount);
  if (!p2Success) {
    session.unlock(p1Id);
    session.unlock(p2Id);
    await UserService.addDongAtomic(p1Id, betAmount);
    await message.reply(`❌ **${targetUser.username}** không đủ ${formatDong(betAmount)} để chấp nhận lời thách đấu!`);
    return;
  }

  const pvpRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('pvp_keo').setLabel('Kéo').setEmoji('✌️').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('pvp_bua').setLabel('Búa').setEmoji('✊').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('pvp_bao').setLabel('Bao').setEmoji('✋').setStyle(ButtonStyle.Primary)
  );

  let p1Choice: Move | null = null;
  let p2Choice: Move | null = null;

  const embed = createDongSonEmbed()
    .setTitle('⚔️ ĐẠI CHIẾN OẰN TÙ TÌ (PVP)')
    .setDescription(
      `Thách đấu giữa **<@${p1Id}>** và **<@${p2Id}>**!\nMức cược tổng hũ: ${formatDong(
        betAmount * 2
      )}\n\nCả hai hãy bấm chọn nước đi bí mật dưới đây trong vòng **60 giây**:`
    );

  const replyMsg = await message.reply({ embeds: [embed], components: [pvpRow] });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === p1Id || i.user.id === p2Id,
  });

  collector.on('collect', async (i) => {
    const move = i.customId.replace('pvp_', '') as Move;

    if (i.user.id === p1Id) {
      if (p1Choice) {
        await i.reply({ content: 'Bạn đã chọn nước đi rồi!', ephemeral: true });
        return;
      }
      p1Choice = move;
      await i.reply({ content: `Bạn đã kín đáo chọn: ${MOVE_NAMES[move].emoji} ${MOVE_NAMES[move].name}`, ephemeral: true });
    } else if (i.user.id === p2Id) {
      if (p2Choice) {
        await i.reply({ content: 'Bạn đã chọn nước đi rồi!', ephemeral: true });
        return;
      }
      p2Choice = move;
      await i.reply({ content: `Bạn đã kín đáo chọn: ${MOVE_NAMES[move].emoji} ${MOVE_NAMES[move].name}`, ephemeral: true });
    }

    if (p1Choice && p2Choice) {
      const winner = getWinner(p1Choice, p2Choice);
      const totalPot = betAmount * 2;

      const resultEmbed = createDongSonEmbed().setTitle('🏆 KẾT QUẢ ĐẠI CHIẾN OẰN TÙ TÌ');

      if (winner === 'p1') {
        await UserService.addDongAtomic(p1Id, totalPot);
        resultEmbed.setDescription(
          `<@${p1Id}>: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n<@${p2Id}>: ${MOVE_NAMES[p2Choice].emoji} **${MOVE_NAMES[p2Choice].name}**\n\n🎉 **<@${p1Id}> THẮNG TRẬN!** Nhận toàn bộ ${formatDong(totalPot)}!`
        );
      } else if (winner === 'p2') {
        await UserService.addDongAtomic(p2Id, totalPot);
        resultEmbed.setDescription(
          `<@${p1Id}>: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n<@${p2Id}>: ${MOVE_NAMES[p2Choice].emoji} **${MOVE_NAMES[p2Choice].name}**\n\n🎉 **<@${p2Id}> THẮNG TRẬN!** Nhận toàn bộ ${formatDong(totalPot)}!`
        );
      } else {
        await UserService.addDongAtomic(p1Id, betAmount);
        await UserService.addDongAtomic(p2Id, betAmount);
        resultEmbed.setDescription(
          `Cả hai cùng chọn: ${MOVE_NAMES[p1Choice].emoji} **${MOVE_NAMES[p1Choice].name}**\n\n🤝 **HÒA TRẬN!** Hoàn tiền cược cho cả hai.`
        );
      }

      session.unlock(p1Id);
      session.unlock(p2Id);

      const disabledRow = new ActionRowBuilder<ButtonBuilder>();
      pvpRow.components.forEach((btn) => disabledRow.addComponents(ButtonBuilder.from(btn).setDisabled(true)));

      await replyMsg.edit({ embeds: [resultEmbed], components: [disabledRow] });
      collector.stop('completed');
    }
  });

  collector.on('end', async (_, reason) => {
    session.unlock(p1Id);
    session.unlock(p2Id);
    if (reason === 'time' && (!p1Choice || !p2Choice)) {
      await UserService.addDongAtomic(p1Id, betAmount);
      await UserService.addDongAtomic(p2Id, betAmount);
      await replyMsg.edit({ content: '⏰ Đã hết 60 giây! Trận đấu bị hủy và hoàn tiền cược.', components: [] });
    }
  });
}
