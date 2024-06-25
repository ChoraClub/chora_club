import React from 'react'

const ExploreDaosSkeletonLoader = () => {
  return (
    <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 py-8 font-poppins">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="px-5 py-9 rounded-2xl bg-white animate-pulse"
        style={{
          boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
        }}
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>
        </div>
        <div className="mt-5 space-y-3 flex flex-col items-center">
          <div className="h-5 w-28 bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default ExploreDaosSkeletonLoader
