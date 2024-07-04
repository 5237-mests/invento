import mongoose from 'mongoose';

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
