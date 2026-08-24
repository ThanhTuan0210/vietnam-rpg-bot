import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function petCommand(message: Message, args: string[]): Promise<void> {
  const user = await UserService.getOrCreateUser(message.author.id);

  const subCommand = args[0]?.toLowerCase();

  if (subCommand === 'adopt' && args[1]) {
    const petType = args[1].toLowerCase();
    const validPets = ['longvuong', 'cuuviho', 'chimlac'];

    if (!validPets.includes(petType)) {
      await message.reply('⚠️ **Linh thú không hợp lệ!** Chọn 1 trong 3 Linh Thú: `longvuong` (Thần Long nhặt quặng x2), `cuuviho` (+20% Rèn Bạo Tinh), `chimlac` (+15% Né Tránh).');
      return;
    }

    (user as any).petType = petType;
    (user as any).petLevel = 1;
    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('🐣 ẤP TRỨNG LINH THÚ THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã nhận Linh Thú Đồng Hành:\n\n` +
          `🐉 **Linh Thú:** \`${petType.toUpperCase()}\` (Cấp 1)\n` +
          `✨ **Nội Tại:** Tự động hỗ trợ nhặt đồ x2 & buff thuộc tính trong combat!`
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const petType = (user as any).petType || 'Chưa Có';
  const petLevel = (user as any).petLevel || 0;

  const embed = createDongSonEmbed()
    .setTitle('🐉 HỆ THỐNG LINH THÚ ĐỒNG HÀNH (PET MEDIEVAL)')
    .setDescription(
      `👤 **Chủ Nhân:** ${message.author.username}\n` +
        `🐾 **Linh Thú Đang Nuôi:** \`${petType.toUpperCase()}\` (Level ${petLevel})\n\n` +
        `📌 **Hướng dẫn:**\n` +
        `• Bắt Linh thú: \`vn pet adopt <longvuong|cuuviho|chimlac>\``
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Đi Điểm Nhặt Đồ').setStyle(ButtonStyle.Success)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
