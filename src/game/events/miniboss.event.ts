import { Client, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';
import { UserService } from '../services/UserService';

export interface WorldBossDefinition {
  name: string;
  icon: string;
  skillName: string;
  hp: number;
  rewardDong: number;
  rewardKimBao: number;
}

export const WORLD_BOSS_POOL: WorldBossDefinition[] = [
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

export function startMinibossSpawner(client: Client, channelId: string): void {
  // Spawn ngẫu nhiên mỗi 30 phút
  setInterval(async () => {
    try {
      const channel = (await client.channels.fetch(channelId)) as TextChannel;
      if (!channel) return;

      const boss = WORLD_BOSS_POOL[Math.floor(Math.random() * WORLD_BOSS_POOL.length)];
      let currentBossHp = boss.hp;
      const attackers = new Map<string, number>();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('miniboss_attack')
          .setLabel('⚔️ HỢP LỰC TẤN CÔNG MINIBOSS')
          .setStyle(ButtonStyle.Danger)
      );

      const embed = createDongSonEmbed()
        .setTitle(`🐉 SỰ KIỆN MINIBOSS REALTIME — ${boss.icon} ${boss.name.toUpperCase()} GIÁNG THẾ!`)
        .setDescription(
          `**${boss.icon} ${boss.name}** vừa giáng thế xuất hiện trong kênh chat!\n` +
            `💥 **Tuyệt kỹ:** *${boss.skillName}*\n` +
            `❤️ **HP Thần Thoại:** \`${currentBossHp.toLocaleString('vi-VN')} / ${boss.hp.toLocaleString('vi-VN')}\`\n\n` +
            `⚠️ **TẤT CẢ ANH HÙNG HÃY BẤM NÚT DƯỚI ĐÂY ĐỂ HỢP LỰC ĐẢ BẠI TRÙM TRONG 60 GIÂY!**`
        );

      const msg = await channel.send({ embeds: [embed], components: [row] });

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
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

        if (currentBossHp <= 0) collector.stop('killed');
      });

      collector.on('end', async (_, reason) => {
        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('miniboss_end')
            .setLabel('🔒 Sự Kiện Miniboss Kết Thúc')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );

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
          await UserService.addDongAtomic(uId, rewardPerUserDong);
        }

        const resultEmbed = createDongSonEmbed()
          .setTitle(`🎉 MINIBOSS ${boss.name.toUpperCase()} ĐÃ BỊ TẤN CÔNG THẤT BẠI / ĐẢ BẠI!`)
          .setDescription(
            `👥 **Tổng số Anh Hùng tham gia:** **${totalParticipants} người**\n` +
              `🎁 **Mỗi người nhận thưởng chia đều:** **+${formatDong(rewardPerUserDong)}**!`
          );

        await msg.edit({ embeds: [resultEmbed], components: [disabledRow] });
      });
    } catch (err) {
      console.error('[Miniboss Error]:', err);
    }
  }, 1800000); // 30 phút
}
