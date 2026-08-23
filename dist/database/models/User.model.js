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
        enum: ['DUNG_TUONG', 'DAO_SI', 'THO_SAN', null],
        default: null,
    },
    nguHanh: {
        type: String,
        enum: ['KIM', 'MOC', 'THUY', 'HOA', 'THO'],
        default: 'HOA',
    },
    danhHieu: {
        type: String,
        default: '« Đệ Nhất Kiếm Thần »',
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
        dong: { type: Number, default: 100, min: 0 },
        kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
        vuKhi: {
            itemId: { type: String, default: 'none' },
            capCuongHoa: { type: Number, default: 0 },
            bonusStat: { type: Number, default: 0 },
            khamNgoc: { type: String, default: '' },
        },
        aoGiap: {
            itemId: { type: String, default: 'none' },
            capCuongHoa: { type: Number, default: 0 },
            bonusStat: { type: Number, default: 0 },
            khamNgoc: { type: String, default: '' },
        },
        phapBao: {
            itemId: { type: String, default: 'none' },
            capCuongHoa: { type: Number, default: 0 },
            hieuUng: { type: String, default: '' },
        },
        linhThu: {
            itemId: { type: String, default: 'none' },
            name: { type: String, default: 'none' },
            bac: { type: Number, default: 0 },
        },
    },
    dungCu: {
        riu: { type: Number, default: 1 },
        canCau: { type: Number, default: 1 },
        cuoc: { type: Number, default: 1 },
        gioThuoc: { type: Number, default: 1 },
    },
    soLanTrungSinh: { type: Number, default: 0 },
    diemCanCot: { type: Number, default: 0 },
    diemTiemNang: {
        tocDoThuHoach: { type: Number, default: 0 },
        giamCooldown: { type: Number, default: 0 },
        tyLeDropHiem: { type: Number, default: 0 },
        heSoExp: { type: Number, default: 1.0 },
    },
    dailyFortune: {
        type: { type: String, enum: ['DAI_CAT', 'TRUNG_CAT', 'TIEU_HUNG', 'DAI_HUNG', null], default: null },
        lastDate: { type: Date },
    },
    suDo: {
        suPhuId: { type: String },
        deTuIds: [{ type: String }],
        diemCongDuc: { type: Number, default: 0 },
    },
    karma: {
        score: { type: Number, default: 0 },
        alignment: { type: String, enum: ['CHINH_DAO', 'TA_DAO', 'TRUNG_LAP'], default: 'TRUNG_LAP' },
    },
    tower: {
        highestFloor: { type: Number, default: 0 },
        trialPoints: { type: Number, default: 0 },
    },
    tuiDo: [
        {
            itemId: { type: String, required: true },
            soLuong: { type: Number, required: true, default: 1 },
            doHiem: {
                type: String,
                enum: ['THUONG', 'TINH_XAO', 'SU_THI', 'TRUYEN_THUYET', 'THAN_THOAI'],
                default: 'THUONG',
            },
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
exports.UserModelAdvanced = (0, mongoose_1.model)('UserAdvanced', UserAdvancedSchema);
