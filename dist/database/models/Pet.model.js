"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetModel = void 0;
const mongoose_1 = require("mongoose");
const PetSchema = new mongoose_1.Schema({
    petId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true, index: true },
    ten: { type: String, required: true },
    loai: {
        type: String,
        enum: ['BACH_HO', 'HUYEN_VU', 'HAC_LONG', 'CHIM_LAC'],
        required: true,
    },
    bac: { type: Number, default: 1, min: 1, max: 5 },
    capDo: { type: Number, default: 1 },
    doNo: { type: Number, default: 100, min: 0, max: 100 },
    kyNangNoiTai: { type: String, default: 'Tự cứu sinh khi 0 HP (Hồi 30% HP)' },
    dangThuDuHi: { type: Boolean, default: false },
    thoiGianTroVe: { type: Date },
}, { timestamps: true });
exports.PetModel = (0, mongoose_1.model)('Pet', PetSchema);
