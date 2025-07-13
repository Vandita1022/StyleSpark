# 🧵 StyleSpark – AI-Powered Fashion Recommender

<div align="center">
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=artificial-intelligence" alt="AI Powered" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
</div>

<div align="center">
  <h3>Discover your perfect style with AI-powered fashion analysis</h3>
  <p>Upload any outfit and get stunning personalized recommendations with a gorgeous dark-themed UI</p>
</div>

---

## 🔮 Features

### 🎯 **CLIP-based Similarity**
Upload any clothing image and get visually similar fashion items from a catalog using CLIP embeddings.

### 🧠 **BLIP Captioning + Color Analysis**
Extract captions and dominant colors from uploaded images with advanced AI models.

### 🌈 **Color Palette Display**
Visualize the main colors of your outfit with beautiful color swatches.

### 👗 **Recommendation Engine**
Get top 12 similar items based on visual embedding similarity scores.

### 🌙 **Dark Theme UI**
Stylish, modern, and intuitive frontend design optimized for the best user experience.

---

## 📂 Project Structure

```
StyleSpark/
│
├── flask_app/                    # Backend (Flask API)
│   ├── app.py                    # Main Flask application
│   ├── utils/
│   │   ├── recommend.py          # CLIP similarity logic
│   │   ├── process_new_image.py  # Captioning, colors, etc.
│   │   └── generate_outfits.py   # (Optional) Outfit generator
│   ├── uploads/                  # Uploaded user images
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ImageUpload.js    # Main upload component
│   │   ├── App.js               # Main React app
│   │   └── index.js             # Entry point
│   ├── package.json
│   └── tailwind.config.js       # Tailwind CSS configuration
│
├── data/
│   ├── images/                   # Fashion catalog images
│   ├── styles.csv               # Product metadata
│   ├── clip_embeddings.npy      # Precomputed CLIP vectors
│   └── filenames.csv            # Image paths for embeddings
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### 🖥️ Backend Setup (Flask)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StyleSpark.git
   cd StyleSpark
   ```

2. **Set up the Flask backend**
   ```bash
   cd flask_app
   pip install -r requirements.txt
   ```

3. **Start the API server**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### 🌐 Frontend Setup (React + Tailwind)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Tailwind CSS (if not already configured)**
   ```bash
   npx tailwindcss init -p
   ```

4. **Start the development server**
   ```bash
   npm run dev  # or npm start
   ```
   The frontend will run on `http://localhost:3000`

---

## 📸 How It Works

1. **📤 Upload**: Upload any outfit image from your device
2. **🔍 Analysis**: Backend extracts:
   - BLIP caption (text description)
   - Dominant colors using advanced color analysis
   - CLIP vector embedding for similarity matching
3. **🎯 Matching**: Finds visually similar items in the dataset using cosine similarity
4. **📋 Results**: Returns curated results with preview, similarity score, and style tags

### 🧪 Example Workflow

```
Input: Red floral dress image
↓
AI Processing: "A red floral dress with short sleeves"
↓
Color Analysis: #D32F2F, #FF6B6B, #4CAF50
↓
Output: 12 similar red dresses, floral patterns, seasonal tags
```

---

## 🛠️ Tech Stack

| **Frontend** | **Backend** | **AI/ML Models** |
|--------------|-------------|------------------|
| React | Flask (Python) | BLIP (Salesforce) |
| TailwindCSS | NumPy | CLIP (OpenAI) |
| JavaScript | PIL/Pillow | Scikit-learn |
| HTML5 | Flask-CORS | OpenCV |

---

## 📦 Datasets Used

- **Fashion Product Images** from Kaggle
- **~44,000 curated fashion items** with metadata
- **Precomputed CLIP embeddings** for lightning-fast similarity matching
- **Cleaned and structured metadata** for accurate recommendations

---

## 💡 Future Improvements

- [ ] **Advanced Filters**: Season, gender, subcategory dropdowns
- [ ] **Outfit Matching**: Cross-category recommendations (tops + bottoms)
- [ ] **Cloud Deployment**: HuggingFace Spaces / Render / Vercel
- [ ] **User Accounts**: Save favorites and learn preferences
- [ ] **Style Rating System**: Community-driven style scoring
- [ ] **Mobile App**: React Native companion app
- [ ] **Social Features**: Share and discover looks

---

## 🚀 Deployment

### Local Development
```bash
# Backend
cd flask_app && python app.py

# Frontend (new terminal)
cd frontend && npm run dev
```

### Production Deployment
- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Render/Railway/Heroku
- **Database**: Add PostgreSQL for user data

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Author

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-💙-red" alt="Made with love" />
  <br>
  <strong>Created by Vandita Gupta</strong>
  <br>
  <em>For Walmart Hackathon 🚀</em>
</div>

---

## 🙏 Acknowledgments

- **OpenAI** for the CLIP model
- **Salesforce** for the BLIP captioning model  
- **Kaggle** for the fashion dataset
- **Walmart** for hosting the inspiring hackathon

---

<div align="center">
  <p>⭐ Don't forget to star this repo if you found it helpful!</p>
  <p>Made with ❤️ and lots of ☕</p>
</div>
