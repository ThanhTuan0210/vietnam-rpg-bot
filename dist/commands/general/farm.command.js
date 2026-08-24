"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CROPS_BALANCED = void 0;
exports.farmCommand = farmCommand;
const Farm_model_1 = require("../../database/models/Farm.model");
const UserService_1 = require("../../game/services/UserService");
const embedBuilder_1 = require("../../utils/embedBuilder");
const formatters_1 = require("../../utils/formatters");
exports.CROPS_BALANCED = {
    hat_giong: {
        id: 'hat_giong',
        name: 'Hạt Giống Nông Nghiệp',
        icon: '🌱',
        seedPrice: 0,
        growMinutes: 15,
        yieldQty: 10,
        sellTotal: 2400,
        netProfit: 2400,
        roiPercent: 100,
        usage: 'Trồng từ túi đồ thu hoạch 10 Hạt Lúa Nước',
        rewardItem: 'lua_nuoc_hat',
    },
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
        rewardItem: 'lua_nuoc_hat',
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
            plots: Array.from({ length: 7 }, (_, i) => ({
                oDat: i + 1,
                hatGiong: '',
                thoiGianTrong: new Date(0),
                trangThai: 'TRONG',
            })),
        });
    }
    else if (farm.plots.length < 7) {
        // Tự động mở rộng lên đủ 7 ô đất cho người chơi
        for (let i = 1; i <= 7; i++) {
            if (!farm.plots.some((p) => p.oDat === i)) {
                farm.plots.push({
                    oDat: i,
                    hatGiong: '',
                    thoiGianTrong: new Date(0),
                    trangThai: 'TRONG',
                });
            }
        }
        farm.plots.sort((a, b) => a.oDat - b.oDat);
        await farm.save();
    }
    // --- GIEO HẠT GIỐNG ---
    if (subCmd === 'gieo_hat' || subCmd === 'gieo') {
        const cropKey = args[1]?.toLowerCase() || 'lua_nuoc';
        const plotNum = parseInt(args[2], 10) || 1;
        if (plotNum < 1 || plotNum > 7) {
            await message.reply('❌ Ô đất không hợp lệ! Vui lòng chọn từ Ô 1 tới Ô 7.');
            return;
        }
        const crop = exports.CROPS_BALANCED[cropKey];
        if (!crop) {
            await message.reply('❌ Hạt giống không hợp lệ! Các loại có sẵn: `hat_giong`, `lua_nuoc`, `dau_xanh`, `nep_nuong`, `sen_vang`');
            return;
        }
        const plotIndex = farm.plots.findIndex((p) => p.oDat === plotNum);
        const targetPlot = farm.plots[plotIndex];
        if (targetPlot && targetPlot.trangThai === 'DANG_LON' && targetPlot.hatGiong) {
            const existingCrop = exports.CROPS_BALANCED[targetPlot.hatGiong];
            const elapsed = Math.floor((Date.now() - new Date(targetPlot.thoiGianTrong).getTime()) / 60000);
            if (elapsed < (existingCrop?.growMinutes || 10)) {
                await message.reply(`❌ Ô đất ${plotNum} đang trồng **${existingCrop?.name || targetPlot.hatGiong}** chưa thu hoạch được!`);
                return;
            }
        }
        if (cropKey === 'hat_giong') {
            const removed = await UserService_1.UserService.removeItemAtomic(userId, 'hat_giong', 1);
            if (!removed) {
                await message.reply('❌ Bạn không có 🌱 **Hạt Giống Nông Nghiệp** trong túi đồ (`vn inv`)!');
                return;
            }
        }
        else {
            const paid = await UserService_1.UserService.deductDongAtomic(userId, crop.seedPrice);
            if (!paid) {
                await message.reply(`❌ Bạn không đủ ${(0, formatters_1.formatDong)(crop.seedPrice)} để mua hạt giống **${crop.name}**!`);
                return;
            }
        }
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
            .setDescription(`Bạn đã gieo **${crop.icon} ${crop.name}** vào **Ô đất ${plotNum}** (Chi phí: ${crop.seedPrice > 0 ? (0, formatters_1.formatDong)(crop.seedPrice) : '🌱 Từ túi đồ'})!\n\n` +
            `⏱️ **Thời gian phát triển:** ${crop.growMinutes} phút\n` +
            `📦 **Sản lượng thu hoạch:** ${crop.yieldQty} Nông sản (Trị giá ${(0, formatters_1.formatDong)(crop.sellTotal)})\n` +
            `💡 **Công dụng:** ${crop.usage}`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // --- THU HOẠCH NÔNG SẢN ---
    if (subCmd === 'thu_hoach' || subCmd === 'thuhoach') {
        let harvestedCount = 0;
        const harvestedSummary = {};
        const now = new Date();
        for (const plot of farm.plots) {
            if (plot.hatGiong && plot.trangThai !== 'TRONG') {
                const crop = exports.CROPS_BALANCED[plot.hatGiong];
                if (crop) {
                    const elapsedMinutes = (now.getTime() - new Date(plot.thoiGianTrong).getTime()) / 60000;
                    if (elapsedMinutes >= crop.growMinutes || plot.trangThai === 'THU_HOACH') {
                        await UserService_1.UserService.addItemAtomic(userId, crop.rewardItem, crop.yieldQty);
                        harvestedSummary[crop.name] = (harvestedSummary[crop.name] || 0) + crop.yieldQty;
                        plot.trangThai = 'TRONG';
                        plot.hatGiong = '';
                        harvestedCount++;
                    }
                }
            }
        }
        await farm.save();
        if (harvestedCount === 0) {
            await message.reply('⏳ Nông sản trên các ô đất chưa lớn xong, chưa đến lúc thu hoạch!');
            return;
        }
        const summaryText = Object.entries(harvestedSummary)
            .map(([name, qty]) => `• **${name}**: +${qty} Nông Sản`)
            .join('\n');
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle('🌾 THU HOẠCH NÔNG SẢN THÀNH CÔNG!')
            .setDescription(`Bạn đã thu hoạch nông sản từ **${harvestedCount} ô đất**:\n\n${summaryText}\n\n📦 *Nông sản đã được cất an toàn vào túi đồ!*`);
        await message.reply({ embeds: [embed] });
        return;
    }
    // --- BẢNG ĐIỀN TRANG 7 Ô ĐẤT & BẢNG GIÁ ---
    const plotList = farm.plots
        .map((p) => {
        if (!p.hatGiong || p.trangThai === 'TRONG') {
            return `• Ô ${p.oDat}: 🟫 **Đất Trống** — *Sẵn sàng gieo hạt (\`vn gieo [tên_hạt] ${p.oDat}\`)*`;
        }
        const crop = exports.CROPS_BALANCED[p.hatGiong];
        const elapsed = Math.floor((Date.now() - new Date(p.thoiGianTrong).getTime()) / 60000);
        const isReady = elapsed >= (crop?.growMinutes || 10);
        return `• Ô ${p.oDat}: ${crop?.icon || '🌱'} **${crop?.name || p.hatGiong}** — ${isReady ? '✅ **SẴN SÀNG THU HOẠCH** (`vn thu_hoach`)' : `⏳ Đang phát triển (${elapsed}/${crop?.growMinutes}m)`}`;
    })
        .join('\n');
    const cropCatalog = Object.values(exports.CROPS_BALANCED)
        .map((c) => `${c.icon} **${c.name}** (\`${c.id}\`): Mua Hạt ${c.seedPrice > 0 ? (0, formatters_1.formatDong)(c.seedPrice) : '🌱 Từ túi đồ'} ➔ Thu hoạch Bán sỉ ${(0, formatters_1.formatDong)(c.sellTotal)} (Lời +${(0, formatters_1.formatDong)(c.netProfit)}) | *${c.usage}*`)
        .join('\n');
    const embed = (0, embedBuilder_1.createDongSonEmbed)()
        .setTitle('🏡 ĐIỀN TRANG NÔNG TRẠI (7 Ô ĐẤT CÂN BẰNG)')
        .setDescription(`**Trạng thái 7 ô đất điền trang:**\n${plotList}\n\n` +
        `**📜 Bảng Giá Hạt Giống & Trị Giá Thu Hoạch:**\n${cropCatalog}\n\n` +
        `• \`vn gieo [tên_hạt] [ô_đất_1_đến_7]\` : Gieo hạt giống vào ô đất\n` +
        `• \`vn thu_hoach\` : Thu hoạch tất cả nông sản đã chín`);
    await message.reply({ embeds: [embed] });
}
