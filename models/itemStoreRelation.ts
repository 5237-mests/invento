import { model, Schema, models } from 'mongoose';

const itemStoreRelationshipSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

export default models.ItemStoreRelationship ||
  model('ItemStoreRelationship', itemStoreRelationshipSchema);
