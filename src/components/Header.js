import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "../assets/logo_transparent.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Read from localStorage once on mount
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = !!localStorage.getItem("token");

  // Re-run when auth changes in other tabs/components
  useEffect(() => {
    const syncAuth = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed")); // notify listeners
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="HomeBiz Logo" className="logo-img" />
        </Link>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li style={{ marginRight: 12 }}>
                Hello{user?.name ? `, ${user.name}` : ""}{" "}
                {/* fallback if name missing */}
              </li>
              <li>
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
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div
        className="menu-toggle"
        onClick={() => {
          /* keep your toggle if needed */
        }}
      >
        ☰
      </div>
    </header>
  );
};

export default Header;
