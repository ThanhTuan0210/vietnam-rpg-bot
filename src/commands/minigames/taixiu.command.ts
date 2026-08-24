import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { SessionManager } from '../../game/managers/SessionManager';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function taiXiuCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  // Parse tiền cược
  const betAmount = parseInt(args[0], 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    await message.reply('⚠️ **Cú pháp:** `vkl taixiu [số tiền cược]` (Ví dụ: `vkl taixiu 500`)');
    return;
  }

  // Session Lock
  const session = SessionManager.getInstance();
  if (!session.lock(userId)) {
    await message.reply('⚠️ Bạn đang có một bàn cược chưa hoàn thành! Hãy kết thúc trước.');
    return;
  }

  // Trừ tiền cược Atomic
  const deductSuccess = await UserService.deductDongAtomic(userId, betAmount);
  if (!deductSuccess) {
    session.unlock(userId);
    await message.reply(`❌ Bạn không đủ ${formatDong(betAmount)} để tham gia lắc Tài Xỉu!`);
    return;
  }

  // Action Row 2 Nút bấm Tài và Xỉu
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('taixiu_tai')
      .setLabel('🔴 TÀI (11 - 17 Điểm)')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('taixiu_xiu')
      .setLabel('🔵 XỈU (4 - 10 Điểm)')
      .setStyle(ButtonStyle.Primary)
  );

  const embed = createDongSonEmbed()
    .setTitle('🎲 LẮC TÀI XỈU DÂN GIAN')
    .setDescription(
      `Mức cược: ${formatDong(
        betAmount
      )}\n\nHãy chọn **🔴 TÀI** hoặc **🔵 XỈU** bên dưới trong vòng **60 giây**:`
    );

  const replyMsg = await message.reply({ embeds: [embed], components: [row] });

  const collector = replyMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
    filter: (i) => i.user.id === userId,
  });

  collector.on('collect', async (i) => {
    const choice = i.customId.replace('taixiu_', ''); // 'tai' | 'xiu'

    // Lắc 3 viên xúc xắc (1 - 6)
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const d3 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2 + d3;

    const isTriple = d1 === d2 && d2 === d3; // Bộ ba đồng nhất (Bão)
    let outcome: 'tai' | 'xiu' | 'bao' = sum >= 11 ? 'tai' : 'xiu';
    if (isTriple) outcome = 'bao';

    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('disabled_tai')
        .setLabel('🔴 TÀI (11 - 17)')
        .setStyle(choice === 'tai' ? ButtonStyle.Danger : ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('disabled_xiu')
        .setLabel('🔵 XỈU (4 - 10)')
        .setStyle(choice === 'xiu' ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(true)
    );

    const resultEmbed = createDongSonEmbed();

    if (isTriple) {
      // Bão -> Nhà cái ăn hết!
      resultEmbed.setTitle('🌪️ XUẤT HIỆN BÃO ĐỒNG NHẤT (3 MẶT GIONG NHAU)!');
      resultEmbed.setDescription(
        `🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm**\n\n` +
          `⚡ **BÃO ĐỒNG NHẤT (${d1}-${d2}-${d3})!** Theo luật sòng bài, nhà cái nuốt trọn! Bạn mất ${formatDong(
            betAmount
          )}.`
      );
    } else if (choice === outcome) {
      // Thắng x2
      const winTotal = betAmount * 2;
      await UserService.addDongAtomic(userId, winTotal);

      resultEmbed.setTitle('🎉 KẾT QUẢ: BẠN ĐÃ THẮNG CƯỢC!');
      resultEmbed.setDescription(
        `🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm** (${outcome.toUpperCase()})\n\n` +
          `✨ Bạn đoán đúng **${choice.toUpperCase()}**! Nhận lại ${formatDong(winTotal)} (Lời +${formatDong(
            betAmount
          )})!`
      );
    } else {
      // Thua
      resultEmbed.setTitle('💸 KẾT QUẢ: THỦI THỦI CẢNH LÀNG');
      resultEmbed.setDescription(
        `🎲 **Xúc xắc:** [ ${d1} ] [ ${d2} ] [ ${d3} ] ➔ Tổng: **${sum} điểm** (${outcome.toUpperCase()})\n\n` +
          `❌ Bạn đoán **${choice.toUpperCase()}** nhưng kết quả là **${outcome.toUpperCase()}**! Mất ${formatDong(
            betAmount
          )}.`
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
      const disabledRow = new ActionRowBuilder<ButtonBuilder>();
      row.components.forEach((btn) => disabledRow.addComponents(ButtonBuilder.from(btn).setDisabled(true)));
      await replyMsg.edit({
        content: '⏰ **Đã hết 60 giây!** Phiên Tài Xỉu đã hủy, tiền cược đã được hoàn lại.',
        components: [disabledRow],
      });
    }
  });
}
