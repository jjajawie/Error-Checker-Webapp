// src/components/ErrorDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './errorDetail.css';  // Add custom styles for the error detail page

const ErrorDetail = () => {
    const { id } = useParams(); // Get error ID from the URL
    const [errorDetail, setErrorDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/errors/${id}`)
            .then(response => {
                setErrorDetail(response.data);
                setLoading(false);
            })
            .catch(() => {
                setErrorMessage('Failed to load error details');
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="error-detail">
            {loading ? (
                <p>Loading...</p>
            ) : errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                <div>
                    <h1>Error Detail</h1>
                    <p><strong>Message:</strong> {errorDetail.message}</p>
                    <p><strong>Severity:</strong> {errorDetail.severity}</p>
                    <p><strong>Status:</strong> {errorDetail.status}</p>
                    <p><strong>Stack Trace:</strong> {errorDetail.stack}</p>
                    {/* Example buttons for status change */}
                    <button>Mark as Resolved</button>
                    <button>Mark as In Progress</button>
                </div>
            )}
        </div>
    );
};

export default ErrorDetail;
