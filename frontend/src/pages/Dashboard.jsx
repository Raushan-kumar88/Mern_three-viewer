import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Upload from "../components/Upload";
import Viewer from "../components/Viewer";
import Controls from "../components/Controls";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get("/models");
      const imagesArray = response.data.data || [];
      setImages(imagesArray);
      if (imagesArray.length > 0) {
        setImage(imagesArray[0]);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newImage) => {
    const parsedImage = newImage?.data || newImage;
    setImage(parsedImage);
    setImages([parsedImage, ...images]);
  };

  const handleImageUpdate = (updatedImage) => {
    setImage(updatedImage);
    setImages(
      images.map((img) => (img._id === updatedImage._id ? updatedImage : img))
    );
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axiosInstance.delete(`/models/${imageId}`);
      const updatedImages = images.filter((img) => img._id !== imageId);
      setImages(updatedImages);
      setImage(updatedImages.length > 0 ? updatedImages[0] : null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  console.log("check all image",images);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-5">
          <Upload onUpload={handleUpload} />

          <div className="flex gap-4">
            <div className="flex-1">
              <Viewer image={image} />

              <div className="mt-4 grid grid-cols-6 gap-2">
                {Array.isArray(images) && images.map((img) => (
                  <div
                    key={img._id}
                    onClick={() => setImage(img)}
                    className={`relative cursor-pointer rounded overflow-hidden border-2 ${
                      image?._id === img._id
                        ? "border-purple-600"
                        : "border-gray-700"
                    }`}
                  >
                    {(img.type === "model") ? (
                      <div className="w-full h-20 bg-gray-900 flex items-center justify-center text-xs text-gray-400">
                        3D Model
                      </div>
                    ) : (
                      <img
                        src={img.fileUrl}
                        alt="thumbnail"
                        className="w-full h-20 object-cover"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img._id);
                      }}
                      className="absolute cursor-pointer top-0 right-0 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Controls image={image} onImageUpdate={handleImageUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;