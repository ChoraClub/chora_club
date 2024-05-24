import React from 'react'

const WatchCollectibleInfo = () => {
  return (
    <div className="rounded-3xl border border-black-shade-200 font-poppins ">
                <p className="w-full rounded-t-3xl bg-blue-shade-400 py-3 font-medium pl-6 text-lg text-blue-shade-100">Collectibles Info</p>
                <div className="w-full h-[0.1px] bg-black-shade-200"></div>
                <div className="flex gap-x-20 text-sm">
                  <div className="ml-6 text-black-shade-100 my-2 font-medium">
                    <p className="my-2">First Collect</p>
                    <p className="my-2">Most recent Collect</p>
                    <p className="my-2">Unique Collectors</p>
                    <p className="my-2">Total Collected</p>
                  </div>
                  <div className="font-normal my-2 text-blue-shade-100">
                    <p className="my-2">2 Weeks ago</p>
                    <p className="my-2">1 day ago</p>
                    <p className="my-2">163(99%)</p>
                    <p className="my-2">164</p>
                  </div>
                </div>
              </div>
  )
}

export default WatchCollectibleInfo
