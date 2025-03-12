import { useState } from "react";
import { sendClickData } from "../utils/api";

export default function useBoundingBoxes(imageUrl, username) {
  const [boundingBoxes, setBoundingBoxes] = useState([]);

  const handleCanvasClick = async (event, activeLabel) => {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const originalWidth = img.width;
    const originalHeight = img.height;
    const displayedWidth = canvas.width;
    const displayedHeight = canvas.height;

    const clickedX = event.clientX - rect.left;
    const clickedY = event.clientY - rect.top;

    const scaledX = (clickedX / displayedWidth) * originalWidth;
    const scaledY = (clickedY / displayedHeight) * originalHeight;

    console.log(`Clicked at: (${scaledX}, ${scaledY})`);

    // Temporarily mark click point
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(clickedX, clickedY, 5, 0, 2 * Math.PI);
    ctx.fill();

    try {
      const data = await sendClickData(imageUrl, scaledX, scaledY, username);
      if (data?.bounding_box) {
        // Add the new bounding box to the array with the active label color
        setBoundingBoxes(prev => [
          ...prev, 
          { 
            ...data.bounding_box, 
            label: activeLabel,
            color: activeLabel.color
          }]);
      }
    } catch (error) {
      console.error("Error getting bounding box:", error);
    }
  };

  const updateBoundingBox = (index, newBox) => {
    setBoundingBoxes(prev => {
      const updated = [...prev];
      updated[index] = newBox;
      return updated;
    });
  };

  const deleteBoundingBox = (index) => {
    setBoundingBoxes(prev => prev.filter((_, i) => i !== index));
  };

  return { 
    boundingBoxes, 
    handleCanvasClick, 
    updateBoundingBox, 
    deleteBoundingBox 
  };
}
