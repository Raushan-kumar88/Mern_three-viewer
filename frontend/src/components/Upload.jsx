import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Upload = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/models/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedModel = response.data?.data || response.data;
      onUpload(uploadedModel);
      setFileName("");
      setLoading(false);
      e.target.value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <p className="mb-2 font-semibold">Upload Image or 3D Model</p>
      <input
        type="file"
        accept="image/*,.glb,.gltf"
        onChange={handleFileChange}
        disabled={loading}
        className="bg-gray-700 p-2 rounded text-white cursor-pointer w-full"
      />
      {fileName && <p className="text-blue-400 text-sm mt-2">Selected: {fileName}</p>}
      {loading && <p className="text-blue-400 text-sm mt-2">Uploading...</p>}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Upload;