import { useState, useEffect, useRef } from "react";

export default function App() {
  const [imageUrl, setImageUrl] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/next-image/")
      .then((response) => response.json())
      .then((data) => setImageUrl(data.image_url))
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  useEffect(() => {
    if (imageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    }
  }, [imageUrl]);

  const handleCanvasClick = async (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
  
    // Get the image's original dimensions
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve)); // Wait for image to load
  
    const originalWidth = img.width;
    const originalHeight = img.height;
    const displayedWidth = canvas.width;
    const displayedHeight = canvas.height;
  
    // Get clicked coordinates relative to the canvas
    const clickedX = event.clientX - rect.left;
    const clickedY = event.clientY - rect.top;
  
    // Scale the coordinates to match the original image resolution
    const scaledX = (clickedX / displayedWidth) * originalWidth;
    const scaledY = (clickedY / displayedHeight) * originalHeight;
  
    console.log(`Original Clicked at: (${scaledX}, ${scaledY})`);
  
    // Draw a red dot where the user clicked
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(clickedX, clickedY, 5, 0, 2 * Math.PI);
    ctx.fill();
  
    // Send the correctly scaled point to the FastAPI backend
    try {
      const response = await fetch("http://127.0.0.1:8000/boxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ x: scaledX, y: scaledY }]),  // Send scaled points
      });
  
      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error sending point:", error);
    }
  };
  
  

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      {imageUrl ? (
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="rounded-lg shadow-lg cursor-crosshair"
        />
      ) : (
        <p className="text-white text-lg">Loading image...</p>
      )}
    </div>
  );
}



// import { useState, useEffect, useRef } from "react";

// export default function App() {
//   const [imageUrl, setImageUrl] = useState("");
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/next-image/")
//       .then((response) => response.json())
//       .then((data) => setImageUrl(data.image_url))
//       .catch((error) => console.error("Error fetching image:", error));
//   }, []);

//   useEffect(() => {
//     if (imageUrl) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const img = new Image();
//       img.src = imageUrl;
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0, img.width, img.height);
//       };
//     }
//   }, [imageUrl]);

//   const handleCanvasClick = (event) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     console.log(`Clicked at: (${x}, ${y})`);

//     // Draw a red dot where the user clicked
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = "red";
//     ctx.beginPath();
//     ctx.arc(x, y, 5, 0, 2 * Math.PI);
//     ctx.fill();
//   };

//   return (
//     <div className="flex items-center justify-center w-full h-screen bg-black">
//       {imageUrl ? (
//         <canvas
//           ref={canvasRef}
//           onClick={handleCanvasClick}
//           className="rounded-lg shadow-lg cursor-crosshair"
//         />
//       ) : (
//         <p className="text-white text-lg">Loading image...</p>
//       )}
//     </div>
//   );
// }
