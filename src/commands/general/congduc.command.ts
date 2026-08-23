import { Message } from 'discord.js';
import { UserModelAdvanced } from '../../database/models/User.model';
import { AreaBossService } from '../../game/services/AreaBossService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export async function congDucCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;
  const subCmd = args[0]?.toLowerCase();

  if (subCmd === 'mua' || subCmd === 'doi') {
    const amount = parseInt(args[1], 10) || 1;
    const res = await AreaBossService.buyMeritPoints(userId, amount);
    await message.reply(res.message);
    return;
  }

  // Hiển thị Điểm Công Đức hiện tại
  const user = await UserModelAdvanced.findOne({ userId });
  if (!user) return;

  const currentMerit = user.suDo?.diemCongDuc || 0;

  const embed = createDongSonEmbed()
    .setTitle('⛩️ ĐIỂM CÔNG ĐỨC & PHONG ẤN THẦN MA')
    .setDescription(
      `✨ Điểm Công Đức Hiện Tại: **${currentMerit} Điểm**\n\n` +
        `💡 **CÔNG DỤNG ĐIỂM CÔNG ĐỨC:**\n` +
        `• Dùng làm ấn chú giải mở Trận Pháp Phong Ấn để khiêu chiến **Boss Trùm Vùng** (\`vn boss\`).\n` +
        `• Đả bại Boss Vùng sẽ giúp bạn **Đột phá sang Khu Vực tiếp theo** (\`khuVuc +1\`)!\n\n` +
        `📜 **QUY ĐỔI CÔNG ĐỨC:**\n` +
        `• **100,000 Đồng** = **1 Điểm Công Đức**\n` +
        `• Cú pháp: \`vn congduc mua [số_lượng]\``
    );

  await message.reply({ embeds: [embed] });
}
