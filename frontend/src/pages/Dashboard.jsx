import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Upload from "../components/Upload";
import Viewer from "../components/Viewer";
import Controls from "../components/Controls";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Dashboard");
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

  console.log("check all image", images);

  const renderTabContent = () => {
    switch (activeTab) {
      case "My Models":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">My Models</h2>
            {loading ? (
              <p className="text-gray-300">Loading your models...</p>
            ) : images.length === 0 ? (
              <p className="text-gray-300">No models found. Upload one to get started.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {images.map((img) => (
                  <div
                    key={img._id}
                    onClick={() => setImage(img)}
                    className={`cursor-pointer rounded-lg border p-4 bg-gray-900 transition-shadow ${
                      image?._id === img._id
                        ? "border-purple-600 shadow-lg shadow-purple-500/20"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <div className="h-36 mb-3 overflow-hidden rounded bg-gray-800 flex items-center justify-center">
                      {img.type === "model" ? (
                        <span className="text-sm text-gray-400">3D Model</span>
                      ) : (
                        <img
                          src={img.fileUrl}
                          alt={img.name || "thumbnail"}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-300">{img.name || "Untitled"}</div>
                    <div className="text-xs text-gray-500 mt-1">{img.type || "image"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "Viewer":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Viewer</h2>
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <Viewer image={image} />
              <Controls image={image} onImageUpdate={handleImageUpdate} />
            </div>
          </div>
        );

      case "Saved States":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Saved States</h2>
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6">
              <p className="text-gray-300 mb-2">You don’t have any saved states yet.</p>
              <p className="text-sm text-gray-500">Use the viewer or controls to create and save progress for later.</p>
            </div>
          </div>
        );

      case "Profile":
        return (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Profile</h2>
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-white font-medium">{user?.name || "Unknown User"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-white font-medium">{user?.email || "No email available"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-white font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "User"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Dashboard</h2>
            <Upload onUpload={handleUpload} />

            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <Viewer image={image} />

                <div className="mt-4 grid grid-cols-2 gap-2">
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
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="flex-1">
        <Navbar />

        <div className="p-5">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;