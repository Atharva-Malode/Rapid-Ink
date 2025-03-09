import { useState, useEffect } from "react";

export default function useImageLoader() {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://127.0.0.1:8000/next-image/")
            .then(response => response.json())
            .then(data => {
                setImageUrl(data.image_url);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching image:", error);
                setLoading(false);
            });
    }, []);

    return { imageUrl, loading };
}

// import { useState, useEffect } from "react";

// export default function useImageLoader(username, imagename) {
//     const [imageUrl, setImageUrl] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setLoading(true);
//         // Simulate backend fetch
//         setTimeout(() => {
//             setImageUrl(`http://127.0.0.1:8000/images/${username}/${imagename}`);
//             setLoading(false);
//         }, 500);
//     }, [username, imagename]);

//     return { imageUrl, loading };
// }