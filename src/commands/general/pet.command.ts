import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { getItemIcon } from '../../game/data/items';
import { formatDong } from '../../utils/formatters';

interface MedievalPetDef {
  id: string;
  name: string;
  icon: string;
  price: number;
  type: string;
  buffDesc: string;
}

const MEDIEVAL_PETS: Record<string, MedievalPetDef> = {
  dragon: {
    id: 'dragon',
    name: 'Rồng Lửa Gothic',
    icon: '🐉',
    price: 25000,
    type: 'Thần Thoại',
    buffDesc: '+20% Sát Thương ATK Ngục Tối & +15% Sản Lượng Quặng khi Đào Mỏ (Miner)',
  },
  wolf: {
    id: 'wolf',
    name: 'Sói Rừng Âm Linh',
    icon: '🐺',
    price: 15000,
    type: 'Sử Thi',
    buffDesc: '+10% Bạo Kích Crit & +10% Sản Lượng Thuốc khi Bào Chế (Alchemist)',
  },
  horse: {
    id: 'horse',
    name: 'Chiến Mã Thép Kị Sĩ',
    icon: '🐴',
    price: 10000,
    type: 'Hiếm',
    buffDesc: '+150 Max HP Sinh Lực & -10% Phí Vàng khi Rèn Đồ (Blacksmith)',
  },
  eagle: {
    id: 'eagle',
    name: 'Ưng Tiên Tri Gothic',
    icon: '🦅',
    price: 15000,
    type: 'Sử Thi',
    buffDesc: '+15% Né Tránh Dodge & +15% Tỷ Lệ Rớt Rương Báu Ngục Tối',
  },
};

export async function petCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);
  const subCommand = args[0]?.toLowerCase();

  // 1. NHẬN NUÔI LINH THÚ: vkl pet adp <dragon|wolf|horse|eagle>
  if (subCommand === 'adp' || subCommand === 'adopt' || subCommand === 'nhan') {
    const targetPetId = args[1]?.toLowerCase();
    const petDef = MEDIEVAL_PETS[targetPetId];

    if (!petDef) {
      await message.reply(
        '⚠️ **Linh thú không hợp lệ!** Chọn 1 trong 4 Linh Thú Trung Cổ:\n' +
          '• `vkl pet adp dragon` (🐉 Rồng Lửa Gothic - 25k Vàng)\n' +
          '• `vkl pet adp wolf` (🐺 Sói Rừng Âm Linh - 15k Vàng)\n' +
          '• `vkl pet adp horse` (🐴 Chiến Mã Thép Kị Sĩ - 10k Vàng)\n' +
          '• `vkl pet adp eagle` (🦅 Ưng Tiên Tri Gothic - 15k Vàng)'
      );
      return;
    }

    if (user.taiChinh.dong < petDef.price) {
      await message.reply(`⚠️ **Không đủ Tiền Vàng!** Bạn cần **${formatDong(petDef.price)}** để nhận nuôi ${petDef.icon} **${petDef.name}**.`);
      return;
    }

    user.taiChinh.dong -= petDef.price;
    (user as any).petType = petDef.id;
    (user as any).petLevel = 1;
    await user.save();

    const embed = createDongSonEmbed()
      .setTitle('🐣 NHẬN NUÔI LINH THÚ THÀNH CÔNG!')
      .setDescription(
        `🎉 **Chúc mừng ${message.author.username}!** Bạn đã sở hữu Linh Thú Đồng Hành:\n\n` +
          `${petDef.icon} **Linh Thú:** **${petDef.name}** (Level 1)\n` +
          `✨ **Nội Tại Bá Vương:** ${petDef.buffDesc}\n\n` +
          `💡 *Gõ \`vkl pet feed\` cho Linh Thú ăn Thuốc HP (\`potion_01a\`) để thăng cấp Level Linh Thú!*`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // 2. CHO LINH THÚ ĂN THẮNG CẤP: vkl pet feed
  if (subCommand === 'feed' || subCommand === 'choan') {
    const currentPetId = (user as any).petType;
    if (!currentPetId || currentPetId === 'Chưa Có') {
      await message.reply('⚠️ Bạn chưa nuôi Linh Thú nào! Gõ `vkl pet adp dragon` để nhận nuôi Linh Thú.');
      return;
    }

    const consumed = await UserService.consumeItemAtomic(userId, 'potion_01a', 1);
    if (!consumed) {
      await message.reply('⚠️ Bạn không có **Thuốc Hồi Máu HP** (`potion_01a`) trong Túi Đồ để cho Linh Thú ăn! Mua trong `vkl shop` hoặc nhờ Thợ Bào Chế luyện giúp!');
      return;
    }

    (user as any).petLevel = ((user as any).petLevel || 1) + 1;
    await user.save();

    const petDef = MEDIEVAL_PETS[currentPetId] || { name: currentPetId, icon: '🐾' };
    const embed = createDongSonEmbed()
      .setTitle('🍖 CHO LINH THÚ ĂN THÀNH CÔNG!')
      .setDescription(
        `🎉 **${message.author.username}** đã cho ${petDef.icon} **${petDef.name}** ăn 1x Thuốc HP!\n\n` +
          `📈 **Linh Thú đã tăng lên Level ${(user as any).petLevel}!** Sức mạnh hỗ trợ chuyên môn tăng thêm **+5%**!`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  // 3. HIỂN THỊ TRẠNG THÁI LINH THÚ CURRENT & DANH SÁCH
  const currentPetId = (user as any).petType || '';
  const currentPetLvl = (user as any).petLevel || 0;
  const activePetDef = MEDIEVAL_PETS[currentPetId];

  let petCatalogStr = '';
  Object.values(MEDIEVAL_PETS).forEach((p) => {
    petCatalogStr += `${p.icon} **${p.name}** (\`${p.id}\`): **${formatDong(p.price)}**\n└ *Nội tại:* ${p.buffDesc}\n\n`;
  });

  const embed = createDongSonEmbed()
    .setTitle('🐉 HỆ THỐNG LINH THÚ KỊ SĨ (MEDIEVAL PETS & MOUNTS)')
    .setDescription(
      `👤 **Chủ Nhân:** ${message.author.username}\n` +
        `🐾 **Linh Thú Đang Đồng Hành:** ${activePetDef ? `${activePetDef.icon} **${activePetDef.name}** (Level ${currentPetLvl})` : '`CHƯA CÓ`'}\n` +
        `${activePetDef ? `✨ **Nội Tại Kích Hoạt:** ${activePetDef.buffDesc}\n\n` : '\n'}` +
        `📌 **Cú pháp nhận nuôi Linh Thú:** \`vkl pet adp <dragon|wolf|horse|eagle>\` (VD: \`vkl pet adp dragon\`)\n` +
        `🍖 **Cho Linh Thú ăn thăng cấp:** \`vkl pet feed\`\n\n` +
        `📜 **DANH SÁCH 4 LINH THÚ TRUNG CỔ:**\n\n${petCatalogStr}`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ (vkl p)').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('cmd_tuido').setLabel('🎒 Túi Đồ (vkl i)').setStyle(ButtonStyle.Success)
  );

  await message.reply({ embeds: [embed], components: [row] });
}
