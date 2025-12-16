// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
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
  const [errors, setErrors] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); 
  
  // Fetch errors function (can be called anytime to refresh)
  const fetchErrors = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/errors'); 
      const data = response.data;
      const formattedData = data.map(item => ({
        ...item,
        id: Number(item.id), 
        occurrences: Number(item.occurrences), 
      }));
      setErrors(formattedData);
      setFetchError(null);
      return formattedData;
    } catch (error) {
      console.error("Could not fetch errors:", error);
      const errorMessage = error.message.includes('5000') || error.message.includes('Network Error')
        ? "Failed to connect to API. Is the Node.js server running on port 5000?"
        : `Error fetching data: ${error.message}`;
      setFetchError(errorMessage);
      throw error;
    }
  }, []);
    
  // Initial fetch on mount
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        await fetchErrors();
      } finally {
        setIsLoading(false);
      }
    };
    initialFetch();
  }, [fetchErrors]);

  // Optional: Poll for updates every 30 seconds to catch changes from other sources
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchErrors();
    }, 30000); // 30 seconds

    return () => clearInterval(pollInterval);
  }, [fetchErrors]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleErrorDetails = (error) => {
    setSelectedError(error);
  };

  // Optimistic update with instant UI feedback
  const handleUpdateErrorStatus = async (id, newStatus) => {
    // Step 1: Optimistically update UI immediately (instant feedback!)
    setErrors(prevErrors => 
      prevErrors.map(error => 
        error.id === id ? { ...error, status: newStatus } : error
      )
    );
    
    if (selectedError && selectedError.id === id) {
      setSelectedError(prev => ({ ...prev, status: newStatus }));
    }

    // Step 2: Send request to server
    try {
      const response = await axios.patch(`http://localhost:5000/api/errors/${id}`, { 
        status: newStatus 
      });
      
      // Step 3: Update with server response (in case server modified anything)
      const updatedError = response.data;
      
      setErrors(prevErrors => 
        prevErrors.map(error => 
          error.id === id ? { ...error, ...updatedError } : error
        )
      );
      
      if (selectedError && selectedError.id === id) {
        setSelectedError(prev => ({ ...prev, ...updatedError }));
      }
      
      console.log(`✅ Updated error ${id} status to ${newStatus}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to update status for error ${id}:`, error);
      
      // Step 4: Rollback on failure - fetch fresh data
      await fetchErrors();
      
      alert('Failed to update status. The data has been refreshed.');
      return { success: false, error };
    }
  };

  // Function to manually refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchErrors();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`App ${theme}`}>
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onRefresh={handleRefresh}
      />
      <main className="app-main">
        {isLoading && <div className="app-message">Loading errors from the database...</div>}
        
        {fetchError && (
          <div className="app-error-message">
            <h2>Data Loading Failed</h2>
            <p>{fetchError}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}
        
        {!isLoading && !fetchError && activeTab === 'dashboard' && (
          <Dashboard 
            errors={errors} 
            onErrorDetails={handleErrorDetails}
            onUpdateStatus={handleUpdateErrorStatus}
            onRefresh={handleRefresh}
          />
        )}
        
        {!isLoading && !fetchError && activeTab === 'errors' && (
          <ErrorList 
            errors={errors} 
            onErrorDetails={handleErrorDetails}
            onUpdateStatus={handleUpdateErrorStatus}
            onRefresh={handleRefresh}
          />
        )}
      </main>
      
      <ErrorDetailWindow
        error={selectedError} 
        onClose={() => setSelectedError(null)}
        onUpdateStatus={handleUpdateErrorStatus}
      />
    </div>
  );
}

export default App;