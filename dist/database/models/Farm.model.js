"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModel = void 0;
const mongoose_1 = require("mongoose");
const FarmSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    plots: [
        {
            oDat: { type: Number, required: true },
            hatGiong: { type: String, required: true },
            thoiGianTrong: { type: Date, default: Date.now },
            trangThai: { type: String, enum: ['DANG_LON', 'THU_HOACH'], default: 'DANG_LON' },
        },
    ],
}, { timestamps: true });
exports.FarmModel = (0, mongoose_1.model)('Farm', FarmSchema);
