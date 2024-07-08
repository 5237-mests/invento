// import { Schema, model, Types, models } from "mongoose";

// const requestSchema = new Schema({
//   item: {
//     type: Types.ObjectId,
//     ref: "Item",
//     required: true,
//   },
//   shop: {
//     type: Types.ObjectId,
//     ref: "Shop",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: [1, 'Quantity must be a non-negative number'],
//   },
//   approved: {
//     type: Boolean,
//     default: false,
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'completed'],
//     default: 'pending',
//   },
//   approvalDate: {
//     type: Date,
//   }
// }, {
//   timestamps: true, // Adds createdAt and updatedAt fields
// });

// // Update approval date when approved is set to true
// requestSchema.pre('save', function(next) {
//   if (this.isModified('approved') && this.approved) {
//     this.approvalDate = new Date();
//   }
//   next();
// });

// export default models.Request || model("Request", requestSchema);

import { Schema, model, Types, models } from 'mongoose';

const itemSchema = new Schema({
  item: {
    type: Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be a positive number'],
  },
});

const requestSchema = new Schema(
  {
    items: [itemSchema], // Array of items with quantity
    shop: {
      type: Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', 'completed'],
      default: 'pending',
    },
    approvalDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Update approval date when approved is set to true
requestSchema.pre('save', function (next) {
  if (this.isModified('approved') && this.approved) {
    this.approvalDate = new Date();
  }
  next();
});

export default models.Request || model('Request', requestSchema);
