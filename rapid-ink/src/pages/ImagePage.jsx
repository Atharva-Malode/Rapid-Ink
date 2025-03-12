import { useParams } from "react-router-dom";
import CanvasDisplay from "../components/CanvasDisplay";
import useImageLoader from "../hooks/useImageLoader";
import useBoundingBox from "../hooks/useBoundingBox";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

export default function ImagePage() {
  const { username, imagename } = useParams();
  const { imageUrl, loading } = useImageLoader(username, imagename);
  const { 
    boundingBoxes, 
    handleCanvasClick, 
    updateBoundingBox, 
    deleteBoundingBox 
  } = useBoundingBox(imageUrl, username);
  const [vehicleLabels, setVehicleLabels] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);

  useEffect(() => {
    const storedLabels = localStorage.getItem('vehicle_labels');
    if (storedLabels) {
      try {
        const parsedLabels = JSON.parse(storedLabels);
        setVehicleLabels(parsedLabels);
        console.log(parsedLabels);
        const defaultLabel = Object.values(parsedLabels).find(label => label.id === 0);
        console.log(defaultLabel);
        if (defaultLabel) {
          setActiveLabel(defaultLabel);
        }
      } catch (error) {
        console.error('Error parsing vehicle labels from localStorage:', error);
      }
    }
  }, []);

  const handleLabelChange = (label) => {
    setActiveLabel(label);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-screen bg-black p-4 text-center">
      {loading ? (
        <p className="text-white text-lg">Loading image...</p>
      ) : (
        <>
          <Sidebar vehicleLabels={vehicleLabels} />
          <div className="mb-4 text-white text-sm">
            Click on objects to detect them. Click on boxes to select and edit them.
          </div>
          <div className="mb-4 text-white text-sm">
            <h3 className="mb-2">Available Labels:</h3>
            <div className="flex gap-2">
              {vehicleLabels && Object.entries(vehicleLabels).map(([key, { id, color }]) => (
                <button
                  key={id}
                  onClick={() => handleLabelChange({ id, color })}
                  style={{ backgroundColor: color }}
                  className={`p-2 rounded ${activeLabel?.id === id ? 'border-2 border-white' : ''}`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <CanvasDisplay 
            imageUrl={imageUrl} 
            boundingBoxes={boundingBoxes} 
            onClick={(event) => handleCanvasClick(event, activeLabel)}
            onBoxUpdate={updateBoundingBox}
            onBoxDelete={deleteBoundingBox}
            activeLabel={activeLabel}
            setActiveLabel={setActiveLabel}
          />
        </>
      )}
    </div>
  );
}
