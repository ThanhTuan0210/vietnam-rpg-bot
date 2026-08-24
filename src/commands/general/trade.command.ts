import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function tradeCommand(message: Message, args: string[]): Promise<void> {
  const targetUser = message.mentions.users.first();

  if (!targetUser) {
    await message.reply('⚠️ **Vui lòng tag người chơi cần giao dịch!**\n*VD:* `vkl trade @ThanhTuan`');
    return;
  }

  if (targetUser.id === message.author.id) {
    await message.reply('⚠️ Bạn không thể giao dịch với chính mình!');
    return;
  }

  const sender = await UserService.getOrCreateUser(message.author.id);
  const receiver = await UserService.getOrCreateUser(targetUser.id);

  const embed = createDongSonEmbed()
    .setTitle('🛍️ PHÒNG GIAO DỊCH TRỰC TIẾP 1-1 (MEDIEVAL TRADE)')
    .setDescription(
      `👥 **Bên A (Khởi xướng):** ${message.author.username}\n` +
        `👥 **Bên B (Được mời):** ${targetUser.username}\n\n` +
        `🤝 **Cửa Sổ Thương Lượng Giao Thương:**\n` +
        `• Cả 2 bên hãy xác nhận đồng ý mở cửa sổ trao đổi nguyên liệu/vũ khí bằng Nút bấm dưới đây.\n` +
        `• Thợ Đào Mỏ có thể đổi Quặng lấy Dược Phép từ Thợ Bào Chế hoặc Cuốc từ Thợ Rèn!`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('trade_accept').setLabel('✅ Đồng Ý Giao Dịch').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('trade_cancel').setLabel('❌ Hủy Giao Dịch').setStyle(ButtonStyle.Danger)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
