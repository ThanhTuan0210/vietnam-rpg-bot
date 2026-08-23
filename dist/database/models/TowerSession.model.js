"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerSessionModel = void 0;
const mongoose_1 = require("mongoose");
const TowerSessionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    currentFloor: { type: Number, default: 1 },
    highestFloorThisRun: { type: Number, default: 1 },
    currentHp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    currentMp: { type: Number, required: true },
    maxMp: { type: Number, required: true },
    activeBuffs: [
        {
            buffId: { type: String, required: true },
            name: { type: String, required: true },
            type: { type: String, required: true },
            value: { type: Number, required: true },
            rarity: { type: String, enum: ['THUONG', 'HIEM', 'THAN_THOAI'], default: 'THUONG' },
            icon: { type: String, default: '✨' },
        },
    ],
    offeredBoons: [{ type: String }],
    isAwaitingBoon: { type: Boolean, default: false },
    isAtRestStation: { type: Boolean, default: false },
    trialPointsEarned: { type: Number, default: 0 },
    monstersSlain: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.TowerSessionModel = (0, mongoose_1.model)('TowerSession', TowerSessionSchema);
