// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // State for holding real database data
  const [errors, setErrors] = useState([]); 

  // States for handling the loading experience
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); 
    
  // Effect Hook to fetch data when the component first mounts
  useEffect(() => {
    const fetchErrors = async () => {
      setIsLoading(true);
      setFetchError(null); 

      try {
        const response = await axios.get('/api/errors'); 
        const data = response.data;
        const formattedData = data.map(item => ({
          ...item,
          id: Number(item.id), 
          occurrences: Number(item.occurrences), 
        }));

        setErrors(formattedData);
        
      } catch (error) {
        console.error("Could not fetch errors:", error);
        // Check if the error is due to the server being offline/unreachable
        const errorMessage = error.message.includes('5000') || error.message.includes('Network Error')
          ? "Failed to connect to API. Is the Node.js server running on port 5000?"
          : `Error fetching data: ${error.message}`;

        setFetchError(errorMessage);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrors();
  }, []);


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
        
        {isLoading && <div className="app-message">Loading errors from the database...</div>}
        
        {fetchError && (
          <div className="app-error-message">
            <h2>Data Loading Failed</h2>
            <p>{fetchError}</p>
          </div>
        )}
        {!isLoading && !fetchError && activeTab === 'dashboard' && (
          <Dashboard errors={errors} onErrorDetails={handleErrorDetails} />
        )}
        {!isLoading && !fetchError && activeTab === 'errors' && (
          <ErrorList errors={errors} onErrorDetails={handleErrorDetails} />
        )}
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