from flask import Flask, request, jsonify, send_from_directory, render_template
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os

# Import utilities
from utils.process_new_image import process_new_image
from utils.recommend import find_similar_items
from utils.generate_outfits import generate_outfit_suggestions

# Configuration
UPLOAD_FOLDER = "uploads"
STATIC_IMAGE_FOLDER = os.path.join("..", "data", "images")  # for /static/catalog_images
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ ONE app initialization with correct folders
app = Flask(
    __name__,
    static_folder='react_build/static',
    template_folder='react_build'
)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app)

# ---------------------------------------------
# ✅ Serve React Frontend
# ---------------------------------------------
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

# ---------------------------------------------
# ✅ Endpoint: Analyze + Recommend (CLIP only)
# ---------------------------------------------
@app.route("/analyze", methods=["POST"])
def analyze_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(image_path)

    print(f"🚀 Received and saved image: {image_path}")

    # Step 1: Process the image
    result = process_new_image(image_path)

    # Step 2: Recommend similar items
    similar_items = find_similar_items(
        uploaded_result=result,
        top_k=12
    )

    # Step 3: Return clean response
    response = {
        "analysis": {
            "caption": result.get("caption"),
            "colors": result.get("color_palette"),
            "season": result.get("season"),
            "display_name": result.get("productDisplayName"),
            "aesthetic_category": result.get("aesthetic_category"),
            "aesthetic_vibe": result.get("aesthetic_vibe")
        },
        "recommendations": similar_items
    }

    return jsonify(response)

# ---------------------------------------------
# ✅ Endpoint: Outfit Generator
# ---------------------------------------------
@app.route("/generate-outfits", methods=["POST"])
def generate_outfits():
    data = request.get_json()

    if not data or "tops" not in data or "bottoms" not in data:
        return jsonify({"error": "Request must include 'tops' and 'bottoms'"}), 400

    outfits = generate_outfit_suggestions(data["tops"], data["bottoms"])
    return jsonify({"outfits": outfits})

# ---------------------------------------------
# ✅ Serve Catalog Images
# ---------------------------------------------
@app.route("/static/catalog_images/<path:filename>")
def serve_catalog_image(filename):
    return send_from_directory(STATIC_IMAGE_FOLDER, filename)

# ---------------------------------------------
# ✅ Run Server
# ---------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
