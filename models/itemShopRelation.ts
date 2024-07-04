// item shop relation model
import { Schema, model, Types, models } from "mongoose";

const itemShopRelationshipSchema = new Schema({
  item: {
    type: Types.ObjectId,
    ref: "Item",
    required: true,
  },
  shop: {
    type: Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

export default models.ItemShopRelationship ||
  model("ItemShopRelationship", itemShopRelationshipSchema);
