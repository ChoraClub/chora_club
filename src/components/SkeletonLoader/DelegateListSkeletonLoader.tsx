import React from "react";

const DelegateListSkeletonLoader = () => {
  return (
    <div className="mt-5 grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="shadow-md p-3 animate-pulse rounded-md">
          <div className="flex justify-center mb-4 relative">
            <div className="bg-gray-200 rounded-full w-20 h-20"></div>
            <div className="absolute top-0 right-0 bg-gray-200 rounded-full w-10 h-10"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded mb-2 w-32 mx-auto"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="bg-gray-200 rounded-full w-6 h-6"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded mb-4 w-32 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default DelegateListSkeletonLoader;
