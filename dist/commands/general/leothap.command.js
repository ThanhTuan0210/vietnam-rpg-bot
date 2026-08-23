"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leoThapCommand = leoThapCommand;
const LeoThapCommand_1 = require("./LeoThapCommand");
async function leoThapCommand(message) {
    await (0, LeoThapCommand_1.leoThapCommandClean)(message);
}
