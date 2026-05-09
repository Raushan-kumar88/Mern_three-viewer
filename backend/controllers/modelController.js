import Model from "../models/Model.js";

export const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;
    const fileUrl = `/uploads/${fileName}`; // Store accessible URL
    const originalName = req.file.originalname.toLowerCase();
    
    // Detect file type
    let fileType = "image";
    if (originalName.endsWith(".glb") || originalName.endsWith(".gltf")) {
      fileType = "model";
    } else if (req.file.mimetype.startsWith("image")) {
      fileType = "image";
    } else {
      fileType = "model";
    }

    const model = await Model.create({
      user: req.user,
      fileUrl,
      type: fileType,
      zoom: 1,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      positionX: 0,
      positionY: 0,
    });

    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveState = async (req, res) => {
  try {
    const { modelId, positionX, positionY, rotation, rotationX, rotationY, zoom } = req.body;

    const model = await Model.findByIdAndUpdate(
      modelId,
      {
        positionX,
        positionY,
        rotation,
        rotationX,
        rotationY,
        zoom,
      },
      { new: true }
    );

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserModels = async (req, res) => {
  try {
    const models = await Model.find({ user: req.user });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await Model.findByIdAndDelete(modelId);

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};