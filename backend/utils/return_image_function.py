from dotenv import load_dotenv
import os
# Load .env file
load_dotenv()

TRACK_FILE = os.getenv("TRACK_FILE")

def get_next_image():
    """Reads the last image ID, increments it, and updates the tracking file."""
    with open(TRACK_FILE, "r+") as f:
        last_id = int(f.read().strip())
        new_id = last_id + 1
        f.seek(0)
        f.write(str(new_id))
        f.truncate()
    return f"{last_id}.jpg"