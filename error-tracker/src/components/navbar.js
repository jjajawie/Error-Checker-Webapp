// src/components/navbar.js 
import React from "react";
import "./navbar.css";

function Navbar({ activeTab, onTabChange, theme, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Error Tracker</h1>
      </div>

      <div className="navbar-right">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => onTabChange("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`nav-btn ${activeTab === "errors" ? "active" : ""}`}
          onClick={() => onTabChange("errors")}
        >
          Errors
        </button>

        {onToggleTheme && (
          <button
            className="nav-btn"
            onClick={onToggleTheme}
            style={{ marginLeft: "8px" }}
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        )}
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  activeTab: "dashboard",
  onTabChange: () => {},
  theme: "light",
  onToggleTheme: null,
};

export default Navbar;
