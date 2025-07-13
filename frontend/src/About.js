import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const teamMembers = [
  {
    name: 'Vandita Gupta',
    role: 'Full Stack Developer',
    img: '/images/vandita.jpg',
    github: 'https://github.com/vanditagupta',
  },
  {
    name: 'Aarav Sharma',
    role: 'AI Engineer',
    img: '/images/aarav.jpg',
    github: 'https://github.com/aaravsharma',
  },
  {
    name: 'Meera Singh',
    role: 'UI/UX Designer',
    img: '/images/meera.jpg',
    github: 'https://github.com/meerasingh',
  },
];

const techStack = ['React', 'Flask', 'Python', 'TensorFlow', 'Tailwind CSS'];

const projectLinks = [
  {
    label: 'Github Repository',
    url: 'https://github.com/vanditagupta/stylespark-frontend',
  },
  { label: 'Live Demo', url: 'https://stylespark.app' },
];


function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <Link to="/" className="back-button">⬅ Back</Link>
        <h2>About StyleSpark</h2>
      </header>

      {/* Intro - simple centered text */}
      <section className="intro">
        <p>
          StyleSpark is an AI-powered fashion recommendation app. Upload an image,
          get analysis on color palettes, aesthetic categories, and receive smart recommendations
          from our curated catalog.
        </p>
        <p>
          This project demonstrates modern frontend design, React state management,
          and communication with a Flask backend.
        </p>
      </section>

      {/* Team Section - flashcard style */}
      <section className="team-section">
        <h3>Meet the Team</h3>
        <div className="team-members">
          {teamMembers.map(({ name, role, img, github }) => (
            <div key={name} className="team-card">
              <h4>{name}</h4>
              <p>{role}</p>
              <a href={github} target="_blank" rel="noopener noreferrer" className="btn-link">
                GitHub Profile
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack - pill badges */}
      <section className="tech-stack-section">
        <h3>Built With</h3>
        <div className="tech-pill-container">
          {techStack.map((tech) => (
            <span key={tech} className="tech-pill">{tech}</span>
          ))}
        </div>
      </section>

      {/* Project Links - button style */}
      <section className="project-links-section">
        <h3>Project Links</h3>
        <div className="links-buttons">
          {projectLinks.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link btn-button"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* Contact - simple text */}
      <section className="contact-section">
        <h3>Get In Touch</h3>
        <p>Email: <a href="mailto:vandita@example.com" className="btn-link">vandita@example.com</a></p>
        <p>Twitter: <a href="https://twitter.com/vanditagupta" target="_blank" rel="noopener noreferrer" className="btn-link">@vanditagupta</a></p>
      </section>

      <footer className="about-footer">
        Built with <span role="img" aria-label="heart">❤️</span> by Vandita Gupta.
      </footer>
    </div>
  );
}

export default About;
