import React from 'react'

const SessionTileSkeletonLoader = () => {
  return (
    <>
    {Array.from({length:3}).map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-[2rem] mb-5 animate-pulse"
          style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
        >
          <div className="flex">
            <div className="max-w-44 max-h-44 basis-1/4 rounded-3xl bg-gray-200"></div>
            <div className="ps-6 pe-12 py-1 flex-1 basis-3/4">
              <div className="w-2/3 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-4 py-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="pt-2 pe-10">
                <hr className="border-gray-200" />
              </div>
              <div className="flex gap-x-16 text-sm py-3">
                <div className="basis-1/3 h-4 bg-gray-200 rounded"></div>
                <div className="basis-1/3 h-4 bg-gray-200 rounded"></div>
                <div className="basis-1/3 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))
}
</>
  )
}

export default SessionTileSkeletonLoader
