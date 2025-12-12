import React from 'react';
import './ErrorDetailWindow.css';

// Assuming you have an ErrorDetail component that shows the info
import ErrorDetail from './errorDetail'; 

function ErrorDetailWindow({ error, onClose }) {
    // If 'error' is null, the modal is closed, so don't render anything
    if (!error) return null; 

    // Prevent clicks inside the modal content from closing the modal (by stopping the event from reaching the backdrop)
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // The modal-backdrop covers the whole screen and closes the modal when clicked
        <div className="modal-backdrop" onClick={onClose}>
            
            {/* The actual window/dialog box */}
            <div className="modal-content-window" onClick={handleContentClick}>
                
                <div className="modal-header">
                    <h2>Details for: {error.title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    {/* Display the error details using your existing component */}
                    <ErrorDetail error={error} />
                </div>
            </div>
        </div>
    );
}

export default ErrorDetailWindow;