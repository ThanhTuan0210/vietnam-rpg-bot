"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dungeonCommand = dungeonCommand;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const items_1 = require("../../game/data/items");
const formatters_1 = require("../../utils/formatters");
const DUNGEONS = [
    {
        id: 1,
        name: '🌲 Hang Goblin Rừng Tre (Tầng 1)',
        minLevel: 1,
        reqCP: 800,
        bossName: '👹 Goblin Chieftain King',
        bossHp: 1500,
        bossAtk: 120,
        keyId: 'key_01a',
        dropItems: [{ id: 'ingot_01a', qty: 5 }, { id: 'crystal_01a', qty: 2 }, { id: 'gift_01a', qty: 1 }],
    },
    {
        id: 2,
        name: '🏔️ Đầm Lầy Orc Thượng Cổ (Tầng 2)',
        minLevel: 15,
        reqCP: 3000,
        bossName: '🐊 Orc Warlord Titan',
        bossHp: 5000,
        bossAtk: 350,
        keyId: 'key_01a',
        dropItems: [{ id: 'ingot_01b', qty: 5 }, { id: 'potion_02a', qty: 3 }, { id: 'gem_01a', qty: 2 }],
    },
    {
        id: 3,
        name: '🌋 Mỏ Tháp Dwarven (Tầng 3)',
        minLevel: 25,
        reqCP: 7500,
        bossName: '🐂 Iron Golem Titan',
        bossHp: 12000,
        bossAtk: 700,
        keyId: 'key_01a',
        dropItems: [{ id: 'gem_01a', qty: 4 }, { id: 'potion_03a', qty: 3 }, { id: 'sword_02a', qty: 1 }],
    },
    {
        id: 4,
        name: '🏰 Pháo Đài Gothic Âm Phủ (Tầng 4)',
        minLevel: 35,
        reqCP: 15000,
        bossName: '🏹 Phantom Archmage Lich',
        bossHp: 25000,
        bossAtk: 1200,
        keyId: 'key_01a',
        dropItems: [{ id: 'ingot_01e', qty: 3 }, { id: 'crystal_01j', qty: 2 }],
    },
    {
        id: 5,
        name: '🎓 Đền Trọng Sinh Ancient Lich (Tầng 5)',
        minLevel: 50,
        reqCP: 30000,
        bossName: '🌳 Ancient Lich Overlord',
        bossHp: 60000,
        bossAtk: 2500,
        keyId: 'key_01a',
        dropItems: [{ id: 'ingot_01e', qty: 5 }, { id: 'crystal_01j', qty: 4 }],
    },
    {
        id: 6,
        name: '🐉 Vực Đáy Kraken Thần Vương (Tầng 6)',
        minLevel: 65,
        reqCP: 55000,
        bossName: '🐲 Deep Sea Kraken Leviathan',
        bossHp: 120000,
        bossAtk: 4500,
        keyId: 'key_01a',
        dropItems: [{ id: 'ingot_01e', qty: 10 }, { id: 'crystal_01j', qty: 8 }],
    },
    {
        id: 7,
        name: '👑 Vương Tọa Rồng Infernal King (ENDGAME Tầng 7)',
        minLevel: 85,
        reqCP: 90000,
        bossName: '🐢👑 Infernal Dragon King (FINAL BOSS)',
        bossHp: 300000,
        bossAtk: 10000,
        keyId: 'key_01a',
        dropItems: [{ id: 'sword_03e', qty: 1 }, { id: 'gem_01a', qty: 10 }],
    },
];
async function dungeonCommand(message, args) {
    const userId = message.author.id;
    const username = message.author.username;
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const floorId = parseInt(args[0]) || 1;
    const floor = DUNGEONS.find((d) => d.id === floorId);
    if (!floor) {
        await message.reply('⚠️ **Tầng Ngục Tối không hợp lệ!** Chọn từ Tầng 1 đến Tầng 7 (`vkl dungeon 1` đến `vkl dungeon 7`).');
        return;
    }
    // Calculate Combat Power (CP) with Dual-Class Synergy Buff (+20% CP if player has both classes)
    const baseCP = (user.canhGioi.capDo * 50) + (user.chiSo.satThuong * 2) + (user.chiSo.phongThu * 3) + Math.floor(user.chiSo.maxHp / 10);
    const hasDualClass = user.hePhai && user.producerJob;
    const userCP = hasDualClass ? Math.floor(baseCP * 1.2) : baseCP;
    if (user.canhGioi.capDo < floor.minLevel) {
        await message.reply(`🔒 **CẤP ĐỘ CHƯA ĐỦ!** Bạn cần đạt **Level ${floor.minLevel}** để tiến vào ${floor.name}. (Cấp hiện tại: Lv ${user.canhGioi.capDo})`);
        return;
    }
    // 🎲 SPECIAL MECHANIC 1: RANDOM ROGUELIKE EVENT ROOM
    const roomEvents = [
        { title: '⚔️ Phòng Phục Kích Tinh Anh', desc: 'Tiêu diệt toán tay sai Goblin Tinh Anh (+500 Vàng & +200 EXP) trước khi giáp mặt Boss!' },
        { title: '🧪 Suối Thần Linh Gothic', desc: 'Uống dòng suối ma pháp (Tiêu thụ 1x Potion) giúp khôi phục 100% HP & MP!' },
        { title: '📜 Cổ Tháp Bí Ẩn', desc: 'Giải phóng phong ấn cổ đại! Tăng ngay **+30% Sát Thương (ATK)** trong trận chiến Boss!' },
        { title: '🧰 Kho Thạch Rương Thần Bí', desc: 'Phát hiện rương báu bị niêm phong trong hầm tối ngầm!' },
    ];
    const randomRoom = roomEvents[Math.floor(Math.random() * roomEvents.length)];
    // 🎲 SPECIAL MECHANIC 2: ENRAGE BOSS SHIELD ACTION BUTTONS
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('btn_dungeon_strike').setLabel('⚔️ Tung Kĩ Năng Trảm Boss').setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder().setCustomId('btn_dungeon_shield').setLabel('🛡️ Đỡ Đòn Kị Sĩ (-80% DMG)').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('btn_dungeon_potion').setLabel('🧪 Ném Ma Dược Kháng Độc').setStyle(discord_js_1.ButtonStyle.Success));
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🏰 THỬ THÁCH NGỤC TỐI GOTHIC — ${floor.name.toUpperCase()}`)
        .setDescription(`🏛️ **ANH HÙNG:** ${username} (\`${(user.hePhai || '').toString().toUpperCase()}\` + \`${(user.producerJob || '').toString().toUpperCase()}\`)\n` +
        `📊 **Lực Chiến CP:** \`${userCP.toLocaleString('vi-VN')} CP\` ${hasDualClass ? '✨ *(+20% Dual-Class Synergy!)*' : ''}\n` +
        `⚔️ **Boss Ngục Tối:** **${floor.bossName}** (HP: \`${floor.bossHp.toLocaleString('vi-VN')}\` | Yêu cầu CP: \`${floor.reqCP.toLocaleString('vi-VN')}\`)\n\n` +
        `🎲 **SỰ KIỆN PHÒNG NGẪU NHIÊN:**\n` +
        `└ **${randomRoom.title}:** ${randomRoom.desc}\n\n` +
        `⚠️ **BOSS ĐANG VUNG KHIÊN CUỒNG NỘ! HÃY BẤM NÚT CHIẾN THUẬT BÊN DƯỚI ĐỂ CHIẾN ĐẤU!**`);
    const replyMsg = await message.reply({ embeds: [embed], components: [row] });
    const collector = replyMsg.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 30000,
    });
    collector.on('collect', async (i) => {
        if (i.user.id !== userId) {
            await i.reply({ content: '⚠️ Bạn không thể điều khiển đòn đánh của người khác!', ephemeral: true });
            return;
        }
        let battleSuccess = userCP >= floor.reqCP;
        let extraText = '';
        if (i.customId === 'btn_dungeon_strike') {
            extraText = '💥 **Bạn đã vung tuyệt kĩ chém thẳng vào điểm yếu của Boss!**\n';
        }
        else if (i.customId === 'btn_dungeon_shield') {
            extraText = '🛡️ **Bạn giơ khiên thép đỡ trọn đòn Cuồng Nộ của Boss! (Kháng 80% Sát Thương)**\n';
        }
        else if (i.customId === 'btn_dungeon_potion') {
            extraText = '🧪 **Bạn ném Ma Dược Kháng Độc làm tan chảy Khiên Cuồng Nộ của Boss!**\n';
        }
        if (battleSuccess) {
            let dropsText = '';
            for (const drop of floor.dropItems) {
                const icon = (0, items_1.getItemIcon)(drop.id);
                const itemDef = items_1.ITEMS[drop.id] || { name: drop.id };
                dropsText += `• **${drop.qty}x** ${icon} **${itemDef.name}** (\`${drop.id}\`)\n`;
                await UserService_1.UserService.addItemAtomic(userId, drop.id, drop.qty);
            }
            const rewardGold = floor.id * 2000;
            const rewardExp = floor.id * 500;
            user.taiChinh.dong += rewardGold;
            user.canhGioi.kinhNghiem += rewardExp;
            await user.save();
            const winEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle(`🏆 CHIẾN THẮNG QUANG VINH — ${floor.name.toUpperCase()}`)
                .setDescription(`${extraText}\n` +
                `🎉 **${username}** đã tiêu diệt thành công Boss **${floor.bossName}**!\n\n` +
                `🎁 **CHIẾN LỢI PHẨM ĐOẠT ĐƯỢC:**\n${dropsText}\n` +
                `💰 **Tiền Thưởng:** \`+${(0, formatters_1.formatDong)(rewardGold)}\` | ✨ **EXP:** \`+${rewardExp} EXP\`\n\n` +
                `💡 *Vật phẩm quý đã được chuyển thẳng vào Túi Đồ (\`vkl i\`) hoặc Kho Vault (\`vkl vlt dep\`)!*`);
            await i.update({ embeds: [winEmbed], components: [] });
        }
        else {
            const loseEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle(`💀 THẤT BẠI TẠI NGỤC TỐI — ${floor.name.toUpperCase()}`)
                .setDescription(`${extraText}\n` +
                `❌ Sát thương của **${floor.bossName}** quá tàn bạo! Tổ đội của bạn chưa đủ Lực Chiến CP!\n\n` +
                `📊 **Lực chiến hiện tại:** \`${userCP.toLocaleString('vi-VN')} CP\` (Cần: \`${floor.reqCP.toLocaleString('vi-VN')} CP\`)\n\n` +
                `💡 *Hãy nâng cấp vũ khí tại Thợ Rèn (\`vkl craft\`) và uống Thuốc HP (\`vkl brew\`) trước khi thử lại!*`);
            await i.update({ embeds: [loseEmbed], components: [] });
        }
    });
}
