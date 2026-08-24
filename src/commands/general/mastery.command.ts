import { Message } from 'discord.js';
import { UserService } from '../../game/services/UserService';
import { MasteryService } from '../../game/services/MasteryService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function masteryCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const username = message.author.username;
  const user = await UserService.getOrCreateUser(userId);

  const masteryData = MasteryService.getMasteryInfo(user);

  const embed = createDongSonEmbed()
    .setTitle(`📜 BẢNG MỆNH ĐỀ THÔNG THẠO NGHỀ (DESTINY BOARD) — ${username.toUpperCase()}`)
    .setDescription(
      `🏛️ **HỆ THỐNG THÔNG THẠO CHUYÊN MÔN NGHỀ (ALBION DESTINY BOARD):**\n` +
        `Thực hiện công việc chuyên môn (\`vkl m\`, \`vkl brew\`, \`vkl craft\`, \`vkl w\`) để tích lũy **Mastery EXP** thăng cấp nghề!\n\n` +
        `🪨 **MINER (Thợ Mỏ):**\n` +
        `• Cấp Thông Thạo: **Level ${masteryData.miner.level}** (\`${masteryData.miner.exp} / ${masteryData.miner.maxExp} EXP\`)\n` +
        `• Special Perks: ${masteryData.miner.perks.join(' | ')}\n\n` +
        `🧪 **ALCHEMIST (Thợ Bào Chế):**\n` +
        `• Cấp Thông Thạo: **Level ${masteryData.alchemist.level}** (\`${masteryData.alchemist.exp} / ${masteryData.alchemist.maxExp} EXP\`)\n` +
        `• Special Perks: ${masteryData.alchemist.perks.join(' | ')}\n\n` +
        `🔨 **BLACKSMITH (Thợ Rèn):**\n` +
        `• Cấp Thông Thạo: **Level ${masteryData.blacksmith.level}** (\`${masteryData.blacksmith.exp} / ${masteryData.blacksmith.maxExp} EXP\`)\n` +
        `• Special Perks: ${masteryData.blacksmith.perks.join(' | ')}\n\n` +
        `✨ **PHẨM CHẤT NGUYÊN LIỆU & TRANG BỊ (.1 / .2 / .3 ENCHANTMENT):**\n` +
        `• **.0 Thường:** Chỉ số gốc 100%\n` +
        `• 🟢 **.1 Uncommon:** Tăng **+20% Chỉ Số** (ATK/DEF/HP)\n` +
        `• 🔵 **.2 Rare:** Tăng **+45% Chỉ Số** (ATK/DEF/HP)\n` +
        `• 🟣 **.3 Exceptional:** Tăng **+75% Chỉ Số** (ATK/DEF/HP) + Phẩm chất Tuyệt Phẩm!`
    );

  await message.reply({ embeds: [embed] });
}
