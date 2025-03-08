import cv2

# Load the image
image_path = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data\28.jpg"  # Update with the correct path if needed
image = cv2.imread(image_path)

# Check if image loaded successfully
if image is None:
    print("Error: Could not load image.")
    exit()

# Define the point
point = (int(635.4), int(336.0))  # Convert float to integer for OpenCV

# Draw a red circle at the point
cv2.circle(image, point, radius=5, color=(0, 0, 255), thickness=-1)  # Red dot

# Display the image
cv2.imshow("Plotted Point", image)
cv2.waitKey(0)  # Wait for key press
cv2.destroyAllWindows()  # Close window
