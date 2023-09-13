import mongoose, { Model } from "mongoose";
import { InferSchemaType } from "mongoose";

const schoolSchema = new mongoose.Schema({
  slug: {
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
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

type School = InferSchemaType<typeof schoolSchema>;
const School: Model<School> =
  mongoose.models.School || mongoose.model("School", schoolSchema);

export default School;
