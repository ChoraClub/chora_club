import React from 'react';

const ProposalsSkeletonLoader = () => {
  return (
    <div className="rounded-[2rem] mt-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col 1.5md:flex-row p-4 mb-2 gap-2 1.5md:gap-0 bg-gray-100 rounded-3xl shadow-lg"
        >
          {/* Left section with logo and description */}
          <div className="flex items-center 1.5md:w-[60%]">
            <div className="size-10 mx-5 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded-md animate-pulse w-[70%] xs:w-[80%] mb-2" />
              {/* Metadata skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-200 rounded-md animate-pulse w-24" />
                <div className="h-3 bg-gray-200 rounded-md animate-pulse w-28" />
                <div className="hidden sm:flex h-3 bg-gray-200 rounded-md animate-pulse w-20" />
              </div>
            </div>
          </div>

          {/* Right section with status indicators */}
          <div className="flex flex-wrap justify-between items-center 1.5md:w-[40%] mt-2 1.5md:mt-0 gap-2 1.5md:gap-1 2md:gap-2 mx-auto 1.5md:mx-0">
            {/* Status pill */}
            <div className="w-[90px] xs:w-24 h-5 bg-gray-200 animate-pulse rounded-full" />
            
            {/* Votes indicator */}
            <div className="w-28 xs:w-32 h-6 bg-gray-200 animate-pulse rounded-md" />
            
            {/* Activity status */}
            <div className="w-[15%]">
              <div className="w-16 h-5 bg-gray-200 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalsSkeletonLoader;


{/* <div className="mr-16 rounded-[2rem] mt-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex p-4 mb-2 gap-5 bg-gray-200 rounded-3xl animate-pulse">
            <div className="flex basis-1/2 items-center">
              <div className="h-10 w-10 rounded-full mx-5" />
              <div className="flex-1">
                <div className="h-5 w-3/4 rounded mb-2" />
                <div className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <div className="flex justify-around items-center basis-1/2">
              <div className="h-8 w-8 rounded-full" />
              <div className="h-6 w-20 rounded-full" />
              <div className="h-6 w-44 rounded" />
              <div className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div> */}