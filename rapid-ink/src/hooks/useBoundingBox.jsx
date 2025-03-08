import { useState } from "react";
import { sendClickData } from "../utils/api";

export default function useBoundingBox(imageUrl, username) {
  const [boundingBox, setBoundingBox] = useState(null);

  const handleCanvasClick = async (event) => {
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

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(clickedX, clickedY, 5, 0, 2 * Math.PI);
    ctx.fill();

    const data = await sendClickData(imageUrl, scaledX, scaledY, username);
    if (data?.bounding_box) {
      setBoundingBox(data.bounding_box);
    }
  };

  return { boundingBox, handleCanvasClick };
}