import React from "react";

const UpdateSessionDetailsSkeletonLoader = () => {
  return (
    <div className="py-5 px-16 font-poppins">
        <div className="w-full rounded-md bg-gray-200 animate-pulse h-8 mb-3"></div>
        <div className="w-3/4 rounded-md bg-gray-200 animate-pulse h-8"></div>
      <div className="w-full flex justify-end mt-4">
        <div className="space-y-2 items-end">
          <div className="flex">
            <div className="h-10 w-20 bg-gray-200 rounded-l-md animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-r-md animate-pulse ml-px"></div>
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
        {/* Skeleton for EditSessionDetails */}
        <div className="">

          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-32 mb-2"></div>
          <div className="w-40 h-24 bg-gray-200 rounded-md animate-pulse mb-4 "></div>
          <div className="flex gap-6 mb-4">
            <div className="h-10 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-md w-1/5 animate-pulse"></div>
          </div>

          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-32 mb-2"></div>
          <div className="h-8 bg-gray-200 w-3/4 rounded-md animate-pulse mb-4"></div>

          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-32 mb-2"></div>
          <div className="h-24 bg-gray-200 w-3/4 rounded-md animate-pulse mb-4"></div>

          <div className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
    </div>
  );
};

export default UpdateSessionDetailsSkeletonLoader;
