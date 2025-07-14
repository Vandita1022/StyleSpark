import React, { useState } from 'react';
import axios from 'axios';

const OutfitGenerator = () => {
  // Example hardcoded IDs for tops and bottoms; replace with your actual data
  const availableTops = ['top1_id', 'top2_id', 'top3_id'];
  const availableBottoms = ['bottom1_id', 'bottom2_id', 'bottom3_id'];

  const [selectedTops, setSelectedTops] = useState([]);
  const [selectedBottoms, setSelectedBottoms] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSelection = (id, selectedList, setSelectedList) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter(item => item !== id));
    } else {
      setSelectedList([...selectedList, id]);
    }
  };

  const handleGenerate = async () => {
    if (selectedTops.length === 0 || selectedBottoms.length === 0) {
      setError('Please select at least one top and one bottom.');
      return;
    }

    setLoading(true);
    setError('');
    setOutfits([]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate-outfits', {
        tops: selectedTops,
        bottoms: selectedBottoms,
      });
      setOutfits(response.data.outfits || []);
    } catch (err) {
      console.error(err);
      setError('Failed to generate outfits.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outfit-generator">
      <h2>Generate Outfits</h2>

      <div>
        <h3>Select Tops</h3>
        <div className="selection-list">
          {availableTops.map(id => (
            <button
              key={id}
              className={selectedTops.includes(id) ? 'selected' : ''}
              onClick={() => toggleSelection(id, selectedTops, setSelectedTops)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Select Bottoms</h3>
        <div className="selection-list">
          {availableBottoms.map(id => (
            <button
              key={id}
              className={selectedBottoms.includes(id) ? 'selected' : ''}
              onClick={() => toggleSelection(id, selectedBottoms, setSelectedBottoms)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Outfits'}
      </button>

      {error && <p className="error">{error}</p>}

      {outfits.length > 0 && (
        <div className="outfits-list">
          <h3>Suggested Outfits</h3>
          <ul>
            {outfits.map((outfit, idx) => (
              <li key={idx}>
                <strong>Top:</strong> {outfit.top} &nbsp;|&nbsp; <strong>Bottom:</strong> {outfit.bottom}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;