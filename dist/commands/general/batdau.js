"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batDauCommand = batDauCommand;
const UserService_1 = require("../../game/services/UserService");
const master_menu_command_1 = require("./master_menu.command");
async function batDauCommand(message) {
    const userId = message.author.id;
    let user = await UserService_1.UserService.getOrCreateUser(userId);
    // Initialize starting items with Medieval Kyrise Items
    if (!user.inventory || user.inventory.length === 0) {
        user.inventory = [
            { itemId: 'potion_01a', quantity: 5 },
            { itemId: 'wood_01a', quantity: 10 },
            { itemId: 'ingot_01a', quantity: 5 },
        ];
        user.trangBi = {
            vuKhi: { itemId: 'sword_01a', capCuongHoa: 0, bonusStat: 0 },
            aoGiap: { itemId: 'shield_01a', capCuongHoa: 0, bonusStat: 0 },
        };
        await user.save();
    }
    // Redirect cleanly to Master Menu (which handles step-by-step class selection & dashboard)
    await (0, master_menu_command_1.masterMenuCommand)(message);
}
