import mongoose from 'mongoose';
// register all models
import '../models/itemModel';
import '../models/shopModel';
import '../models/storeModel';
import '../models/userModel';
import '../models/requestModel';
import '../models/itemShopRelation';
import '../models/itemStoreRelation';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('db connected');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default connectDB;
