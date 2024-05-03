import React, { useState, useEffect } from 'react';

const ButtonWithCircle = ({ children }) => {
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [showCircle, setShowCircle] = useState(false);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCirclePosition({ x, y });
    setShowCircle(true);

    setTimeout(() => {
      setShowCircle(false);
    }, 1000); // Adjust the time as needed
  };

  return (
    <div className="relative" onClick={(event)=>handleClick(event)}>
      {children}
      {showCircle && (
        <div
          className="absolute bg-blue-200 rounded-full animate-ping"
          style={{
            width: '20px',
            height: '20px',
            left: `${circlePosition.x - 10}px`,
            top: `${circlePosition.y - 10}px`,
            zIndex: '9999',
          }}
        />
      )}
    </div>
  );
};

export default ButtonWithCircle;