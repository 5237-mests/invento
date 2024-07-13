import { Schema, model, models } from 'mongoose';

const saleSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: false,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SoldItem',
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Sale || model('Sale', saleSchema);
