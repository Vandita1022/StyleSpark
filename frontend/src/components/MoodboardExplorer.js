import React from 'react';
import { useNavigate } from 'react-router-dom';

const moodboards = [
  {
    id: 1,
    image: '/images/moodboard1.jpg',
    description: 'Effortless sophistication with a neutral palette for the modern chic woman.',
  },
  {
    id: 2,
    image: '/images/moodboard2.jpg',
    description: 'Playful charm meets sunny optimism in a soft, casual denim look.',
  },
  {
    id: 3,
    image: '/images/moodboard3.jpg',
    description: 'A relaxed, preppy ensemble with utilitarian flair and coastal vibes.',
  },
];

export default function MoodboardExplorer() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-center text-purple-500 mb-12">Discover Your Style Moodboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moodboards.map((mood) => (
          <div key={mood.id} className="bg-gray-800 p-4 rounded-xl shadow-lg text-white flex flex-col items-center space-y-3">
            <div className="border-4 border-purple-500 rounded-lg overflow-hidden w-60 h-40">
              <img src={mood.image} alt="Moodboard" className="w-full h-full object-cover" />
            </div>
            <p className="text-center text-sm italic text-gray-300 px-2">{mood.description}</p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md"
              onClick={() => navigate(`/moodboard/${mood.id}`)}
            >
              Explore This
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
