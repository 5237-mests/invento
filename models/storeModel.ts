import { model, Schema, models, Types } from 'mongoose';

// address schema
const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const storeSchema = new Schema(
  {
    storeCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    location: {
      type: addressSchema,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  { timestamps: true },
);

export default models.Store || model('Store', storeSchema);
