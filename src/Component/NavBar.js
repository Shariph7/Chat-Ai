import React, { useState } from "react";
import "./NavBar.css";

const Navbar = ({ setMessages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">Chat AI</span>
      </div>

      <button className="menu-icon" onClick={toggleMenu}>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </button>
      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        <button className="navbar-button" onClick={handleNewChat}>+ New Chat</button>
        <button className="navbar-button">Home</button>
        <a href="https://shariph7.github.io/OJT/"><button className="navbar-button">Project</button></a>
        <a href="https://github.com/shariph7"><button className="navbar-button navbar-github">Github</button></a>
        <button className="navbar-button navbar-google">
          Continue with Google
        </button>
      </div>
    </nav>
  );
};

export default Navbar;