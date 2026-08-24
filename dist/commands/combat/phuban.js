"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phuBanCommandAdvanced = phuBanCommandAdvanced;
const dungeon_command_1 = require("../general/dungeon.command");
async function phuBanCommandAdvanced(message, args = []) {
    await (0, dungeon_command_1.dungeonCommand)(message, args);
}
