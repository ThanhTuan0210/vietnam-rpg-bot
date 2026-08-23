"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonsterModelAdvanced = void 0;
const mongoose_1 = require("mongoose");
const MonsterAdvancedSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    ten: { type: String, required: true },
    khuVuc: { type: Number, required: true },
    isBoss: { type: Boolean, default: false },
    stats: {
        hp: { type: Number, required: true },
        maxHp: { type: Number, required: true },
        atk: { type: Number, required: true },
        def: { type: Number, required: true },
        speed: { type: Number, default: 10 },
    },
    skills: [
        {
            tenChieu: { type: String, required: true },
            satThuongHeSo: { type: Number, required: true },
            hieuUng: { type: String, enum: ['CHOANG', 'THIEU_DOT', 'GIAM_GIAP', 'KHIEN', 'HUU_ANH'] },
            mpCost: { type: Number, default: 0 },
        },
    ],
    lootTable: [
        {
            itemId: { type: String, required: true },
            tyLe: { type: Number, required: true },
            soLuongMin: { type: Number, required: true },
            soLuongMax: { type: Number, required: true },
        },
    ],
    icon: { type: String, default: '👾' },
    description: { type: String, default: '' },
});
exports.MonsterModelAdvanced = (0, mongoose_1.model)('MonsterAdvanced', MonsterAdvancedSchema);
