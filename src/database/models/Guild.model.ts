import { Schema, model, Document } from 'mongoose';

export interface IGuildResource {
  dong: number;
  go: number;
  khoangThach: number;
}

export interface IGuild extends Document {
  guildId: string;
  tenBang: string;
  tocTruong: string; // Owner User ID
  thanhVien: string[]; // Member User IDs
  capDoDinhLang: number;
  khoTaiNguyen: IGuildResource;
  buffBang: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuildSchema = new Schema<IGuild>(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    tenBang: { type: String, required: true, unique: true },
    tocTruong: { type: String, required: true },
    thanhVien: [{ type: String, required: true }],
    capDoDinhLang: { type: Number, default: 1 },
    khoTaiNguyen: {
      dong: { type: Number, default: 0 },
      go: { type: Number, default: 0 },
      khoangThach: { type: Number, default: 0 },
    },
    buffBang: { type: String, default: '+2% EXP Toàn Bang' },
  },
  { timestamps: true }
);

export const GuildModel = model<IGuild>('Guild', GuildSchema);
