import Model from "../models/Model.js";

export const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
        status: 400
      });
    }

    let fileUrl = req.file.secure_url || req.file.path;

    if (!fileUrl && req.file.filename) {
      fileUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${req.file.filename}`;
    }

    const originalName = req.file.originalname.toLowerCase();

    if (!fileUrl) {
      console.error("check url returned from Cloudinary:", req.file);
      return res.status(500).json({
        success: false,
        message: "Failed to upload file to Cloudinary",
        status: 500
      });
    }

    console.log("check here File uploaded successfully. URL:", fileUrl);

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

    res.status(201).json({
      success: true,
      message: "Model uploaded successfully",
      data: model,
      status: 201
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
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
      return res.status(404).json({
        success: false,
        message: "Model not found",
        status: 404
      });
    }

    res.status(200).json({
      success: true,
      message: "Model state saved successfully",
      data: model,
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
  }
};

export const getUserModels = async (req, res) => {
  try {
    const models = await Model.find({ user: req.user });
    res.status(200).json({
      success: true,
      message: "Models retrieved successfully",
      data: models,
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = await Model.findByIdAndDelete(modelId);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
        status: 404
      });
    }

    res.status(200).json({
      success: true,
      message: "Model deleted successfully",
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
  }
};