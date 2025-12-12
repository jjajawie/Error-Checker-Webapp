import React from 'react';
import './navbar.css';

function Navbar({ activeTab, onTabChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Error Tracker</h1>
      </div>
      
      <div className="navbar-right">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </button>
        
        <button
          className={`nav-btn ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => onTabChange('errors')}
        >
          Errors
        </button>
      </div>
    </nav>
  );
}

// Default props
Navbar.defaultProps = {
  activeTab: 'dashboard',
  onTabChange: () => {}
};

export default Navbar;