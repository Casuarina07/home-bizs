import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/logo_transparent.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="HomeBiz Logo" className="logo-img" />
        </a>
      </div>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/menu">Menu</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
        </ul>
      </nav>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </header>
  );
};

export default Header;
