import { useState, useCallback } from 'react';

// Custom hook for managing toasts
const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);

        setToasts(currentToasts => [
            ...currentToasts,
            { id, message, type, duration }
        ]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(currentToasts =>
            currentToasts.filter(toast => toast.id !== id)
        );
    }, []);

    // Render function for the toast container
    const ToastContainer = () => (
        <div className="toast toast-top toast-end max-w-max">
            {toasts.map(toast => (
                <div key={toast.id} className={`alert alert-${toast.type} shadow-lg`}>
                    <span>{toast.message}</span>
                    <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => removeToast(toast.id)}
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );

    return {
        addToast,
        removeToast,
        ToastContainer
    };
};

export default useToast;