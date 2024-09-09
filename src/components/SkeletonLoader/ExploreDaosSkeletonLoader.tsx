import React from 'react'

const ExploreDaosSkeletonLoader = () => {
  return (
    <div className="flex flex-wrap justify-center md:justify-normal gap-4 md:gap-6 lg:gap-8 py-8 font-poppins">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="w-[calc(100%-2rem)] max-w-[280px] sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] 2xl:w-[calc(20%-1rem)] px-4 py-6 rounded-2xl flex flex-col items-center justify-center animate-pulse bg-white"
        style={{
          boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
        }}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
  
  )
}

export default ExploreDaosSkeletonLoader
