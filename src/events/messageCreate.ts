import { Message } from 'discord.js';
import { masterMenuCommand } from '../commands/general/master_menu.command';
import { guideCommand } from '../commands/general/guide.command';
import { eventTestCommand } from '../commands/general/event.command';
import { GatheringService } from '../game/services/GatheringService';
import { UserService } from '../game/services/UserService';
import { createDongSonEmbed } from '../utils/embedBuilder';
import { dungeonCommand } from '../commands/general/dungeon.command';
import { tuiDoCommand } from '../commands/general/tuido';
import { profileCommandAdvanced } from '../commands/general/profile.command';
import { vaultCommand } from '../commands/general/vault.command';
import { tradeCommand } from '../commands/general/trade.command';
import { jobCommand } from '../commands/general/job.command';
import { detuCommand } from '../commands/general/detu.command';
import { petCommand } from '../commands/general/pet.command';
import { cooldownCommand } from '../commands/general/cooldown.command';
import { bxhCommand } from '../commands/general/bxh.command';
import { caoThiCommand } from '../commands/general/caothi.command';
import { diemDanhCommand } from '../commands/general/diemdanh.command';
import { weeklyCommand } from '../commands/general/weekly.command';
import { codeCommand } from '../commands/general/code.command';
import { shopCommand } from '../commands/general/shop.command';
import { banCommand } from '../commands/general/ban.command';
import { useCommand } from '../commands/general/use.command';
import { equipCommand, unequipCommand } from '../commands/general/equip.command';
import { giveCommand } from '../commands/general/give.command';
import { renCommand } from '../commands/general/ren';
import { dismantleCommand } from '../commands/general/dismantle.command';
import { cuongHoaCommand } from '../commands/general/cuonghoa';
import { ghepCommand } from '../commands/general/ghep.command';
import { phaCheCommand } from '../commands/general/phache.command';
import { khamCommand } from '../commands/general/kham.command';
import { nangCapToolCommand } from '../commands/general/nangcap';
import { sanCommandAdvanced } from '../commands/combat/san';
import { thamHiemCommand } from '../commands/combat/thamhiem';
import { duongThuongCommand } from '../commands/general/duongthuong';
import { pvpCommand } from '../commands/combat/pvp.command';
import { leoThapCommandClean } from '../commands/general/LeoThapCommand';
import { bossCommand } from '../commands/general/boss.command';
import { luyenVoCommand } from '../commands/combat/luyenvo';
import { farmCommand } from '../commands/general/farm.command';
import { comboAllCommand } from '../commands/general/combo.command';
import { syncEmojisCommand } from '../commands/general/sync_emojis.command';
import { trungHoiCommand, canCotCommand } from '../commands/general/trunghoi';
import { xinXamCommand } from '../commands/general/xinxam.command';
import { bangHoiCommand } from '../commands/general/banghoi.command';
import { trynaCommand } from '../commands/general/tryna.command';
import { thuongLaiCommand } from '../commands/general/thuonglai.command';
import { bauCuaCommand } from '../commands/minigames/baucua.command';
import { duaLinhThuCommand } from '../commands/minigames/duangua.command';
import { taiXiuCommand } from '../commands/minigames/taixiu.command';
import { xiDachCommand } from '../commands/minigames/xidach.command';
import { oanTuTiCommand } from '../commands/minigames/oantuti.command';
import { choiDoCommand } from '../commands/minigames/choido.command';
import { slotsCommand } from '../commands/minigames/slots.command';
import { rouletteCommand } from '../commands/minigames/roulette.command';

export async function onMessageCreate(message: Message): Promise<void> {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  const lowerContent = content.toLowerCase();

  let matchedPrefix = '';
  if (lowerContent.startsWith('vkl ')) {
    matchedPrefix = 'vkl ';
  } else if (lowerContent === 'vkl' || lowerContent.startsWith('vkl')) {
    matchedPrefix = 'vkl';
  }

  if (!matchedPrefix) return;

  console.log(`📩 [DISCORD COMMAND] ${message.author.tag} (${message.guild.name}): "${content}"`);

  const args = content.slice(matchedPrefix.length).trim().split(/ +/);
  const command = (args.shift() || '').toLowerCase();

  try {
    switch (command) {
      // --- MASTER MENU & GUIDE & EVENT ---
      case '':
      case 'help':
      case 'lenh':
      case 'trogiup':
      case 'start':
      case 'batdau':
      case 'menu':
        await masterMenuCommand(message);
        break;

      case 'guide':
      case 'huongdan':
      case 'lore':
      case 'g':
        await guideCommand(message);
        break;

      case 'event':
      case 'sukien':
      case 'testevent':
        await eventTestCommand(message, args);
        break;

      // --- MAIN SHORTCUTS & ACTION COMMANDS ---
      case 'w':
      case 'work':
      case 'combo':
      case 'c':
      case 'cmb':
      case 'all':
        await comboAllCommand(message);
        break;

      case 'h':
      case 'hunt':
      case 'hnt':
      case 'san': {
        const isHard = args[0]?.toLowerCase() === 'hard' || args[0]?.toLowerCase() === 'kho';
        await sanCommandAdvanced(message, isHard);
        break;
      }

      case 'd':
      case 'dun':
      case 'dungeon':
      case 'nguctoi':
      case 'phuban':
        await dungeonCommand(message, args);
        break;

      case 'i':
      case 'inv':
      case 'inventory':
      case 'tuido':
      case 'kho':
        await tuiDoCommand(message);
        break;

      case 'p':
      case 'pro':
      case 'profile':
      case 'nhanvat':
      case 'stats':
        await profileCommandAdvanced(message);
        break;

      case 'v':
      case 'vlt':
      case 'vault':
      case 'khochung':
        await vaultCommand(message, args);
        break;

      case 't':
      case 'trd':
      case 'trade':
      case 'giaodich':
        await tradeCommand(message, args);
        break;

      case 'job':
      case 'songphai':
        await jobCommand(message, args);
        break;

      case 'detu':
      case 'dtu':
      case 'apprentice':
        await detuCommand(message, args);
        break;

      case 'pet':
      case 'linhthu':
        await petCommand(message, args);
        break;

      // --- PROGRESS & UTILITY COMMANDS ---
      case 'cooldowns':
      case 'cooldown':
      case 'cd':
        await cooldownCommand(message);
        break;

      case 'top':
      case 'leaderboard':
      case 'bxh':
        await bxhCommand(message, args);
        break;

      case 'quest':
      case 'caothi':
        await caoThiCommand(message);
        break;

      case 'daily':
      case 'diemdanh':
        await diemDanhCommand(message);
        break;

      case 'weekly':
      case 'hangtuan':
        await weeklyCommand(message);
        break;

      case 'code':
      case 'giftcode':
        await codeCommand(message, args);
        break;

      // --- ECONOMY & CRAFTING COMMANDS ---
      case 'shop':
      case 'cuahang':
        await shopCommand(message, args);
        break;

      case 'kimbao':
      case 'kb':
        await shopCommand(message, ['kimbao', ...args]);
        break;

      case 'buy':
      case 'mua':
        await shopCommand(message, ['buy', ...args]);
        break;

      case 'sell':
      case 'ban':
        await banCommand(message, args);
        break;

      case 'use':
      case 'dung':
        await useCommand(message, args);
        break;

      case 'equip':
      case 'mac':
        await equipCommand(message, args);
        break;

      case 'unequip':
      case 'thao':
        await unequipCommand(message, args);
        break;

      case 'open':
      case 'mo':
      case 'moruong':
      case 'ghepruong':
        await ghepCommand(message, args);
        break;

      case 'give':
      case 'cho':
        await giveCommand(message, args);
        break;

      case 'dismantle':
      case 'tach':
        await dismantleCommand(message, args);
        break;

      case 'enchant':
      case 'cuonghoa':
      case 'dapdo':
        await cuongHoaCommand(message, args);
        break;

      case 'combine':
      case 'ghep':
      case 'hopthanh':
        await ghepCommand(message, args);
        break;

      case 'socket':
      case 'kham':
        await khamCommand(message, args);
        break;

      case 'upgrade':
      case 'nangcap':
        await nangCapToolCommand(message, args);
        break;

      // --- PRODUCER CLASS SINGLE COMMANDS ---
      case 'mine':
      case 'm':
      case 'min':
      case 'daokhoang': {
        const user = await UserService.getOrCreateUser(message.author.id);
        const pJob = ((user as any).producerJob || '').toLowerCase();
        if (pJob && pJob !== 'miner' && pJob !== 'min') {
          await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy nhờ đồng đội làm **MINER (THỢ MỎ)** đào quặng giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
          break;
        }
        const mineRes = await GatheringService.mine(message.author.id);
        const mineText = mineRes.itemsGained.map((i: any) => `🪨 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
        const embed = createDongSonEmbed()
          .setTitle(`🪨 MINER — ĐÀO KHOÁNG MỎ THẠCH GOTHIC`)
          .setDescription(`⛏️ **Thợ Mỏ vung cuốc đập đá trong hầm mỏ ngầm và thu hoạch được:**\n\n${mineText}\n\n💡 *Gửi Quặng vào Kho Vault (\`vkl vlt dep\`) cho Thợ Rèn rèn đồ!*`);
        await message.reply({ embeds: [embed] });
        break;
      }

      case 'brew':
      case 'alc':
      case 'potion':
      case 'phache': {
        const user = await UserService.getOrCreateUser(message.author.id);
        const pJob = ((user as any).producerJob || '').toLowerCase();
        if (pJob && pJob !== 'alchemist' && pJob !== 'alc') {
          await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy nhờ đồng đội làm **ALCHEMIST (BÀO CHẾ)** luyện thuốc giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
          break;
        }
        const herbRes = await GatheringService.gatherHerbs(message.author.id);
        const herbText = herbRes.itemsGained.map((i: any) => `🧪 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
        const embed = createDongSonEmbed()
          .setTitle(`🧪 ALCHEMIST — NUNG LÒ BÀO CHẾ MA DƯỢC`)
          .setDescription(`🔥 **Thợ Bào Chế nung lò vạc luyện ma dược và thu hoạch được:**\n\n${herbText}\n\n💡 *Gửi Thuốc vào Kho Vault (\`vkl vlt dep\`) cho Kị Sĩ đi đánh Boss Ngục Tối!*`);
        await message.reply({ embeds: [embed] });
        break;
      }

      case 'craft':
      case 'blk':
      case 'forge':
      case 'ren': {
        const user = await UserService.getOrCreateUser(message.author.id);
        const pJob = ((user as any).producerJob || '').toLowerCase();
        if (args.length > 0 && pJob && pJob !== 'blacksmith' && pJob !== 'blk') {
          await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy gửi nguyên liệu vào Kho Vault (\`vkl vlt dep\`) cho **BLACKSMITH (THỢ RÈN)** rèn đồ giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
          break;
        }
        await renCommand(message, args);
        break;
      }

      // --- COMBAT & OTHER ACTIVITIES ---
      case 'adventure':
      case 'adv':
      case 'thamhiem':
        await thamHiemCommand(message);
        break;

      case 'heal':
      case 'duongthuong':
      case 'hoimau':
        await duongThuongCommand(message);
        break;

      case 'duel':
      case 'pvp':
      case 'loidai':
        await pvpCommand(message);
        break;

      case 'arena':
      case 'tower':
      case 'leothap':
      case 'thap':
        await leoThapCommandClean(message);
        break;

      case 'boss':
      case 'trum':
        await bossCommand(message);
        break;

      case 'training':
      case 'luyenvo':
        await luyenVoCommand(message);
        break;

      case 'farm':
      case 'nongsang':
      case 'nongtrai':
        await farmCommand(message, args);
        break;

      case 'sync_emojis':
      case 'emojis':
        await syncEmojisCommand(message);
        break;

      case 'rebirth':
      case 'trunghoi':
      case 'trungsinh':
        await trungHoiCommand(message);
        break;

      case 'cancot':
        await canCotCommand(message, args);
        break;

      case 'fortune':
      case 'xinxam':
        await xinXamCommand(message);
        break;

      case 'guild':
      case 'bang':
      case 'banghoi':
        await bangHoiCommand(message, args);
        break;

      case 'bounty':
      case 'truyna':
        await trynaCommand(message, args);
        break;

      case 'merchant':
      case 'thuonglai':
        await thuongLaiCommand(message, args);
        break;

      // --- MINIGAMES ---
      case 'dice':
      case 'taixiu':
        await taiXiuCommand(message, args);
        break;

      case 'blackjack':
      case 'xidach':
        await xiDachCommand(message, args);
        break;

      case 'slots':
        await slotsCommand(message, args);
        break;

      case 'roulette':
        await rouletteCommand(message, args);
        break;

      case 'baucua':
        await bauCuaCommand(message, args);
        break;

      case 'rps':
      case 'oantuti':
        await oanTuTiCommand(message, args);
        break;

      case 'choido':
        await choiDoCommand(message);
        break;

      case 'duangua':
      case 'dua_linhthu':
        await duaLinhThuCommand(message, args);
        break;

      default:
        break;
    }
  } catch (err: any) {
    console.error(`❌ [COMMAND ERROR] Lỗi khi xử lý lệnh "${command}":`, err);
    await message.reply('❌ An internal error occurred while processing the command!').catch(() => {});
  }
}
