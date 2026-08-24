"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = require("../../database/models/User.model");
const items_1 = require("../data/items");
const embedBuilder_1 = require("../../utils/embedBuilder");
class UserService {
    /**
     * Tự động kiểm tra và nâng Cấp Độ (Level Up) nếu EXP tích lũy vượt quá mốc level
     */
    static async checkAndApplyLevelUp(userId) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return null;
        let level = user.canhGioi.capDo || 1;
        let exp = user.canhGioi.kinhNghiem || 0;
        let expMax = level * 100;
        let leveledUp = false;
        let originalLevel = level;
        while (exp >= expMax) {
            exp -= expMax;
            level += 1;
            expMax = level * 100;
            leveledUp = true;
        }
        if (leveledUp) {
            const levelDiff = level - originalLevel;
            const updatedUser = await User_model_1.UserModelAdvanced.findOneAndUpdate({ userId }, {
                $set: {
                    'canhGioi.capDo': level,
                    'canhGioi.kinhNghiem': exp,
                },
                $inc: {
                    'chiSo.maxHp': 50 * levelDiff,
                    'chiSo.maxMp': 20 * levelDiff,
                    'chiSo.satThuong': 10 * levelDiff,
                    'chiSo.phongThu': 3 * levelDiff,
                },
            }, { new: true });
            return updatedUser;
        }
        return user;
    }
    /**
     * Tạo mới hoặc lấy thông tin người dùng (Tự động nâng level nếu đủ EXP)
     */
    static async getOrCreateUser(userId) {
        let user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user) {
            user = await User_model_1.UserModelAdvanced.create({
                userId,
                canhGioi: { capDo: 1, kinhNghiem: 0, khuVuc: 1 },
                taiChinh: { dong: 5000, kimBao: 0 },
                chiSo: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, satThuong: 10, magicAtk: 10, phongThu: 2, magicRes: 2, chiMang: 0.05, critDmg: 1.5, neTranh: 0.05, armorPen: 0, lifeSteal: 0 },
                hePhai: null,
                trangBi: {
                    vuKhi: { itemId: 'gay_tam_vong', capCuongHoa: 0, bonusStat: 0 },
                    aoGiap: { itemId: 'ao_vai_tho', capCuongHoa: 0, bonusStat: 0 },
                },
                tuiDo: [],
                cooldowns: new Map(),
            });
        }
        else {
            // Tự động kiểm tra và tăng level nếu đang thừa EXP
            const updated = await this.checkAndApplyLevelUp(userId);
            if (updated)
                user = updated;
        }
        return user;
    }
    /**
     * Kiểm tra cooldown điểm danh hàng ngày
     */
    static checkDailyRewardCooldown(user) {
        const lastUsed = user.cooldowns?.get('daily_reward') || 0;
        const now = Date.now();
        const duration = 86400000; // 24 Hours
        if (now - lastUsed >= duration) {
            return { isReady: true, formattedTime: '0s' };
        }
        const remSec = Math.ceil((duration - (now - lastUsed)) / 1000);
        const hours = Math.floor(remSec / 3600);
        const minutes = Math.floor((remSec % 3600) / 60);
        const seconds = remSec % 60;
        let formattedTime = '';
        if (hours > 0)
            formattedTime += `${hours} giờ `;
        if (minutes > 0)
            formattedTime += `${minutes} phút `;
        formattedTime += `${seconds} giây`;
        return { isReady: false, formattedTime: formattedTime.trim() };
    }
    /**
     * Cộng/trừ tiền Đồng của người dùng an toàn atomic
     */
    static async addDongAtomic(userId, amount) {
        return await User_model_1.UserModelAdvanced.findOneAndUpdate({ userId }, { $inc: { 'taiChinh.dong': amount } }, { new: true });
    }
    /**
     * Khấu trừ tiền Đồng của người dùng
     */
    static async deductDongAtomic(userId, amount) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user || user.taiChinh.dong < amount)
            return false;
        await User_model_1.UserModelAdvanced.updateOne({ userId, 'taiChinh.dong': { $gte: amount } }, { $inc: { 'taiChinh.dong': -amount } });
        return true;
    }
    /**
     * Thêm vật phẩm vào túi đồ người dùng
     */
    static async addItemAtomic(userId, itemId, quantity = 1) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return false;
        const existingIndex = user.tuiDo.findIndex((i) => i.itemId === itemId);
        if (existingIndex > -1) {
            const newQty = user.tuiDo[existingIndex].soLuong + quantity;
            if (newQty <= 0) {
                await User_model_1.UserModelAdvanced.updateOne({ userId }, { $pull: { tuiDo: { itemId } } });
            }
            else {
                await User_model_1.UserModelAdvanced.updateOne({ userId, 'tuiDo.itemId': itemId }, { $set: { 'tuiDo.$.soLuong': newQty } });
            }
        }
        else if (quantity > 0) {
            await User_model_1.UserModelAdvanced.updateOne({ userId }, { $push: { tuiDo: { itemId, soLuong: quantity, doHiem: 'THUONG' } } });
        }
        return true;
    }
    /**
     * Trừ vật phẩm trong túi đồ người dùng
     */
    static async removeItemAtomic(userId, itemId, quantity = 1) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return false;
        const existingSlot = user.tuiDo.find((i) => i.itemId === itemId);
        if (!existingSlot || existingSlot.soLuong < quantity)
            return false;
        return await this.addItemAtomic(userId, itemId, -quantity);
    }
    /**
     * Tiêu hao vật phẩm nguyên tố
     */
    static async consumeItemAtomic(userId, itemId, quantity = 1) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return false;
        const item = user.tuiDo.find((i) => i.itemId === itemId);
        if (!item || item.soLuong < quantity) {
            return false;
        }
        return await this.addItemAtomic(userId, itemId, -quantity);
    }
    /**
     * 🛡️ TRANG BỊ VẬT PHẨM MỚI & THÁO ĐỒ CŨ TRẢ VỀ TÚI ĐỒ (KÈM GỢI Ý LỆNH HƯỚNG DẪN THÔNG MINH)
     */
    static async equipItemAtomic(userId, itemId) {
        const user = await UserService.getOrCreateUser(userId);
        if (!user)
            return { success: false, message: 'Không tìm thấy người dùng.' };
        const itemDef = items_1.ITEMS[itemId];
        if (!itemDef || (itemDef.type !== 'vukhi' && itemDef.type !== 'aogiap')) {
            return { success: false, message: '❌ Vật phẩm này không thể trang bị!' };
        }
        // Kiểm tra Level
        if (user.canhGioi.capDo < (itemDef.requiredLevel || 1)) {
            return {
                success: false,
                message: `🔒 Bạn chưa đủ **Level ${itemDef.requiredLevel}** để trang bị **${itemDef.name}** (\`${itemId}\`)!`,
            };
        }
        // Kiểm tra vật phẩm có trong túi đồ không
        const userItem = user.tuiDo.find((i) => i.itemId === itemId);
        if (!userItem || userItem.soLuong < 1) {
            return { success: false, message: `❌ Bạn không có **${itemDef.name}** (\`${itemId}\`) trong túi đồ!` };
        }
        const slotKey = itemDef.type === 'vukhi' ? 'vuKhi' : 'aoGiap';
        const slotTypeName = itemDef.type === 'vukhi' ? 'vukhi' : 'aogiap';
        const currentEquipped = user.trangBi?.[slotKey];
        // Tháo đồ cũ trả về túi đồ (nếu có)
        if (currentEquipped && currentEquipped.itemId) {
            await this.addItemAtomic(userId, currentEquipped.itemId, 1);
        }
        // Xóa 1 món mới khỏi túi đồ
        await this.consumeItemAtomic(userId, itemId, 1);
        // Mặc món mới vào thân
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { [`trangBi.${slotKey}`]: { itemId, capCuongHoa: 0, bonusStat: 0 } } });
        const oldName = currentEquipped?.itemId ? items_1.ITEMS[currentEquipped.itemId]?.name || currentEquipped.itemId : 'không có';
        const oldIdStr = currentEquipped?.itemId ? `(\`${currentEquipped.itemId}\`)` : '';
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`🥋 TRANG BỊ THÀNH CÔNG — ${itemDef.name.toUpperCase()}`)
            .setDescription(`Bạn đã tháo **${oldName}** ${oldIdStr} cất lại vào túi đồ và mặc lên người ${itemDef.icon} **${itemDef.name}** (\`${itemId}\`)!`)
            .addFields({
            name: '💡 Gợi Ý Lệnh Cởi / Tháo Đồ',
            value: `• Tháo trang bị này cất lại vào túi: \`vn unequip ${slotTypeName}\` hoặc \`vn thao ${slotTypeName}\``,
            inline: false,
        }, {
            name: '💡 Gợi Ý Lệnh Mặc Đồ Khác',
            value: `• Mặc món đồ khác: \`vn equip [mã_id]\` hoặc \`vn dung [mã_id]\``,
            inline: false,
        }, {
            name: '💡 Gợi Ý Kiểm Tra Trạng Thái',
            value: `• Xem Hồ Sơ & Lực Chiến: \`vn profile\` (hoặc \`vn p\`)\n• Xem Túi Đồ: \`vn inv\` (hoặc \`vn i\`)`,
            inline: false,
        });
        return {
            success: true,
            message: '',
            embed,
        };
    }
    /**
     * 🥋 THÁO TRANG BỊ ĐANG MẶC TRẢ VỀ TÚI ĐỒ
     */
    static async unequipItemAtomic(userId, slotType) {
        const user = await UserService.getOrCreateUser(userId);
        if (!user)
            return { success: false, message: 'Không tìm thấy người dùng.' };
        const slotKey = slotType === 'vukhi' ? 'vuKhi' : 'aoGiap';
        const currentEquipped = user.trangBi?.[slotKey];
        if (!currentEquipped || !currentEquipped.itemId || currentEquipped.itemId === 'none') {
            return { success: false, message: `❌ Vị trí ${slotType === 'vukhi' ? 'Vũ khí' : 'Áo giáp'} hiện đang trống (none), không có trang bị nào để tháo!` };
        }
        const itemDef = items_1.ITEMS[currentEquipped.itemId] || { name: currentEquipped.itemId, icon: '🛡️' };
        // Trả về túi đồ
        await this.addItemAtomic(userId, currentEquipped.itemId, 1);
        // Đặt vị trí trang bị về none
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { [`trangBi.${slotKey}`]: { itemId: 'none', capCuongHoa: 0, bonusStat: 0 } } });
        const embed = (0, embedBuilder_1.createDongSonEmbed)()
            .setTitle(`🥋 THÁO ĐỒ CẤT VÀO TÚI THÀNH CÔNG!`)
            .setDescription(`Bạn đã tháo ${itemDef.icon} **${itemDef.name}** (\`${currentEquipped.itemId}\`) và cất lại an toàn vào túi đồ!`)
            .addFields({
            name: '💡 Gợi Ý Lệnh Mặc Lại Trang Bị',
            value: `• Mặc trang bị từ túi đồ: \`vn equip ${currentEquipped.itemId}\` hoặc \`vn dung ${currentEquipped.itemId}\``,
            inline: false,
        }, {
            name: '💡 Gợi Ý Rèn Đồ Mới Cấp Cao',
            value: `• Rèn Vũ khí / Áo giáp cấp cao: \`vn craft sword\` hoặc \`vn craft armor\``,
            inline: false,
        }, {
            name: '💡 Gợi Ý Lệnh Xem Túi Đồ',
            value: `• Kiểm tra túi đồ: \`vn inv\` (hoặc \`vn i\`)`,
            inline: false,
        });
        return {
            success: true,
            message: '',
            embed,
        };
    }
    /**
     * Hồi máu 100% Sinh Lực cho nhân vật
     */
    static async healUserAtomic(userId) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return null;
        return await User_model_1.UserModelAdvanced.findOneAndUpdate({ userId }, { $set: { 'chiSo.hp': user.chiSo.maxHp, 'chiSo.mp': user.chiSo.maxMp } }, { new: true });
    }
    /**
     * Cập nhật thời gian hồi chiêu
     */
    static async updateCooldownAtomic(userId, commandKey, timestamp) {
        await User_model_1.UserModelAdvanced.updateOne({ userId }, { $set: { [`cooldowns.${commandKey}`]: timestamp } });
    }
    /**
     * Áp dụng kết quả trận đấu (Kinh nghiệm, Tiền Đồng, Rớt Đồ, Tăng Cấp Tự Động)
     */
    static async applyBattleResults(userId, newHp, expGained, dongGained, isBoss = false, currentLevel = 1, droppedItems = []) {
        const user = await User_model_1.UserModelAdvanced.findOne({ userId });
        if (!user)
            return { levelUp: false, newLevel: currentLevel };
        let totalExp = (user.canhGioi.kinhNghiem || 0) + expGained;
        let level = user.canhGioi.capDo || 1;
        let expMax = level * 100;
        let levelUp = false;
        while (totalExp >= expMax) {
            totalExp -= expMax;
            level += 1;
            expMax = level * 100;
            levelUp = true;
        }
        const updateQuery = {
            $set: {
                'chiSo.hp': newHp,
                'canhGioi.kinhNghiem': totalExp,
                'canhGioi.capDo': level,
            },
            $inc: {
                'taiChinh.dong': dongGained,
            },
        };
        if (levelUp) {
            const levelDiff = level - user.canhGioi.capDo;
            updateQuery.$inc['chiSo.maxHp'] = 50 * levelDiff;
            updateQuery.$inc['chiSo.maxMp'] = 20 * levelDiff;
            updateQuery.$inc['chiSo.satThuong'] = 10 * levelDiff;
            updateQuery.$inc['chiSo.phongThu'] = 3 * levelDiff;
        }
        await User_model_1.UserModelAdvanced.updateOne({ userId }, updateQuery);
        for (const drop of droppedItems) {
            await this.addItemAtomic(userId, drop.itemId, drop.quantity);
        }
        return { levelUp, newLevel: level };
    }
}
exports.UserService = UserService;
