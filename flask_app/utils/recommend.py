import os
import torch
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def normalize_color(hex_code):
    """
    Normalize a hex color by converting to lowercase and mapping to common base colours.
    You can expand the mapping if needed.
    """
    base_colors = {
        '#000000': 'black',
        '#ffffff': 'white',
        '#ff0000': 'red',
        '#00ff00': 'green',
        '#0000ff': 'blue',
        '#ffff00': 'yellow',
        '#ffa500': 'orange',
        '#800080': 'purple',
        '#808080': 'gray',
        '#a52a2a': 'brown',
        # Add more if needed
    }

    hex_code = hex_code.strip().lower()
    return base_colors.get(hex_code, hex_code)


# -----------------------------------------------
# PATHS
# -----------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

CATALOG_METADATA_PATH = os.path.join(BASE_DIR, "data", "catalog_metadata.csv")
CATALOG_EMBEDDINGS_PATH = os.path.join(BASE_DIR, "data", "catalog_embeddings.pt")

# -----------------------------------------------
# LOAD CATALOG DATA
# -----------------------------------------------

CATALOG_FILENAMES_PATH = os.path.join(BASE_DIR, "data", "image_filenames.csv")  # updated path

def load_catalog():
    print("✅ Loading catalog metadata...")
    df = pd.read_csv(CATALOG_METADATA_PATH)

    print("✅ Loading catalog embeddings...")
    embeddings = torch.load(CATALOG_EMBEDDINGS_PATH)

    print("✅ Loading embedding filenames...")
    filenames_df = pd.read_csv(CATALOG_FILENAMES_PATH)  # assumes header is present
    filenames_df.rename(columns={filenames_df.columns[0]: "path"}, inplace=True)

    # Extract ID from path (e.g., '/kaggle/.../images/31973.jpg' → 31973)
    filenames_df["id"] = filenames_df["path"].apply(
        lambda x: int(os.path.splitext(os.path.basename(x))[0])
    )
    filenames_df["embedding_idx"] = filenames_df.index

    # Merge on 'id' to align metadata with embeddings
    df = df.merge(filenames_df, on="id")

    # Filter embeddings to match aligned metadata
    aligned_embeddings = embeddings[df["embedding_idx"].values]

    print(f"✅ Final aligned catalog items: {len(df)}")

    return df.drop(columns=["embedding_idx"]), aligned_embeddings.numpy()


# -----------------------------------------------
# FIND SIMILAR ITEMS USING CLIP ONLY
# -----------------------------------------------
def find_similar_items(uploaded_result, top_k=10):
    """
    uploaded_result: dict with 'clip_embedding' key (list or np.array)
    top_k: number of results to return

    Returns: list of dicts with similar items
    """

    # Load data
    df_catalog, catalog_embeddings = load_catalog()

    # Convert query embedding
    query_embedding = np.array(uploaded_result["clip_embedding"]).reshape(1, -1)

    # Compute cosine similarity
    similarities = cosine_similarity(query_embedding, catalog_embeddings)[0]

    # Get top_k indices
    top_indices = np.argsort(-similarities)[:top_k]

    # Slice and annotate
    results_df = df_catalog.iloc[top_indices].copy()
    results_df["similarity"] = similarities[top_indices]

    # Return selected fields only
    wanted_cols = ["id", "productDisplayName", "baseColour", "season", "similarity"]
    result_cols = [col for col in wanted_cols if col in results_df.columns]

    return results_df[result_cols].to_dict(orient="records")
