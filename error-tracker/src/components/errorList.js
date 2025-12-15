// src/components/errorList.js
import React, { useState, useMemo } from 'react';
import './errorList.css';
import ErrorCard from './errorCard';

function ErrorList({ errors, onErrorDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severity, setSeverity] = useState('');

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      const text = (err.title + ' ' + err.message).toLowerCase();
      const matchesSearch =
        !searchTerm || text.includes(searchTerm.toLowerCase());
      const matchesSeverity = !severity || err.severity === severity;
      return matchesSearch && matchesSeverity;
    });
  }, [errors, searchTerm, severity]);

  return (
    <div className="error-list-container">
      <div className="error-list-header">
        <h2 className="error-list-title">All Errors</h2>
      </div>

      {/* search bar */}
      <div className="search-container">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search errors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" type="button">
            Search
          </button>
        </div>
      </div>

      {/* simple severity filter */}
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="filter-select"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="error-count">
        Showing {filteredErrors.length} of {errors.length} errors
      </div>

      <div className="errors-grid">
        {filteredErrors.map((error) => (
          <ErrorCard
            key={error.id}
            error={error}
            onDetails={onErrorDetails}
          />
        ))}

        {filteredErrors.length === 0 && (
          <div className="empty-state">
            <h3>No errors found</h3>
            <p>Try relaxing your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorList;
