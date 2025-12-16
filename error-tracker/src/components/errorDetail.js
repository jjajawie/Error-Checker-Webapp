// src/components/errorDetail.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './errorDetail.css';

function ErrorDetail({ error, id, onUpdateStatus }) {
  const [fetched, setFetched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Prefer an explicitly passed id, otherwise fall back to error.id (if present).
  const effectiveId = useMemo(() => {
    if (id !== undefined && id !== null) return id;
    if (error && error.id !== undefined && error.id !== null) return error.id;
    return null;
  }, [id, error]);
  
  // If no `error` prop is provided, fetch details from the API using effectiveId.
  useEffect(() => {
    if (error || effectiveId === null) {
      setFetched(null);
      setLoading(false);
      setErrorMessage('');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    axios
      .get(`http://localhost:5000/api/errors/${effectiveId}`)
      .then((response) => {
        setFetched(response.data);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Failed to load error details');
        setLoading(false);
      });
  }, [effectiveId, error]);
  
  const data = error ?? fetched;
  
  // Local update function if onUpdateStatus prop is not provided
  const updateStatus = async (newStatus) => {
    if (effectiveId === null) return;
    
    try {
      // If parent provides update handler, use it (this will do optimistic update)
      if (onUpdateStatus) {
        await onUpdateStatus(effectiveId, newStatus);
      } else {
        // Otherwise, update directly
        const res = await axios.patch(`http://localhost:5000/api/errors/${effectiveId}`, {
          status: newStatus
        });
        setFetched(res.data);
      }
      
    } catch (err) {
      console.error('Failed to update status:', err);
      setErrorMessage('Failed to update status');
    }
  };
  
  if (!data) {
    return (
      <div className="error-detail">
        <p>Select an error to view details.</p>
      </div>
    );
  }
  
  return (
    <div className="error-detail">
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : (
        <div>
          <h1>Error Detail</h1>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Message:</strong> {data.message}</p>
          <p><strong>Severity:</strong> {data.severity}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Environment:</strong> {data.environment ?? '-'}</p>
          <p><strong>Project:</strong> {data.project ?? '-'}</p>
          <p><strong>User:</strong> {data.user ?? '-'}</p>
          <p><strong>Occurrences:</strong> {data.occurrences ?? '-'}</p>
          <p><strong>Timestamp:</strong> {data.timestamp ?? '-'}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{data.stackTrace ?? '-'}</pre>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => updateStatus('open')}>Mark as Open</button>
            <button onClick={() => updateStatus('in_progress')}>Mark as In Progress</button>
            <button onClick={() => updateStatus('resolved')}>Mark as Resolved</button>
            <button onClick={() => updateStatus('ignored')}>Mark as Ignored</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ErrorDetail;