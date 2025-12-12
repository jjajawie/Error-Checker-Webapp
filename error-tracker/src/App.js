// src/App.js
import React, { useState } from "react";
import Dashboard from "./components/dashboard";
import ErrorDetail from "./components/errorDetail";
import ErrorList from "./components/errorList";
import Navbar from "./components/navbar";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [selectedErrors, setSelectedErrors] = useState(new Set());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedError, setSelectedError] = useState(null);

  const errors = [
    {
      id: 1,
      title: "TypeError: Cannot read property",
      message:
        'Cannot read property "map" of undefined in UserList component',
      severity: "critical",
      status: "open",
      timestamp: "2024-01-15T10:30:00Z",
      occurrences: 15,
      project: "Dashboard App",
      environment: "production",
      user: "john@example.com",
      tags: ["frontend", "react", "javascript"],
      stackTrace:
        "TypeError: Cannot read property 'map' of undefined\n    at UserList.jsx:42:15\n    at renderWithHooks (react-dom.development.js:16305:18)...",
    },
    // add more mock errors here if you like
  ];

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleErrorSelect = (errorId) => {
    setSelectedErrors((prev) => {
      const next = new Set(prev);
      if (next.has(errorId)) next.delete(errorId);
      else next.add(errorId);
      return next;
    });
  };

  const handleViewDetails = (error) => {
    setSelectedError(error);
  };

  return (
    <div className={`App ${theme}`}>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="app-main">
        {activeTab === "dashboard" ? (
          <>
            <Dashboard
              errors={errors}
              onErrorSelect={handleErrorSelect}
              selectedErrors={selectedErrors}
              onErrorDetails={handleViewDetails}
            />
            <ErrorDetail error={selectedError} />
          </>
        ) : (
          <>
            <ErrorList
              errors={errors}
              onErrorSelect={handleErrorSelect}
              selectedErrors={selectedErrors}
              onErrorDetails={handleViewDetails}
            />
            <ErrorDetail error={selectedError} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
