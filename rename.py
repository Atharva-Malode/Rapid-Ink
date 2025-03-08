import os

# Set the folder path
folder_path = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data"  # Change this to your folder path

# Get all image files in the folder (supporting .jpg, .jpeg, .png)
image_extensions = (".jpg", ".jpeg", ".png")
image_files = [f for f in os.listdir(folder_path) if f.lower().endswith(image_extensions)]

# Sort files to maintain order
image_files.sort()

# Rename files sequentially
for index, filename in enumerate(image_files, start=1):
    # Get file extension
    ext = os.path.splitext(filename)[1].lower()
    new_name = f"{index}{ext}"
    
    # Old and new file paths
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)

    # Rename the file
    os.rename(old_path, new_path)
    print(f"Renamed: {filename} -> {new_name}")

print("Renaming complete!")
