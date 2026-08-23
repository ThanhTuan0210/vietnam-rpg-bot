import { Schema, model, Document } from 'mongoose';

export interface ITowerLeaderboard extends Document {
  userId: string;
  username: string;
  highestFloor: number;
  totalTrialPoints: number;
  updatedAt: Date;
}

const TowerLeaderboardSchema = new Schema<ITowerLeaderboard>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    highestFloor: { type: Number, default: 0, index: true },
    totalTrialPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TowerLeaderboardModel = model<ITowerLeaderboard>('TowerLeaderboard', TowerLeaderboardSchema);
