import React from 'react';

const NotificationSkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeletonLoader;