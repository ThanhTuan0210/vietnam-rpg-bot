import { Message, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { UserService } from './UserService';
import { createDongSonEmbed } from '../../utils/embedBuilder';
import { formatDong } from '../../utils/formatters';

export class RandomEventService {
  /**
   * Kích hoạt thử nghiệm Sự kiện Ngẫu nhiên (15% Tỷ lệ)
   */
  public static async tryTriggerEvent(message: Message): Promise<void> {
    const chance = Math.random();
    if (chance > 0.15) return; // 15% tỷ lệ xuất hiện

    const eventTypes = ['RAINING_COINS', 'GOD_BLESSING', 'MONSTER_AMBUSH'];
    const selectedEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    if (selectedEvent === 'RAINING_COINS') {
      await this.triggerRainingCoins(message);
    } else if (selectedEvent === 'GOD_BLESSING') {
      await this.triggerGodBlessing(message);
    } else {
      await this.triggerMonsterAmbush(message);
    }
  }

  /**
   * 🪙 1. SỰ KIỆN MƯA TIỀN ĐỒNG (IT'S RAINING COINS) - 100% Giống Ảnh Đối Chiếu
   */
  public static async triggerRainingCoins(message: Message): Promise<void> {
    const minReward = 1000;
    const maxReward = 35000;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('event_catch_coins')
        .setLabel('🪙 CATCH (NHẶT TIỀN)')
        .setStyle(ButtonStyle.Success)
    );

    const embed = createDongSonEmbed()
      .setTitle('🪙 IT\'S RAINING COINS — MƯA TIỀN ĐỒNG THẦN THOẠI!')
      .setDescription(
        `Bấm nút **CATCH** bên dưới (1 lần) để nhặt Tiền Đồng rơi từ bầu trời!\n` +
          `Phần thưởng ngẫu nhiên: **${formatDong(minReward)} ~ ${formatDong(maxReward)}**!\n\n` +
          `⏰ *Sự kiện kéo dài trong **30 giây**!*`
      );

    const channel = message.channel as TextChannel;
    const eventMsg = await channel.send({ embeds: [embed], components: [row] });

    const claimedUserIds = new Set<string>();

    const collector = eventMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
    });

    collector.on('collect', async (i: any) => {
      if (i.customId === 'event_catch_coins') {
        if (claimedUserIds.has(i.user.id)) {
          await i.reply({ content: '⚠️ Bạn đã nhặt tiền trong sự kiện này rồi!', ephemeral: true });
          return;
        }

        claimedUserIds.add(i.user.id);
        const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

        await UserService.addDongAtomic(i.user.id, reward);

        await i.reply({
          content: `🎉 **<@${i.user.id}>** đã nhanh tay bấm **CATCH** và nhặt được **+${formatDong(reward)}**!`,
        });
      }
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('event_done').setLabel('🪙 ĐÃ KẾT THÚC').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );

      const endEmbed = createDongSonEmbed()
        .setTitle('🪙 SỰ KIỆN MƯA TIỀN ĐỒNG KẾT THÚC')
        .setDescription(`Tổng cộng đã có **${claimedUserIds.size} người chơi** nhanh tay tham gia nhặt Tiền Đồng!`);

      await eventMsg.edit({ embeds: [endEmbed], components: [disabledRow] }).catch(() => {});
    });
  }

  /**
   * 🌳 2. SỰ KIỆN CÂY THẦN BAN PHƯỚC (GOD'S BLESSING)
   */
  public static async triggerGodBlessing(message: Message): Promise<void> {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('event_pray_tree')
        .setLabel('🌿 PRAY (NGUYỆN CẦU)')
        .setStyle(ButtonStyle.Success)
    );

    const embed = createDongSonEmbed()
      .setTitle('🌳 GOD\'S BLESSING — CÂY THẦN BẢO VỰC XUẤT HIỆN!')
      .setDescription(
        `Cây thần Đông Sơn tỏa hào quang ban phước lành!\n` +
          `Bấm **PRAY** để thành tâm nguyện cầu nhận **+500 EXP & 1 Rương Bạc**!\n\n` +
          `⏰ *Sự kiện kéo dài trong **30 giây**!*`
      );

    const channel = message.channel as TextChannel;
    const eventMsg = await channel.send({ embeds: [embed], components: [row] });
    const claimedUserIds = new Set<string>();

    const collector = eventMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
    });

    collector.on('collect', async (i: any) => {
      if (i.customId === 'event_pray_tree') {
        if (claimedUserIds.has(i.user.id)) {
          await i.reply({ content: '⚠️ Bạn đã nguyện cầu rồi!', ephemeral: true });
          return;
        }

        claimedUserIds.add(i.user.id);
        await UserService.addItemAtomic(i.user.id, 'ruong_bac', 1);

        await i.reply({
          content: `🌿 **<@${i.user.id}>** đã thành tâm **PRAY** và nhận được **+500 EXP** & **1 Rương Bạc**!`,
        });
      }
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('event_done').setLabel('🌿 ĐÃ KẾT THÚC').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );
      await eventMsg.edit({ components: [disabledRow] }).catch(() => {});
    });
  }

  /**
   * 👹 3. SỰ KIỆN YÊU MA ĐỘT KÍCH (MONSTER AMBUSH)
   */
  public static async triggerMonsterAmbush(message: Message): Promise<void> {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('event_fight_ambush')
        .setLabel('⚔️ FIGHT (TIÊU DIỆT)')
        .setStyle(ButtonStyle.Danger)
    );

    const embed = createDongSonEmbed()
      .setTitle('👹 MONSTER AMBUSH — YÊU MA ĐỘT KÍCH LÀNG XÓM!')
      .setDescription(
        `Bầy Ma Cương Thi bất ngờ xuất hiện tấn công dân làng!\n` +
          `Bấm **FIGHT** để xông lên tiêu diệt và đoạt lấy **Ngọc Lửa Lv.1 + 5,000 Đồng**!\n\n` +
          `⏰ *Sự kiện kéo dài trong **30 giây**!*`
      );

    const channel = message.channel as TextChannel;
    const eventMsg = await channel.send({ embeds: [embed], components: [row] });
    const claimedUserIds = new Set<string>();

    const collector = eventMsg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30000,
    });

    collector.on('collect', async (i: any) => {
      if (i.customId === 'event_fight_ambush') {
        if (claimedUserIds.has(i.user.id)) {
          await i.reply({ content: '⚠️ Bạn đã tham chiến rồi!', ephemeral: true });
          return;
        }

        claimedUserIds.add(i.user.id);
        await UserService.addDongAtomic(i.user.id, 5000);
        await UserService.addItemAtomic(i.user.id, 'ngoc_lua_1', 1);

        await i.reply({
          content: `💥 **<@${i.user.id}>** dũng cảm **FIGHT** đả bại yêu ma và nhận **🔴 Ngọc Lửa Lv.1** + **+5,000 Đồng**!`,
        });
      }
    });

    collector.on('end', async () => {
      const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('event_done').setLabel('⚔️ ĐÃ KẾT THÚC').setStyle(ButtonStyle.Secondary).setDisabled(true)
      );
      await eventMsg.edit({ components: [disabledRow] }).catch(() => {});
    });
  }
}
