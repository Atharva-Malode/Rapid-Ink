import { useParams } from "react-router-dom";
import CanvasDisplay from "../components/CanvasDisplay";
import useImageLoader from "../hooks/useImageLoader";
import useBoundingBox from "../hooks/useBoundingBox";
import Sidebar from "../components/Sidebar";

export default function ImagePage() {
  const { username, imagename } = useParams();
  const { imageUrl, loading } = useImageLoader(username, imagename);
  const { 
    boundingBoxes, 
    handleCanvasClick, 
    updateBoundingBox, 
    deleteBoundingBox 
  } = useBoundingBox(imageUrl, username);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black">
      {loading ? (
        <p className="text-white text-lg">Loading image...</p>
      ) : (
        <>
          <Sidebar/>
          <div className="mb-4 text-white text-sm">
            Click on objects to detect them. Click on boxes to select and edit them.
          </div>
          <CanvasDisplay 
            imageUrl={imageUrl} 
            boundingBoxes={boundingBoxes} 
            onClick={handleCanvasClick}
            onBoxUpdate={updateBoundingBox}
            onBoxDelete={deleteBoundingBox}
          />
        </>
      )}
    </div>
  );
}
// import { useParams } from "react-router-dom";
// import CanvasDisplay from "../components/CanvasDisplay";
// import useImageLoader from "../hooks/useImageLoader";
// import useBoundingBox from "../hooks/useBoundingBox";

// export default function ImagePage() {
//     const { username, imagename } = useParams();
//     const { imageUrl, loading } = useImageLoader(username, imagename);
//     const { boundingBox, handleCanvasClick } = useBoundingBox(imageUrl, username);

//     return (
//         <div className="flex items-center justify-center w-full h-screen bg-black">
//             {loading ? (
//                 <p className="text-white text-lg">Loading image...</p>
//             ) : (
//                 <CanvasDisplay imageUrl={imageUrl} boundingBox={boundingBox} onClick={handleCanvasClick} />
//             )}
//         </div>
//     );
// }