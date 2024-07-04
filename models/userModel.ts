import { model, Schema, models } from 'mongoose';

// Define user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'shopkeeper', 'storekeeper', 'customer'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

// Middleware to update the 'updatedAt' field before each update
userSchema.pre('save', function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

// Create user model from the schema
export default models.User || model('User', userSchema);
