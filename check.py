import sys
import torch
import cv2
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor
import numpy as np

sys.path.append(r'C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\sam2\sam2')

device = torch.device("cpu")
print(f"Using device: {device}")

checkpoint = "./checkpoints/sam2.1_hiera_large.pt"
model_cfg = "configs/sam2.1/sam2.1_hiera_l.yaml"

img_path = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\sam2\sam2\test.jpeg"

# Read image
mat = cv2.imread(img_path)
clone = mat.copy()  # Keep an original copy

# Initialize model
sam2_model = build_sam2(model_cfg, checkpoint, device=device)
predictor = SAM2ImagePredictor(sam2_model)
predictor.set_image(mat)

# Function to get bounding box from a mask
def get_bounding_box(mask):
    """Finds the bounding box of a binary mask."""
    y_indices, x_indices = np.where(mask > 0)
    if len(x_indices) == 0 or len(y_indices) == 0:
        return None  # No object detected
    
    x_min, x_max = np.min(x_indices), np.max(x_indices)
    y_min, y_max = np.min(y_indices), np.max(y_indices)
    
    return (x_min, y_min, x_max, y_max)

# Click event: process each click immediately
def click_event(event, x, y, flags, param):
    global clone  # Use the clone image for updates

    if event == cv2.EVENT_LBUTTONDOWN:  # Left mouse button click
        print(f"Clicked at: ({x}, {y})")

        input_point = np.array([[x, y]])
        input_label = np.array([1])  # Label 1 for foreground

        # Get segmentation mask
        masks, scores, logits = predictor.predict(
            point_coords=input_point,
            point_labels=input_label,
            multimask_output=True,  # Returns 3 masks
        )

        # Select the **largest mask** (max area)
        largest_mask = max(masks, key=lambda m: np.sum(m))

        # Get bounding box of the largest mask
        bbox = get_bounding_box(largest_mask)

        if bbox:
            x_min, y_min, x_max, y_max = bbox
            print(f"Bounding Box: {bbox}")

            # Draw bounding box on the image
            cv2.rectangle(clone, (x_min, y_min), (x_max, y_max), (0, 0, 255), 2)  # Red bounding box

        # Show updated image
        cv2.imshow("Click to Segment", clone)

# Show original image
cv2.imshow("Click to Segment", clone)
cv2.setMouseCallback("Click to Segment", click_event)

# Wait until 'Esc' key is pressed
while True:
    key = cv2.waitKey(1) & 0xFF
    if key == 27:  # Press 'Esc' to exit
        break

cv2.destroyAllWindows()



# import cv2

# # Load the image
# image_path = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data\28.jpg"  # Update with the correct path if needed
# image = cv2.imread(image_path)

# # Check if image loaded successfully
# if image is None:
#     print("Error: Could not load image.")
#     exit()

# # Define the point
# point = (int(635.4), int(336.0))  # Convert float to integer for OpenCV

# # Draw a red circle at the point
# cv2.circle(image, point, radius=5, color=(0, 0, 255), thickness=-1)  # Red dot

# # Display the image
# cv2.imshow("Plotted Point", image)
# cv2.waitKey(0)  # Wait for key press
# cv2.destroyAllWindows()  # Close window
