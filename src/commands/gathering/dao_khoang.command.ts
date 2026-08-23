import { Message } from 'discord.js';
import { GatheringService } from '../../game/services/GatheringService';
import { CooldownEngine } from '../../game/engines/CooldownEngine';
import { UserService } from '../../game/services/UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';

export async function daoKhoangCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  // Cooldown 3m (180,000 ms)
  const cooldownCheck = CooldownEngine.checkCooldown(user, 'dao_khoang', 180000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  const { itemsGained } = await GatheringService.mine(userId);
  await UserService.updateCooldownAtomic(userId, 'dao_khoang', Date.now());
  await UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);

  const itemStr = itemsGained.map((i) => `⛏️ **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');

  const embed = createDongSonEmbed()
    .setTitle('⛏️ MINE — KHAI MỎ ĐÀO KHOÁNG THẠCH')
    .setDescription(`Bạn dùng cuốc vung đào sâu lòng núi và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);

  await message.reply({ embeds: [embed] });
}

export async function cauCaCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  // Cooldown 3m (180,000 ms)
  const cooldownCheck = CooldownEngine.checkCooldown(user, 'cau_ca', 180000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  const { itemsGained } = await GatheringService.fish(userId);
  await UserService.updateCooldownAtomic(userId, 'cau_ca', Date.now());
  await UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);

  const itemStr = itemsGained.map((i) => `🐟 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');

  const embed = createDongSonEmbed()
    .setTitle('🎣 FISH — CÂU CÁ BẾN THÔN QUÊ')
    .setDescription(`Bạn thả cần câu bên ao bến sông Hồng và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);

  await message.reply({ embeds: [embed] });
}

export async function haiThuocCommand(message: Message): Promise<void> {
  const userId = message.author.id;
  const user = await UserService.getOrCreateUser(userId);

  // Cooldown 3m (180,000 ms)
  const cooldownCheck = CooldownEngine.checkCooldown(user, 'hai_thuoc', 180000);
  if (!cooldownCheck.isReady) {
    await message.reply(cooldownCheck.message);
    return;
  }

  const { itemsGained } = await GatheringService.gatherHerbs(userId);
  await UserService.updateCooldownAtomic(userId, 'hai_thuoc', Date.now());
  await UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);

  const itemStr = itemsGained.map((i) => `🧺 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');

  const embed = createDongSonEmbed()
    .setTitle('🧺 PICKUP — HÁI THẢO DƯỢC RỪNG NÚI')
    .setDescription(`Bạn đem giỏ lên ngàn hái dược và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);

  await message.reply({ embeds: [embed] });
}

export async function cheDuocCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  const consumed = await UserService.consumeItemAtomic(userId, 'la_thuoc_nam', 3);
  if (!consumed) {
    await message.reply('❌ Bạn không đủ **3 Lá Thuốc Nam** (`la_thuoc_nam`) để luyện chế Bình Kim Đan!');
    return;
  }

  await UserService.addItemAtomic(userId, 'binh_kim_dan', 1);

  const embed = createDongSonEmbed()
    .setTitle('🔮 CHẾ DƯỢC THÀNH CÔNG!')
    .setDescription('Bạn đã luyện chế thành công **1 Bình Kim Đan** (`binh_kim_dan`) (+100% DEF trong 30 phút)!');

  await message.reply({ embeds: [embed] });
}

export async function nauAnCommand(message: Message, args: string[]): Promise<void> {
  const userId = message.author.id;

  const consumed = await UserService.consumeItemAtomic(userId, 'ca_chep_song', 2);
  if (!consumed) {
    await message.reply('❌ Bạn không đủ **2 Cá Chép Sông** (`ca_chep_song`) để nấu Cơm Lam!');
    return;
  }

  await UserService.addItemAtomic(userId, 'com_lam', 1);

  const embed = createDongSonEmbed()
    .setTitle('🍳 NẤU ĂN THÀNH CÔNG!')
    .setDescription('Bạn đã nấu thành công **1 Cơm Lam** (`com_lam`) thơm dẻo linh khí!');

  await message.reply({ embeds: [embed] });
}
