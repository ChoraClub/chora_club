import React from 'react';
import { RiErrorWarningLine } from "react-icons/ri";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg shadow-md">
      <RiErrorWarningLine className="text-red-500 text-5xl mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-red-600 text-center mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;