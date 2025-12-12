// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; //
import Dashboard from './components/dashboard';
import ErrorDetail from './components/errorDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Error Tracker Tool</h1>  {/* Custom Header */}
        </header>
        
        {/* Set up for routing */}
        <Routes>
          <Route path="/" element={<Dashboard />} />  {/* Dashboard Route */}
          <Route path="/errors/:id" element={<ErrorDetail />} />  {/* Error Detail Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
