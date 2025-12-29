import { useEffect } from 'react';
export default function Toast({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseStyles = `fixed bottom-6 right-6 px-5 py-3 rounded shadow-lg text-white animate-fade-in-out z-50`;
    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-500 text-black',
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type] || typeStyles.info}`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
