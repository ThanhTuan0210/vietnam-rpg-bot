"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildModel = void 0;
const mongoose_1 = require("mongoose");
const GuildSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true, index: true },
    tenBang: { type: String, required: true, unique: true },
    tocTruong: { type: String, required: true },
    thanhVien: [{ type: String, required: true }],
    capDoDinhLang: { type: Number, default: 1 },
    khoTaiNguyen: {
        dong: { type: Number, default: 0 },
        go: { type: Number, default: 0 },
        khoangThach: { type: Number, default: 0 },
    },
    buffBang: { type: String, default: '+2% EXP Toàn Bang' },
}, { timestamps: true });
exports.GuildModel = (0, mongoose_1.model)('Guild', GuildSchema);
