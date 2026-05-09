import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ["image", "model"], default: "image" },
    positionX: { type: Number, default: 0 },
    positionY: { type: Number, default: 0 },
    rotation: { type: Number, default: 0 },
    zoom: { type: Number, default: 1 },
    rotationX: { type: Number, default: 0 },
    rotationY: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Model", modelSchema);