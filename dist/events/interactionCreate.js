"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onInteractionCreate = onInteractionCreate;
const discord_js_1 = require("discord.js");
const UserService_1 = require("../game/services/UserService");
const embedBuilder_1 = require("../utils/embedBuilder");
const combo_command_1 = require("../commands/general/combo.command");
const dungeon_command_1 = require("../commands/general/dungeon.command");
const tuido_1 = require("../commands/general/tuido");
const nhanvat_1 = require("../commands/general/nhanvat");
const vault_command_1 = require("../commands/general/vault.command");
const trade_command_1 = require("../commands/general/trade.command");
const detu_command_1 = require("../commands/general/detu.command");
const pet_command_1 = require("../commands/general/pet.command");
const slots_command_1 = require("../commands/minigames/slots.command");
const master_menu_command_1 = require("../commands/general/master_menu.command");
const job_command_1 = require("../commands/general/job.command");
const HourlyEventService_1 = require("../game/services/HourlyEventService");
/**
 * Tạo Mock Message Object gắn đúng thông tin người bấm nút (interaction.user)
 */
function createMockMessage(interaction) {
    return {
        author: interaction.user,
        channel: interaction.channel,
        guild: interaction.guild,
        member: interaction.member,
        client: interaction.client,
        reply: async (options) => {
            if (interaction.deferred || interaction.replied) {
                return await interaction.followUp(options);
            }
            else {
                return await interaction.reply(options);
            }
        },
    };
}
async function onInteractionCreate(interaction) {
    if (!interaction.isButton() && !interaction.isStringSelectMenu())
        return;
    try {
        const user = await UserService_1.UserService.getOrCreateUser(interaction.user.id);
        const mockMsg = createMockMessage(interaction);
        // --- BUTTON INTERACTIONS ---
        if (interaction.isButton()) {
            const customId = interaction.customId;
            // Handle Class Selection Step 1 (Combat Class)
            if (customId.startsWith('job_combat_')) {
                const combat = customId.replace('job_combat_', '');
                user.hePhai = combat;
                await user.save();
                const embed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle('🎭 KHỞI TẠO NHÂN VẬT - BƯỚC 2: CHỌN CLASS SẢN XUẤT (PP)')
                    .setDescription(`🎉 **Bạn đã chọn Class Chiến Đấu:** \`${combat.toUpperCase()}\`!\n\n` +
                    `🔨 **Bây giờ hãy chọn 1 trong 3 Class Sản Xuất (PP) để đóng góp cho Kho Vault Tổ Đội:**\n` +
                    `• **🪨 Miner (Thợ Mỏ):** Đào quặng, tinh thạch & ngọc quý\n` +
                    `• **🧪 Alchemist (Bào Chế):** Luyện ma dược hồi HP/MP & thuốc kích rèn\n` +
                    `• **🔨 Blacksmith (Thợ Rèn):** Rèn vũ khí, trang bị & cuốc mỏ`);
                const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('job_producer_miner').setLabel('🪨 Miner (Thợ Mỏ)').setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder().setCustomId('job_producer_alchemist').setLabel('🧪 Alchemist (Bào Chế)').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('job_producer_blacksmith').setLabel('🔨 Blacksmith (Thợ Rèn)').setStyle(discord_js_1.ButtonStyle.Danger));
                await interaction.update({ embeds: [embed], components: [row] });
                return;
            }
            // Handle Class Selection Step 2 (Producer Class)
            if (customId.startsWith('job_producer_')) {
                const producer = customId.replace('job_producer_', '');
                user.producerJob = producer;
                await user.save();
                const embed = (0, embedBuilder_1.createDongSonEmbed)()
                    .setTitle('🎉 TẠO NHÂN VẬT THÀNH CÔNG! - CHÀO MỪNG ĐẾN KYRISE RPG')
                    .setDescription(`✨ **Chúc mừng ${interaction.user.username}!** Bạn đã hoàn tất chọn Song Phái Dual-Class:\n\n` +
                    `⚔️ **Class Chiến Đấu:** \`${(user.hePhai || '').toString().toUpperCase()}\`\n` +
                    `🔨 **Class Sản Xuất (PP):** \`${producer.toUpperCase()}\`\n\n` +
                    `🚀 **Tất cả tính năng đã được mở khóa! Gõ \`vkl\` hoặc bấm nút bên dưới để bắt đầu chơi!**`);
                const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId('cmd_master_menu').setLabel('🎮 Bảng Master Menu (vkl)').setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder().setCustomId('cmd_combo').setLabel('⚡ Lao Động Combo (vkl w)').setStyle(discord_js_1.ButtonStyle.Primary));
                await interaction.update({ embeds: [embed], components: [row] });
                return;
            }
            // Handle Event Claim Button
            if (customId.startsWith('event_claim_')) {
                const eventId = customId.replace('event_claim_', '');
                await HourlyEventService_1.HourlyEventService.handleClaim(interaction, eventId);
                return;
            }
            // Action Buttons
            if (customId === 'cmd_master_menu') {
                await (0, master_menu_command_1.masterMenuCommand)(mockMsg);
                return;
            }
            if (customId === 'cmd_combo') {
                await (0, combo_command_1.comboAllCommand)(mockMsg);
                return;
            }
            if (customId.startsWith('cmd_dungeon')) {
                const floorStr = customId.replace('cmd_dungeon_', '').replace('cmd_dungeon', '');
                const floor = parseInt(floorStr) || 1;
                await (0, dungeon_command_1.dungeonCommand)(mockMsg, [floor.toString()]);
                return;
            }
            if (customId === 'cmd_tuido') {
                await (0, tuido_1.tuiDoCommand)(mockMsg);
                return;
            }
            if (customId === 'cmd_profile') {
                await (0, nhanvat_1.nhanVatCommandAdvanced)(mockMsg);
                return;
            }
            if (customId === 'cmd_vault') {
                await (0, vault_command_1.vaultCommand)(mockMsg, []);
                return;
            }
            if (customId === 'cmd_trade') {
                await (0, trade_command_1.tradeCommand)(mockMsg, []);
                return;
            }
        }
        // --- SELECT MENU INTERACTIONS ---
        if (interaction.isStringSelectMenu()) {
            const selectedValue = interaction.values[0];
            if (selectedValue === 'menu_job') {
                await (0, job_command_1.jobCommand)(mockMsg, []);
                return;
            }
            if (selectedValue === 'menu_inventory') {
                await (0, tuido_1.tuiDoCommand)(mockMsg);
                return;
            }
            if (selectedValue === 'menu_profile') {
                await (0, nhanvat_1.nhanVatCommandAdvanced)(mockMsg);
                return;
            }
            if (selectedValue === 'menu_vault') {
                await (0, vault_command_1.vaultCommand)(mockMsg, []);
                return;
            }
            if (selectedValue === 'menu_trade') {
                await (0, trade_command_1.tradeCommand)(mockMsg, []);
                return;
            }
            if (selectedValue === 'menu_detu') {
                await (0, detu_command_1.detuCommand)(mockMsg, []);
                return;
            }
            if (selectedValue === 'menu_pet') {
                await (0, pet_command_1.petCommand)(mockMsg, []);
                return;
            }
            if (selectedValue === 'menu_dungeon') {
                await (0, dungeon_command_1.dungeonCommand)(mockMsg, ['1']);
                return;
            }
            if (selectedValue === 'menu_minigames') {
                await (0, slots_command_1.slotsCommand)(mockMsg, ['100']);
                return;
            }
        }
    }
    catch (err) {
        console.error('❌ Lỗi xử lý Interaction:', err);
        if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '⚠️ Đã xảy ra lỗi khi xử lý nút bấm, vui lòng thử lại!', ephemeral: true }).catch(() => { });
        }
    }
}
