import { Message } from 'discord.js';
import { GatheringService } from '../../game/services/GatheringService';
import { CooldownEngine } from '../../game/engines/CooldownEngine';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function donCuiCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  // Cooldown 3m (180,000 ms)
  const cooldownCheck = CooldownEngine.checkCooldown(user, 'don_cui', 180000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  const { itemsGained } = await GatheringService.woodcut(userId);
  await UserService.updateCooldownAtomic(userId, 'don_cui', Date.now());

  // Thưởng thêm +50 EXP cho lao động đốn củi
  await UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);

  const itemStr = itemsGained.map((i) => `🪵 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');

  const embed = createDongSonEmbed()
    .setTitle('🪓 CHOP — ĐỐN CỦI TRONG RỪNG THÂM')
    .setDescription(
      `Bạn vung rìu đốn củi trong đồi tre quê hương và thu hoạch được:\n\n${itemStr}\n\n` +
        `✨ **Thưởng Lao Động:** **+50 EXP**!`
    );

  await message.reply({ embeds: [embed] });
}
