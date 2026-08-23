"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpMenuService = void 0;
const embedBuilder_1 = require("../../utils/embedBuilder");
class HelpMenuService {
    /**
     * Tạo Embed Bảng Danh Sách Lệnh (Help Menu) với Prefix "vn"
     */
    static renderHelpEmbed(prefix = 'vn ') {
        const p = prefix.endsWith(' ') ? prefix : prefix + ' ';
        return (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 DANH SÁCH LỆNH BOT RPG VIỆT NAM')
            .setDescription(`Ví dụ cách sử dụng lệnh: \`${p}hunt\`, \`${p}chop\`, \`${p}profile\`, hoặc \`${p}craft sword\`\n\n`)
            .addFields({
            name: '🏅 Progress Commands',
            value: `\`${p}profile\` (\`${p}p\`), \`${p}inventory\` (\`${p}inv\`), \`${p}cooldowns\` (\`${p}cd\`), ` +
                `\`${p}quest\`, \`${p}top\` (\`${p}lb\`), \`${p}daily\`, \`${p}weekly\`, \`${p}code\``,
            inline: false,
        }, {
            name: '⚔️ Fighting Commands',
            value: `\`${p}hunt\` (\`${p}h\`), \`${p}adventure\` (\`${p}adv\`), \`${p}heal\`, \`${p}duel\` (\`${p}pvp\`), ` +
                `\`${p}dungeon\`, \`${p}arena\`, \`${p}miniboss\`, \`${p}boss\``,
            inline: false,
        }, {
            name: '💰 Economy Commands',
            value: `\`${p}shop\`, \`${p}buy [qty] [item]\`, \`${p}sell all\`, \`${p}sell [item]\`, ` +
                `\`${p}use [item]\`, \`${p}give [@user] [amount]\`, \`${p}merchant\`, \`${p}bounty\``,
            inline: false,
        }, {
            name: '🛠️ Working & Crafting Commands',
            value: `\`${p}chop\`, \`${p}fish\`, \`${p}pickup\`, \`${p}mine\`, ` +
                `\`${p}craft sword\`, \`${p}craft armor\`, \`${p}dismantle\`, \`${p}enchant\`, \`${p}combine\`, \`${p}brew\``,
            inline: false,
        }, {
            name: '🎲 Gambling Commands',
            value: `\`${p}dice\`, \`${p}blackjack\`, \`${p}slots\`, \`${p}roulette\`, \`${p}rps\`, \`${p}race\`, \`${p}baucua\``,
            inline: false,
        }, {
            name: '🧗 Level Unlocked Mechanics',
            value: '**Level 1 - 9:** Wooden & Bamboo Equipment (`vn craft dao_tre_gai`)\n' +
                '**Level 10 - 19:** Bronze Equipment (`vn craft dao_mac_dong`)\n' +
                '**Level 20 - 29:** Iron Equipment (`vn craft kiem_sat_ba_vi`)\n' +
                '**Level 40 - 59:** Dark Steel Equipment (`vn craft thuong_huyen_thiet`)\n' +
                '**Level 60 - 90+:** Mythic Equipment (`vn craft cung_no_than`, `vn craft kiem_thuan_thien`)',
            inline: false,
        })
            .setFooter({ text: `Type ${p}help [command] for detailed instructions.` });
    }
}
exports.HelpMenuService = HelpMenuService;
