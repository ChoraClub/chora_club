import React from 'react'

const WatchComponentSkeletonLoader = () => {
  return (
    <div className="1.7xl:ps-14 lg:ps-5 ps-4 xl:ps-10">
    <div className="flex justify-between items-center pt-6 pb-3 1.7xl:pe-10 lg:pe-3 pe-2 w-full">
      <div className="bg-gray-200 animate-pulse rounded-xl h-12 w-48 "></div>
      <div className="bg-gray-200 animate-pulse rounded-xl h-10 w-36"></div>
    </div>

    <div className="grid grid-cols-3 gap-y-4 gap-x-4 1.7xl:gap-x-6 pt-6 relative 1.7xl:pr-14 pr-4 lg:pr-5 xl-pr-10">
      {/* Left side */}
      <div className="sticky top-10 z-10 col-span-2 space-y-5 pb-10"> 
        <div className="bg-gray-200 animate-pulse rounded-3xl h-[70vh]"></div>
        <div className="bg-gray-200 animate-pulse rounded-3xl h-52"></div>
      </div>

      {/* Right side */}
      <div
        className={`col-span-1 pb-8 gap-y-6 flex flex-col`}
      >
        <div className="bg-gray-200 animate-pulse rounded-3xl h-40"></div>
        <div className="bg-gray-200 animate-pulse rounded-3xl h-80"></div>
        <div className="bg-gray-200 animate-pulse rounded-3xl h-44"></div>
      </div>
    </div>
  </div>


  )
}

export default WatchComponentSkeletonLoader
