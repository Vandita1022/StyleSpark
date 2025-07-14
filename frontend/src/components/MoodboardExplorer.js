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
      <h1 className="text-3xl font-bold text-center text-purple-500 mb-12">Discover Your Style Moodboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {moodboards.map((mood) => (
          <div key={mood.id} className="bg-gray-900 p-4 rounded-2xl shadow-xl text-white flex flex-col items-center">
            <img src={mood.image} alt="Moodboard" className="rounded-lg mb-4 w-72 h-48 object-cover" />
            <p className="mb-4 text-center italic text-base text-gray-300">{mood.description}</p>
            <button
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg transition"
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
