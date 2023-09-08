import mongoose, { Model } from "mongoose";
import { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  onboarded: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
});

type User = InferSchemaType<typeof userSchema>;
const User: Model<User> = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
