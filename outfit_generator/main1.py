import os
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import itertools

# --- BASE DIRECTORY FIX ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TOPS_DIR = os.path.join(BASE_DIR, "inputs", "tops")
BOTTOMS_DIR = os.path.join(BASE_DIR, "inputs", "bottoms")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- FEATURE EXTRACTOR: COLOR ---
def extract_dominant_color(image_path, k=3):
    image = Image.open(image_path).resize((100, 100)).convert('RGB')
    img_np = np.array(image).reshape(-1, 3)
    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(img_np)
    dominant_color = kmeans.cluster_centers_[np.argmax(np.bincount(kmeans.labels_))]
    return tuple(map(int, dominant_color))  # RGB

# --- SCORER ---
def color_distance(c1, c2):
    return np.linalg.norm(np.array(c1) - np.array(c2))

def score_pair(color1, color2):
    dist = color_distance(color1, color2)
    if dist < 40:
        return 2  # too similar, safe but plain
    elif dist < 120:
        return 9  # complementary, stylish
    else:
        return 5  # bold contrast

# --- IMAGE COMBINER ---
def combine_images(top_path, bottom_path, output_path):
    top = Image.open(top_path).resize((300, 300))
    bottom = Image.open(bottom_path).resize((300, 300))
    combined = Image.new("RGB", (600, 300))
    combined.paste(top, (0, 0))
    combined.paste(bottom, (300, 0))
    combined.save(output_path)

# --- MAIN LOGIC ---
tops = [os.path.join(TOPS_DIR, f) for f in os.listdir(TOPS_DIR) if f.lower().endswith((".jpg", ".jpeg"))]
bottoms = [os.path.join(BOTTOMS_DIR, f) for f in os.listdir(BOTTOMS_DIR) if f.lower().endswith((".jpg", ".jpeg"))]

top_features = [{"path": path, "color": extract_dominant_color(path)} for path in tops]
bottom_features = [{"path": path, "color": extract_dominant_color(path)} for path in bottoms]

outfits = []
for top, bottom in itertools.product(top_features, bottom_features):
    score = score_pair(top["color"], bottom["color"])
    outfits.append({
        "top_path": top["path"],
        "bottom_path": bottom["path"],
        "score": score
    })

# Sort outfits and select top 3
top_outfits = sorted(outfits, key=lambda x: x["score"], reverse=True)[:3]

# Create visual output
print("✅ Top 3 outfit combinations generated in /outputs:\n")
for idx, outfit in enumerate(top_outfits, start=1):
    out_path = os.path.join(OUTPUT_DIR, f"outfit_{idx}.jpg")
    combine_images(outfit["top_path"], outfit["bottom_path"], out_path)
    print(f"{idx}. {os.path.basename(outfit['top_path'])} + {os.path.basename(outfit['bottom_path'])} → {out_path}")
