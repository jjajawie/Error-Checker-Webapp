import React, { useState } from 'react';
import './searchFilter.css';

function SearchFilter({ 
  onSearch, 
  onFilterChange, 
  initialFilters = {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: initialFilters.severity || '',
    status: initialFilters.status || '',
    environment: initialFilters.environment || ''
  });

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'ignored', label: 'Ignored' }
  ];

  const environmentOptions = [
    { value: '', label: 'All Environments' },
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      severity: '', 
      status: '', 
      environment: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    if (onFilterChange) onFilterChange(clearedFilters);
    if (onSearch) onSearch('');
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '') || searchTerm !== '';
  };

  return (
    <div className="search-filter">
      {/* Main Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search errors by title or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      {/* Filters Grid */}
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="filter-select"
          >
            {severityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Environment</label>
          <select
            value={filters.environment}
            onChange={(e) => handleFilterChange('environment', e.target.value)}
            className="filter-select"
          >
            {environmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters and Clear Button */}
      {hasActiveFilters() && (
        <div className="active-filters">
          <div className="filters-summary">
            <span>Active filters:</span>
            {filters.severity && <span className="active-filter">Severity: {filters.severity}</span>}
            {filters.status && <span className="active-filter">Status: {filters.status}</span>}
            {filters.environment && <span className="active-filter">Environment: {filters.environment}</span>}
            {searchTerm && <span className="active-filter">Search: "{searchTerm}"</span>}
          </div>
          <button onClick={handleClearFilters} className="clear-btn">
            ✕ Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
