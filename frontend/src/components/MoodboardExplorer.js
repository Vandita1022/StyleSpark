import React, { useState } from 'react';

const moodboards = [
  {
    id: 1,
    image: '/images/moodboard1.jpg',
    description: 'Effortless sophistication with a neutral palette for the modern chic woman.',
    recommendations: ['/images/reco1-1.jpg', '/images/reco1-2.jpg', '/images/reco1-3.jpg', '/images/reco1-4.jpg']
  },
  {
    id: 2,
    image: '/images/moodboard2.jpg',
    description: 'Playful charm meets sunny optimism in a soft, casual denim look.',
    recommendations: ['/images/reco2-1.jpg', '/images/reco2-2.jpg', '/images/reco2-3.jpg', '/images/reco2-4.jpg']
  },
  {
    id: 3,
    image: '/images/moodboard3.jpg',
    description: 'A relaxed, preppy ensemble with utilitarian flair and coastal vibes.',
    recommendations: ['/images/reco3-1.jpg', '/images/reco3-2.jpg', '/images/reco3-3.jpg', '/images/reco3-4.jpg']
  },
];

export default function MoodboardExplorer() {
  const [activeReco, setActiveReco] = useState(null);

  const handleExplore = (id) => {
    setActiveReco(id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-center text-purple-400 mb-6">Explore Moodboards</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moodboards.map((mood) => (
          <div key={mood.id} className="bg-gray-800 p-4 rounded-xl shadow-lg text-white">
            <img src={mood.image} alt="Moodboard" className="rounded-lg mb-4" />
            <p className="mb-4 italic">{mood.description}</p>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
              onClick={() => handleExplore(mood.id)}
            >
              Explore This
            </button>
            {activeReco === mood.id && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {mood.recommendations.map((reco, idx) => (
                  <img key={idx} src={reco} alt={`Recommendation ${idx + 1}`} className="rounded-lg" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}