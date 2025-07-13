import torch
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# -----------------------------------------------
# CONFIG
# -----------------------------------------------
CATALOG_METADATA_PATH = "data/catalog_metadata.csv"
CATALOG_EMBEDDINGS_PATH = "data/catalog_embeddings.pt"

# -----------------------------------------------
# LOAD CATALOG DATA
# -----------------------------------------------
def load_catalog():
    print("✅ Loading catalog metadata...")
    df = pd.read_csv(CATALOG_METADATA_PATH)

    print("✅ Loading catalog embeddings...")
    embeddings = torch.load(CATALOG_EMBEDDINGS_PATH)
    embeddings = embeddings.numpy()

    print(f"✅ Loaded {len(df)} items from catalog.")
    return df, embeddings

# -----------------------------------------------
# APPLY USER-SELECTED FILTERS
# -----------------------------------------------
def apply_filters(df, filters):
    """
    Filters catalog DataFrame to match user-selected criteria.
    For example:
        filters = {
            "season": "Summer",
            "baseColour": "Red",
            "aesthetic_category": "Boho"
        }
    Only rows matching all given values are kept.
    """
    for key, value in filters.items():
        if value and key in df.columns:
            df = df[df[key].str.lower() == value.lower()]
    return df

# -----------------------------------------------
# MAIN FUNCTION TO FIND SIMILAR ITEMS
# -----------------------------------------------
def find_similar_items(uploaded_result, top_k=10, filter_options=None):
    """
    uploaded_result: dict with uploaded image's CLIP embedding and predicted tags
    filter_options: optional dict to further filter catalog

    Returns: list of top_k catalog items with highest similarity
    """

    # Load catalog data
    df_catalog, catalog_embeddings = load_catalog()

    # Apply metadata filters if specified
    if filter_options:
        print(f"✅ Applying filters: {filter_options}")
        df_catalog = apply_filters(df_catalog, filter_options)
        if len(df_catalog) == 0:
            print("❌ No matching items in catalog after filtering!")
            return []
        catalog_embeddings = catalog_embeddings[df_catalog.index]

    # Extract uploaded image's embedding
    query_embedding = np.array(uploaded_result["clip_embedding"]).reshape(1, -1)

    # Compute cosine similarities
    similarities = cosine_similarity(query_embedding, catalog_embeddings)[0]

    # Get top_k indices with highest similarity
    top_indices = np.argsort(-similarities)[:top_k]
    results_df = df_catalog.iloc[top_indices].copy()
    results_df["similarity"] = similarities[top_indices]

    print(f"✅ Found {len(results_df)} similar items.")

    # Return as list of dicts for JSON API use
    return results_df.to_dict(orient="records")


# -----------------------------------------------
# CLI TEST EXAMPLE
# -----------------------------------------------
if __name__ == "__main__":
    print("\n🚀 Testing: Find Similar Items")

    # Simulated uploaded image prediction (normally from 03_process_uploaded_image.py)
    uploaded_result = {
        "clip_embedding": np.random.rand(512).tolist(),
        "season": "Summer",
        "productDisplayName": "Casual Red Shirt",
        "aesthetic_category": "Minimalist",
        "baseColour": "Red"
    }

    # Simulated filters (like user selecting checkboxes in UI)
    user_filters = {
        "season": uploaded_result["season"],
        "baseColour": uploaded_result["baseColour"],
        "aesthetic_category": uploaded_result["aesthetic_category"]
    }

    # Get recommendations
    results = find_similar_items(
        uploaded_result=uploaded_result,
        top_k=10,
        filter_options=user_filters
    )

    # Print results nicely
    print("\n🎯 Recommended Items:")
    for i, item in enumerate(results, 1):
        print(f"\n⭐️ Rank {i}")
        for key, value in item.items():
            print(f"  {key}: {value}")
