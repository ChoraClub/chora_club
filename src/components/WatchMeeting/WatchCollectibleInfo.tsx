import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const WatchCollectibleInfo = () => {
  const [showComingSoon, setShowComingSoon] = useState(true);
  return (
    <div className="rounded-3xl border border-black-shade-200 font-poppins ">
      <div className="flex w-full rounded-t-3xl bg-blue-shade-400 py-3 pl-6">
        <p className="font-medium xl:text-base 1.7xl:text-lg text-blue-shade-100">
          Collectibles Info
        </p>
        {showComingSoon && (
          <div className="flex items-center bg-yellow-100 border border-yellow-400 rounded-full px-2 ml-4">
            <p className="text-sm text-yellow-700 mr-2">Coming Soon</p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="text-yellow-700 hover:text-yellow-800"
            >
              <RxCross2 size={12} />
            </button>
          </div>
        )}
      </div>
      <div className="w-full h-[0.1px] bg-black-shade-200"></div>
      <div className="flex xl:gap-x-20 gap-x-14 1.7xl:text-sm text-xs">
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
  );
};

export default WatchCollectibleInfo;
