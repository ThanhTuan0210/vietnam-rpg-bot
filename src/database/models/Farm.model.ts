import { Schema, model, Document } from 'mongoose';

export interface IFarmPlot {
  oDat: number; // Ô đất 1 -> 6
  hatGiong: string; // 'lua_nuoc', 'dau_xanh', 'nep_nuong'
  thoiGianTrong: Date;
  trangThai: 'DANG_LON' | 'THU_HOACH';
}

export interface IFarm extends Document {
  userId: string;
  plots: IFarmPlot[];
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    plots: [
      {
        oDat: { type: Number, required: true },
        hatGiong: { type: String, required: true },
        thoiGianTrong: { type: Date, default: Date.now },
        trangThai: { type: String, enum: ['DANG_LON', 'THU_HOACH'], default: 'DANG_LON' },
      },
    ],
  },
  { timestamps: true }
);

export const FarmModel = model<IFarm>('Farm', FarmSchema);
