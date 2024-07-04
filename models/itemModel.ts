import { model, Schema, models } from 'mongoose';

const itemSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    measurementUnit: {
      type: String,
    },
    stores: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Store',
      },
    ],
    shops: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
      },
    ],
  },
  { timestamps: true },
);

export default models.Item || model('Item', itemSchema);
