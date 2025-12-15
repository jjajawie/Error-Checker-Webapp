import React from 'react';
import './errorCard.css';

function ErrorCard({ error, onSelect, isSelected, onDetails }) {
  // severity styling
  const getSeverityStyles = () => {
    switch (error.severity) {
      case 'critical': return { color: '#df1b2eff', bgColor: '#f1cacdff' };
      case 'high': return { color: '#f17612ff', bgColor: '#f9e8afff' };
      case 'medium': return { color: '#ffc107', bgColor: '#fff' };
      case 'low': return { color: '#20c997', bgColor: '#d1f2eb' };
      default: return { color: '#6c757d', bgColor: '#f8f9fa' };
    }
  };

  // status styling
  const getStatusStyles = () => {
    switch (error.status) {
      case 'open': return { color: '#dc3545', text: 'Open' };
      case 'in-progress': return { color: '#fd7e14', text: 'In Progress' };
      case 'resolved': return { color: '#28a745', text: 'Resolved' };
      case 'ignored': return { color: '#6c757d', text: 'Ignored' };
      default: return { color: '#6c757d', text: 'Unknown' };
    }
  };

  const severityStyle = getSeverityStyles();
  const statusStyle = getStatusStyles();

  // Copy stack trace to clipboard
  const handleCopyStackTrace = (e) => {
    e.stopPropagation();
    if (error.stackTrace) {
      navigator.clipboard.writeText(error.stackTrace);
      alert('Stack trace copied to clipboard!');
    }
  };

  // Handles view details
  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onDetails) {
      onDetails(error);
    } else {
      console.log('Viewing details for error:', error.id);
    }
  };

  return (
    <div 
      className={`error-card ${isSelected ? 'selected' : ''} severity-${error.severity}`}
      onClick={() => onSelect && onSelect(error.id)}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <div className="error-checkbox">
          <input 
            type="checkbox" 
            checked={isSelected || false}
            onChange={() => onSelect(error.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Error Header */}
      <div className="error-card-header">
        <div className="header-left">
          <h4 className="error-title">{error.title || 'Untitled Error'}</h4>
          <div className="badge-container">
            <span className="severity-badge" style={{ backgroundColor: severityStyle.bgColor, color: severityStyle.color }}>
              {error.severity ? error.severity.toUpperCase() : 'UNKNOWN'}
            </span>
            <span className="status-badge" data-status={error.status} style={{ backgroundColor: statusStyle.color }}>
              {statusStyle.text}
            </span>
          </div>
        </div>
        <div className="header-right">
          <div className="project">Project: {error.project || 'Unknown'}</div>
        </div>
      </div>

      {/* Error Message */}
      <p className="error-message">
        {error.message ? 
          (error.message.length > 150 ? error.message.substring(0, 150) + '...' : error.message)
          : 'No error message provided.'
        }
      </p>

      {/* Error Metadata */}
      <div className="error-meta">
        <div className="meta-left">
          <span className="meta-item">
            Occurrences: {error.occurrences || 1}
          </span>
          {error.user && (
            <span className="meta-item">
              Reported by: {error.user}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="error-actions">
          {error.stackTrace && (
            <button
              onClick={handleCopyStackTrace}
              className="action-btn secondary"
            >
              <span className="btn-icon">📋</span> Copy
            </button>
          )}
          <button
            onClick={handleViewDetails}
            className="action-btn primary"
          >
            <span className="btn-icon">🔍</span> Details
          </button>
        </div>
      </div>

      {/* Tags */}
      {error.tags && error.tags.length > 0 && (
        <div className="error-tags">
          {error.tags.map((tag, index) => (
            <span key={index} className="error-tag">#{tag}</span>
          ))}
        </div>
      )}

      {/* Stack Trace Preview (collapsed by default) */}
      {error.stackTrace && (
        <div className="stack-trace-preview">
          <div className="stack-trace-header">
            <strong>Stack Trace Preview:</strong>
          </div>
          <div className="stack-trace-content">
            {error.stackTrace.length > 100 
              ? error.stackTrace.substring(0, 100) + '...' 
              : error.stackTrace}
          </div>
        </div>
      )}
    </div>
  );
}

// Default props for safety
ErrorCard.defaultProps = {
  error: {
    id: 0,
    title: 'Unknown Error',
    message: 'No message provided',
    severity: 'medium',
    status: 'open',
    timestamp: new Date().toISOString(),
    occurrences: 1,
    project: 'Unknown',
    environment: 'production',
    tags: []
  },
  onSelect: null,
  isSelected: false,
  onDetails: null
};

export default ErrorCard;
