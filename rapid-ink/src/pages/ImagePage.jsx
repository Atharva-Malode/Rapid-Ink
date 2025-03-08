import { useParams } from "react-router-dom";
import CanvasDisplay from "../components/CanvasDisplay";
import useImageLoader from "../hooks/useImageLoader";
import useBoundingBox from "../hooks/useBoundingBox";

export default function ImagePage() {
    const { username, imagename } = useParams();
    const { imageUrl, loading } = useImageLoader(username, imagename);
    const { boundingBox, handleCanvasClick } = useBoundingBox(imageUrl, username);

    return (
        <div className="flex items-center justify-center w-full h-screen bg-black">
            {loading ? (
                <p className="text-white text-lg">Loading image...</p>
            ) : (
                <CanvasDisplay imageUrl={imageUrl} boundingBox={boundingBox} onClick={handleCanvasClick} />
            )}
        </div>
    );
}