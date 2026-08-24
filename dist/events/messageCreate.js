"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageCreate = onMessageCreate;
const master_menu_command_1 = require("../commands/general/master_menu.command");
const guide_command_1 = require("../commands/general/guide.command");
const event_command_1 = require("../commands/general/event.command");
const GatheringService_1 = require("../game/services/GatheringService");
const UserService_1 = require("../game/services/UserService");
const embedBuilder_1 = require("../utils/embedBuilder");
const dungeon_command_1 = require("../commands/general/dungeon.command");
const tuido_1 = require("../commands/general/tuido");
const profile_command_1 = require("../commands/general/profile.command");
const vault_command_1 = require("../commands/general/vault.command");
const trade_command_1 = require("../commands/general/trade.command");
const job_command_1 = require("../commands/general/job.command");
const detu_command_1 = require("../commands/general/detu.command");
const pet_command_1 = require("../commands/general/pet.command");
const cooldown_command_1 = require("../commands/general/cooldown.command");
const bxh_command_1 = require("../commands/general/bxh.command");
const caothi_command_1 = require("../commands/general/caothi.command");
const diemdanh_command_1 = require("../commands/general/diemdanh.command");
const weekly_command_1 = require("../commands/general/weekly.command");
const code_command_1 = require("../commands/general/code.command");
const shop_command_1 = require("../commands/general/shop.command");
const ban_command_1 = require("../commands/general/ban.command");
const use_command_1 = require("../commands/general/use.command");
const equip_command_1 = require("../commands/general/equip.command");
const give_command_1 = require("../commands/general/give.command");
const ren_1 = require("../commands/general/ren");
const dismantle_command_1 = require("../commands/general/dismantle.command");
const cuonghoa_1 = require("../commands/general/cuonghoa");
const ghep_command_1 = require("../commands/general/ghep.command");
const kham_command_1 = require("../commands/general/kham.command");
const nangcap_1 = require("../commands/general/nangcap");
const san_1 = require("../commands/combat/san");
const thamhiem_1 = require("../commands/combat/thamhiem");
const duongthuong_1 = require("../commands/general/duongthuong");
const pvp_command_1 = require("../commands/combat/pvp.command");
const LeoThapCommand_1 = require("../commands/general/LeoThapCommand");
const boss_command_1 = require("../commands/general/boss.command");
const luyenvo_1 = require("../commands/combat/luyenvo");
const farm_command_1 = require("../commands/general/farm.command");
const combo_command_1 = require("../commands/general/combo.command");
const sync_emojis_command_1 = require("../commands/general/sync_emojis.command");
const trunghoi_1 = require("../commands/general/trunghoi");
const xinxam_command_1 = require("../commands/general/xinxam.command");
const banghoi_command_1 = require("../commands/general/banghoi.command");
const tryna_command_1 = require("../commands/general/tryna.command");
const thuonglai_command_1 = require("../commands/general/thuonglai.command");
const baucua_command_1 = require("../commands/minigames/baucua.command");
const duangua_command_1 = require("../commands/minigames/duangua.command");
const taixiu_command_1 = require("../commands/minigames/taixiu.command");
const xidach_command_1 = require("../commands/minigames/xidach.command");
const oantuti_command_1 = require("../commands/minigames/oantuti.command");
const choido_command_1 = require("../commands/minigames/choido.command");
const slots_command_1 = require("../commands/minigames/slots.command");
const roulette_command_1 = require("../commands/minigames/roulette.command");
async function onMessageCreate(message) {
    if (message.author.bot || !message.guild)
        return;
    const content = message.content.trim();
    const lowerContent = content.toLowerCase();
    let matchedPrefix = '';
    if (lowerContent.startsWith('vkl ')) {
        matchedPrefix = 'vkl ';
    }
    else if (lowerContent === 'vkl' || lowerContent.startsWith('vkl')) {
        matchedPrefix = 'vkl';
    }
    if (!matchedPrefix)
        return;
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
                await (0, master_menu_command_1.masterMenuCommand)(message);
                break;
            case 'guide':
            case 'huongdan':
            case 'lore':
            case 'g':
                await (0, guide_command_1.guideCommand)(message);
                break;
            case 'event':
            case 'sukien':
            case 'testevent':
                await (0, event_command_1.eventTestCommand)(message, args);
                break;
            // --- MAIN SHORTCUTS & ACTION COMMANDS ---
            case 'w':
            case 'work':
            case 'combo':
            case 'c':
            case 'cmb':
            case 'all':
                await (0, combo_command_1.comboAllCommand)(message);
                break;
            case 'h':
            case 'hunt':
            case 'hnt':
            case 'san': {
                const isHard = args[0]?.toLowerCase() === 'hard' || args[0]?.toLowerCase() === 'kho';
                await (0, san_1.sanCommandAdvanced)(message, isHard);
                break;
            }
            case 'd':
            case 'dun':
            case 'dungeon':
            case 'nguctoi':
            case 'phuban':
                await (0, dungeon_command_1.dungeonCommand)(message, args);
                break;
            case 'i':
            case 'inv':
            case 'inventory':
            case 'tuido':
            case 'kho':
                await (0, tuido_1.tuiDoCommand)(message);
                break;
            case 'p':
            case 'pro':
            case 'profile':
            case 'nhanvat':
            case 'stats':
                await (0, profile_command_1.profileCommandAdvanced)(message);
                break;
            case 'v':
            case 'vlt':
            case 'vault':
            case 'khochung':
                await (0, vault_command_1.vaultCommand)(message, args);
                break;
            case 't':
            case 'trd':
            case 'trade':
            case 'giaodich':
                await (0, trade_command_1.tradeCommand)(message, args);
                break;
            case 'job':
            case 'songphai':
                await (0, job_command_1.jobCommand)(message, args);
                break;
            case 'detu':
            case 'dtu':
            case 'apprentice':
                await (0, detu_command_1.detuCommand)(message, args);
                break;
            case 'pet':
            case 'linhthu':
                await (0, pet_command_1.petCommand)(message, args);
                break;
            // --- PROGRESS & UTILITY COMMANDS ---
            case 'cooldowns':
            case 'cooldown':
            case 'cd':
                await (0, cooldown_command_1.cooldownCommand)(message);
                break;
            case 'top':
            case 'leaderboard':
            case 'bxh':
                await (0, bxh_command_1.bxhCommand)(message, args);
                break;
            case 'quest':
            case 'caothi':
                await (0, caothi_command_1.caoThiCommand)(message);
                break;
            case 'daily':
            case 'diemdanh':
                await (0, diemdanh_command_1.diemDanhCommand)(message);
                break;
            case 'weekly':
            case 'hangtuan':
                await (0, weekly_command_1.weeklyCommand)(message);
                break;
            case 'code':
            case 'giftcode':
                await (0, code_command_1.codeCommand)(message, args);
                break;
            // --- ECONOMY & CRAFTING COMMANDS ---
            case 'shop':
            case 'cuahang':
                await (0, shop_command_1.shopCommand)(message, args);
                break;
            case 'kimbao':
            case 'kb':
                await (0, shop_command_1.shopCommand)(message, ['kimbao', ...args]);
                break;
            case 'buy':
            case 'mua':
                await (0, shop_command_1.shopCommand)(message, ['buy', ...args]);
                break;
            case 'sell':
            case 'ban':
                await (0, ban_command_1.banCommand)(message, args);
                break;
            case 'use':
            case 'dung':
                await (0, use_command_1.useCommand)(message, args);
                break;
            case 'equip':
            case 'mac':
                await (0, equip_command_1.equipCommand)(message, args);
                break;
            case 'unequip':
            case 'thao':
                await (0, equip_command_1.unequipCommand)(message, args);
                break;
            case 'open':
            case 'mo':
            case 'moruong':
            case 'ghepruong':
                await (0, ghep_command_1.ghepCommand)(message, args);
                break;
            case 'give':
            case 'cho':
                await (0, give_command_1.giveCommand)(message, args);
                break;
            case 'dismantle':
            case 'tach':
                await (0, dismantle_command_1.dismantleCommand)(message, args);
                break;
            case 'enchant':
            case 'cuonghoa':
            case 'dapdo':
                await (0, cuonghoa_1.cuongHoaCommand)(message, args);
                break;
            case 'combine':
            case 'ghep':
            case 'hopthanh':
                await (0, ghep_command_1.ghepCommand)(message, args);
                break;
            case 'socket':
            case 'kham':
                await (0, kham_command_1.khamCommand)(message, args);
                break;
            case 'upgrade':
            case 'nangcap':
                await (0, nangcap_1.nangCapToolCommand)(message, args);
                break;
            // --- PRODUCER CLASS SINGLE COMMANDS ---
            case 'mine':
            case 'm':
            case 'min':
            case 'daokhoang': {
                const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
                const pJob = (user.producerJob || '').toLowerCase();
                if (pJob && pJob !== 'miner' && pJob !== 'min') {
                    await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy nhờ đồng đội làm **MINER (THỢ MỎ)** đào quặng giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
                    break;
                }
                const mineRes = await GatheringService_1.GatheringService.mine(message.author.id);
                const mineText = mineRes.itemsGained.map((i) => `🪨 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
                const embed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle(`🪨 MINER — ĐÀO KHOÁNG MỎ THẠCH GOTHIC`)
                    .setDescription(`⛏️ **Thợ Mỏ vung cuốc đập đá trong hầm mỏ ngầm và thu hoạch được:**\n\n${mineText}\n\n💡 *Gửi Quặng vào Kho Vault (\`vkl vlt dep\`) cho Thợ Rèn rèn đồ!*`);
                await message.reply({ embeds: [embed] });
                break;
            }
            case 'brew':
            case 'alc':
            case 'potion':
            case 'phache': {
                const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
                const pJob = (user.producerJob || '').toLowerCase();
                if (pJob && pJob !== 'alchemist' && pJob !== 'alc') {
                    await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy nhờ đồng đội làm **ALCHEMIST (BÀO CHẾ)** luyện thuốc giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
                    break;
                }
                const herbRes = await GatheringService_1.GatheringService.gatherHerbs(message.author.id);
                const herbText = herbRes.itemsGained.map((i) => `🧪 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
                const embed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle(`🧪 ALCHEMIST — NUNG LÒ BÀO CHẾ MA DƯỢC`)
                    .setDescription(`🔥 **Thợ Bào Chế nung lò vạc luyện ma dược và thu hoạch được:**\n\n${herbText}\n\n💡 *Gửi Thuốc vào Kho Vault (\`vkl vlt dep\`) cho Kị Sĩ đi đánh Boss Ngục Tối!*`);
                await message.reply({ embeds: [embed] });
                break;
            }
            case 'craft':
            case 'blk':
            case 'forge':
            case 'ren': {
                const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
                const pJob = (user.producerJob || '').toLowerCase();
                if (args.length > 0 && pJob && pJob !== 'blacksmith' && pJob !== 'blk') {
                    await message.reply(`⛔ **CHUYÊN MÔN NGHỀ NGHIỆP GIỚI HẠN!**\nBạn đang là **${pJob.toUpperCase()}**!\n💡 *Bạn chỉ có thể thực hiện công việc chuyên môn của Class mình. Hãy gửi nguyên liệu vào Kho Vault (\`vkl vlt dep\`) cho **BLACKSMITH (THỢ RÈN)** rèn đồ giúp bạn hoặc đổi Class tại \`vkl job\`!*`);
                    break;
                }
                await (0, ren_1.renCommand)(message, args);
                break;
            }
            // --- COMBAT & OTHER ACTIVITIES ---
            case 'adventure':
            case 'adv':
            case 'thamhiem':
                await (0, thamhiem_1.thamHiemCommand)(message);
                break;
            case 'heal':
            case 'duongthuong':
            case 'hoimau':
                await (0, duongthuong_1.duongThuongCommand)(message);
                break;
            case 'duel':
            case 'pvp':
            case 'loidai':
                await (0, pvp_command_1.pvpCommand)(message);
                break;
            case 'arena':
            case 'tower':
            case 'leothap':
            case 'thap':
                await (0, LeoThapCommand_1.leoThapCommandClean)(message);
                break;
            case 'boss':
            case 'trum':
                await (0, boss_command_1.bossCommand)(message);
                break;
            case 'training':
            case 'luyenvo':
                await (0, luyenvo_1.luyenVoCommand)(message);
                break;
            case 'farm':
            case 'nongsang':
            case 'nongtrai':
                await (0, farm_command_1.farmCommand)(message, args);
                break;
            case 'sync_emojis':
            case 'emojis':
                await (0, sync_emojis_command_1.syncEmojisCommand)(message);
                break;
            case 'rebirth':
            case 'trunghoi':
            case 'trungsinh':
                await (0, trunghoi_1.trungHoiCommand)(message);
                break;
            case 'cancot':
                await (0, trunghoi_1.canCotCommand)(message, args);
                break;
            case 'fortune':
            case 'xinxam':
                await (0, xinxam_command_1.xinXamCommand)(message);
                break;
            case 'guild':
            case 'bang':
            case 'banghoi':
                await (0, banghoi_command_1.bangHoiCommand)(message, args);
                break;
            case 'bounty':
            case 'truyna':
                await (0, tryna_command_1.trynaCommand)(message, args);
                break;
            case 'merchant':
            case 'thuonglai':
                await (0, thuonglai_command_1.thuongLaiCommand)(message, args);
                break;
            // --- MINIGAMES ---
            case 'dice':
            case 'taixiu':
                await (0, taixiu_command_1.taiXiuCommand)(message, args);
                break;
            case 'blackjack':
            case 'xidach':
                await (0, xidach_command_1.xiDachCommand)(message, args);
                break;
            case 'slots':
                await (0, slots_command_1.slotsCommand)(message, args);
                break;
            case 'roulette':
                await (0, roulette_command_1.rouletteCommand)(message, args);
                break;
            case 'baucua':
                await (0, baucua_command_1.bauCuaCommand)(message, args);
                break;
            case 'rps':
            case 'oantuti':
                await (0, oantuti_command_1.oanTuTiCommand)(message, args);
                break;
            case 'choido':
                await (0, choido_command_1.choiDoCommand)(message);
                break;
            case 'duangua':
            case 'dua_linhthu':
                await (0, duangua_command_1.duaLinhThuCommand)(message, args);
                break;
            default:
                break;
        }
    }
    catch (err) {
        console.error(`❌ [COMMAND ERROR] Lỗi khi xử lý lệnh "${command}":`, err);
        await message.reply('❌ An internal error occurred while processing the command!').catch(() => { });
    }
}
