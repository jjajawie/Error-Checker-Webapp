// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dashBoard.css';  // Updated the CSS file for custom styling

const Dashboard = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [filters, setFilters] = useState({
        severity: '',
        status: ''
    });

    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/errors', {
                    params: {
                        severity: filters.severity,
                        status: filters.status,
                    }
                });
                setErrors(response.data);
                setLoading(false);
            } catch (error) {
                setErrorMessage('Failed to load errors');
                setLoading(false);
            }
        };

        fetchErrors();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="dashboard">
            <h1>Error Dashboard</h1>

            {/* Filters Section */}
            <div className="filters">
                <select
                    name="severity"
                    value={filters.severity}
                    onChange={handleFilterChange}
                    className="filter-dropdown"
                >
                    <option value="">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="filter-dropdown"
                >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Display Errors in a Table */}
            {loading ? (
                <p>Loading...</p>
            ) : errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                <table className="error-table">
                    <thead>
                        <tr>
                            <th>Error ID</th>
                            <th>Message</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {errors.map((error) => (
                            <tr key={error.id}>
                                <td>{error.id}</td>
                                <td>{error.message}</td>
                                <td>{error.severity}</td>
                                <td>{error.status}</td>
                                <td>
                                    <Link to={`/errors/${error.id}`} className="view-link">View Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Dashboard;
