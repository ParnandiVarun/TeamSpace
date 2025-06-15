import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to TeamSpace</h1>
        <p>Collaborate. Manage. Grow — All in one place.</p>
      </header>

      <main className="home-main">
        <img
          src="https://cdn.dribbble.com/users/120167/screenshots/3897687/media/5c8ef68fc885f3474b17bb7a383d9e07.gif"
          alt="Team Collaboration"
          className="home-image"
        />
        <div className="home-actions">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </main>

      <footer className="home-footer">
        <p>Made with ❤️ by TeamSpace Devs</p>
      </footer>
    </div>
  );
};

export default Home;
