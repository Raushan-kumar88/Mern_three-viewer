import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import {
  uploadModel,
  saveState,
  getUserModels,
  deleteModel,
} from "../controllers/modelController.js";

const router = express.Router();

// Configure multer to preserve original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

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

router.post("/upload", protect, upload.single("file"), uploadModel);
router.post("/save", protect, saveState);
router.get("/", protect, getUserModels);
router.delete("/:modelId", protect, deleteModel);

export default router;