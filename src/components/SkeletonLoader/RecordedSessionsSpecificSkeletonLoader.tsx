import React from 'react'

const RecordedSessionsSpecificSkeletonLoader = ({ itemCount = 8 , gridCols = "2xl:grid-cols-4" }) => {
  return (
    <div className={`grid min-[475px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-10 py-8 font-poppins`}>
  {Array.from({ length: itemCount }).map((_, index) => (
    <div key={index} className="rounded-3xl">
      <div className="w-full h-44 rounded-t-3xl bg-gray-200 animate-pulse"></div>
      <div className="py-2">

        <div className="flex text-sm gap-3 py-1 w-full">
          <div className="bg-gray-200  py-1 px-3 rounded-md h-5 basis-1/2 animate-pulse"></div>
          <div className=" py-1 px-3 rounded-md  h-5 bg-gray-200 basis-1/2 animate-pulse"></div>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 py-1 px-3 text-sm w-full">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 py-1 px-3 text-sm w-full">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
  )
}

export default RecordedSessionsSpecificSkeletonLoader;
