import React from "react";

function MobileResponsiveMessage() {
  return (
    <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-sm w-full">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-blue-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Oops!</h2>
          <p className="text-gray-600 mb-4">
            The mobile version of this site isn't ready yet.
          </p>
          <p className="text-gray-600 font-semibold">
            Please use your desktop computer.
          </p>
        </div>
      </div>
  );
}

export default MobileResponsiveMessage;
