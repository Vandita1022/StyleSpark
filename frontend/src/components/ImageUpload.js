import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAnalysis(null);
    setSimilarItems([]);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://127.0.0.1:5000/analyze', formData);
      const data = response.data;

      setAnalysis(data.analysis);
      setSimilarItems(data.recommendations);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error analyzing image. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload and Analyze Image</h2>

      <div className="controls">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {analysis && (
        <div className="analysis">
          <h3>🧵 Analysis</h3>
          <p><strong>Caption:</strong> {analysis.caption}</p>
          <p><strong>Season:</strong> {analysis.season}</p>
          <p><strong>Aesthetic Category:</strong> {analysis.aesthetic_category}</p>
          <p><strong>Aesthetic Vibe:</strong> {analysis.aesthetic_vibe}</p>
          <p><strong>Product Name:</strong> {analysis.display_name}</p>
          <div>
            <strong>Color Palette:</strong>
            <div className="color-palette">
              {analysis.colors && analysis.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {similarItems.length > 0 && (
        <div className="recommendations">
          <h3>🎯 Recommended Items</h3>
          <div className="recommendation-grid">
            {similarItems.map((item, idx) => (
              <div key={idx} className="recommendation-card">
                <img
                  src={`http://127.0.0.1:5000/static/catalog_images/${item.id}.jpg`}
                  alt={item.productDisplayName}
                />
                <p><strong>Product:</strong> {item.productDisplayName}</p>
                <p><strong>Base Colour:</strong> {item.baseColour}</p>
                <p><strong>Season:</strong> {item.season}</p>
                <p><strong>Similarity:</strong> {item.similarity?.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
