# /scripts/generate_outfits.py

import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

def extract_dominant_color(image_path, k=3):
    """
    Extract dominant RGB color from image using KMeans.
    """
    image = Image.open(image_path).resize((100, 100)).convert('RGB')
    img_np = np.array(image).reshape(-1, 3)
    kmeans = KMeans(n_clusters=k, n_init='auto')
    kmeans.fit(img_np)
    dominant_color = kmeans.cluster_centers_[np.argmax(np.bincount(kmeans.labels_))]
    return tuple(map(int, dominant_color))


def color_distance(c1, c2):
    """
    Euclidean distance in RGB space.
    """
    return np.linalg.norm(np.array(c1) - np.array(c2))


def score_pair(color1, color2):
    """
    Heuristic scoring based on color distance.
    Higher score = better style.
    """
    dist = color_distance(color1, color2)
    if dist < 40:
        return 2   # very similar, safe but plain
    elif dist < 120:
        return 9   # complementary, stylish
    else:
        return 5   # bold contrast


def generate_outfit_suggestions(tops, bottoms, top_n=5):
    """
    Generate top outfit suggestions from lists of tops and bottoms.
    Each item must have:
        - id
        - image_path
        - baseColour (optional)

    Returns list of top N outfit pairs with score.
    """
    top_features = []
    for item in tops:
        color = extract_dominant_color(item['image_path'])
        top_features.append({
            **item,
            "dominant_color": color
        })

    bottom_features = []
    for item in bottoms:
        color = extract_dominant_color(item['image_path'])
        bottom_features.append({
            **item,
            "dominant_color": color
        })

    outfits = []
    for top in top_features:
        for bottom in bottom_features:
            score = score_pair(top["dominant_color"], bottom["dominant_color"])
            outfits.append({
                "top": top,
                "bottom": bottom,
                "score": score
            })

    # Sort and return top N
    outfits_sorted = sorted(outfits, key=lambda x: x["score"], reverse=True)
    return outfits_sorted[:top_n]
