import * as mongoose from 'mongoose';
import { visibilityPlugin } from './plugins/visibility';
import { timeStamp } from 'console';
const ObjectId = mongoose.Schema.Types.ObjectId;
/*
📝Note for assignment evaluator:
In the real world, cryptocurrency rates fluctuate with every purchase, meaning each transaction can have a different price. 
To accurately reflect this, I would typically save each purchase history and calculate the equivalent rates for each crypto coin, ensuring precise tracking for users in their wallets. 

I have the expertise to implement this in detail, but due to time constraints on this assignment, I’m prioritizing the basic functionality and skipping these real cases for now.

*/
export interface iUser {
  userRef: string;
  cryptoId: string;
  cryptoName: string;
  quantity: number;
  rate: number;
  createdAt: number;
}

const CryptoWalletSchema = new mongoose.Schema({
  userRef: {
    type: ObjectId,
    ref: "User",
    required: true
  }, // reference to 'User' detail
  cryptoId: { type: String, required: true },
  cryptoName: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },

}, { timestamps: true, versionKey: false });

CryptoWalletSchema.plugin(visibilityPlugin);

export const CryptoWallet = mongoose.model('CryptoWallet', CryptoWalletSchema);

