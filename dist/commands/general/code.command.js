"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeCommand = codeCommand;
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
async function codeCommand(message, args) {
    const userId = message.author.id;
    const codeStr = args[0]?.toUpperCase();
    const validCodes = {
        VKL2026: {
            rewardName: '🎁 Quà Tân Thủ Gothic vkl2026',
            dong: 50000,
            items: [
                { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 10 },
                { itemId: 'ingot_01a', name: 'Thỏi Đồng Cổ', icon: '🧱', qty: 10 },
                { itemId: 'crystal_01a', name: 'Tinh Thạch Thượng Cổ', icon: '🔮', qty: 5 },
            ],
        },
        EXCALIBUR: {
            rewardName: '⚔️ Quà Hoàng Gia Excalibur',
            dong: 30000,
            items: [
                { itemId: 'sword_01a', name: 'Kiếm Sơ Cấp Trung Cổ', icon: '⚔️', qty: 1 },
                { itemId: 'shield_01a', name: 'Khiên Thép Kị Sĩ', icon: '🛡️', qty: 1 },
                { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối Tầng 1', icon: '🗝️', qty: 5 },
                { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ', icon: '🧰', qty: 3 },
            ],
        },
        MEDIEVALVIP: {
            rewardName: '👑 Quà Siêu VIP Medieval',
            dong: 100000,
            items: [
                { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 1 },
                { itemId: 'gem_01a', name: 'Hồng Ngọc Trung Cổ', icon: '💎', qty: 5 },
                { itemId: 'potion_03a', name: 'Ma Dược Kích Rèn Thượng Cổ', icon: '🧪', qty: 5 },
            ],
        },
        RESETJOB: {
            rewardName: '📜 Quà Tự Do Đổi Nghề Trung Cổ',
            dong: 50000,
            items: [
                { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 2 },
                { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 10 },
            ],
        },
        RESTORE: {
            rewardName: '🎁 ĐẠI QUÀ HOÀN TÁC TRANG BỊ & NGUYÊN LIỆU',
            dong: 200000,
            items: [
                { itemId: 'wood_01a', name: 'Gỗ Sồi Cổ Tier 1.1', icon: '🪵', qty: 10 },
                { itemId: 'wood_01b', name: 'Gỗ Thông Gothic Tier 1.2', icon: '🪵', qty: 10 },
                { itemId: 'ingot_01a', name: 'Thỏi Kim Loại Tier 1.1', icon: '🧱', qty: 10 },
                { itemId: 'crystal_01a', name: 'Tinh Thạch Ma Thuật Tier 1.1', icon: '🔮', qty: 10 },
                { itemId: 'key_01a', name: 'Chìa Khóa Ngục Tối Tier 1.1', icon: '🗝️', qty: 10 },
                { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP Tier 1.1', icon: '🧪', qty: 10 },
                { itemId: 'potion_03a', name: 'Ma Dược Kích Rèn Tier 3.1', icon: '🧪', qty: 5 },
                { itemId: 'sword_01a', name: 'Thép Kiếm Gothic Tier 1', icon: '⚔️', qty: 1 },
                { itemId: 'shield_01a', name: 'Khiên Thép Gothic Tier 1', icon: '🛡️', qty: 1 },
                { itemId: 'gift_01a', name: 'Rương Báu Thượng Cổ Tier 1.1', icon: '🧰', qty: 5 },
                { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 5 },
                { itemId: 'gem_01a', name: 'Hồng Ngọc Khảm Giáp Tier 1.1', icon: '💎', qty: 5 },
            ],
        },
        DOINGHE: {
            rewardName: '📜 Quà Tự Do Đổi Nghề Trung Cổ',
            dong: 50000,
            items: [
                { itemId: 'scroll_reset_job', name: 'Sách Xóa Nghề Trung Cổ', icon: '📜', qty: 2 },
                { itemId: 'potion_01a', name: 'Thuốc Hồi Máu HP', icon: '🧪', qty: 10 },
            ],
        },
    };
    if (!codeStr || !validCodes[codeStr]) {
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🎁 DANH SÁCH MÃ GIFTCODE SIÊU XỊN (PREFIX: vkl)')
            .setDescription(`📌 **Cú pháp nhận quà:** \`vkl code <mã_giftcode>\`\n\n` +
            `🔥 **4 MÃ CODE ĐANG KÍCH HOẠT THÀNH CÔNG:**\n\n` +
            `1. 📜 **\`RESETJOB\`** (hoặc \`DOINGHE\`) — **TẶNG 2x 📜 SÁCH XÓA NGHỀ (Trị giá 100.000 Vàng) + 50.000 Vàng + 10x Thuốc HP!**\n` +
            `2. 🎁 **\`VKL2026\`** — Nhận 50.000 Vàng + 10x Thuốc HP + 10x Thỏi Đồng + 5x Tinh Thạch\n` +
            `3. ⚔️ **\`EXCALIBUR\`** — Nhận 1x Kiếm Kị Sĩ + 1x Khiên Thép + 5x Chìa Khóa Ngục Tối + 3x Rương Báu\n` +
            `4. 👑 **\`MEDIEVALVIP\`** — Nhận 100.000 Vàng + 1x 📜 Sách Xóa Nghề + 5x Hồng Ngọc + 5x Ma Dược`);
        await message.reply({ embeds: [embed] });
        return;
    }
    const user = await UserService_1.UserService.getOrCreateUser(userId);
    const claimedKey = `code_${codeStr.toLowerCase()}`;
    const hasClaimed = user.cooldowns?.get(claimedKey);
    if (hasClaimed) {
        await message.reply(`⚠️ **Bạn đã nhận mã Giftcode \`${codeStr}\` rồi!** Mỗi người chơi chỉ được nhận 1 lần.`);
        return;
    }
    const codeData = validCodes[codeStr];
    user.taiChinh.dong += codeData.dong;
    await UserService_1.UserService.updateCooldownAtomic(userId, claimedKey, Date.now());
    let itemRewardText = '';
    for (const item of codeData.items) {
        await UserService_1.UserService.addItemAtomic(userId, item.itemId, item.qty);
        itemRewardText += `• **${item.qty}x** ${item.icon} **${item.name}** (\`${item.itemId}\`)\n`;
    }
    await user.save();
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle(`🎉 NHẬP CODE THÀNH CÔNG — ${codeData.rewardName.toUpperCase()}`)
        .setDescription(`✨ **Chúc mừng ${message.author.username} đã nhận thưởng từ Mã Giftcode \`${codeStr}\`!**\n\n` +
        `💰 **Vàng Thưởng:** \`+${(0, formatters_1.formatDong)(codeData.dong)}\`\n\n` +
        `🎁 **VẬT PHẨM ĐOẠT ĐƯỢC:**\n${itemRewardText}\n` +
        `💡 *Vật phẩm đã được chuyển trực tiếp vào Túi Đồ (\`vkl i\`)!\n` +
        `💡 Dùng Sách Xóa Nghề bằng lệnh: \`vkl use scroll_reset_job\`*`);
    await message.reply({ embeds: [embed] });
}
