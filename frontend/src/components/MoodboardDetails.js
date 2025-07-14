import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const recommendations = {
  1: ['/images/reco1-1.jpg', '/images/reco1-2.jpg', '/images/reco1-3.jpg', '/images/reco1-4.jpg'],
  2: ['/images/reco2-1.jpg', '/images/reco2-2.jpg', '/images/reco2-3.jpg', '/images/reco2-4.jpg'],
  3: ['/images/reco3-1.jpg', '/images/reco3-2.jpg', '/images/reco3-3.jpg', '/images/reco3-4.jpg'],
};

export default function MoodboardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const outfits = recommendations[id] || [];

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">Recommended Outfits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {outfits.map((outfit, index) => (
          <img
            key={index}
            src={outfit}
            alt={`Recommended Outfit ${index + 1}`}
            className="rounded-lg w-full h-64 object-cover"
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded mt-4"
        >
          Back to Moodboards
        </button>
      </div>
    </div>
  );
}
