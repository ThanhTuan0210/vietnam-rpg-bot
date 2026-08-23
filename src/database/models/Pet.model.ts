import { Schema, model, Document } from 'mongoose';

export type PetLoaiType = 'BACH_HO' | 'HUYEN_VU' | 'HAC_LONG' | 'CHIM_LAC';

export interface IPet extends Document {
  petId: string;
  ownerId: string;
  ten: string;
  loai: PetLoaiType;
  bac: number;       // Tier 1 -> 5
  capDo: number;
  doNo: number;      // Hunger: 0 -> 100
  kyNangNoiTai: string;
  dangThuDuHi: boolean;
  thoiGianTroVe?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>(
  {
    petId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true, index: true },
    ten: { type: String, required: true },
    loai: {
      type: String,
      enum: ['BACH_HO', 'HUYEN_VU', 'HAC_LONG', 'CHIM_LAC'],
      required: true,
    },
    bac: { type: Number, default: 1, min: 1, max: 5 },
    capDo: { type: Number, default: 1 },
    doNo: { type: Number, default: 100, min: 0, max: 100 },
    kyNangNoiTai: { type: String, default: 'Tự cứu sinh khi 0 HP (Hồi 30% HP)' },
    dangThuDuHi: { type: Boolean, default: false },
    thoiGianTroVe: { type: Date },
  },
  { timestamps: true }
);

export const PetModel = model<IPet>('Pet', PetSchema);
