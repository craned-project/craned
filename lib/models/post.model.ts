
import mongoose, { Model } from "mongoose";
import { InferSchemaType } from "mongoose";

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  images: [{
    type: String,
  }],
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
});

type Post = InferSchemaType<typeof postSchema>;
const Post: Model<Post> = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
