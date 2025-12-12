import React, { useState } from 'react';
import ErrorCard from './errorCard';
import SearchFilter from './searchFilter';

function ErrorList() {
  const [errors, setErrors] = useState([
    {
      id: 1,
      title: 'TypeError: Cannot read property',
      message: 'Cannot read property "map" of undefined',
      severity: 'critical',
      status: 'open',
      occurrences: 15,
      project: 'Dashboard App'
    },
    // Add more mock errors
  ]);

  const [filteredErrors, setFilteredErrors] = useState(errors);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = errors.filter(error =>
      error.title.toLowerCase().includes(term.toLowerCase()) ||
      error.message.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredErrors(filtered);
  };

  const handleFilter = (severity, status) => {
    // Filter logic here
  };

  return (
    <div className="error-list">
      <h2>Error Tracking</h2>
      
      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search errors..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <select className="severity-filter">
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Error Count */}
      <div className="error-count">
        Showing {filteredErrors.length} of {errors.length} errors
      </div>

      {/* Error Cards */}
      <div className="errors-container">
        {filteredErrors.map(error => (
          <ErrorCard key={error.id} error={error} />
        ))}
      </div>
    </div>
  );
}

export default ErrorList;
