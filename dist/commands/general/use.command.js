"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommand = useCommand;
const User_model_1 = require("../../database/models/User.model");
const UserService_1 = require("../../game/services/UserService");
const items_1 = require("../../game/data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function useCommand(message, args) {
    const userId = message.author.id;
    const rawItemId = args.join(' ').toLowerCase().trim();
    if (!rawItemId) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 HƯỚNG DẪN SỬ DỤNG & MẶC VẬT PHẨM')
            .setDescription('Vui lòng chọn mã vật phẩm hoặc thần dược muốn sử dụng:')
            .addFields({
            name: '📜 Thẻ Bỏ Qua Nhiệm Vụ (Cooldown 3 Giờ)',
            value: '• `vkl dung the_skip_nhiem_vu`',
            inline: true,
        }, {
            name: '🌸 Đan Dược Đột Phá (+1 Level)',
            value: '• `vkl dung dan_dot_pha`',
            inline: true,
        }, {
            name: '🪷 Linh Mộc Ưu Đàm (Hồi FULL 24h)',
            value: '• `vkl dung linh_moc_uu_dam`',
            inline: true,
        }, {
            name: '🍷 Thuốc Huyết Long (Hồi 100% HP & +50% Max HP)',
            value: '• `vkl dung thuoc_huyet_long`',
            inline: true,
        }, {
            name: '💧 Thuốc Linh Khí (Hồi 100% MP & +50% Max MP)',
            value: '• `vkl dung thuoc_linh_khi`',
            inline: true,
        }, {
            name: '💥 Đan Dược Cuồng Nộ (+25% ATK trong 30p)',
            value: '• `vkl dung dan_cuong_no`',
            inline: true,
        });
        await message.reply({ embeds: [embed] });
        return;
    }
    const aliases = {
        level_up: 'dan_dot_pha',
        dot_pha: 'dan_dot_pha',
        skip_quest: 'the_skip_nhiem_vu',
        skip_nhiem_vu: 'the_skip_nhiem_vu',
        reset_cd: 'bua_hoi_cooldown',
        cooldown_reset: 'bua_hoi_cooldown',
        double_exp: 'thuoc_nhan_doi_exp',
        exp_boost: 'thuoc_nhan_doi_exp',
        stat_buff: 'thien_linh_dan',
        loot_buff: 'bua_may_man',
        hp_elixir: 'thuoc_huyet_long',
        mp_elixir: 'thuoc_linh_khi',
        atk_buff: 'dan_cuong_no',
        def_buff: 'thuoc_kim_cuong',
        crit_buff: 'bua_bao_kich',
        coin_buff: 'bua_chieu_tai',
    };
    const itemId = aliases[rawItemId] || rawItemId.replace(/ +/g, '_');
    const itemDef = items_1.ITEMS[itemId];
    // NẾU LÀ TRANG BỊ VŨ KHÍ HOẶC ÁO GIÁP ➔ TỰ ĐỘNG THÁO ĐỒ CŨ TRẢ VỀ TÚI ĐỒ VÀ MẶC ĐỒ MỚI!
    if (itemDef && (itemDef.type === 'vukhi' || itemDef.type === 'aogiap')) {
        const result = await UserService_1.UserService.equipItemAtomic(userId, itemId);
        if (result.embed) {
            await message.reply({ embeds: [result.embed] });
        }
        else {
            await message.reply(result.message);
        }
        return;
    }
    // 📜 SÁCH XÓA NGHỀ TRUNG CỔ (RESET 24H COOLDOWN CHUYỂN CLASS PP)
    if (itemId === 'scroll_reset_job') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'scroll_reset_job', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **📜 Sách Xóa Nghề Trung Cổ** (`scroll_reset_job`)! Hãy mua trong Tiệm Thương Nhân (`vkl shop`) với giá **50.000 Vàng**!');
            return;
        }
        await UserService_1.UserService.updateCooldownAtomic(userId, 'producer_job_change', 0);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 XÓA NGHỀ THÀNH CÔNG — KYRISE RPG')
            .setDescription(`🎉 **Bạn đã sử dụng thành công 📜 Sách Xóa Nghề Trung Cổ!**\n\n` +
            `✨ Thời gian chờ 24h thực đổi Class Sản Xuất (PP) đã được reset **100%**!\n\n` +
            `👉 **Hãy gõ \`vkl job sel <war|mag|ran|ass> <min|alc|blk>\` để đổi sang Class Sản Xuất mới ngay lập tức!**`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 1. ĐAN DƯỢC ĐỘT PHÁ CẢNH GIỚI (TĂNG +1 LEVEL NGAY LẬP TỨC)
    if (itemId === 'dan_dot_pha') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'dan_dot_pha', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Đan Dược Đột Phá Cảnh Giới** (`dan_dot_pha`)!');
            return;
        }
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $inc: { 'canhGioi.capDo': 1 } });
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🌸 ĐỘT PHÁ CẢNH GIỚI THÀNH CÔNG!')
            .setDescription('Linh khí đại bùng nổ! Bạn đã sử dụng Đan Dược Đột Phá và **THĂNG THẲNG +1 LEVEL** ngay lập tức!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 2. LINH MỘC ƯU ĐÀM HỘ THỂ (HỒI MÁU/MANA LIÊN TỤC 24H)
    if (itemId === 'linh_moc_uu_dam') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'linh_moc_uu_dam', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Linh Mộc Ưu Đàm Hộ Thể** (`linh_moc_uu_dam`)!');
            return;
        }
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🪷 KÍCH HOẠT LINH MỘC ƯU ĐÀM!')
            .setDescription('Ưu đàm nở hoa! Nhân vật của bạn sẽ **TỰ ĐỘNG HỒI 100% HP & MP MỖI KHI ĐI SĂN** trong 24 Giờ!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 3. THẺ BỎ QUA NHIỆM VỤ (SKIP QUEST - BẮT BUỘC CHỜ COOLDOWN 3 GIỜ)
    if (itemId === 'the_skip_nhiem_vu') {
        const user = await UserService_1.UserService.getOrCreateUser(userId);
        // Kiểm tra Cooldown 3 Giờ (10,800,000 ms)
        const lastUsed = user.cooldowns?.get('skip_quest') || 0;
        const now = Date.now();
        const cooldownMs = 3 * 3600 * 1000; // 3 hours
        if (now - lastUsed < cooldownMs) {
            const remSec = Math.ceil((cooldownMs - (now - lastUsed)) / 1000);
            const hours = Math.floor(remSec / 3600);
            const minutes = Math.floor((remSec % 3600) / 60);
            const seconds = remSec % 60;
            let timeStr = '';
            if (hours > 0)
                timeStr += `${hours} giờ `;
            if (minutes > 0)
                timeStr += `${minutes} phút `;
            timeStr += `${seconds} giây`;
            await message.reply(`⏰ **COOLDOWN CÁO THỊ:** Bạn phải chờ **${timeStr.trim()}** nữa mới có thể tiếp tục dùng **Thẻ Bỏ Qua Nhiệm Vụ**!`);
            return;
        }
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'the_skip_nhiem_vu', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thẻ Bỏ Qua Nhiệm Vụ** (`the_skip_nhiem_vu`)!');
            return;
        }
        // Ghi nhận cooldown 3 giờ
        await UserService_1.UserService.updateCooldownAtomic(userId, 'skip_quest', now);
        // Trao toàn bộ phần thưởng Cáo Thị làng xóm
        const rewardDong = 30000;
        const rewardKimBao = 5;
        const rewardExp = 1000;
        await UserService_1.UserService.addDongAtomic(userId, rewardDong);
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $inc: { 'taiChinh.kimBao': rewardKimBao } });
        await UserService_1.UserService.addItemAtomic(userId, 'ruong_bac', 1);
        await UserService_1.UserService.applyBattleResults(userId, user.chiSo.hp, rewardExp, 0, false, user.canhGioi.capDo, []);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('📜 HOÀN THÀNH CÁO THỊ THÀNH CÔNG (SKIP)!')
            .setDescription(`Bạn đã dùng **Thẻ Bỏ Qua Nhiệm Vụ** và **HOÀN THÀNH THẮNG LỢI TOÀN BỘ CÁO THỊ NHIỆM VỤ!**\n\n` +
            `🎁 **Phần thưởng nhận được:**\n` +
            `• 🪙 **+${(0, formatters_1.formatDong)(rewardDong)}**\n` +
            `• 💎 **+${(0, formatters_1.formatKimBao)(rewardKimBao)}**\n` +
            `• 🟦 **1x Rương Bạc Thượng Cổ** (\`ruong_bac\`)\n` +
            `• 🌟 **+${rewardExp} EXP** *(Tự động thăng cấp khi đủ tu vi)*\n\n` +
            `⏰ *Nhiệm vụ tiếp theo sẽ phát sinh sau 3 Giờ!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // 4. THUỐC HỒI MÁU HP: HỒI 100% HP & MP
    if (itemId === 'potion_01a' || itemId === 'life_potion') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'potion_01a', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thuốc Hồi Máu HP** (`potion_01a`) trong túi đồ!');
            return;
        }
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 SỬ DỤNG THUỐC HP THÀNH CÔNG!')
            .setDescription('Bạn uống Dược Phép Hồi HP và được **HỒI 100% SINH LỰC (HP) & MANA (MP)**!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 5. THUỐC HUYẾT LONG (+50% MAX HP & HEAL FULL)
    if (itemId === 'thuoc_huyet_long') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'thuoc_huyet_long', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thuốc Huyết Long Tinh Chất** (`thuoc_huyet_long`)!');
            return;
        }
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🍷 UỐNG THUỐC HUYẾT LONG THÀNH CÔNG!')
            .setDescription('Máu rồng bùng nổ! Bạn được **HỒI 100% HP & TĂNG +50% MÁU TỐI ĐA (MAX HP)** trong 1 Giờ!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 6. THUỐC LINH KHÍ (+50% MAX MP & HEAL FULL)
    if (itemId === 'thuoc_linh_khi') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'thuoc_linh_khi', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thuốc Linh Khí Đại Bổ** (`thuoc_linh_khi`)!');
            return;
        }
        await UserService_1.UserService.healUserAtomic(userId);
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('💧 UỐNG THUỐC LINH KHÍ THÀNH CÔNG!')
            .setDescription('Mana dâng trào! Bạn được **HỒI 100% MP & TĂNG +50% MANA TỐI ĐA (MAX MP)** trong 1 Giờ!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 7. ĐAN DƯỢC CUỒNG NỘ (+25% ATK)
    if (itemId === 'dan_cuong_no') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'dan_cuong_no', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Đan Dược Cuồng Nộ** (`dan_cuong_no`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('💥 KÍCH HOẠT DƯỢC LỰC CUỒNG NỘ!')
            .setDescription('Sát khí ngút trời! Nhân vật được **+25% SÁT THƯƠNG (ATK)** trong 30 Phút!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 8. THUỐC KIM CƯƠNG (+25% DEF)
    if (itemId === 'thuoc_kim_cuong') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'thuoc_kim_cuong', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thuốc Kim Cương Hộ Thể** (`thuoc_kim_cuong`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🛡️ KÍCH HOẠT KIM CƯƠNG HỘ THỂ!')
            .setDescription('Thân thể mình đồng da sắt! Nhân vật được **+25% GIÁP (DEF)** trong 30 Phút!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 9. BÙA BẠO KÍCH (+15% CRIT RATE)
    if (itemId === 'bua_bao_kich') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'bua_bao_kich', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Bùa Bạo Kích Thần Tốc** (`bua_bao_kich`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎯 KÍCH HOẠT BÙA BẠO KÍCH!')
            .setDescription('Đòn đánh nhắm thẳng yếu huyệt! Nhận **+15% TỶ LỆ CHÍ MẠNG (CRIT RATE)** trong 30 Phút!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 10. BÙA CHIÊU TÀI (+50% COINS FROM HUNT)
    if (itemId === 'bua_chieu_tai') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'bua_chieu_tai', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Bùa Chiêu Tài Tiến Bảo** (`bua_chieu_tai`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('💰 KÍCH HOẠT BÙA CHIÊU TÀI!')
            .setDescription('Tài lộc dâng tràn! Nhận **+50% TIỀN ĐỒNG THƯỞNG** khi đi săn `vkl hunt` trong 1 Giờ!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 11. BÙA HỒI COOLDOWN SIÊU TỐC (COOLDOWN RESET)
    if (itemId === 'bua_hoi_cooldown') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'bua_hoi_cooldown', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Bùa Hồi Cooldown Siêu Tốc** (`bua_hoi_cooldown`)!');
            return;
        }
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { 'cooldowns.san': 0, 'cooldowns.don_cui': 0, 'cooldowns.dao_khoang': 0, 'cooldowns.cau_ca': 0, 'cooldowns.hai_thuoc': 0 } });
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('⚡ HỒI CHIÊU SIÊU TỐC!')
            .setDescription('Pháp lực bùng nổ! Tất cả thời gian chờ của **Đi Săn, Đốn Củi, Đào Khoáng, Câu Cá, Hái Thuốc** đã được **XÓA BỎ NGAY LẬP TỨC**!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 12. THUỐC NHÂN ĐÔI EXP (DOUBLE EXP BOOST)
    if (itemId === 'thuoc_nhan_doi_exp') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'thuoc_nhan_doi_exp', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thuốc Nhân Đôi EXP** (`thuoc_nhan_doi_exp`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🧪 KÍCH HOẠT NHÂN ĐÔI EXP!')
            .setDescription('Bạn uống thần dược linh khí! Nhận **+100% EXP (Gấp 2 lần)** từ tất cả quái vật & phụ bản trong 1 Giờ!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 13. THIÊN LINH ĐAN (+30% ATK & DEF)
    if (itemId === 'thien_linh_dan') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'thien_linh_dan', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Thiên Linh Đan Hộ Thể** (`thien_linh_dan`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🔮 CƯỜNG HÓA CHÂN KHÍ THÀNH CÔNG!')
            .setDescription('Chân khí hội tụ! Nhân vật được **+30% Sát Thương (ATK) & +30% Giáp (DEF)**!');
        await message.reply({ embeds: [embed] });
        return;
    }
    // 14. BÙA MAY MẮN (LOOT MULTIPLIER)
    if (itemId === 'bua_may_man') {
        const consumed = await UserService_1.UserService.consumeItemAtomic(userId, 'bua_may_man', 1);
        if (!consumed) {
            await message.reply('❌ Bạn không có **Bùa May Mắn Rớt Đồ** (`bua_may_man`)!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🍀 KÍCH HOẠT MAY MẮN RỚT ĐỒ!')
            .setDescription('Vận khí dâng cao! Đảm bảo **100% RỚT NGUYÊN LIỆU HIẾM** trong 10 lần `vkl hunt` tiếp theo!');
        await message.reply({ embeds: [embed] });
        return;
    }
    await message.reply('❌ Vật phẩm này không thể sử dụng trực tiếp.');
}
