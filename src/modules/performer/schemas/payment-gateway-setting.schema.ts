import { Schema } from 'mongoose';

export const PaymentGatewaySettingSchema = new Schema({
  performerId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  key: { type: String, index: true },
  value: Schema.Types.Mixed,
  status: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
