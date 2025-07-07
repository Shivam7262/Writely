import React from 'react';

interface AlertProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const bgColor =
    type === 'success' ? 'bg-green-100 border-green-500 text-green-700' :
    type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
    'bg-blue-100 border-blue-500 text-blue-700';

  return (
    <div className={`${bgColor} px-4 py-3 rounded relative mb-4 border-l-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          onClick={onClose}
        >
          <svg
            className="fill-current h-6 w-6 text-gray-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Alert;