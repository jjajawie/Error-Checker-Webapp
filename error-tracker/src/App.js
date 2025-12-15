// src/App.js
import React, { useState } from 'react';
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import ErrorList from './components/errorList';
import ErrorDetail from './components/errorDetail';
import ErrorDetailWindow from './components/ErrorDetailWindow';
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

   {
      id: 2,
      title: 'ReferenceError: $ is not defined',
      message: 'Query $ variable is not defined on page load in initAnalytics script',
      severity: 'high',
      status: 'open',
      timestamp: '2024-01-15T11:45:00Z',
      occurrences: 58,
      project: 'Marketing Site',
      environment: 'staging',
      user: 'anon-session-12345',
      tags: ['frontend', 'javascript', 'jquery', 'third-party'],
      stackTrace:
        "ReferenceError: $ is not defined\n" +
        '    at initAnalytics (analytics.js:10:5)\n' +
        '    at HTMLDocument.ready (main.js:30:3)\n' +
        '    at fire (jquery.js:3232:38)'
    },
    {
      id: 3,
      title: 'Warning: Missing alt prop on <img> tag',
      message: 'Accessibility warning: Image in ProductCard component is missing an "alt" attribute',
      severity: 'low',
      status: 'new',
      timestamp: '2024-01-15T13:10:00Z',
      occurrences: 302,
      project: 'E-commerce Platform',
      environment: 'development',
      user: 'dev-session-456',
      tags: ['frontend', 'react', 'accessibility', 'warning'],
      stackTrace:
        "Warning: Missing alt prop on <img> tag\n" +
        '    at img\n' +
        '    at ProductCard.jsx:88:9\n' +
        '    at div\n' +
        '    at ProductList.js:15:1'
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

      <ErrorDetailWindow
            error={selectedError} 
            onClose={() => setSelectedError(null)} 
      />
    </div>
  );
}

export default App;
