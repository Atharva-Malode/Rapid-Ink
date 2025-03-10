import os
import shutil

# Define paths
data_folder = r"C:\Users\HP\Desktop\Rapid-Ink\data"
subfolders = ["atharva", "raj", "pranav"]

# Ensure subfolders exist
for subfolder in subfolders:
    os.makedirs(os.path.join(data_folder, subfolder), exist_ok=True)

# Get list of all images in 'data' folder (excluding subfolders)
images = [f for f in os.listdir(data_folder) if f.endswith((".jpg", ".png", ".jpeg")) and os.path.isfile(os.path.join(data_folder, f))]

# Distribute images equally in round-robin fashion
for index, image in enumerate(images):
    subfolder = subfolders[index % len(subfolders)]  # Rotate between folders
    src_path = os.path.join(data_folder, image)
    dest_path = os.path.join(data_folder, subfolder, image)
    shutil.move(src_path, dest_path)

print("Images distributed successfully!")


# import os

# # Set the folder path
# folder_path = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data"  # Change this to your folder path

# # Get all image files in the folder (supporting .jpg, .jpeg, .png)
# image_extensions = (".jpg", ".jpeg", ".png")
# image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(image_extensions)]

# # Sort files to maintain order
# image_files.sort()

# # Rename files sequentially
# for index, filename in enumerate(image_files, start=1):
#     # Get file extension
#     ext = os.path.splitext(filename)[1].lower()
#     new_name = f"{index}{ext}"
    
#     # Old and new file paths
#     old_path = os.path.join(folder_path, filename)
#     new_path = os.path.join(folder_path, new_name)

#     # Rename the file
#     os.rename(old_path, new_path)
#     print(f"Renamed: {filename} -> {new_name}")

# print("Renaming complete!")
