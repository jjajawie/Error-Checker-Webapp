import React, { useState, useMemo } from "react";
import ErrorCard from "./errorCard";
import "./errorList.css";

function ErrorList({ errors = [], onErrorSelect, selectedErrors, onErrorDetails }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const filteredErrors = useMemo(() => {
    return errors.filter((error) => {
      if (searchTerm) {
        const haystack = `${error.title ?? ""} ${error.message ?? ""}`.toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }
      if (severityFilter && error.severity !== severityFilter) {
        return false;
      }
      return true;
    });
  }, [errors, searchTerm, severityFilter]);

  return (
    <div className="error-list-container">
      <div className="error-list-header">
        <h2 className="error-list-title">Error Tracking</h2>
      </div>

      {/* Search box */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search errors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            className="search-btn"
            onClick={() => {}}
          >
            Search
          </button>
        </div>
      </div>

      {/* Simple severity filter */}
      <div className="filters-container">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Severity</label>
            <select
              className="filter-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
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

      {/* Error cards */}
      <div className="errors-grid">
        {filteredErrors.length === 0 ? (
          <div className="empty-state">
            <h3>No errors found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <ErrorCard
              key={error.id}
              error={error}
              onSelect={onErrorSelect}
              isSelected={selectedErrors?.has(error.id)}
              onDetails={onErrorDetails}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ErrorList;
