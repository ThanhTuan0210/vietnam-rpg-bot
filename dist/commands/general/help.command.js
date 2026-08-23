"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpCommand = helpCommand;
const env_1 = require("../../config/env");
const HelpMenuService_1 = require("../../game/services/HelpMenuService");
async function helpCommand(message) {
    const embed = HelpMenuService_1.HelpMenuService.renderHelpEmbed(env_1.CONFIG.PREFIX);
    await message.reply({ embeds: [embed] });
}
