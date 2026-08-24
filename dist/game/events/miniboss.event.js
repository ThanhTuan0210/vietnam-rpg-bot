"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORLD_BOSS_POOL = void 0;
exports.startMinibossSpawner = startMinibossSpawner;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
const UserService_1 = require("../services/UserService");
exports.WORLD_BOSS_POOL = [
    {
        name: 'Thuồng Luồng Tinh Thượng Cổ',
        icon: '🐉',
        skillName: 'Sóng Thần Cuồng Nộ',
        hp: 50000,
        rewardDong: 200000,
        rewardKimBao: 5,
    },
    {
        name: 'Xích Quỷ Ma Vương',
        icon: '👹',
        skillName: 'Ma Huyết Đại Trận',
        hp: 120000,
        rewardDong: 500000,
        rewardKimBao: 10,
    },
    {
        name: 'Nghê Thần Trấn Môn',
        icon: '🦁',
        skillName: 'Nghê Thần Nộ Hống',
        hp: 250000,
        rewardDong: 1000000,
        rewardKimBao: 15,
    },
    {
        name: 'Thần Hổ Thượng Ngàn',
        icon: '🐅',
        skillName: 'Sơn Lâm Cuồng Phong',
        hp: 500000,
        rewardDong: 2500000,
        rewardKimBao: 25,
    },
    {
        name: 'Thần Kim Quy Đền Hùng',
        icon: '🐢',
        skillName: 'Kim Quy Trầm Thủy',
        hp: 1000000,
        rewardDong: 5000000,
        rewardKimBao: 40,
    },
];
function startMinibossSpawner(client, channelId) {
    // Spawn ngẫu nhiên mỗi 30 phút
    setInterval(async () => {
        try {
            const channel = (await client.channels.fetch(channelId));
            if (!channel)
                return;
            const boss = exports.WORLD_BOSS_POOL[Math.floor(Math.random() * exports.WORLD_BOSS_POOL.length)];
            let currentBossHp = boss.hp;
            const attackers = new Map();
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('miniboss_attack')
                .setLabel('⚔️ HỢP LỰC TẤN CÔNG MINIBOSS')
                .setStyle(discord_js_1.ButtonStyle.Danger));
            const embed = (0, embedBuilder_1.createDongSonEmbed)()
                .setTitle(`🐉 SỰ KIỆN MINIBOSS REALTIME — ${boss.icon} ${boss.name.toUpperCase()} GIÁNG THẾ!`)
                .setDescription(`**${boss.icon} ${boss.name}** vừa giáng thế xuất hiện trong kênh chat!\n` +
                `💥 **Tuyệt kỹ:** *${boss.skillName}*\n` +
                `❤️ **HP Thần Thoại:** \`${currentBossHp.toLocaleString('vi-vkl')} / ${boss.hp.toLocaleString('vi-vkl')}\`\n\n` +
                `⚠️ **TẤT CẢ ANH HÙNG HÃY BẤM NÚT DƯỚI ĐÂY ĐỂ HỢP LỰC ĐẢ BẠI TRÙM TRONG 60 GIÂY!**`);
            const msg = await channel.send({ embeds: [embed], components: [row] });
            const collector = msg.createMessageComponentCollector({
                componentType: discord_js_1.ComponentType.Button,
                time: 60000,
            });
            collector.on('collect', async (i) => {
                const userId = i.user.id;
                const dmg = Math.floor(Math.random() * 500) + 200;
                currentBossHp = Math.max(0, currentBossHp - dmg);
                attackers.set(userId, (attackers.get(userId) || 0) + dmg);
                await i.reply({
                    content: `⚔️ Bạn vung kiếm đánh chém **${boss.name}** gây **${dmg} sát thương**! (HP Boss còn: ${currentBossHp})`,
                    ephemeral: true,
                });
                if (currentBossHp <= 0)
                    collector.stop('killed');
            });
            collector.on('end', async (_, reason) => {
                const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId('miniboss_end')
                    .setLabel('🔒 Sự Kiện Miniboss Kết Thúc')
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setDisabled(true));
                if (attackers.size === 0) {
                    await msg.edit({
                        content: `💨 **${boss.name}** đã tẩu thoát do không có Anh Hùng nào ra tay!`,
                        components: [disabledRow],
                    });
                    return;
                }
                const totalParticipants = attackers.size;
                const rewardPerUserDong = Math.floor(boss.rewardDong / totalParticipants);
                for (const [uId] of attackers.entries()) {
                    await UserService_1.UserService.addDongAtomic(uId, rewardPerUserDong);
                }
                const resultEmbed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle(`🎉 MINIBOSS ${boss.name.toUpperCase()} ĐÃ BỊ TẤN CÔNG THẤT BẠI / ĐẢ BẠI!`)
                    .setDescription(`👥 **Tổng số Anh Hùng tham gia:** **${totalParticipants} người**\n` +
                    `🎁 **Mỗi người nhận thưởng chia đều:** **+${(0, formatters_1.formatDong)(rewardPerUserDong)}**!`);
                await msg.edit({ embeds: [resultEmbed], components: [disabledRow] });
            });
        }
        catch (err) {
            console.error('[Miniboss Error]:', err);
        }
    }, 1800000); // 30 phút
}
