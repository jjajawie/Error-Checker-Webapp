import React from 'react';
import './ErrorDetailWindow.css';
import ErrorDetail from './errorDetail'; 

function ErrorDetailWindow({ error, onClose, onUpdateStatus }) {
    // If 'error' is null, the modal is closed, so don't render anything
    if (!error) return null; 

    // Prevent clicks inside the modal content from closing the modal
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // The modal-backdrop covers the whole screen and closes the modal when clicked
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content-window" onClick={handleContentClick}>
                
                <div className="modal-header">
                    <h2>Details for: {error.title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <ErrorDetail 
                        error={error} 
                        onUpdateStatus={onUpdateStatus}
                    />
                </div>
            </div>
        </div>
    );
}

export default ErrorDetailWindow;