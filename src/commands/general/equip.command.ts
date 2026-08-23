import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function equipCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const rawInput = args.join(' ').trim().toLowerCase();

  if (!rawInput) {
    const embed = createDongSonEmbed()
      .setTitle('🥋 HƯỚNG DẪN MẶC & THÁO TRANG BỊ')
      .setDescription('Vui lòng nhập đúng cú pháp để mặc trang bị từ túi đồ:')
      .addFields(
        {
          name: '🥋 Mặc Trang Bị (Equip)',
          value: '• `vn equip [mã_id]` hoặc `vn dung [mã_id]`\n*Ví dụ: `vn equip dao_mac_dong` hoặc `vn dung basic armor`*',
          inline: false,
        },
        {
          name: '🥋 Cởi / Tháo Trang Bị (Unequip)',
          value: '• `vn unequip vukhi` hoặc `vn thao vukhi` (Tháo vũ khí cất túi)\n• `vn unequip aogiap` hoặc `vn thao aogiap` (Tháo áo giáp cất túi)',
          inline: false,
        }
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // Ánh xạ Alias Tên Tiếng Anh sang ID Vật Phẩm CSDL
  const aliases: Record<string, string> = {
    wooden_sword: 'dao_tre_gai',
    'wooden sword': 'dao_tre_gai',
    basic_sword: 'gay_tam_vong',
    'basic sword': 'gay_tam_vong',
    basic_armor: 'ao_vai_tho',
    'basic armor': 'ao_vai_tho',
    fish_armor: 'ao_la_chuoi',
    'fish armor': 'ao_la_chuoi',
    zombie_sword: 'dao_mac_dong',
    'zombie sword': 'dao_mac_dong',
    ruby_sword: 'kiem_sat_ba_vi',
    'ruby sword': 'kiem_sat_ba_vi',
    epic_armor: 'giap_sat_trao_phong',
    'epic armor': 'giap_sat_trao_phong',
  };

  const itemId = aliases[rawInput] || rawInput.replace(/ +/g, '_');

  const result = await UserService.equipItemAtomic(userId, itemId);
  if (result.embed) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}

export async function unequipCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const slotInput = args[0]?.toLowerCase();

  if (slotInput !== 'vukhi' && slotInput !== 'aogiap' && slotInput !== 'sword' && slotInput !== 'armor') {
    const embed = createDongSonEmbed()
      .setTitle('🥋 HƯỚNG DẪN CỞI / THÁO TRANG BỊ')
      .setDescription('Vui lòng chọn vị trí trang bị muốn tháo cất lại vào túi đồ:')
      .addFields(
        {
          name: '🗡️ Tháo Vũ Khí',
          value: '• `vn unequip vukhi` (hoặc `vn thao vukhi` / `vn unequip sword`)',
          inline: true,
        },
        {
          name: '🥋 Tháo Áo Giáp',
          value: '• `vn unequip aogiap` (hoặc `vn thao aogiap` / `vn unequip armor`)',
          inline: true,
        }
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  const slotType = slotInput === 'vukhi' || slotInput === 'sword' ? 'vukhi' : 'aogiap';

  const result = await UserService.unequipItemAtomic(userId, slotType);
  if (result.embed) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
