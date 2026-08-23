"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
dotenv_1.default.config({ path: path_1.default.join(__dirname, './.env') });
exports.CONFIG = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || process.env.TOKEN || '',
    PREFIX: process.env.PREFIX || 'vn',
    MONGO_URI: process.env.MONGO_URI ||
        process.env.MONGODB_URI ||
        'mongodb+srv://so44so777_db_user:z1NEfch6eGbkaOCU@cluster0.idd06f0.mongodb.net/vietnam_rpg_bot?retryWrites=true&w=majority',
};
