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


// utils/api.js
export async function sendBoundingBoxesData(imageUrl, boundingBoxes, username) {
    try {
      // Prepare payload.
      // You can format the bounding boxes as needed.
      const payload = {
        image_url: imageUrl,
        // Here, we're converting the array of boxes into an object keyed by a label name.
        // For instance, if each box already has a label property, you might want to use that.
        objects: boundingBoxes.reduce((acc, box, index) => {
          // Example: use "object0", "object1", ... as keys.
          // You might also convert the box coordinates from x_min, y_min, x_max, y_max 
          // to YOLO format [class_id, x_center, y_center, width, height] if required.
          acc[`object${index}`] = [
            box.label?.id || 0, // class_id
            (box.x_min + box.x_max) / 2, // x_center (example calculation)
            (box.y_min + box.y_max) / 2, // y_center
            box.x_max - box.x_min,       // width
            box.y_max - box.y_min        // height
          ];
          return acc;
        }, {}),
        username: username
      };
  
      const response = await fetch("http://localhost:8000/save-annotation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send bounding boxes");
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending bounding boxes data:", error);
      return null;
    }
  }
  