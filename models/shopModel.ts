import { model, Schema, models, Types } from "mongoose";

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

const shopSchema = new Schema(
  {
    shopCode: {
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
        ref: "Item",
      },
    ],
  },
  { timestamps: true },
);

export default models.Shop || model("Shop", shopSchema);
