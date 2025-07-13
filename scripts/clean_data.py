import pandas as pd
import os

# Set paths
RAW_CSV = "data/styles.csv"
IMAGE_DIR = "data/images"
OUTPUT_CSV = "data/catalog_metadata.csv"

# Load original metadata
df = pd.read_csv(RAW_CSV, on_bad_lines='skip')
print(f"✅ Loaded {len(df)} rows from metadata")

# Drop rows without id or subCategory
df_clean = df.dropna(subset=["id", "subCategory"])
df_clean["id"] = df_clean["id"].astype(str)

# Add image path
df_clean["image_path"] = df_clean["id"].apply(lambda x: os.path.join(IMAGE_DIR, f"{x}.jpg"))

# Only keep rows with image file present
df_clean = df_clean[df_clean["image_path"].apply(os.path.exists)]

# Rename for consistency
df_clean = df_clean.rename(columns={"subCategory": "category"})

# Select useful columns
keep_cols = ["id", "gender", "masterCategory", "category", "baseColour", "season", "productDisplayName", "image_path"]
df_clean = df_clean[keep_cols]

# Save
df_clean.to_csv(OUTPUT_CSV, index=False)
print(f"✅ Saved cleaned metadata to {OUTPUT_CSV}")
print(f"📦 Total usable items: {len(df_clean)}")
