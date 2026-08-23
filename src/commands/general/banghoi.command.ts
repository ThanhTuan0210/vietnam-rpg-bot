import { Message } from 'discord.js';
import { GuildModel } from '../../database/models/Guild.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function bangHoiCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const subCommand = args[0]?.toLowerCase();

  if (subCommand === 'tao') {
    const guildName = args.slice(1).join(' ');
    if (!guildName) {
      await message.reply('⚠️ **Cú pháp:** `vn bang tao [tên bang phái]`');
      return;
    }

    const cost = 500000;
    const paid = await UserService.deductDongAtomic(userId, cost);
    if (!paid) {
      await message.reply(`❌ Bạn cần **${formatDong(cost)}** để lập Bang Phái!`);
      return;
    }

    const guildId = `guild_${Date.now()}`;
    await GuildModel.create({
      guildId,
      tenBang: guildName,
      tocTruong: userId,
      thanhVien: [userId],
    });

    const embed = createDongSonEmbed()
      .setTitle('🏛️ THÀNH LẬP BANG PHÁI THÀNH CÔNG!')
      .setDescription(`Chúc mừng **${message.author.username}** đã lập Bang Phái **« ${guildName} »**!`);

    await message.reply({ embeds: [embed] });
    return;
  }

  if (subCommand === 'gop') {
    const amount = parseInt(args[1], 10);
    if (isNaN(amount) || amount <= 0) {
      await message.reply('⚠️ **Cú pháp:** `vn bang gop [số đồng]`');
      return;
    }

    const guild = await GuildModel.findOne({ thanhVien: userId });
    if (!guild) {
      await message.reply('❌ Bạn chưa gia nhập Bang Phái nào!');
      return;
    }

    const paid = await UserService.deductDongAtomic(userId, amount);
    if (!paid) {
      await message.reply(`❌ Bạn không đủ ${formatDong(amount)} để đóng góp!`);
      return;
    }

    guild.khoTaiNguyen.dong += amount;
    // Cứ mỗi 100,000 Đồng gộp vào tăng 1 Cấp Đình Làng
    const levelIncrease = Math.floor(amount / 100000);
    if (levelIncrease > 0) {
      guild.capDoDinhLang += levelIncrease;
      guild.buffBang = `+${guild.capDoDinhLang * 2}% EXP Toàn Bang`;
    }
    await guild.save();

    const embed = createDongSonEmbed()
      .setTitle('🏯 ĐÓNG GÓP ĐÌNH LÀNG BANG PHÁI')
      .setDescription(
        `Bạn đã đóng góp **${formatDong(amount)}** vào Kho Bang!\n\n` +
          `🏰 **Đình Làng:** Cấp ${guild.capDoDinhLang}\n✨ **Buff Bang:** ${guild.buffBang}`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // Mặc định hiển thị thông tin Bang
  const guild = await GuildModel.findOne({ thanhVien: userId });
  if (!guild) {
    const embed = createDongSonEmbed()
      .setTitle('🏰 HỆ THỐNG BANG HỘI ĐẠI VIỆT')
      .setDescription(
        `Bạn chưa gia nhập Bang Phái nào!\n\n` +
          `• \`vn bang tao [tên]\` : Lập Bang Phái mới (${formatDong(500000)})\n` +
          `• \`vn bang gop [số đồng]\` : Đóng góp tài nguyên nâng cấp Đình Làng`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const embed = createDongSonEmbed()
    .setTitle(`🏰 BANG PHÁI — « ${guild.tenBang.toUpperCase()} »`)
    .addFields(
      { name: '👑 Tộc Trưởng', value: `<@${guild.tocTruong}>`, inline: true },
      { name: '👥 Thành Viên', value: `${guild.thanhVien.length} Người`, inline: true },
      { name: '🏯 Đình Làng', value: `Cấp **${guild.capDoDinhLang}** (${guild.buffBang})`, inline: true },
      { name: '💰 Kho Tài Nguyên', value: `${formatDong(guild.khoTaiNguyen.dong)}`, inline: false }
    );

  await message.reply({ embeds: [embed] });
}
