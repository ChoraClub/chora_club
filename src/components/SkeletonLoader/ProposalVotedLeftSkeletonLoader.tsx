import React from 'react'

const ProposalVotedLeftSkeletonLoader = () => {
  return (
    <div>
              <div className="flex gap-4 w-full px-10">
                <div className="bg-gray-200 rounded-full basis-1/3 h-4 animate-pulse"></div>
                <div className="bg-gray-200 rounded-full basis-1/3 h-4 animate-pulse"></div>
                <div className="bg-gray-200 rounded-full basis-1/3 h-4 animate-pulse"></div>
              </div>
              <div className="mt-10 flex justify-center items-center">
                <div className="w-[360px] h-[360px] bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
  )
}

export default ProposalVotedLeftSkeletonLoader
