"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donCuiCommand = donCuiCommand;
const GatheringService_1 = require("../../game/services/GatheringService");
const CooldownEngine_1 = require("../../game/engines/CooldownEngine");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
async function donCuiCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    // Cooldown 3m (180,000 ms)
    const cooldownCheck = CooldownEngine_1.CooldownEngine.checkCooldown(user, 'don_cui', 180000);
    if (!cooldownCheck.isReady) {
        await message.reply(cooldownCheck.message);
        return;
    }
    const { itemsGained } = await GatheringService_1.GatheringService.woodcut(userId);
    await UserService_1.UserService.updateCooldownAtomic(userId, 'don_cui', Date.now());
    // Thưởng thêm +50 EXP cho lao động đốn củi
    await UserService_1.UserService.applyBattleResults(userId, user.chiSo.hp, 50, 0, false, user.canhGioi.capDo, []);
    const itemStr = itemsGained.map((i) => `🪵 **${i.name}** (\`${i.itemId}\`) x${i.qty}`).join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🪓 CHOP — ĐỐN CỦI TRONG RỪNG THÂM')
        .setDescription(`Bạn vung rìu đốn củi trong đồi tre quê hương và thu hoạch được:\n\n${itemStr}\n\n` +
        `✨ **Thưởng Lao Động:** **+50 EXP**!`);
    await message.reply({ embeds: [embed] });
}
