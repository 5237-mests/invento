import { Schema, model, models } from 'mongoose';

const soldItemSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sale: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models.SoldItem || model('SoldItem', soldItemSchema);
