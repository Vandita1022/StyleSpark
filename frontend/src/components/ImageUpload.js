import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAnalysis(null);
    setSimilarItems([]);
    setError('');

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
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

  return React.createElement(
    'div',
    { className: 'image-upload-container' },
    // Header
    React.createElement(
      'div',
      { className: 'upload-header' },
      React.createElement('h1', { className: 'main-title' }, 'AI Fashion Analyzer'),
      React.createElement('p', { className: 'subtitle' }, 'Upload an image to discover your style and get personalized recommendations')
    ),
    // Upload Section
    React.createElement(
      'div',
      { className: 'upload-section' },
      React.createElement(
        'div',
        { className: 'file-input-wrapper' },
        React.createElement('input', {
          type: 'file',
          id: 'file-input',
          onChange: handleFileChange,
          accept: 'image/*',
          className: 'file-input'
        }),
        React.createElement(
          'label',
          { htmlFor: 'file-input', className: 'file-input-label' },
          React.createElement('span', { className: 'upload-icon' }, '📸'),
          React.createElement('span', { className: 'upload-text' }, selectedFile ? selectedFile.name : 'Choose an image')
        )
      ),
      React.createElement(
        'button',
        {
          onClick: handleAnalyze,
          disabled: loading || !selectedFile,
          className: `analyze-button ${loading ? 'loading' : ''}`
        },
        loading
          ? [
              React.createElement('span', { key: 'spinner', className: 'spinner' }),
              'Analyzing...'
            ]
          : [
              React.createElement('span', { key: 'icon', className: 'analyze-icon' }, '✨'),
              'Analyze Style'
            ]
      )
    ),
    // Error
    error &&
      React.createElement(
        'div',
        { className: 'error-message' },
        React.createElement('span', { className: 'error-icon' }, '⚠️'),
        error
      ),
    // Preview
    previewUrl &&
      React.createElement(
        'div',
        { className: 'preview-section' },
        React.createElement(
          'h3',
          { className: 'section-title' },
          React.createElement('span', { className: 'section-icon' }, ),
          'Your Image'
        ),
        React.createElement(
          'div',
          { className: 'image-preview' },
          React.createElement('img', {
            src: previewUrl,
            alt: 'Uploaded preview',
            className: 'preview-image'
          })
        )
      ),
    // Analysis
    analysis &&
      React.createElement(
        'div',
        { className: 'analysis-section' },
        React.createElement(
          'h3',
          { className: 'section-title' },
          React.createElement('span', { className: 'section-icon' }, ),
          'Style Analysis'
        ),
        React.createElement(
          'div',
          { className: 'analysis-grid' },
          ['display_name', 'season', 'aesthetic_category', 'aesthetic_vibe'].map((key) =>
            React.createElement(
              'div',
              { key, className: 'analysis-card' },
              React.createElement('h4', null, key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())),
              React.createElement('p', null, analysis[key])
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'description-card' },
          React.createElement('h4', null, 'Description'),
          React.createElement('p', null, analysis.caption)
        ),
        analysis.colors &&
          React.createElement(
            'div',
            { className: 'colors-section' },
            React.createElement('h4', null, 'Color Palette'),
            React.createElement(
              'div',
              { className: 'color-palette' },
              analysis.colors.map((color, idx) =>
                React.createElement(
                  'div',
                  {
                    key: idx,
                    className: 'color-swatch',
                    style: { backgroundColor: color },
                    title: color
                  },
                  React.createElement('span', { className: 'color-code' }, color)
                )
              )
            )
          )
      ),
    // Recommendations
    similarItems.length > 0 &&
      React.createElement(
        'div',
        { className: 'recommendations-section' },
        React.createElement(
          'h3',
          { className: 'section-title' },
          React.createElement('span', { className: 'section-icon' }, '🎯'),
          'Recommended For You'
        ),
        React.createElement(
          'div',
          { className: 'recommendations-grid' },
          similarItems.map((item, idx) =>
            React.createElement(
              'div',
              { key: idx, className: 'recommendation-card' },
              React.createElement(
                'div',
                { className: 'card-image-wrapper' },
                React.createElement('img', {
                  src: `http://127.0.0.1:5000/static/catalog_images/${item.id}.jpg`,
                  alt: item.productDisplayName,
                  className: 'card-image'
                }),
                React.createElement(
                  'div',
                  { className: 'similarity-badge' },
                  `${(item.similarity * 100).toFixed(1)}% match`
                )
              ),
              React.createElement(
                'div',
                { className: 'card-content' },
                React.createElement('h4', { className: 'card-title' }, item.productDisplayName),
                React.createElement(
                  'div',
                  { className: 'card-details' },
                  React.createElement(
                    'span',
                    { className: 'detail-item' },
                    React.createElement('span', { className: 'detail-label' }, 'Color:'),
                    React.createElement('span', { className: 'detail-value' }, item.baseColour)
                  ),
                  React.createElement(
                    'span',
                    { className: 'detail-item' },
                    React.createElement('span', { className: 'detail-label' }, 'Season:'),
                    React.createElement('span', { className: 'detail-value' }, item.season)
                  )
                )
              )
            )
          )
        )
      )
  );
};

export default ImageUpload;
