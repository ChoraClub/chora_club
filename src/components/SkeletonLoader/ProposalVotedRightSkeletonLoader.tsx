import React from 'react'

const ProposalVotedRightSkeletonLoader = () => {
  return (
    <div className="w-full px-3 py-2 flex flex-col gap-2">
                <div className="w-full animate-pulse rounded-lg h-16 bg-gray-200 "></div>
                <div className="w-full animate-pulse rounded-lg h-16 bg-gray-200 "></div>
                <div className="w-full animate-pulse rounded-lg h-16 bg-gray-200 "></div>
                <div className="w-full animate-pulse rounded-lg h-16 bg-gray-200 "></div>
                <div className="w-full animate-pulse rounded-lg h-16 bg-gray-200 "></div>
              </div>
  )
}

export default ProposalVotedRightSkeletonLoader
