import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import About from './About';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>StyleSpark</h1>
          <nav>
            <Link to="/about" className="about-link">About</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ImageUpload />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
