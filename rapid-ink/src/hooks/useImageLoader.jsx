import { useState, useEffect } from "react";

export default function useImageLoader(username) {
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) return;

        setLoading(true);
        setError(null);

        fetch(`http://127.0.0.1:8000/next-image/${username}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch image");
                }
                return response.json();
            })
            .then((data) => {
                setImageUrl(data.image_url);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });

    }, [username]);

    return { imageUrl, loading, error };
}
