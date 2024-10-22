// import React from "react";

// const WatchComponentSkeletonLoader = () => {
//   return (
//     <div className="1.7xl:ps-14 lg:ps-5 ps-4 xl:ps-10">
//       <div className="flex justify-between items-center pt-6 pb-3 1.7xl:pe-10 lg:pe-3 pe-2 w-full">
//         <div className="bg-gray-200 animate-pulse rounded-xl h-12 w-48 "></div>
//         <div className="bg-gray-200 animate-pulse rounded-xl h-10 w-36"></div>
//       </div>

//       <div className="grid grid-cols-3 gap-y-4 gap-x-4 1.7xl:gap-x-6 pt-6 relative 1.7xl:pr-14 pr-4 lg:pr-5 xl-pr-10">
//         {/* Left side */}
//         <div className="col-span-2 space-y-5 pb-10">
//           <div className="bg-gray-200 animate-pulse rounded-3xl h-[70vh]"></div>
//           <div className="bg-gray-200 animate-pulse rounded-3xl h-52"></div>
//         </div>

//         {/* Right side */}
//         <div className={`col-span-1 pb-8 gap-y-6 flex flex-col`}>
//           <div className="bg-gray-200 animate-pulse rounded-3xl h-40"></div>
//           <div className="bg-gray-200 animate-pulse rounded-3xl h-80"></div>
//           <div className="bg-gray-200 animate-pulse rounded-3xl h-44"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WatchComponentSkeletonLoader;



import React from "react";

const WatchComponentSkeletonLoader = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8 1.7xl:px-14">
      {/* Header */}
      <div className="flex justify-between items-center pt-6 pb-3 w-full">
        <div className="bg-gray-200 animate-pulse rounded-xl h-8 md:h-12 w-32 md:w-48"></div>
        <div className="flex gap-2">
          <div className="bg-gray-200 animate-pulse rounded-xl h-8 md:h-10 w-24 md:w-32"></div>
          <div className="bg-gray-200 animate-pulse rounded-xl h-8 md:h-10 w-24 md:w-32"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 1.5lg:grid-cols-3 gap-y-4 1.5lg:gap-x-4 1.7xl:gap-x-6 pt-6 relative">
        {/* Left Column */}
        <div className="col-span-1 1.5lg:col-span-2 space-y-5 pb-6 1.5lg:pb-10">
          {/* Video Player Skeleton */}
          <div className="bg-gray-200 animate-pulse rounded-3xl h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"></div>
          
          {/* Session Info Skeleton */}
          <div className="bg-gray-200 animate-pulse rounded-3xl h-40 md:h-52"></div>
          
          {/* Video Recommendations Skeleton */}
          <div>
      {/* Header */}
      <div className="flex justify-between mt-5 mb-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-7 w-48"></div>
        <div className="bg-gray-200 animate-pulse rounded h-6 w-20"></div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 1.5lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {/* Video Card Skeletons - rendered for different screen sizes */}
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col gap-3 
              ${index >= 2 && 'sm:hidden'} 
              ${index >= 3 && 'lg:block 1.5lg:hidden'} 
              ${index >= 2 && '2xl:block'}
            `}
          >
            {/* Thumbnail */}
            <div className="bg-gray-200 animate-pulse rounded-xl aspect-video w-full"></div>
            
            {/* Title and Info Section */}
            <div className="flex gap-3 mt-1.5">
              {/* Profile Picture */}
              <div className="bg-gray-200 animate-pulse rounded-full h-10 w-10 shrink-0"></div>
              
              {/* Text Content */}
              <div className="flex flex-col gap-2 flex-grow">
                {/* Title */}
                <div className="bg-gray-200 animate-pulse rounded h-4 w-[85%]"></div>
                
                {/* Info Row */}
                <div className="flex gap-2">
                  <div className="bg-gray-200 animate-pulse rounded h-3 w-24"></div>
                  <div className="bg-gray-200 animate-pulse rounded h-3 w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-6 pb-8">
          {/* Free Collect Skeleton */}
          <div className="bg-gray-200 animate-pulse rounded-3xl h-32 md:h-40"></div>
          
          {/* Leaderboard Skeleton */}
          <div className="bg-gray-200 animate-pulse rounded-3xl h-64 md:h-80"></div>
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row 1.5lg:flex-col gap-6">
            {/* Collectible Info Skeleton */}
            <div className="flex-1 bg-gray-200 animate-pulse rounded-3xl h-36 md:h-44"></div>
            
            {/* Social Links Skeleton */}
            <div className="flex-1 bg-gray-200 animate-pulse rounded-3xl h-36 md:h-44"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchComponentSkeletonLoader;