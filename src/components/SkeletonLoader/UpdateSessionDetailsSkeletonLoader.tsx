import React from "react";

const UpdateSessionDetailsSkeletonLoader = () => {
  return (
<>
    <div className="border rounded-3xl py-6 px-8 mx-10 gap-10 items-center mb-10 mt-4 flex justify-between">
      <div className="flex flex-col gap-3">
        <div className="bg-gray-200 animate-pulse w-[60vw] h-6 rounded-md "></div>
        <div className="bg-gray-200 animate-pulse w-[50vw] h-6 rounded-md "></div>
      </div>
      <div className="flex gap-[1px]">
        <div className="rounded-l-full bg-gray-200 animate-pulse w-24 h-8"></div>
        <div className="rounded-r-full bg-gray-200 animate-pulse w-24 h-8"></div>
      </div>
    </div>
    
    <div
      className="rounded-3xl px-8 mx-10 py-8"
      style={{
        boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)",
      }}
    >
      {/* Skeleton loader */}
      <div className="animate-pulse relative">
        <div className="animate-pulse bg-gray-200 absolute top-6 right-6 w-56 h-10 rounded-full"></div>
        {/* Thumbnail Image skeleton */}
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
          <div className="flex gap-3 items-end">
          <div className="h-24 w-40 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-16 w-60 rounded-md animate-pulse bg-gray-200"></div>
          </div>
        </div>
        
        {/* Session Title skeleton */}
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        </div>
        
        {/* Session Description skeleton */}
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-48 w-full bg-gray-200 rounded-md"></div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="rounded-full animate-pulse bg-gray-200 w-36 h-10"></div>
      </div>

      </div>
      </>
  );
};

export default UpdateSessionDetailsSkeletonLoader;
