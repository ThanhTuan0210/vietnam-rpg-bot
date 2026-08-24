import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function suDoCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const subCmd = args[0]?.toLowerCase();

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl batdau`.');
    return;
  }

  if (subCmd === 'nhan') {
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply('⚠️ **Cú pháp:** `vkl sudo nhan @User` (Nhận Đệ tử dưới Cấp 25)');
      return;
    }

    if (user.canhGioi.capDo < 50) {
      await message.reply('❌ Bạn cần đạt **Cảnh giới Kim Đan Kỳ (Level 50+)** mới đủ tư cách làm Sư Phụ!');
      return;
    }

    const disciple = await UserModelAdvanced.findOne({ userId: targetUser.id });
    if (!disciple || disciple.canhGioi.capDo >= 25) {
      await message.reply('❌ Người chơi này đã vượt quá Cấp 25, không thể nhận làm Đệ tử!');
      return;
    }

    const currentDeTu = user.suDo?.deTuIds || [];
    if (currentDeTu.length >= 2) {
      await message.reply('❌ Sư phụ chỉ có thể nhận tối đa 2 Đệ tử!');
      return;
    }

    await UserModelAdvanced.updateOne(
      { userId },
      { $push: { 'suDo.deTuIds': targetUser.id } }
    );
    await UserModelAdvanced.updateOne(
      { userId: targetUser.id },
      { $set: { 'suDo.suPhuId': userId } }
    );

    const embed = createDongSonEmbed()
      .setTitle('🤝 BÁI SƯ THÀNH CÔNG!')
      .setDescription(
        `**<@${targetUser.id}>** đã bái **<@${userId}>** làm Sư Phụ!\n\n` +
          `✨ **Nội tại Sư Phụ Trợ Chiến:** Đệ tử được tự động cộng thêm **15% chỉ số của Sư phụ** khi đi săn!`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // Mặc định hiển thị danh sách Sư Đồ
  const deTuCount = user.suDo?.deTuIds?.length || 0;
  const diemCongDuc = user.suDo?.diemCongDuc || 0;

  const embed = createDongSonEmbed()
    .setTitle('☯️ HỆ THỐNG SƯ ĐỒ & TRUYỀN THỪA')
    .setDescription(
      `Sư Phụ: ${user.suDo?.suPhuId ? `<@${user.suDo.suPhuId}>` : '*(Chưa bái sư)*'}\n` +
        `Đệ Tử: **${deTuCount}/2** Người\n` +
        `✨ **Điểm Công Đức:** **${diemCongDuc} điểm**\n\n` +
        `• \`vkl sudo nhan @User\` : Nhận người chơi cấp thấp làm Đệ tử (Sư phụ Level 50+, Đệ tử < Level 25)`
    );

  await message.reply({ embeds: [embed] });
}
