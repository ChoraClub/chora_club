import React from 'react';

const LeaderboardSkeleton = () => {
  return (
    <div 
      className="bg-white rounded-lg mb-4 w-full animate-pulse"
      style={{
        boxShadow: "rgb(204, 219, 232) 3px 3px 12px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
      }}
    >
      <div className="flex flex-col 1.7lg:flex-row justify-between 1.7lg:items-center items-start">
        {/* Left section with rank, avatar and name */}
        <div className="flex items-center space-x-2 xs:space-x-5 mb-2 xs:mb-3 sm:mb-0">
          {/* Rank placeholder */}
          <div className="bg-gray-200 ml-2 xs:ml-5 size-[45px] xs:size-[56px] rounded-full" />
          
          {/* Vertical divider */}
          <div className="h-[86px] xs:h-[105px] border-[0.1px] border-[#D5D4DF]" />
          
          {/* Avatar placeholder */}
          <div className="size-8 xs:size-11 bg-gray-200 rounded-full" />
          
          {/* Name placeholder */}
          <div className="min-w-[140px] xs:min-w-[160px]">
            <div className="bg-gray-200 h-8 rounded-full w-full" />
          </div>
        </div>

        {/* Desktop stats */}
        <div className="hidden 1.7lg:flex flex-wrap justify-between w-[660px] mt-2 sm:mt-0">
          {/* Stats placeholders */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="text-center mx-3 my-1 w-[110px]">
              <div className="bg-gray-200 h-6 rounded-full w-full" />
            </div>
          ))}
        </div>

        {/* Mobile stats */}
        <div className="flex 1.7lg:hidden flex-wrap gap-2 p-4 w-full">
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* NFTs Claimed */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="bg-gray-200 h-4 w-20 mb-2 rounded" />
              <div className="bg-gray-200 h-6 w-12 rounded" />
            </div>

            {/* Sessions */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="bg-gray-200 h-4 w-16 mb-2 rounded" />
              <div className="bg-gray-200 h-6 w-12 rounded" />
            </div>

            {/* Views */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="bg-gray-200 h-4 w-14 mb-2 rounded" />
              <div className="bg-gray-200 h-6 w-12 rounded" />
            </div>

            {/* Ratings */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
              <div className="bg-gray-200 h-4 w-16 mb-2 rounded" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-200 size-4 rounded" />
                ))}
              </div>
            </div>

            {/* CC Score */}
            <div className="bg-gray-50 rounded-xl col-span-2 p-4 shadow-sm">
              <div className="bg-gray-200 h-4 w-20 mb-2 rounded" />
              <div className="bg-gray-200 h-6 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;