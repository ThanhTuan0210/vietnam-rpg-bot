import { Schema, model, Document } from 'mongoose';

export type HePhaiType = 'DUNG_TUONG' | 'DAO_SI' | 'THO_SAN';
export type NguHanhType = 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO';
export type DoHiemType = 'THUONG' | 'TINH_XAO' | 'SU_THI' | 'TRUYEN_THUYET' | 'THAN_THOAI';

export interface ITuiDoItemAdvanced {
  itemId: string;
  soLuong: number;
  doHiem: DoHiemType;
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
  score: number; // >0: Chính Đạo, <0: Tà Đạo
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
  diemTiemNang: {
    tocDoThuHoach: number;
    giamCooldown: number;
    tyLeDropHiem: number;
    heSoExp: number;
  };
  dailyFortune: IDailyFortune;
  suDo: ISuDoInfo;
  karma: IKarmaInfo;
  tower: ITowerProgress;
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
      enum: ['DUNG_TUONG', 'DAO_SI', 'THO_SAN', null],
      default: null,
    },
    nguHanh: {
      type: String,
      enum: ['KIM', 'MOC', 'THUY', 'HOA', 'THO'],
      default: 'HOA',
    },
    danhHieu: {
      type: String,
      default: '« Đệ Nhất Kiếm Thần »',
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
      dong: { type: Number, default: 100, min: 0 },
      kimBao: { type: Number, default: 0, min: 0 },
    },
    trangBi: {
      vuKhi: {
        itemId: { type: String, default: 'none' },
        capCuongHoa: { type: Number, default: 0 },
        bonusStat: { type: Number, default: 0 },
        khamNgoc: { type: String, default: '' },
      },
      aoGiap: {
        itemId: { type: String, default: 'none' },
        capCuongHoa: { type: Number, default: 0 },
        bonusStat: { type: Number, default: 0 },
        khamNgoc: { type: String, default: '' },
      },
      phapBao: {
        itemId: { type: String, default: 'none' },
        capCuongHoa: { type: Number, default: 0 },
        hieuUng: { type: String, default: '' },
      },
      linhThu: {
        itemId: { type: String, default: 'none' },
        name: { type: String, default: 'none' },
        bac: { type: Number, default: 0 },
      },
    },
    dungCu: {
      riu: { type: Number, default: 1 },
      canCau: { type: Number, default: 1 },
      cuoc: { type: Number, default: 1 },
      gioThuoc: { type: Number, default: 1 },
    },
    soLanTrungSinh: { type: Number, default: 0 },
    diemCanCot: { type: Number, default: 0 },
    diemTiemNang: {
      tocDoThuHoach: { type: Number, default: 0 },
      giamCooldown: { type: Number, default: 0 },
      tyLeDropHiem: { type: Number, default: 0 },
      heSoExp: { type: Number, default: 1.0 },
    },
    dailyFortune: {
      type: { type: String, enum: ['DAI_CAT', 'TRUNG_CAT', 'TIEU_HUNG', 'DAI_HUNG', null], default: null },
      lastDate: { type: Date },
    },
    suDo: {
      suPhuId: { type: String },
      deTuIds: [{ type: String }],
      diemCongDuc: { type: Number, default: 0 },
    },
    karma: {
      score: { type: Number, default: 0 },
      alignment: { type: String, enum: ['CHINH_DAO', 'TA_DAO', 'TRUNG_LAP'], default: 'TRUNG_LAP' },
    },
    tower: {
      highestFloor: { type: Number, default: 0 },
      trialPoints: { type: Number, default: 0 },
    },
    tuiDo: [
      {
        itemId: { type: String, required: true },
        soLuong: { type: Number, required: true, default: 1 },
        doHiem: {
          type: String,
          enum: ['THUONG', 'TINH_XAO', 'SU_THI', 'TRUYEN_THUYET', 'THAN_THOAI'],
          default: 'THUONG',
        },
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

export const UserModelAdvanced = model<IUserAdvanced>('UserAdvanced', UserAdvancedSchema);
