import { Schema, model, Document } from 'mongoose';

export type HePhaiType = 'warrior' | 'mage' | 'ranger' | 'assassin' | 'DUNG_TUONG' | 'DAO_SI' | 'THO_SAN' | string;
export type NguHanhType = 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO';
export type DoHiemType = 'THUONG' | 'TINH_XAO' | 'SU_THI' | 'TRUYEN_THUYET' | 'THAN_THOAI';

export interface ITuiDoItemAdvanced {
  itemId: string;
  soLuong: number;
  quantity?: number;
  doHiem?: DoHiemType;
}

export interface IDungCuSet {
  riu: number;
  canCau: number;
  cuoc: number;
  gioThuoc: number;
}

export interface ITrangBiSlot {
  itemId: string;
  capCuongHoa: number;
  bonusStat: number;
  khamNgoc?: string;
}

export interface IPhapBaoSlot {
  itemId: string;
  capCuongHoa: number;
  hieuUng: string;
}

export interface ILinhThuSlot {
  itemId: string;
  name: string;
  bac: number;
}

export interface ITrangBiSet {
  vuKhi: ITrangBiSlot;
  aoGiap: ITrangBiSlot;
  phapBao?: IPhapBaoSlot;
  linhThu?: ILinhThuSlot;
}

export interface IChiSoAdvanced {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  satThuong: number;
  magicAtk: number;
  phongThu: number;
  magicRes: number;
  chiMang: number;
  critDmg: number;
  neTranh: number;
  armorPen: number;
  lifeSteal: number;
}

export interface ICanhGioi {
  capDo: number;
  kinhNghiem: number;
  khuVuc: number;
}

export interface ITaiChinhAdvanced {
  dong: number;
  kimBao: number;
}

export interface IDailyFortune {
  type: 'DAI_CAT' | 'TRUNG_CAT' | 'TIEU_HUNG' | 'DAI_HUNG' | null;
  lastDate?: Date;
}

export interface ISuDoInfo {
  suPhuId?: string;
  deTuIds: string[];
  diemCongDuc: number;
}

export interface IKarmaInfo {
  score: number;
  alignment: 'CHINH_DAO' | 'TA_DAO' | 'TRUNG_LAP';
}

export interface ITowerProgress {
  highestFloor: number;
  trialPoints: number;
}

export interface IUserAdvanced extends Document {
  userId: string;
  hePhai: HePhaiType | null;
  nguHanh: NguHanhType;
  danhHieu: string;
  canhGioi: ICanhGioi;
  chiSo: IChiSoAdvanced;
  taiChinh: ITaiChinhAdvanced;
  trangBi: ITrangBiSet;
  dungCu: IDungCuSet;
  soLanTrungSinh: number;
  diemCanCot: number;
  diemTiemNang?: {
    tocDoThuHoach: number;
    giamCooldown: number;
    tyLeDropHiem: number;
    heSoExp: number;
  };
  dailyFortune: IDailyFortune;
  suDo?: ISuDoInfo;
  karma?: IKarmaInfo;
  tower?: ITowerProgress;
  inventory: ITuiDoItemAdvanced[];
  tuiDo: ITuiDoItemAdvanced[];
  cooldowns: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const UserAdvancedSchema = new Schema<IUserAdvanced>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hePhai: {
      type: String,
      default: null,
    },
    nguHanh: {
      type: String,
      default: 'HOA',
    },
    danhHieu: {
      type: String,
      default: '« Hiệp Sĩ Gothic Trung Cổ »',
    },
    canhGioi: {
      capDo: { type: Number, default: 1 },
      kinhNghiem: { type: Number, default: 0 },
      khuVuc: { type: Number, default: 1 },
    },
    chiSo: {
      hp: { type: Number, default: 100 },
      maxHp: { type: Number, default: 100 },
      mp: { type: Number, default: 50 },
      maxMp: { type: Number, default: 50 },
      satThuong: { type: Number, default: 15 },
      magicAtk: { type: Number, default: 10 },
      phongThu: { type: Number, default: 5 },
      magicRes: { type: Number, default: 5 },
      chiMang: { type: Number, default: 0.05 },
      critDmg: { type: Number, default: 1.50 },
      neTranh: { type: Number, default: 0.05 },
      armorPen: { type: Number, default: 0.0 },
      lifeSteal: { type: Number, default: 0.0 },
    },
    taiChinh: {
      dong: { type: Number, default: 5000, min: 0 },
      kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
      vuKhi: {
        itemId: { type: String, default: 'sword_01a' },
        capCuongHoa: { type: Number, default: 0 },
        bonusStat: { type: Number, default: 0 },
      },
      aoGiap: {
        itemId: { type: String, default: 'shield_01a' },
        capCuongHoa: { type: Number, default: 0 },
        bonusStat: { type: Number, default: 0 },
      },
    },
    soLanTrungSinh: { type: Number, default: 0 },
    diemCanCot: { type: Number, default: 0 },
    dailyFortune: {
      type: { type: String, default: null },
    },
    suDo: {
      suPhuId: { type: String },
      deTuIds: { type: [String], default: [] },
      diemCongDuc: { type: Number, default: 0 },
    },
    karma: {
      score: { type: Number, default: 0 },
      alignment: { type: String, default: 'TRUNG_LAP' },
    },
    tower: {
      highestFloor: { type: Number, default: 0 },
      trialPoints: { type: Number, default: 0 },
    },
    inventory: [
      {
        itemId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        soLuong: { type: Number, default: 1 },
      },
    ],
    tuiDo: [
      {
        itemId: { type: String, required: true },
        soLuong: { type: Number, default: 1 },
        quantity: { type: Number, default: 1 },
      },
    ],
    cooldowns: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true, strict: false }
);

export const UserModelAdvanced = model<IUserAdvanced>('UserAdvanced', UserAdvancedSchema);
