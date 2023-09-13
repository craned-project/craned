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
  image: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});
interface Post extends InferSchemaType<typeof postSchema> {
  _id: string;
}
const Post: Model<Post> =
  mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
