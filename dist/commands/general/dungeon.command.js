"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dungeonCommand = dungeonCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const items_1 = require("../../game/data/items");
const DUNGEONS = [
    { id: 1, name: '🌲 Hang Goblin Rừng Tre (Tầng 1)', minLevel: 1, reqCP: 1000, bossName: '👹 Goblin Chieftain King', keyId: 'key_01a', dropItems: [{ id: 'ingot_01a', qty: 3 }, { id: 'crystal_01a', qty: 2 }, { id: 'gift_01a', qty: 1 }] },
    { id: 2, name: '🏔️ Đầm Lầy Orc Cổ (Tầng 2)', minLevel: 15, reqCP: 3500, bossName: '🐊 Orc Warlord', keyId: 'key_01b', dropItems: [{ id: 'ingot_01b', qty: 4 }, { id: 'potion_02a', qty: 2 }] },
    { id: 3, name: '🌋 Mỏ Tháp Dwarven (Tầng 3)', minLevel: 25, reqCP: 8000, bossName: '🐂 Iron Golem Titan', keyId: 'key_01c', dropItems: [{ id: 'gem_01a', qty: 2 }, { id: 'potion_03a', qty: 3 }] },
    { id: 4, name: '🏰 Pháo Đài Gothic Âm Phủ (Tầng 4)', minLevel: 35, reqCP: 15000, bossName: '🏹 Phantom Archmage Lich', keyId: 'key_01d', dropItems: [{ id: 'spellbook_01a', qty: 1 }, { id: 'scroll_01a', qty: 2 }] },
    { id: 5, name: '🎓 Đền Trọng Sinh Ancient Lich (Tầng 5)', minLevel: 50, reqCP: 25000, bossName: '🌳 Ancient Lich Overlord', keyId: 'key_01e', dropItems: [{ id: 'ingot_01e', qty: 2 }, { id: 'crystal_01j', qty: 1 }] },
    { id: 6, name: '🐉 Vực Đáy Kraken Thần Vương (Tầng 6)', minLevel: 65, reqCP: 45000, bossName: '🐲 Deep Sea Kraken Leviathan', keyId: 'key_02a', dropItems: [{ id: 'sword_02a', qty: 1 }, { id: 'key_02b', qty: 1 }] },
    { id: 7, name: '👑 Vương Tọa Rồng Infernal King (ENDGAME Tầng 7)', minLevel: 85, reqCP: 80000, bossName: '🐢👑 Infernal Dragon King (FINAL BOSS)', keyId: 'key_02b', dropItems: [{ id: 'sword_03e', qty: 1 }, { id: 'giftopen_01f', qty: 1 }] },
];
async function dungeonCommand(message, args) {
    const user = await UserService_1.UserService.getOrCreateUser(message.author.id);
    const floorId = parseInt(args[0]) || 1;
    const floor = DUNGEONS.find((d) => d.id === floorId);
    if (!floor) {
        await message.reply('⚠️ **Tầng Ngục Tối không hợp lệ!** Chọn từ Tầng 1 đến Tầng 7 (`vn dungeon 1` đến `vn dungeon 7`).');
        return;
    }
    // Check level & CP requirements
    const userCP = (user.level * 50) + (user.sucManh * 2) + (user.giap * 3) + Math.floor(user.maxHp / 10);
    if (user.level < floor.minLevel) {
        await message.reply(`🔒 **Cấp độ chưa đủ!** Bạn cần đạt **Level ${floor.minLevel}** để tiến vào ${floor.name}. (Cấp hiện tại: Lv ${user.level})`);
        return;
    }
    // Perform Dungeon Battle Raid
    let battleResultStr = '';
    if (userCP >= floor.reqCP) {
        battleResultStr = `🎉 **CHIẾN THẮNG QUANG VINH!**\n\nTổ đội của bạn đã đả bại Super Boss **${floor.bossName}** tại ${floor.name}!\n\n🎁 **Chiến lợi phẩm đoạt được:**\n`;
        floor.dropItems.forEach((drop) => {
            const icon = (0, items_1.getItemIcon)(drop.id);
            battleResultStr += `• **${drop.qty}x** ${icon} \`${drop.id}\`\n`;
            const existingSlot = user.inventory.find((i) => i.itemId.toLowerCase() === drop.id);
            if (existingSlot) {
                existingSlot.quantity += drop.qty;
            }
            else {
                user.inventory.push({ itemId: drop.id, quantity: drop.qty });
            }
        });
        user.exp += floorId * 500;
        user.dong += floorId * 2000;
        await user.save();
    }
    else {
        battleResultStr = `💀 **THẤT BẠI TRONG NGỤC TỐI!**\n\nTổ đội Lực chiến **${userCP} CP** chưa đủ khỏe để vượt qua Super Boss **${floor.bossName}** (Yêu cầu **${floor.reqCP} CP**).\n\n💡 *Hãy nhờ Thợ Rèn rèn đồ Tier cao hơn và Thợ Bào Chế nung Ma Dược Buff CP rồi quay lại chiến đấu nhé!*`;
    }
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🗺️ CHINH PHỤC NGỤC TỐI - TẦNG ${floor.id}`)
        .setDescription(`⚔️ **Anh Hùng:** ${message.author.username}\n` +
        `📊 **Lực Chiến:** \`${userCP} CP\` / \`${floor.reqCP} CP Yêu Cầu\`\n` +
        `👹 **Super Boss:** \`${floor.bossName}\`\n\n` +
        `${battleResultStr}`);
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`cmd_dungeon_${Math.min(7, floor.id + 1)}`).setLabel(`⏩ Tiến Tầng ${Math.min(7, floor.id + 1)}`).setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('cmd_profile').setLabel('🎒 Hồ Sơ CP').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('cmd_vault').setLabel('📦 Kho Vault').setStyle(discord_js_1.ButtonStyle.Success));
    await message.reply({ embeds: [embed], components: [row] });
}
