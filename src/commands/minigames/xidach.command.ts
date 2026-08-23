import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { BlackjackEngine, Card } from '../../game/engines/BlackjackEngine';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function xiDachCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  // 1. Parse cược
  let betAmount = parseInt(args[0], 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vn xidach [số tiền cược]` (Ví dụ: `vn xidach 200`)');
    return;
  }

  // 2. Session Lock
  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một phiên cược / trận đấu chưa kết thúc! Hãy hoàn tất trước.');
    return;
  }

  // 3. Trừ tiền cược Atomic
  const deductSuccess = await UserService.deductDongAtomic(userId, betAmount);
  if (!deductSuccess) {
    session.unlock(userId);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để tham gia chơi Xì Dách!`);
    return;
  }

  // Khởi tạo Engine bài
  const engine = new BlackjackEngine();
  const playerCards: Card[] = [engine.drawCard(), engine.drawCard()];
  const dealerCards: Card[] = [engine.drawCard(), engine.drawCard()];

  let playerHand = BlackjackEngine.evaluateHand(playerCards);
  let dealerHand = BlackjackEngine.evaluateHand(dealerCards);

  // Tạo ActionRow 3 Nút bấm
  const buildActionRow = (allowDouble = true) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('xidach_hit')
        .setLabel('🃏 Rút Bài (Hit)')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('xidach_stand')
        .setLabel('🛑 Dừng (Stand)')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('xidach_double')
        .setLabel('⚡ Gấp Đôi (Double)')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(!allowDouble)
    );
  };

  const createStatusEmbed = (hideDealer = true, customTitle?: string, customDesc?: string) => {
    const embed = createDongSonEmbed()
      .setTitle(customTitle || '🃏 XÌ DÁCH BANH BÀI 21 ĐIỂM')
      .setDescription(customDesc || `Mức cược hiện tại: ${formatDong(betAmount)}`);

    const dealerDisplayCards = BlackjackEngine.formatCards(dealerCards, hideDealer);
    const dealerScoreStr = hideDealer ? '❓' : `${dealerHand.total} điểm`;

    embed.addFields(
      {
        name: `🏦 Nhà Cái (${dealerScoreStr})`,
        value: dealerDisplayCards,
        inline: false,
      },
      {
        name: `👤 Bạn (${playerHand.total} điểm - ${playerHand.type})`,
        value: BlackjackEngine.formatCards(playerCards),
        inline: false,
      }
    );

    return embed;
  };

  // Kiểm tra Xì Bàng / Xì Dách đầu trận
  if (playerHand.type === 'XI_BANG' || playerHand.type === 'XI_DACH' || dealerHand.type === 'XI_BANG' || dealerHand.type === 'XI_DACH') {
    const comparison = BlackjackEngine.compareHands(playerHand, dealerHand);
    const payout = Math.floor(betAmount * comparison.multiplier);
    if (payout > 0) await UserService.addDongAtomic(userId, payout);

    const embed = createStatusEmbed(false, '💥 KẾT THÚC VÁN BÀI NGAY ĐẦU VÁN!');
    embed.addFields({
      name: '📢 Kết Quả',
      value: `${comparison.reason}\n${payout > 0 ? `Nhận về: ${formatDong(payout)}` : ''}`,
      inline: false,
    });

    session.unlock(userId);
    await message.reply({ embeds: [embed] });
    return;
  }

  // Gửi thông báo bắt đầu
  const replyMsg = await message.reply({
    embeds: [createStatusEmbed(true)],
    components: [buildActionRow(true)],
  });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  const finishGame = async (i: any, isDouble = false) => {
    // Nhà cái rút bài nếu < 17
    while (dealerHand.total < 17 && dealerHand.type !== 'QUAC' && dealerHand.type !== 'NGU_LINH') {
      dealerCards.push(engine.drawCard());
      dealerHand = BlackjackEngine.evaluateHand(dealerCards);
    }

    const currentBet = isDouble ? betAmount * 2 : betAmount;
    const comparison = BlackjackEngine.compareHands(playerHand, dealerHand);
    const payout = Math.floor(currentBet * comparison.multiplier);

    if (payout > 0) {
      await UserService.addDongAtomic(userId, payout);
    }

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('d_hit').setLabel('🃏 Rút Bài').setStyle(ButtonStyle.Primary).setDisabled(true),
      new ButtonBuilder().setCustomId('d_stand').setLabel('🛑 Dừng').setStyle(ButtonStyle.Success).setDisabled(true),
      new ButtonBuilder().setCustomId('d_double').setLabel('⚡ Gấp Đôi').setStyle(ButtonStyle.Danger).setDisabled(true)
    );

    const endEmbed = createStatusEmbed(false, '🏁 KẾT THÚC VÁN BÀI XÌ DÁCH');
    endEmbed.addFields({
      name: '🏆 Kết Quả Trận Đấu',
      value: `${comparison.reason}\n${payout > 0 ? `Tổng nhận về: ${formatDong(payout)}` : `Mất: ${formatDong(currentBet)}`}`,
      inline: false,
    });

    await i.update({ embeds: [endEmbed], components: [disabledRow] });
    session.unlock(userId);
    collector.stop('completed');
  };

  collector.on('collect', async (i) => {
    const action = i.customId;

    if (action === 'xidach_hit') {
      playerCards.push(engine.drawCard());
      playerHand = BlackjackEngine.evaluateHand(playerCards);

      // Nếu quắc hoặc đủ 5 lá (Ngũ linh), tự động kết thúc ván
      if (playerHand.isBust || playerCards.length === 5 || playerHand.total === 21) {
        await finishGame(i, false);
      } else {
        await i.update({
          embeds: [createStatusEmbed(true)],
          components: [buildActionRow(false)], // Không được gấp đôi sau khi đã rút
        });
      }
    } else if (action === 'xidach_stand') {
      await finishGame(i, false);
    } else if (action === 'xidach_double') {
      // Thử trừ thêm tiền cược gấp đôi
      const hasMoney = await UserService.deductDongAtomic(userId, betAmount);
      if (!hasMoney) {
        await i.reply({ content: `❌ Bạn không đủ ${formatDong(betAmount)} để cược Gấp Đôi!`, ephemeral: true });
        return;
      }
      playerCards.push(engine.drawCard());
      playerHand = BlackjackEngine.evaluateHand(playerCards);
      await finishGame(i, true);
    }
  });

  collector.on('end', async (_, reason) => {
    session.unlock(userId);
    if (reason === 'time') {
      await UserService.addDongAtomic(userId, betAmount);
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('d_hit').setLabel('🃏 Rút Bài').setStyle(ButtonStyle.Primary).setDisabled(true),
        new ButtonBuilder().setCustomId('d_stand').setLabel('🛑 Dừng').setStyle(ButtonStyle.Success).setDisabled(true),
        new ButtonBuilder().setCustomId('d_double').setLabel('⚡ Gấp Đôi').setStyle(ButtonStyle.Danger).setDisabled(true)
      );
      await replyMsg.edit({
        content: '⏰ **Đã hết 60 giây!** Ván bài hủy và đã hoàn tiền cược.',
        components: [disabledRow],
      });
    }
  });
}
