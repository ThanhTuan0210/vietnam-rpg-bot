"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerLeaderboardModel = void 0;
const mongoose_1 = require("mongoose");
const TowerLeaderboardSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    highestFloor: { type: Number, default: 0, index: true },
    totalTrialPoints: { type: Number, default: 0 },
}, { timestamps: true });
exports.TowerLeaderboardModel = (0, mongoose_1.model)('TowerLeaderboard', TowerLeaderboardSchema);
