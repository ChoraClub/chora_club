"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

function RewardButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);
  const balance = 0.0;
  const ethPrice = 0.0;
  const formattedBalance = balance.toFixed(3);
  const usdBalance = (balance * ethPrice).toFixed(2);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push("/claim-rewards");
  }, [router]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  }, []);

  return (
    <>
      <div className="relative inline-block">
        <div
          ref={hoverRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
        >
          {balance < 0 ? (
            <>
              <span className="flex items-center">
                Rewards <span className="">🎁</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center">{formattedBalance} ETH</span>
            </>
          )}
        </div>
        {showTooltip && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute z-10 w-72 p-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform opacity-100 scale-100"
          >
            <div className="text-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Rewards Balance
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {formattedBalance} ETH
              </p>
              <p className="text-gray-600 mb-4">≈ ${usdBalance} USD</p>
              {balance > 0 ? (
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 font-semibold">
                  Claim Rewards
                </button>
              ) : (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">
                    Earn rewards by:
                  </p>
                  <ul className="list-disc list-inside text-blue-500">
                    <li>Sharing Sessions</li>
                    <li>Referring Creators</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RewardButton;
