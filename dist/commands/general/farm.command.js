"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CROPS_BALANCED = void 0;
exports.farmCommand = farmCommand;
const Farm_model_1 = require("../../database/models/Farm.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
exports.CROPS_BALANCED = {
    lua_nuoc: {
        id: 'lua_nuoc',
        name: 'Lúa Nước Đồng Bằng',
        icon: '🌾',
        seedPrice: 800,
        growMinutes: 30,
        yieldQty: 5,
        sellTotal: 1200,
        netProfit: 400,
        roiPercent: 50,
        usage: 'Nấu Cơm Lam (Hồi 100% HP & MP)',
        rewardItem: 'bua_com_lam',
    },
    dau_xanh: {
        id: 'dau_xanh',
        name: 'Đậu Xanh Thần Độc',
        icon: '🫘',
        seedPrice: 3500,
        growMinutes: 120, // 2 giờ
        yieldQty: 8,
        sellTotal: 5000,
        netProfit: 1500,
        roiPercent: 43,
        usage: 'Pha chế Đan Dược & Thức ăn Linh Thú',
        rewardItem: 'dau_xanh_hat',
    },
    nep_nuong: {
        id: 'nep_nuong',
        name: 'Nếp Nương Tây Bắc',
        icon: '🌾',
        seedPrice: 15000,
        growMinutes: 360, // 6 giờ
        yieldQty: 10,
        sellTotal: 21000,
        netProfit: 6000,
        roiPercent: 40,
        usage: 'Gói Bánh Chưng Linh Thảo (+30% Stats)',
        rewardItem: 'nep_nuong_hat',
    },
    sen_vang: {
        id: 'sen_vang',
        name: 'Sen Vàng Cổ Hồ Thượng Cổ',
        icon: '🪷',
        seedPrice: 75000,
        growMinutes: 720, // 12 giờ
        yieldQty: 3,
        sellTotal: 100000,
        netProfit: 25000,
        roiPercent: 33,
        usage: 'Chế Kim Đan Hoàng Cung tăng vĩnh viễn HP',
        rewardItem: 'sen_vang_bup',
    },
};
async function farmCommand(message, args) {
    const userId = message.author.id;
    const subCmd = args[0]?.toLowerCase();
    let farm = await Farm_model_1.FarmModel.findOne({ userId });
    if (!farm) {
        farm = await Farm_model_1.FarmModel.create({
            userId,
            plots: [
                { oDat: 1, hatGiong: 'lua_nuoc', thoiGianTrong: new Date(), trangThai: 'THU_HOACH' },
                { oDat: 2, hatGiong: 'dau_xanh', thoiGianTrong: new Date(), trangThai: 'THU_HOACH' },
            ],
        });
    }
    if (subCmd === 'gieo_hat' || subCmd === 'gieo') {
        const cropKey = args[1]?.toLowerCase() || 'lua_nuoc';
        const plotNum = parseInt(args[2], 10) || 1;
        const crop = exports.CROPS_BALANCED[cropKey];
        if (!crop) {
            await message.reply('❌ Hạt giống không hợp lệ! (Có sẵn: `lua_nuoc`, `dau_xanh`, `nep_nuong`, `sen_vang`)');
            return;
        }
        const paid = await UserService_1.UserService.deductDongAtomic(userId, crop.seedPrice);
        if (!paid) {
            await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(crop.seedPrice)} để mua hạt giống **${crop.name}**!`);
            return;
        }
        const plotIndex = farm.plots.findIndex((p) => p.oDat === plotNum);
        const newPlot = {
            oDat: plotNum,
            hatGiong: cropKey,
            thoiGianTrong: new Date(),
            trangThai: 'DANG_LON',
        };
        if (plotIndex > -1) {
            farm.plots[plotIndex] = newPlot;
        }
        else {
            farm.plots.push(newPlot);
        }
        await farm.save();
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🌾 GIEO HẠT GIỐNG THÀNH CÔNG!')
            .setDescription(`Bạn đã mua hạt giống và gieo **${crop.icon} ${crop.name}** vào **Ô đất ${plotNum}** với giá ${(0, formatters_1.formatDong)(crop.seedPrice)}!\n\n` +
            `⏱️ **Thời gian lớn:** ${crop.growMinutes} phút\n` +
            `📦 **Sản lượng dự kiến:** ${crop.yieldQty} Nông sản (Tổng trị giá ${(0, formatters_1.formatDong)(crop.sellTotal)})\n` +
            `💡 **Công dụng:** ${crop.usage}`);
        await message.reply({ embeds: [embed] });
        return;
    }
    if (subCmd === 'thu_hoach' || subCmd === 'thuhoach') {
        let harvestedCount = 0;
        const now = new Date();
        for (const plot of farm.plots) {
            const crop = exports.CROPS_BALANCED[plot.hatGiong];
            if (crop) {
                const elapsedMinutes = (now.getTime() - new Date(plot.thoiGianTrong).getTime()) / 60000;
                if (elapsedMinutes >= crop.growMinutes || plot.trangThai === 'THU_HOACH') {
                    await UserService_1.UserService.addItemAtomic(userId, crop.rewardItem, crop.yieldQty);
                    plot.trangThai = 'THU_HOACH';
                    harvestedCount++;
                }
            }
        }
        await farm.save();
        if (harvestedCount === 0) {
            await message.reply('⏳ Nông sản trên các ô đất vẫn đang phát triển, chưa đến lúc thu hoạch!');
            return;
        }
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🌾 THU HOẠCH NÔNG SẢN THÀNH CÔNG!')
            .setDescription(`Bạn đã thu hoạch nông sản từ **${harvestedCount} ô đất** và cất vào kho!`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // Mặc định hiển thị Bảng Điền Trang & Tỷ suất ROI
    const plotList = farm.plots
        .map((p) => {
        const crop = exports.CROPS_BALANCED[p.hatGiong];
        const elapsed = Math.floor((Date.now() - new Date(p.thoiGianTrong).getTime()) / 60000);
        const isReady = elapsed >= (crop?.growMinutes || 10) || p.trangThai === 'THU_HOACH';
        return `• Ô ${p.oDat}: ${crop?.icon || '🌱'} **${crop?.name || p.hatGiong}** — ${isReady ? '✅ **SẴN SÀNG THU HOẠCH**' : `⏳ Đang lớn (${elapsed}/${crop?.growMinutes}m)`}`;
    })
        .join('\n');
    const cropCatalog = Object.values(exports.CROPS_BALANCED)
        .map((c) => `${c.icon} **${c.name}** (\`${c.id}\`): Mua Hạt Giống ${(0, formatters_1.formatDong)(c.seedPrice)} ➔ Thu hoạch Bán sỉ ${(0, formatters_1.formatDong)(c.sellTotal)} (Lời ròng +${(0, formatters_1.formatDong)(c.netProfit)}) | *${c.usage}*`)
        .join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🏡 ĐIỀN TRANG NÔNG TRẠI & BẢNG GIÁ HẠT GIỐNG CÂN BẰNG')
        .setDescription(`**Trạng thái ô đất điền trang:**\n${plotList}\n\n` +
        `**📜 Bảng Giá Hạt Giống & Trị Giá Thu Hoạch Cân Bằng:**\n${cropCatalog}\n\n` +
        `• \`vn gieo_hat [tên_hạt_giống] [ô_đất]\` : Gieo hạt giống\n` +
        `• \`vn thu_hoach\` : Thu hoạch nông sản`);
    await message.reply({ embeds: [embed] });
}
