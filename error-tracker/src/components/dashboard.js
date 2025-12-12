// src/components/dashboard.js
import React, { useState, useMemo } from 'react';
import SearchFilter from './searchFilter';
import ErrorCard from './errorCard';
import './dashBoard.css';

function Dashboard({ errors, onErrorDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    environment: ''
  });

  const handleSearch = (term) => {
    setSearchTerm(term || '');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      const text = (err.title + ' ' + err.message).toLowerCase();
      const matchesSearch =
        !searchTerm || text.includes(searchTerm.toLowerCase());

      const matchesSeverity =
        !filters.severity || err.severity === filters.severity;

      const matchesStatus =
        !filters.status || err.status === filters.status;

      const matchesEnv =
        !filters.environment || err.environment === filters.environment;

      return matchesSearch && matchesSeverity && matchesStatus && matchesEnv;
    });
  }, [errors, searchTerm, filters]);

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Error Tracking Dashboard</h2>

      <section className="demo-section">
        <h3>Search &amp; Filter Component</h3>
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </section>

      <section className="demo-section">
        <h3>Error List Component</h3>
        <p className="error-count">
          Showing {filteredErrors.length} of {errors.length} errors
        </p>

        <div className="errors-container">
          {filteredErrors.map((error) => (
            <ErrorCard
              key={error.id}
              error={error}
              onDetails={onErrorDetails}
            />
          ))}

          {filteredErrors.length === 0 && (
            <p className="empty-state">
              No errors match the current search / filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
