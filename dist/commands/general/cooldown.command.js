"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cooldownCommand = cooldownCommand;
const UserService_1 = require("../../game/services/UserService");
const CooldownDashboardService_1 = require("../../game/services/CooldownDashboardService");
async function cooldownCommand(message) {
    const userId = message.author.id;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const embed = CooldownDashboardService_1.CooldownDashboardService.renderCooldownEmbed(user, message.author.username);
    await message.reply({ embeds: [embed] });
}
