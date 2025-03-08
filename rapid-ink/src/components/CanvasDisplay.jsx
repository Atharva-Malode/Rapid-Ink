import { useRef, useEffect } from "react";

export default function CanvasDisplay({ imageUrl, boundingBox, onClick }) {
    const canvasRef = useRef(null);

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

    useEffect(() => {
        if (boundingBox) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                boundingBox.x_min,
                boundingBox.y_min,
                boundingBox.x_max - boundingBox.x_min,
                boundingBox.y_max - boundingBox.y_min
            );
        }
    }, [boundingBox]);

    return (
        <canvas
            ref={canvasRef}
            onClick={onClick}
            className="rounded-lg shadow-lg cursor-crosshair"
        />
    );
}