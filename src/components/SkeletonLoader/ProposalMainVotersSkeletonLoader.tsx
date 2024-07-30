import React from 'react'

const ProposalMainVotersSkeletonLoader = () => {
  return (
    <>
      {/* {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex py-4 pl-8 pr-6 text-base bg-gray-50 transition-shadow duration-300 ease-in-out shadow-lg w-[45vw] animate-pulse">
                <div className="w-[75%] flex justify-start items-center">
                  <div className="bg-gray-200 rounded-full size-8 mx-2"></div>
                  <div className="bg-gray-200 h-4 w-64 rounded"></div>
                </div>
                <div className="w-[25%] flex justify-center items-center ml-auto gap-2">
                  <div className="bg-gray-200 h-6 w-32 rounded"></div>
                  <div className="bg-gray-200 rounded-full size-6"></div>
                </div>
              </div>
            ))} */}
 <div className={`flex flex-col gap-2 py-3 pl-3 pr-1 xl:pl-3 xl: pr-2 my-3 border-gray-200 h-[440px] `}>
<div className="animate-pulse max-h-[450px] flex flex-col gap-2 overflow-hidden">
    {[...Array(4)].map((_, index) => (
      <div className="flex items-center py-6 px-0 xl:px-6 bg-white rounded-2xl  border-2 border-transparent space-x-6 gap-4" key={index}>
        <div className=" p-2 flex-grow flex items-center space-x-4">
          <div className="xl:w-10 w-8 xl:h-10 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-2">
          <div className="xl:w-36 w-20 h-8 bg-gray-200 rounded-full"></div>
          <div className="xl:w-5 xl:h-5 w-4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
  </div>
    </>
  )
}

export default ProposalMainVotersSkeletonLoader
