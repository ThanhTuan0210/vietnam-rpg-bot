import { Schema, model, Document } from 'mongoose';

export type BoonType =
  | 'ATK_PERCENT'
  | 'DEF_PERCENT'
  | 'CRIT_RATE'
  | 'CRIT_DMG'
  | 'LIFE_STEAL'
  | 'HEAL_PER_FLOOR'
  | 'REFLECT_DMG'
  | 'MP_RESTORE'
  | 'DODGE_STUN';

export type BoonRarity = 'THUONG' | 'HIEM' | 'THAN_THOAI';

export interface ITowerActiveBuff {
  buffId: string;
  name: string;
  type: BoonType;
  value: number;
  rarity: BoonRarity;
  icon: string;
}

export interface ITowerSession extends Document {
  userId: string;
  currentFloor: number;
  highestFloorThisRun: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  activeBuffs: ITowerActiveBuff[];
  offeredBoons: string[]; // Lưu mảng 3 buffId đã roll ra để xác thực anti-cheat
  isAwaitingBoon: boolean;
  isAtRestStation: boolean;
  trialPointsEarned: number;
  monstersSlain: number;
  isActive: boolean;
  startedAt: Date;
  updatedAt: Date;
}

const TowerSessionSchema = new Schema<ITowerSession>(
  {
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
  },
  { timestamps: true }
);

export const TowerSessionModel = model<ITowerSession>('TowerSession', TowerSessionSchema);
