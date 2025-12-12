// src/App.js
import React, { useState } from 'react';
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import ErrorList from './components/errorList';
import ErrorDetail from './components/errorDetail';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedError, setSelectedError] = useState(null);

  // Mock data – “fake backend” for now
  const [errors] = useState([
    {
      id: 1,
      title: 'TypeError: Cannot read property',
      message: 'Cannot read property "map" of undefined in UserList component',
      severity: 'critical',
      status: 'open',
      timestamp: '2024-01-15T10:30:00Z',
      occurrences: 15,
      project: 'Dashboard App',
      environment: 'production',
      user: 'john@example.com',
      tags: ['frontend', 'react', 'javascript'],
      stackTrace:
        "TypeError: Cannot read property 'map' of undefined\n" +
        '    at UserList.jsx:42:15\n' +
        '    at renderWithHooks (react-dom.development.js:16305:18)'
    },
    // add more mock errors here later
  ]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleErrorDetails = (error) => {
    setSelectedError(error);
  };

  return (
    <div className={`App ${theme}`}>
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard errors={errors} onErrorDetails={handleErrorDetails} />
        )}

        {activeTab === 'errors' && (
          <ErrorList errors={errors} onErrorDetails={handleErrorDetails} />
        )}

        {/* Shared detail panel under both tabs */}
        <ErrorDetail error={selectedError} />
      </main>
    </div>
  );
}

export default App;
