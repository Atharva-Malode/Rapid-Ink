import { useRef, useEffect, useState } from "react";

export default function CanvasDisplay({ imageUrl, boundingBoxes = [], onClick, onBoxUpdate, onBoxDelete }) {
  const canvasRef = useRef(null);
  const [isDrawingImage, setIsDrawingImage] = useState(true);
  const [activeBox, setActiveBox] = useState(null);
  const [draggingCorner, setDraggingCorner] = useState(null);
  const [draggingBox, setDraggingBox] = useState(null);
  const [hoverBox, setHoverBox] = useState(null);

  // Draw the image
  useEffect(() => {
    if (imageUrl) {
      setIsDrawingImage(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setIsDrawingImage(false);
        drawAllBoxes();
      };
    }
  }, [imageUrl]);

  // Draw all bounding boxes
  const drawAllBoxes = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas and redraw image
    const img = new Image();
    img.src = imageUrl;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Draw each bounding box
    boundingBoxes.forEach((box, index) => {
      const width = box.x_max - box.x_min;
      const height = box.y_max - box.y_min;

      // Draw rectangle
      ctx.strokeStyle = box.color || "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x_min, box.y_min, width, height);

      // Draw label with number and delete button
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(box.x_min, box.y_min - 25, 60, 25);

      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`#${index + 1}`, box.x_min + 5, box.y_min - 7);

      // Draw X button
      ctx.fillStyle = hoverBox === `delete-${index}` ? "red" : "white";
      ctx.font = "bold 16px Arial";
      ctx.fillText("✕", box.x_min + 40, box.y_min - 7);

      // Draw resize handles if active
      if (activeBox === index) {
        const handleSize = 8;
        const handles = [
          { x: box.x_min, y: box.y_min }, // top-left
          { x: box.x_max, y: box.y_min }, // top-right
          { x: box.x_min, y: box.y_max }, // bottom-left
          { x: box.x_max, y: box.y_max }  // bottom-right
        ];

        handles.forEach((handle) => {
          ctx.fillStyle = "yellow";
          ctx.fillRect(
            handle.x - handleSize / 2, 
            handle.y - handleSize / 2, 
            handleSize, 
            handleSize
          );
        });
      }
    });
  };

  // Update when boundingBoxes change
  useEffect(() => {
    if (!isDrawingImage) {
      drawAllBoxes();
    }
  }, [boundingBoxes, activeBox, hoverBox, isDrawingImage]);

  // Handle mouse down - for selection, dragging and resizing
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Check if clicking on delete button
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      const deleteX = box.x_min + 40;
      const deleteY = box.y_min - 7;

      if (
        x >= deleteX - 10 && 
        x <= deleteX + 10 && 
        y >= deleteY - 10 && 
        y <= deleteY + 10
      ) {
        e.stopPropagation();
        onBoxDelete(i);
        return;
      }
    }

    // Check if clicking on a resize handle
    if (activeBox !== null) {
      const box = boundingBoxes[activeBox];
      const handleSize = 8;
      const handles = [
        { x: box.x_min, y: box.y_min, cursor: "nwse-resize", corner: "topLeft" },
        { x: box.x_max, y: box.y_min, cursor: "nesw-resize", corner: "topRight" },
        { x: box.x_min, y: box.y_max, cursor: "nesw-resize", corner: "bottomLeft" },
        { x: box.x_max, y: box.y_max, cursor: "nwse-resize", corner: "bottomRight" }
      ];

      for (let i = 0; i < handles.length; i++) {
        const handle = handles[i];
        if (
          x >= handle.x - handleSize && 
          x <= handle.x + handleSize && 
          y >= handle.y - handleSize && 
          y <= handle.y + handleSize
        ) {
          e.stopPropagation();
          setDraggingCorner({ 
            boxIndex: activeBox, 
            corner: handle.corner, 
            startX: x, 
            startY: y,
            originalBox: { ...box }
          });
          return;
        }
      }
    }

    // Check if clicking inside a box (for dragging)
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      if (
        x >= box.x_min && 
        x <= box.x_max && 
        y >= box.y_min && 
        y <= box.y_max
      ) {
        e.stopPropagation();
        setActiveBox(i);
        setDraggingBox({
          boxIndex: i,
          startX: x,
          startY: y,
          offsetX: x - box.x_min,
          offsetY: y - box.y_min,
          originalBox: { ...box }
        });
        return;
      }
    }

    // If clicking outside any box, deselect and allow new box creation
    setActiveBox(null);
    onClick(e);
  };

  // Handle mouse move - for dragging and resizing
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Update cursor based on hover position
    let cursorChanged = false;

    // Check if hovering over delete button
    for (let i = 0; i < boundingBoxes.length; i++) {
      const box = boundingBoxes[i];
      const deleteX = box.x_min + 40;
      const deleteY = box.y_min - 7;

      if (
        x >= deleteX - 10 && 
        x <= deleteX + 10 && 
        y >= deleteY - 10 && 
        y <= deleteY + 10
      ) {
        canvas.style.cursor = "pointer";
        setHoverBox(`delete-${i}`);
        cursorChanged = true;
        break;
      }
    }

    if (!cursorChanged) {
      setHoverBox(null);

      // Check if hovering over a resize handle
      if (activeBox !== null) {
        const box = boundingBoxes[activeBox];
        const handleSize = 8;
        const handles = [
          { x: box.x_min, y: box.y_min, cursor: "nwse-resize" },
          { x: box.x_max, y: box.y_min, cursor: "nesw-resize" },
          { x: box.x_min, y: box.y_max, cursor: "nesw-resize" },
          { x: box.x_max, y: box.y_max, cursor: "nwse-resize" }
        ];

        for (let i = 0; i < handles.length; i++) {
          const handle = handles[i];
          if (
            x >= handle.x - handleSize && 
            x <= handle.x + handleSize && 
            y >= handle.y - handleSize && 
            y <= handle.y + handleSize
          ) {
            canvas.style.cursor = handle.cursor;
            cursorChanged = true;
            break;
          }
        }
      }

      // Check if hovering inside a box
      if (!cursorChanged) {
        for (let i = 0; i < boundingBoxes.length; i++) {
          const box = boundingBoxes[i];
          if (
            x >= box.x_min && 
            x <= box.x_max && 
            y >= box.y_min && 
            y <= box.y_max
          ) {
            canvas.style.cursor = "move";
            cursorChanged = true;
            break;
          }
        }

        if (!cursorChanged) {
          canvas.style.cursor = "crosshair";
        }
      }
    }

    // Handle corner dragging
    if (draggingCorner) {
      const { boxIndex, corner, originalBox } = draggingCorner;
      const newBox = { ...originalBox };

      switch (corner) {
        case "topLeft":
          newBox.x_min = Math.min(originalBox.x_max - 10, x);
          newBox.y_min = Math.min(originalBox.y_max - 10, y);
          break;
        case "topRight":
          newBox.x_max = Math.max(originalBox.x_min + 10, x);
          newBox.y_min = Math.min(originalBox.y_max - 10, y);
          break;
        case "bottomLeft":
          newBox.x_min = Math.min(originalBox.x_max - 10, x);
          newBox.y_max = Math.max(originalBox.y_min + 10, y);
          break;
        case "bottomRight":
          newBox.x_max = Math.max(originalBox.x_min + 10, x);
          newBox.y_max = Math.max(originalBox.y_min + 10, y);
          break;
        default:
          break;
      }

      onBoxUpdate(boxIndex, newBox);
    }

    // Handle box dragging
    if (draggingBox) {
      const { boxIndex, offsetX, offsetY, originalBox } = draggingBox;
      const width = originalBox.x_max - originalBox.x_min;
      const height = originalBox.y_max - originalBox.y_min;

      const newX = x - offsetX;
      const newY = y - offsetY;

      const newBox = {
        x_min: newX,
        y_min: newY,
        x_max: newX + width,
        y_max: newY + height,
        color: originalBox.color
      };

      onBoxUpdate(boxIndex, newBox);
    }
  };

  // Handle mouse up - end dragging
  const handleMouseUp = () => {
    setDraggingCorner(null);
    setDraggingBox(null);
  };

  // Handle mouse leave - end dragging
  const handleMouseLeave = () => {
    setDraggingCorner(null);
    setDraggingBox(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => e.stopPropagation()} // Prevent click propagation
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="rounded-lg shadow-lg"
    />
  );
}
