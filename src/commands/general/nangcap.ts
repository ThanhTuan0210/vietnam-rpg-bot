import { Message } from 'discord.js';
import { GatheringService } from '../../game/services/GatheringService';
import { UserModelAdvanced } from '../../database/models/User.model';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function nangCapToolCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const toolInput = args[0]?.toLowerCase();

  const mapTool: Record<string, 'riu' | 'canCau' | 'cuoc' | 'gioThuoc'> = {
    riu: 'riu',
    cancau: 'canCau',
    cuoc: 'cuoc',
    gio: 'gioThuoc',
    giothuoc: 'gioThuoc',
  };

  const toolType = mapTool[toolInput];

  if (!toolType) {
    const user = await UserModelAdvanced.findOne({ userId });
    const dungCu = user?.dungCu || { riu: 1, canCau: 1, cuoc: 1, gioThuoc: 1 };

    const embed = createDongSonEmbed()
      .setTitle('🪓 NÂNG CẤP DỤNG CỤ LAO ĐỘNG')
      .setDescription(
        `Cấp độ dụng cụ hiện tại của bạn:\n` +
          `• 🪓 Rìu đốn củi: **Bậc ${dungCu.riu}** (\`vkl nangcap riu\`)\n` +
          `• 🎣 Cần câu cá: **Bậc ${dungCu.canCau}** (\`vkl nangcap cancau\`)\n` +
          `• ⛏️ Cuốc khai mỏ: **Bậc ${dungCu.cuoc}** (\`vkl nangcap cuoc\`)\n` +
          `• 🧺 Giỏ hái thuốc: **Bậc ${dungCu.gioThuoc}** (\`vkl nangcap gio\`)\n\n` +
          `*Dụng cụ bậc cao giúp tăng sản lượng thu hoạch và mở khóa nguyên liệu quý hiếm!*`
      );

    await message.reply({ embeds: [embed] });
    return;
  }

  const res = await GatheringService.upgradeTool(userId, toolType);
  await message.reply(res.message);
}
