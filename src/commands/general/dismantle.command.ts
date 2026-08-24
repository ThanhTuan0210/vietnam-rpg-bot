import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function dismantleCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const slotType = args[0]?.toLowerCase();

  if (slotType !== 'vukhi' && slotType !== 'aogiap' && slotType !== 'sword' && slotType !== 'armor') {
    await message.reply('⚠️ **Cú pháp phân tách chuẩn Epic RPG:** `vkl dismantle [vukhi / aogiap]` (Ví dụ: `vkl dismantle vukhi`)');
    return;
  }

  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  const targetSlot = slotType === 'vukhi' || slotType === 'sword' ? 'vuKhi' : 'aoGiap';
  const itemSlot = user.trangBi[targetSlot];

  if (!itemSlot || !itemSlot.itemId) {
    await message.reply('❌ Bạn không đeo trang bị nào ở vị trí này để phân tách!');
    return;
  }

  // Rã trang bị thu hồi nguyên liệu & Bùa Cường Hóa
  await UserService.addItemAtomic(userId, 'bua_cuong_hoa_1', 1);
  await UserService.addItemAtomic(userId, 'quang_dong', 5);

  const embed = createDongSonEmbed()
    .setTitle('🔨 PHÂN TÁCH TRANG BỊ — THU HỒI NGUYÊN LIỆU')
    .setDescription(
      `Bạn đã rã trang bị và hoàn trả được:\n\n` +
        `• 🪨 **Quặng Đồng x5** (Thu hồi 50% nguyên liệu đúc)\n` +
        `• 📜 **1 Bùa Cường Hóa +1**!`
    );

  await message.reply({ embeds: [embed] });
}
