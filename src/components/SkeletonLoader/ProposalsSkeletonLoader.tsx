import React from 'react'

const ProposalsSkeletonLoader = () => {
  return (
    <div className="mr-16 rounded-[2rem] mt-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex py-4 px-8 mb-2 gap-5 rounded-3xl border border-gray-200 ">
            <div className='size-10 bg-gray-200 animate-pulse rounded-full'></div> 
            <div className='flex w-full'>
              
            <div className='flex basis-1/2 flex-col gap-2 items-start justify-center'>              
              <div className='h-4 w-80 bg-gray-200 animate-pulse'></div>
              <div className='h-4 w-64 bg-gray-200 animate-pulse'></div>
            </div>
            <div className='basis-1/2 flex items-center justify-between'>
              <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse'></div>
              <div className='w-24 rounded-full h-5 bg-gray-200 animate-pulse'></div>
              <div className='w-32 rounded-md h-5 bg-gray-200 animate-pulse'></div>
              <div className='w-24 rounded-full h-5 bg-gray-200 animate-pulse'></div>
            </div>
            </div>
          </div>
        ))}
      </div>
  )
}

export default ProposalsSkeletonLoader


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