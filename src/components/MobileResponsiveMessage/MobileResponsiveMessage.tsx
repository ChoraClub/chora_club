import React from "react";

function MobileResponsiveMessage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-6 w-full">
      <p className="text-lg text-gray-800 bg-white p-4 rounded-lg shadow-md text-center">
        Our website is best viewed on a desktop. Please switch to desktop mode
        for the optimal experience.
      </p>
    </div>
  );
}

export default MobileResponsiveMessage;
