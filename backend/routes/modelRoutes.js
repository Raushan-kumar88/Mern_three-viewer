import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import protect from "../middleware/authMiddleware.js";
import {
  uploadModel,
  saveState,
  getUserModels,
  deleteModel,
} from "../controllers/modelController.js";

const router = express.Router();

export const initializeCloudinaryStorage = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Log to verify credentials are loaded
  console.log("✅ Cloudinary configured with cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("✅ Cloudinary API Key available:", !!process.env.CLOUDINARY_API_KEY);

  // Configure Cloudinary Storage
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      // Determine resource type based on file extension
      const is3DModel = file.originalname.toLowerCase().endsWith('.glb') ||
                       file.originalname.toLowerCase().endsWith('.gltf');

      return {
        folder: "3d_models",
        resource_type: is3DModel ? "raw" : "auto",
        allowed_formats: is3DModel ? ["glb", "gltf"] : ["jpg", "jpeg", "png", "gif"],
        use_filename: true,
        unique_filename: true,
      };
    },
  });

  // Create multer upload middleware with Cloudinary storage
  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /image|glb|gltf/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(file.originalname.toLowerCase());

      if (mimeType || extname) {
        return cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only images and 3D models are allowed."));
      }
    },
  });

  return upload;
};

let upload;

export const setupRoutes = (uploadMiddleware) => {
  upload = uploadMiddleware;
  return router;
};

router.post("/upload", protect, (req, res, next) => {
  if (!upload) {
    return res.status(500).json({ message: "Upload middleware not initialized" });
  }
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadModel);

router.post("/save", protect, saveState);
router.get("/", protect, getUserModels);
router.delete("/:modelId", protect, deleteModel);

export default router;