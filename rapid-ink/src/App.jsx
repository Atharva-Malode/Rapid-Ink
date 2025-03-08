// import { useState, useEffect, useRef } from "react";

// export default function App() {
//   const [imageUrl, setImageUrl] = useState("");
//   const [boundingBox, setBoundingBox] = useState(null);
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

//   useEffect(() => {
//     if (boundingBox) {
//       drawBoundingBox(boundingBox);
//     }
//   }, [boundingBox]);

//   const drawBoundingBox = (bbox) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.strokeStyle = "green";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(bbox.x_min, bbox.y_min, bbox.x_max - bbox.x_min, bbox.y_max - bbox.y_min);
//   };

//   const handleCanvasClick = async (event) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const ctx = canvas.getContext("2d");
    
//     const img = new Image();
//     img.src = imageUrl;
//     await new Promise((resolve) => (img.onload = resolve));

//     const originalWidth = img.width;
//     const originalHeight = img.height;
//     const displayedWidth = canvas.width;
//     const displayedHeight = canvas.height;

//     const clickedX = event.clientX - rect.left;
//     const clickedY = event.clientY - rect.top;

//     const scaledX = (clickedX / displayedWidth) * originalWidth;
//     const scaledY = (clickedY / displayedHeight) * originalHeight;

//     console.log(`Clicked at: (${scaledX}, ${scaledY})`);

//     ctx.fillStyle = "red";
//     ctx.beginPath();
//     ctx.arc(clickedX, clickedY, 5, 0, 2 * Math.PI);
//     ctx.fill();

//     try {
//       const response = await fetch("http://127.0.0.1:8000/boxes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify([{ img: imageUrl, x: scaledX, y: scaledY }]),
//       });
      
//       const data = await response.json();
//       console.log("Server response:", data);
//       if (data.bounding_box) {
//         setBoundingBox(data.bounding_box);
//       }
//     } catch (error) {
//       console.error("Error sending point:", error);
//     }
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

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username/:imagename" element={<ImagePage />} />
      </Routes>
    </Router>
  );
}