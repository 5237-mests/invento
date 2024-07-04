import { model, Schema, models } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
  },
  { timestamps: true },
);

export default models.Post || model("Post", postSchema);
