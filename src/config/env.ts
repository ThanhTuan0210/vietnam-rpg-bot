import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env') });

export const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || process.env.TOKEN || '',
  PREFIX: process.env.PREFIX || 'vn',
  MONGO_URI:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb+srv://so44so777_db_user:z1NEfch6eGbkaOCU@cluster0.idd06f0.mongodb.net/vietnam_rpg_bot?retryWrites=true&w=majority',
};
