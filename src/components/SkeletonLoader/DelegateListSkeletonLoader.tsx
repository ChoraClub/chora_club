import React from "react";

const DelegateListSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-4"
        >
          {/* Avatar and Logo Skeleton */}
          <div className="relative flex justify-center">
            {/* Main Avatar */}
            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
            {/* Logo Badge */}
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          </div>

          {/* Name and Address Section */}
          <div className="text-center space-y-2">
            {/* Name */}
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
            {/* Address and Copy Button */}
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Delegated Tokens Badge */}
          <div className="flex justify-center">
            <div className="h-6 w-40 bg-blue-100 rounded-full animate-pulse" />
          </div>

          {/* Delegate Button */}
          <div className="h-10 w-full bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default DelegateListSkeletonLoader;