import { Schema, model, Document } from 'mongoose';

export type StatusEffectType = 'CHOANG' | 'THIEU_DOT' | 'GIAM_GIAP' | 'KHIEN' | 'HUU_ANH';

export interface IMonsterSkill {
  tenChieu: string;
  satThuongHeSo: number;
  hieuUng?: StatusEffectType;
  mpCost?: number;
}

export interface ILootTableItem {
  itemId: string;
  tyLe: number; // 0.0 -> 1.0
  soLuongMin: number;
  soLuongMax: number;
}

export interface IMonsterStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
}

export interface IMonsterAdvanced extends Document {
  id: string;
  ten: string;
  khuVuc: number;
  isBoss: boolean;
  stats: IMonsterStats;
  skills: IMonsterSkill[];
  lootTable: ILootTableItem[];
  icon: string;
  description: string;
}

const MonsterAdvancedSchema = new Schema<IMonsterAdvanced>({
  id: { type: String, required: true, unique: true },
  ten: { type: String, required: true },
  khuVuc: { type: Number, required: true },
  isBoss: { type: Boolean, default: false },
  stats: {
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    atk: { type: Number, required: true },
    def: { type: Number, required: true },
    speed: { type: Number, default: 10 },
  },
  skills: [
    {
      tenChieu: { type: String, required: true },
      satThuongHeSo: { type: Number, required: true },
      hieuUng: { type: String, enum: ['CHOANG', 'THIEU_DOT', 'GIAM_GIAP', 'KHIEN', 'HUU_ANH'] },
      mpCost: { type: Number, default: 0 },
    },
  ],
  lootTable: [
    {
      itemId: { type: String, required: true },
      tyLe: { type: Number, required: true },
      soLuongMin: { type: Number, required: true },
      soLuongMax: { type: Number, required: true },
    },
  ],
  icon: { type: String, default: '👾' },
  description: { type: String, default: '' },
});

export const MonsterModelAdvanced = model<IMonsterAdvanced>('MonsterAdvanced', MonsterAdvancedSchema);
