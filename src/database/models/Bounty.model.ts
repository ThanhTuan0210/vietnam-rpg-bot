import { Schema, model, Document } from 'mongoose';

export interface IBounty extends Document {
  bountyId: string;
  posterId: string;
  posterName: string;
  targetDungeon: string;
  rewardDong: number;
  acceptedBy?: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const BountySchema = new Schema<IBounty>(
  {
    bountyId: { type: String, required: true, unique: true },
    posterId: { type: String, required: true, index: true },
    posterName: { type: String, required: true },
    targetDungeon: { type: String, required: true },
    rewardDong: { type: Number, required: true },
    acceptedBy: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const BountyModel = model<IBounty>('Bounty', BountySchema);
