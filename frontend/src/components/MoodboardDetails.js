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
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">Recommended Outfits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
        {outfits.map((outfit, index) => (
          <div key={index} className="border-2 border-purple-500 rounded-lg overflow-hidden w-60 h-64 shadow-md">
            <img
              src={outfit}
              alt={`Recommended Outfit ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-full shadow-lg"
        >
          Back to Moodboards
        </button>
      </div>
    </div>
  );
}
