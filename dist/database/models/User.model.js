"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelAdvanced = void 0;
const mongoose_1 = require("mongoose");
const UserAdvancedSchema = new mongoose_1.Schema({
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
    nguHanh: {
        type: String,
        default: 'HOA',
    },
    danhHieu: {
        type: String,
        default: '« Hiệp Sĩ Gothic Trung Cổ »',
    },
    canhGioi: {
        capDo: { type: Number, default: 1 },
        kinhNghiem: { type: Number, default: 0 },
        khuVuc: { type: Number, default: 1 },
    },
    chiSo: {
        hp: { type: Number, default: 100 },
        maxHp: { type: Number, default: 100 },
        mp: { type: Number, default: 50 },
        maxMp: { type: Number, default: 50 },
        satThuong: { type: Number, default: 15 },
        magicAtk: { type: Number, default: 10 },
        phongThu: { type: Number, default: 5 },
        magicRes: { type: Number, default: 5 },
        chiMang: { type: Number, default: 0.05 },
        critDmg: { type: Number, default: 1.50 },
        neTranh: { type: Number, default: 0.05 },
        armorPen: { type: Number, default: 0.0 },
        lifeSteal: { type: Number, default: 0.0 },
    },
    taiChinh: {
        dong: { type: Number, default: 5000, min: 0 },
        kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
        vuKhi: {
            itemId: { type: String, default: 'sword_01a' },
            capCuongHoa: { type: Number, default: 0 },
            bonusStat: { type: Number, default: 0 },
        },
        aoGiap: {
            itemId: { type: String, default: 'shield_01a' },
            capCuongHoa: { type: Number, default: 0 },
            bonusStat: { type: Number, default: 0 },
        },
    },
    soLanTrungSinh: { type: Number, default: 0 },
    diemCanCot: { type: Number, default: 0 },
    dailyFortune: {
        type: { type: String, default: null },
    },
    suDo: {
        suPhuId: { type: String },
        deTuIds: { type: [String], default: [] },
        diemCongDuc: { type: Number, default: 0 },
    },
    karma: {
        score: { type: Number, default: 0 },
        alignment: { type: String, default: 'TRUNG_LAP' },
    },
    tower: {
        highestFloor: { type: Number, default: 0 },
        trialPoints: { type: Number, default: 0 },
    },
    inventory: [
        {
            itemId: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            soLuong: { type: Number, default: 1 },
        },
    ],
    tuiDo: [
        {
            itemId: { type: String, required: true },
            soLuong: { type: Number, default: 1 },
            quantity: { type: Number, default: 1 },
        },
    ],
    cooldowns: {
        type: Map,
        of: Number,
        default: new Map(),
    },
}, { timestamps: true, strict: false });
exports.UserModelAdvanced = (0, mongoose_1.model)('UserAdvanced', UserAdvancedSchema);
