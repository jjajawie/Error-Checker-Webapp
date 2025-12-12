import React, { useState } from 'react';
import Dashboard from './components/dashboard';
import ErrorDetail from './components/errorDetail';
import ErrorList from './components/errorList';
import Navbar from './components/navbar';
import SearchFilter from './components/searchFilter';
import ErrorCard from './components/errorCard';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [selectedErrors, setSelectedErrors] = useState(new Set());

  // Mock data
  const errors = [
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
      tags: ['frontend', 'react', 'javascript']
    },
    // Add more errors...
  ];

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters);
  };

  const handleErrorSelect = (errorId) => {
    const newSelected = new Set(selectedErrors);
    if (newSelected.has(errorId)) {
      newSelected.delete(errorId);
    } else {
      newSelected.add(errorId);
    }
    setSelectedErrors(newSelected);
  };

  return (
    <div className={`App ${theme}`}>
      <Navbar 
        onSearch={handleSearch}
        onToggleTheme={handleToggleTheme}
        theme={theme}
      />
      
      <main className="app-main">
        <ErrorList errors={errors} />
        
        <div className="components-demo">
          <section className="demo-section">
            <h3>Search & Filter Component</h3>
            <SearchFilter 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              projects={[{ id: 1, name: 'Dashboard App' }, { id: 2, name: 'API Service' }]}
              users={[{ id: 1, name: 'John Developer' }, { id: 2, name: 'Jane Tester' }]}
            />
          </section>
          
          <section className="demo-section">
            <h3>Error Card Component</h3>
            {errors.slice(0, 2).map(error => (
              <ErrorCard 
                key={error.id}
                error={error}
                onSelect={handleErrorSelect}
                isSelected={selectedErrors.has(error.id)}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;