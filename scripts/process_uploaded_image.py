import os
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import requests
from dotenv import load_dotenv

# ---------------- CONFIG ---------------- #
load_dotenv()
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY') or "YOUR_FALLBACK_KEY"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------------- LOAD MODELS ---------------- #
blip_model_path = "./models/blip_model/blip_model"
clip_model_path = "./models/clip-vit-base-patch32/clip-vit-base-patch32"

print("✅ Loading BLIP...")
blip_processor = BlipProcessor.from_pretrained(blip_model_path)
blip_model = BlipForConditionalGeneration.from_pretrained(blip_model_path).to(DEVICE)
print("✅ BLIP model loaded!")

print("✅ Loading CLIP...")
clip_model = CLIPModel.from_pretrained(clip_model_path).to(DEVICE)
clip_processor = CLIPProcessor.from_pretrained(clip_model_path)
print("✅ CLIP model loaded successfully on", DEVICE)

# ---------------- BLIP CAPTION ---------------- #
def generate_blip_caption(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
        inputs = blip_processor(image, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            out = blip_model.generate(**inputs)
        caption = blip_processor.decode(out[0], skip_special_tokens=True)
        return caption
    except Exception as e:
        print(f"❌ BLIP error for {image_path}: {e}")
        return ""

# ---------------- COLOR PALETTE ---------------- #
def extract_colors(image_path, n_colors=5):
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize((128, 128))
        img_np = np.array(img).reshape(-1, 3)
        kmeans = KMeans(n_clusters=n_colors, random_state=42)
        kmeans.fit(img_np)
        colors = kmeans.cluster_centers_.astype(int)
        hex_colors = ['#%02x%02x%02x' % tuple(c) for c in colors]
        return hex_colors
    except Exception as e:
        print(f"❌ Color extraction error for {image_path}: {e}")
        return []

# ---------------- CLIP EMBEDDING ---------------- #
def compute_clip_embedding(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
        inputs = clip_processor(images=image, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            embedding = clip_model.get_image_features(**inputs)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)
        return embedding.cpu().numpy().flatten().tolist()
    except Exception as e:
        print(f"❌ CLIP embedding error for {image_path}: {e}")
        return []

# ---------------- LLM CALL ---------------- #
def call_openrouter(prompt):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [
            {"role": "system", "content": "You are a fashion stylist and classifier."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 200
    }
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=30)
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"❌ LLM call error: {e}")
        return ""

# ---------------- MAIN PROCESS FUNCTION ---------------- #
def process_new_image(image_path):
    print(f"🚀 Processing {image_path}")

    caption = generate_blip_caption(image_path)
    print(f"✅ Caption: {caption}")

    colors = extract_colors(image_path)
    print(f"✅ Colors: {colors}")

    # LLM PROMPTS
    prompt_season = f"""Given this description: "{caption}" and these colors: {colors}, predict the fashion season (Spring, Summer, Autumn, Winter). Return only the season word."""
    season = call_openrouter(prompt_season)
    print(f"✅ Season: {season}")

    prompt_display_name = f"""Given this description: "{caption}" and these colors: {colors}, suggest a product display name (e.g. "Casual Shirt", "Evening Dress"). Return only the name."""
    display_name = call_openrouter(prompt_display_name)
    print(f"✅ Display Name: {display_name}")

    prompt_aesthetic = f"""Given this description: "{caption}" and these colors: {colors}, choose ONE from these categories:
Minimalist, Boho, Streetwear, Casual Basics, Preppy, Activewear, Lingerie/Intimate, Ethnic/Traditional, Footwear, Outerwear, Accessories, Formal, Party, Vintage.
Return only that category."""
    aesthetic_category = call_openrouter(prompt_aesthetic)
    print(f"✅ Aesthetic Category: {aesthetic_category}")

    prompt_vibe = f"""Given this description: "{caption}" and these colors: {colors}, write ONE short line describing the fashion vibe in 5-6 words, capturing style and mood."""
    aesthetic_vibe = call_openrouter(prompt_vibe)
    print(f"✅ Aesthetic Vibe: {aesthetic_vibe}")

    clip_embedding = compute_clip_embedding(image_path)
    print(f"✅ CLIP embedding generated.")

    result = {
        "image_path": image_path,
        "caption": caption,
        "color_palette": colors,
        "season": season,
        "productDisplayName": display_name,
        "aesthetic_category": aesthetic_category,
        "aesthetic_vibe": aesthetic_vibe,
        "clip_embedding": clip_embedding
    }

    return result

# ---------------- CLI RUN EXAMPLE ---------------- #
if __name__ == "__main__":
    test_image = "assets/test-img-1.png"
    result = process_new_image(test_image)
    print("\n🎯 Final Result:")
    print(result)
