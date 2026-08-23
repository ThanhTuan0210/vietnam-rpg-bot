"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountyModel = void 0;
const mongoose_1 = require("mongoose");
const BountySchema = new mongoose_1.Schema({
    bountyId: { type: String, required: true, unique: true },
    posterId: { type: String, required: true, index: true },
    posterName: { type: String, required: true },
    targetDungeon: { type: String, required: true },
    rewardDong: { type: Number, required: true },
    acceptedBy: { type: String },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },
}, { timestamps: true });
exports.BountyModel = (0, mongoose_1.model)('Bounty', BountySchema);
