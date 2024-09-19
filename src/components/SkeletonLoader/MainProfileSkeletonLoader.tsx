import React from 'react'

const MainProfileSkeletonLoader = () => {
  return (
    <div className="">
  <div className="flex py-5 justify-between px-4 md:px-6 lg:px-14">
    <div className="flex flex-col xs:flex-row xs:items-center justify-center">
      <div className="size-[80vw] xs:size-40 bg-gray-200 rounded-3xl animate-pulse"></div>
      <div className="px-4 flex flex-col gap-8">
        <div className=''>
          <div className="w-full xs:w-48 h-6 bg-gray-200 rounded animate-pulse mt-1  "></div>
          <div className="w-full xs:w-40 h-5 bg-gray-200 rounded animate-pulse mt-3"></div>
        </div>
        {/* <div className="py-1 flex gap-3">
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
        </div> */}
        
          <div className="w-full xs:w-40 h-12 bg-gray-200 rounded-full animate-pulse mb-1"></div>


      </div>
    </div>
  </div>

  <div className="flex gap-12 bg-[#D9D9D945] px-16 w-full">
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="hidden xs:block w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
    <div className="hidden md:block w-24 h-6 bg-gray-200 rounded-xl animate-pulse my-4"></div>
  </div>

  <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 px-16 w-full mt-6">
    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
  </div>

  <div className="py-6 px-16">
    <div className="w-full h-60 bg-gray-200 rounded-2xl animate-pulse"></div>
  </div>
</div>
  )
}

export default MainProfileSkeletonLoader
