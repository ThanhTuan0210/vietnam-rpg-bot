"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    hePhai: {
        type: String,
        default: null,
    },
    producerJob: {
        type: String,
        default: null,
    },
    danhHieu: {
        type: String,
        default: 'Dân Làng',
    },
    chiSo: {
        capDo: { type: Number, default: 1 },
        kinhNghiem: { type: Number, default: 0 },
        khuVuc: { type: Number, default: 1 },
        sinhLuc: { type: Number, default: 100 },
        sinhLucToiDa: { type: Number, default: 100 },
        satThuong: { type: Number, default: 15 },
        phongThu: { type: Number, default: 5 },
    },
    taiChinh: {
        dong: { type: Number, default: 100, min: 0 },
        kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
        vuKhi: { type: String, default: 'sword_01a' },
        aoGiap: { type: String, default: 'shield_01a' },
        phuPhepTier: { type: Number, default: 0 },
    },
    tuiDo: [
        {
            itemId: { type: String, required: true },
            soLuong: { type: Number, required: true, default: 1 },
        },
    ],
    cooldowns: {
        type: Map,
        of: Number,
        default: new Map(),
    },
}, {
    timestamps: true,
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
