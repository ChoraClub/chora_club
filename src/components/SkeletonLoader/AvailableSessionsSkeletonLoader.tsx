import React from 'react'

const AvailableSessionsSkeletonLoader = () => {
  return (
    <div className="overflow-auto font-poppins grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-12 py-5 px-10">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        style={{
          boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
        }}
        className="rounded-3xl flex flex-col bg-white animate-pulse"
      >
        <div className="flex items-center mb-4 border-b-2 py-5 px-5 rounded-tl-3xl rounded-tr-3xl">
          
            <div className="w-32 h-32 flex items-center justify-content bg-gray-200 animate-pulse rounded-3xl">
            </div>


          <div className="w-3/4 ml-4">
            <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="text-sm flex mt-1">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="items-center ml-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-24 h-6 bg-gray-200 rounded mt-2"></div>
            <div className="mt-4">
              <div
                className="text-[#4F4F4F]  rounded-md w-full py-1"
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div style={{ display: "flex" }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="w-24 h-8 bg-gray-200 rounded-full mr-2"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center px-5 pb-3">
          <div className="w-[60%] ml-1">
            <div className="w-48 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-[40%] flex justify-end">
            <div className="w-44 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div> 
  )
}

export default AvailableSessionsSkeletonLoader
