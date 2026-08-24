import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { CooldownEngine } from '../../game/engines/CooldownEngine';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function thamHiemCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserModelAdvanced.findOne({ userId });

  if (!user || !user.hePhai) {
    await message.reply('❌ Bạn chưa khởi tạo nhân vật! Hãy gõ `vkl batdau`.');
    return;
  }

  const cooldownCheck = CooldownEngine.checkCooldown(user, 'thamhiem', 300000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  await UserService.updateCooldownAtomic(userId, 'thamhiem', Date.now());

  const rand = Math.random();
  const embed = createDongSonEmbed().setTitle('🌄 THÁM HIỂM VÙNG ĐẤT CỔ');

  if (rand < 0.4) {
    const dongFound = Math.floor(Math.random() * 3000) + 1000;
    await UserService.addDongAtomic(userId, dongFound);
    embed.setDescription(`Bạn băng qua rừng thâm và phát hiện một hũ tiền đồng cổ chứa ${formatDong(dongFound)}!`);
  } else if (rand < 0.7) {
    await UserService.addItemAtomic(userId, 'go_tram_huong', 2);
    embed.setDescription('Bạn nhặt được 🪵 **Gỗ Trầm Hương x2** bên ngọn thác Ba Vì!');
  } else if (rand < 0.9) {
    await UserService.addItemAtomic(userId, 'ruong_bac', 1);
    embed.setDescription('✨ **MAY MẮN!** Bạn thám hiểm phát hiện **1 Rương Bạc Thượng Cổ**!');
  } else {
    await UserService.addItemAtomic(userId, 'bua_cuong_hoa_2', 1);
    embed.setDescription('🔮 Bạn phát hiện hang đá thần ma và nhặt được **1 Bùa Cường Hóa +2**!');
  }

  await message.reply({ embeds: [embed] });
}
