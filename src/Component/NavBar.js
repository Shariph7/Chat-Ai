import React, { useState } from "react";
import "./NavBar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">Chat Pro+</span>
      </div>

      <button className="menu-icon" onClick={toggleMenu}>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </button>

      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        <button className="navbar-button">+ New</button>
        <button className="navbar-button">Home</button>
        <button className="navbar-button">Project</button>
        <a href="https://github.com/shariph7"><button className="navbar-button navbar-github">Github</button></a>
        <button className="navbar-button navbar-google">
          Continue with Google
        </button>
      </div>
    </nav>
  );
};

export default Navbar;