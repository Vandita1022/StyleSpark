import React, { useState } from 'react';
import axios from 'axios';

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

      setAnalysis(data.analysis); // ✅ FIXED KEY
      setSimilarItems(data.recommendations); // ✅ FIXED KEY
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error analyzing image. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload and Analyze Image</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {analysis && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>🧵 Analysis</h3>
          <p><strong>Caption:</strong> {analysis.caption}</p>
          <p><strong>Season:</strong> {analysis.season}</p>
          <p><strong>Aesthetic Category:</strong> {analysis.aesthetic_category}</p>
          <p><strong>Aesthetic Vibe:</strong> {analysis.aesthetic_vibe}</p>
          <p><strong>Product Name:</strong> {analysis.display_name}</p>
          <div>
            <strong>Color Palette:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              {analysis.colors && analysis.colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: color,
                    width: '30px',
                    height: '30px',
                    border: '1px solid #000'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {similarItems.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>🎯 Recommended Items</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {similarItems.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <img
                  src={`http://127.0.0.1:5000/static/catalog_images/${item.id}.jpg`}
                  alt={item.productDisplayName}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '8px' }}
                />
                <p><strong>Product:</strong> {item.productDisplayName}</p>
                <p><strong>Base Colour:</strong> {item.baseColour}</p>
                <p><strong>Season:</strong> {item.season}</p>
                <p><strong>Aesthetic Category:</strong> {item.aesthetic_category}</p>
                <p><strong>Similarity Score:</strong> {item.similarity?.toFixed(4)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
