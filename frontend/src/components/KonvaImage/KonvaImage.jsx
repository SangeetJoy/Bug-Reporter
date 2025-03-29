import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const KonvaImage = ({ src, stageWidth, stageHeight, onImageClick }) => {
  const [image, status] = useImage(src, "anonymous");

  if (status === "loading") {
    // console.log("Image is still loading...");
    return null; // Prevent rendering while loading
  }

  if (status === "failed") {
    // console.error("Failed to load image:", src);
    return null;
  }

  // console.log("Image loaded successfully", image);

  // Scale to fit inside the stage
  const scaleX = stageWidth / image.width;
  const scaleY = stageHeight / image.height;
  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  return (
    <Image
      image={image}
      scaleX={scale}
      scaleY={scale}
      // stroke="red"
      // fillPriority="green"
      // draggable
      y={25}
      x={35}
      scale={{ x: scale, y: scale }}
      onClick={onImageClick}
    />
  );
};

export default KonvaImage;
