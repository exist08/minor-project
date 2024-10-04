import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, duration = 2000, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Automatically hide toast after the duration
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) {
                onClose();  // Optional callback to handle cleanup
            }
        }, duration);

        return () => clearTimeout(timer); // Clear the timer when the component unmounts
    }, [duration, onClose]);

    if (!show) return null;

    // Determine the toast style based on the type
    const toastTypeClass = type === 'success' ? 'alert-success' :
        type === 'error' ? 'alert-error' :
            'alert-info';

    return (
        <div className="toast toast-top toast-end">
            <div className={`alert ${toastTypeClass}`}>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
