// src/components/dashboard.js
import React, { useState, useMemo } from "react";
import SearchFilter from "./searchFilter";
import ErrorCard from "./errorCard";
import "./dashBoard.css";

function Dashboard({
  errors,
  onErrorSelect,
  selectedErrors,
  onErrorDetails, // 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    severity: "",
    status: "",
    environment: "",
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      if (searchTerm) {
        const haystack = `${err.title ?? ""} ${err.message ?? ""}`.toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      if (filters.severity && err.severity !== filters.severity) {
        return false;
      }

      if (filters.status && err.status !== filters.status) {
        return false;
      }

      if (filters.environment && err.environment !== filters.environment) {
        return false;
      }

      return true;
    });
  }, [errors, searchTerm, filters]);

  const sampleError = errors[0];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Error Tracking Dashboard</h2>

      {/* Search / Filter card */}
      <section className="dashboard-section">
        <h3 className="section-heading">Search &amp; Filter Component</h3>
        <SearchFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </section>

      {/* Filtered error list */}
      <section className="dashboard-section">
        <h3 className="section-heading">Error List Component</h3>

        {filteredErrors.length === 0 ? (
          <p>No errors match the current filters.</p>
        ) : (
          filteredErrors.map((err) => (
            <ErrorCard
              key={err.id}
              error={err}
              onSelect={onErrorSelect}
              isSelected={selectedErrors?.has(err.id)}
              onDetails={onErrorDetails}   // <-- uses the prop
            />
          ))
        )}
      </section>

      {/* Single ErrorCard demo */}
      {sampleError && (
        <section className="dashboard-section">
          <h3 className="section-heading">Error Card Component</h3>
          <ErrorCard
            error={sampleError}
            onSelect={onErrorSelect}
            isSelected={selectedErrors?.has(sampleError.id)}
            onDetails={onErrorDetails}
          />
        </section>
      )}
    </div>
  );
}

Dashboard.defaultProps = {
  errors: [],
  onErrorSelect: () => {},
  selectedErrors: new Set(),
  onErrorDetails: () => {},
};

export default Dashboard;
