import { useState, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

const Model3D = ({ url, rotation, position, zoom }) => {
  const { scene } = useGLTF(url, undefined, (error) => {
    console.error("Failed to load 3D model:", error);
  });

  useEffect(() => {
    if (scene) {
      scene.rotation.x = rotation.x;
      scene.rotation.y = rotation.y;
      scene.position.x = position.x;
      scene.position.y = position.y;
      scene.scale.set(zoom, zoom, zoom);
    }
  }, [rotation, position, zoom, scene]);

  return <primitive object={scene} />;
};

const CameraController = ({ zoom }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 5 / zoom;
    camera.updateProjectionMatrix();
  }, [zoom, camera]);

  return null;
};

const ModelLoader = ({ url, rotation, position, zoom }) => {
  return (
    <Suspense
      fallback={
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="orange" wireframe />
        </mesh>
      }
    >
      <Model3D url={url} rotation={rotation} position={position} zoom={zoom} />
    </Suspense>
  );
};

const Viewer = ({ image }) => {
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [modelError, setModelError] = useState(false);

  if (!image) {
    return (
      <div className="h-[400px] bg-black rounded-lg flex-1 flex items-center justify-center">
        <p className="text-gray-400">Upload an image or 3D model to view</p>
      </div>
    );
  }

  // 2D Image Handler
  const handleMouseDown = (e) => {
    if (!imageRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imageRef.current.offsetLeft,
      y: e.clientY - imageRef.current.offsetTop,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const x = e.clientX - dragStart.x;
    const y = e.clientY - dragStart.y;

    imageRef.current.style.left = `${x}px`;
    imageRef.current.style.top = `${y}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get full URL for file
  const getFileUrl = (fileUrl) => {
    console.log(fileUrl,"Raushan")
    if (fileUrl.startsWith("https")) {
      return fileUrl;
    }
    if (fileUrl.startsWith("/")) {
      return `http://localhost:5000${fileUrl}`;
    }
    return `http://localhost:5000/${fileUrl}`;
  };

  // 3D Model
  // if (image.type === "model" || image.fileUrl.endsWith(".glb") || image.fileUrl.endsWith(".gltf")) {
  if (image.type === "model") {
    const modelUrl = getFileUrl(image.fileUrl);

    if (modelError) {
      return (
        <div className="h-[400px] bg-black rounded-lg flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-400">Failed to load 3D model</p>
          <p className="text-gray-400 text-sm">{modelUrl}</p>
        </div>
      );
    }

    return (
      <div className="h-[400px] bg-black rounded-lg flex-1">
        <Canvas
          onError={(error) => {
            console.error("Canvas error:", error);
            setModelError(true);
          }}
        >
          <PerspectiveCamera position={[0, 0, 5]} fov={75} makeDefault />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.3} />

          <CameraController zoom={image.zoom || 1} />

          <ModelLoader
            url={modelUrl}
            rotation={{
              x: image.rotationX || 0,
              y: image.rotationY || 0,
            }}
            position={{
              x: image.positionX || 0,
              y: image.positionY || 0,
            }}
            zoom={image.zoom || 1}
          />

          <OrbitControls
            autoRotate={false}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        </Canvas>
      </div>
    );
  }

  // 2D Image
  const imageUrl = getFileUrl(image.fileUrl);

  return (
    <div
      className="h-[400px] bg-black rounded-lg flex-1 relative overflow-hidden cursor-move"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt="uploaded"
        className="absolute select-none"
        style={{
          width: `${(image.zoom || 1) * 100}%`,
          transform: `rotate(${image.rotation || 0}deg)`,
          left: `${image.positionX || 0}px`,
          top: `${image.positionY || 0}px`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onError={() => console.error("Failed to load image:", imageUrl)}
      />
    </div>
  );
};

export default Viewer;