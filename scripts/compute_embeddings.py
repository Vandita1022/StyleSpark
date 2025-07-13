import os
import torch
import pandas as pd
from PIL import Image
from tqdm import tqdm
from transformers import CLIPProcessor, CLIPModel

# Paths
METADATA_CSV = "data/catalog_metadata.csv"
EMBEDDINGS_PATH = "data/catalog_embeddings.pt"

# Batch size for processing
BATCH_SIZE = 32

# Device
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"✅ Using device: {device}")

# Load catalog metadata
df = pd.read_csv(METADATA_CSV)
image_paths = df['image_path'].tolist()
print(f"✅ Found {len(image_paths)} images to process")

# Load CLIP
print("✅ Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

# Embedding function
def embed_batch(batch_paths):
    images = [Image.open(p).convert("RGB") for p in batch_paths]
    inputs = processor(images=images, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        features = model.get_image_features(**inputs)
        features = features / features.norm(dim=-1, keepdim=True)
    return features.cpu()

# Process in batches
all_embeddings = []
for i in tqdm(range(0, len(image_paths), BATCH_SIZE), desc="Embedding batches"):
    batch_paths = image_paths[i:i+BATCH_SIZE]
    batch_embeddings = embed_batch(batch_paths)
    all_embeddings.append(batch_embeddings)

# Concatenate
catalog_embeddings = torch.cat(all_embeddings)
print(f"✅ Embedding shape: {catalog_embeddings.shape}")

# Save
torch.save(catalog_embeddings, EMBEDDINGS_PATH)
print(f"✅ Saved embeddings to {EMBEDDINGS_PATH}")
