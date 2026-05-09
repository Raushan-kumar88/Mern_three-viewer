import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Controls = ({ image, onImageUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!image) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg w-72">
        <h2 className="mb-3 font-semibold">Controls</h2>
        <p className="text-gray-400">Upload an image or 3D model to use controls</p>
      </div>
    );
  }

  const is3D = image.type === "model" || image.fileUrl.endsWith(".glb");

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/models/save", {
        modelId: image._id,
        positionX: image.positionX || 0,
        positionY: image.positionY || 0,
        rotation: image.rotation || 0,
        rotationX: image.rotationX || 0,
        rotationY: image.rotationY || 0,
        zoom: image.zoom || 1,
      });

      onImageUpdate(response.data);
      alert("State saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg w-72 max-h-[500px] overflow-y-auto">
      <h2 className="mb-3 font-semibold">{is3D ? "3D Model" : "Image"} Controls</h2>

      {/* Position X */}
      <div className="mb-3">
        <p className="text-sm text-gray-300">Position X: {image.positionX || 0}px</p>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={image.positionX || 0}
          onChange={(e) =>
            onImageUpdate({ ...image, positionX: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {/* Position Y */}
      <div className="mb-3">
        <p className="text-sm text-gray-300">Position Y: {image.positionY || 0}px</p>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={image.positionY || 0}
          onChange={(e) =>
            onImageUpdate({ ...image, positionY: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {is3D ? (
        <>
          {/* Rotation X (3D) */}
          <div className="mb-3">
            <p className="text-sm text-gray-300">Rotation X: {((image.rotationX || 0) * 180 / Math.PI).toFixed(0)}°</p>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.01"
              value={image.rotationX || 0}
              onChange={(e) =>
                onImageUpdate({ ...image, rotationX: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Rotation Y (3D) */}
          <div className="mb-3">
            <p className="text-sm text-gray-300">Rotation Y: {((image.rotationY || 0) * 180 / Math.PI).toFixed(0)}°</p>
            <input
              type="range"
              min="0"
              max="6.28"
              step="0.01"
              value={image.rotationY || 0}
              onChange={(e) =>
                onImageUpdate({ ...image, rotationY: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </>
      ) : (
        <>
          {/* Rotation (2D) */}
          <div className="mb-3">
            <p className="text-sm text-gray-300">Rotation: {image.rotation || 0}°</p>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={image.rotation || 0}
              onChange={(e) =>
                onImageUpdate({ ...image, rotation: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </>
      )}

      {/* Zoom */}
      <div className="mb-3">
        <p className="text-sm text-gray-300">Zoom: {((image.zoom || 1) * 100).toFixed(0)}%</p>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={image.zoom || 1}
          onChange={(e) =>
            onImageUpdate({ ...image, zoom: Number(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 w-full py-2 rounded mb-2 text-white font-semibold"
      >
        {loading ? "Saving..." : "Save State"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default Controls;