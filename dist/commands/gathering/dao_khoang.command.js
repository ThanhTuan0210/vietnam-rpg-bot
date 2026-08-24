"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daoKhoangCommand = daoKhoangCommand;
exports.cauCaCommand = cauCaCommand;
exports.haiThuocCommand = haiThuocCommand;
exports.cheDuocCommand = cheDuocCommand;
exports.nauAnCommand = nauAnCommand;
const GatheringService_1 = require("../../game/services/GatheringService");
const CooldownEngine_1 = require("../../game/engines/CooldownEngine");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function daoKhoangCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    // Cooldown 3m (180,000 ms)
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'dao_khoang', 180000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    const { itemsGained } = await GatheringService_1.GatheringService.mine(userId);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'dao_khoang', Date.now());
    await UserService_1.UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);
    const itemStr = itemsGained.map((i) => `⛏️ **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('⛏️ MINE — KHAI MỎ ĐÀO KHOÁNG THẠCH')
        .setDescription(`Bạn dùng cuốc vung đào sâu lòng núi và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);
    await message.reply({ embeds: [embed] });
}
async function cauCaCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    // Cooldown 3m (180,000 ms)
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'cau_ca', 180000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    const { itemsGained } = await GatheringService_1.GatheringService.fish(userId);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'cau_ca', Date.now());
    await UserService_1.UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);
    const itemStr = itemsGained.map((i) => `🐟 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🎣 FISH — CÂU CÁ BẾN THÔN QUÊ')
        .setDescription(`Bạn thả cần câu bên ao bến sông Hồng và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);
    await message.reply({ embeds: [embed] });
}
async function haiThuocCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    // Cooldown 3m (180,000 ms)
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'hai_thuoc', 180000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    const { itemsGained } = await GatheringService_1.GatheringService.gatherHerbs(userId);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'hai_thuoc', Date.now());
    await UserService_1.UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);
    const itemStr = itemsGained.map((i) => `🧺 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🧺 PICKUP — HÁI THẢO DƯỢC RỪNG NÚI')
        .setDescription(`Bạn đem giỏ lên ngàn hái dược và thu hoạch được:\n\n${itemStr}\n\n✨ **Thưởng Lao Động:** **+50 EXP**!`);
    await message.reply({ embeds: [embed] });
}
async function cheDuocCommand(message, args) {
    const userId = message.author.id;
    const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'la_thuoc_nam', 3);
    if (!consumed) {
        await message.reply('❌ Bạn không đủ **3 Lá Thuốc Nam** (`la_thuoc_nam`) để luyện chế Bình Kim Đan!');
        return;
    }
    await UserService_1.UserService.addItemAtomic(userId, 'binh_kim_dan', 1);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🔮 CHẾ DƯỢC THÀNH CÔNG!')
        .setDescription('Bạn đã luyện chế thành công **1 Bình Kim Đan** (`binh_kim_dan`) (+100% DEF trong 30 phút)!');
    await message.reply({ embeds: [embed] });
}
async function nauAnCommand(message, args) {
    const userId = message.author.id;
    const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'fish_01a', 2);
    if (!consumed) {
        await message.reply('❌ Bạn không đủ **2 Cá Đầm Lầy Gothic** (`fish_01a`) để chế biến Dược Nướng!');
        return;
    }
    await UserService_1.UserService.addItemAtomic(userId, 'potion_01a', 1);
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🍳 CHẾ BIẾN THÀNH CÔNG!')
        .setDescription('Bạn đã nướng thành công **1 Bình Dược HP** (`potion_01a`)!');
    await message.reply({ embeds: [embed] });
}
