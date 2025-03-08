export async function sendClickData(imageUrl, x, y, username) {
    try {
        const response = await fetch("http://127.0.0.1:8000/boxes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ img: imageUrl, x, y, username }]),
        });
        const data = await response.json();
        console.log("Server response:", data);
        return data;
    } catch (error) {
        console.error("Error sending point:", error);
        return null;
    }
  }