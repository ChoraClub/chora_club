import React from 'react'

const MainProfileSkeletonLoader = () => {
  return (
    <div className="">
  <div className="flex ps-14 py-5 pe-10 justify-between">
    <div className="flex items-center justify-center">
      <div className="w-40 h-40 bg-gray-200 rounded-3xl animate-pulse"></div>
      <div className="px-4 flex flex-col gap-8">
        <div className=''>
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mt-1  "></div>
          <div className="w-40 h-5 bg-gray-200 rounded animate-pulse mt-3"></div>
        </div>
        {/* <div className="py-1 flex gap-3">
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
        </div> */}
        
          <div className="w-40 h-12 bg-gray-200 rounded-full animate-pulse mb-1"></div>


      </div>
    </div>
  </div>

  <div className="flex gap-12 bg-[#D9D9D945] px-16 w-full">
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
  </div>

  <div className="flex gap-8  px-16 w-full mt-6">
    <div className="basis-1/4 h-32 bg-gray-200 rounded-2xl animate-pulse my-4"></div>
    <div className="basis-1/4 h-32 bg-gray-200 rounded-2xl animate-pulse my-4"></div>
    <div className="basis-1/4 h-32 bg-gray-200 rounded-2xl animate-pulse my-4"></div>
    <div className="basis-1/4 h-32 bg-gray-200 rounded-2xl animate-pulse my-4"></div>
  </div>

  <div className="py-6 px-16">
    <div className="w-full h-60 bg-gray-200 rounded-2xl animate-pulse"></div>
  </div>
</div>
  )
}

export default MainProfileSkeletonLoader
