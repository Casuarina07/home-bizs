import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/logo_transparent.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // or redirect anywhere
  };
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

          {!isLoggedIn ? (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <a href="/Register">Register</a>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "blue",
              }}
            >
              Logout
            </button>
          )}
        </ul>
      </nav>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </header>
  );
};

export default Header;
