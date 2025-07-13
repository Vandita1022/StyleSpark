from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from app import recommendation, outfits

app = FastAPI()

# Allow CORS so frontend (React) can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later you can restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/recommend")
async def recommend_endpoint(file: UploadFile = File(...)):
    # 1️⃣ Save uploaded image
    upload_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2️⃣ Call recommendation logic
    results = recommendation.get_recommendations(upload_path)

    # 3️⃣ Return results to frontend
    return results


from pydantic import BaseModel
from typing import List

class OutfitRequest(BaseModel):
    tops: List[str]
    bottoms: List[str]

@app.post("/generate-outfits")
async def generate_outfits_endpoint(request: OutfitRequest):
    # 1️⃣ Get tops and bottoms from request
    tops = request.tops
    bottoms = request.bottoms

    # 2️⃣ Call outfit generation logic
    outfits_results = outfits.generate_outfits_route(tops, bottoms)

    # 3️⃣ Return to frontend
    return {"outfits": outfits_results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
