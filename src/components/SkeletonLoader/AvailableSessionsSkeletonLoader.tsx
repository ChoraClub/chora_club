import React from "react";

const AvailableSessionsSkeletonLoader = () => {
  return (
    <div className="overflow-auto font-poppins grid grid-cols-1 md:grid-cols-1 1.5lg:grid-cols-2 2xl:grid-cols-2 gap-12 py-5 px-6 md:px-10">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
          }}
          className="rounded-3xl flex flex-col bg-white animate-pulse"
        >
          <div className="relative border-b-2 mb-2 sm:mb-4">
            <div className="flex xs:items-center py-5 px-5 rounded-tl-3xl rounded-tr-3xl">
              <div className="relative object-cover rounded-3xl border-none xs:border-[2px] border-[#E9E9E9]">
                <div className="size-24 sm:size-32 flex items-center justify-content">
                  <div className="flex justify-center items-center size-24 sm:size-32">
                    <div className="size-24 sm:w-32 sm:h-32 bg-gray-200 rounded-xl xs:rounded-3xl animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="w-3/4 ml-2 sm:ml-4">
                <div className="w-40 xs:w-48 h-6 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="text-xs sm:text-sm flex">
                  <div className="w-24 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                  <div className="items-center w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded mt-2 animate-pulse"></div>
                <div className="mt-4">
                  <div
                    className="text-[#4F4F4F] rounded-md w-full py-1"
                    style={{
                      overflowX: "auto",
                      overflowY: "hidden",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-20 xs:w-24 h-8 bg-gray-200 rounded-full mr-2 animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-3 right-3 sm:flex gap-1 hidden">
              <div className="w-12 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center px-3 sm:px-5 pb-2 sm:pb-3">
            <div className="hidden xs:block w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-[60%] flex items-center ml-2">
              <div className="w-36 xs:w-40 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="w-[40%] flex justify-end">
              <div className="w-40 xs:w-44 h-10 xs:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableSessionsSkeletonLoader;
