import { Schema, model, Document } from 'mongoose';

export interface ITuiDoItem {
  itemId: string;
  soLuong: number;
}

export interface IChiSo {
  capDo: number;
  kinhNghiem: number;
  khuVuc: number;
  sinhLuc: number;
  sinhLucToiDa: number;
  satThuong: number;
  phongThu: number;
}

export interface ITaiChinh {
  dong: number;
  kimBao: number;
}

export interface ITrangBi {
  vuKhi: string;
  aoGiap: string;
  phuPhepTier: number;
}

export interface IUser extends Document {
  userId: string;
  danhHieu: string;
  chiSo: IChiSo;
  taiChinh: ITaiChinh;
  trangBi: ITrangBi;
  tuiDo: ITuiDoItem[];
  cooldowns: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    danhHieu: {
      type: String,
      default: 'Dân Làng',
    },
    chiSo: {
      capDo: { type: Number, default: 1 },
      kinhNghiem: { type: Number, default: 0 },
      khuVuc: { type: Number, default: 1 },
      sinhLuc: { type: Number, default: 100 },
      sinhLucToiDa: { type: Number, default: 100 },
      satThuong: { type: Number, default: 15 },
      phongThu: { type: Number, default: 5 },
    },
    taiChinh: {
      dong: { type: Number, default: 100, min: 0 },
      kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
      vuKhi: { type: String, default: 'sword_01a' },
      aoGiap: { type: String, default: 'shield_01a' },
      phuPhepTier: { type: Number, default: 0 },
    },
    tuiDo: [
      {
        itemId: { type: String, required: true },
        soLuong: { type: Number, required: true, default: 1 },
      },
    ],
    cooldowns: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', UserSchema);
