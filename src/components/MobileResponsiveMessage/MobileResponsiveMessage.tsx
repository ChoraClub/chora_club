import React from "react";
import SidebarMainMobile from "../MainSidebar/SidebarMainMobile";
import Image from "next/image";
import cclogo from "@/assets/images/daos/CCLogo.png";

function MobileResponsiveMessage() {
  return (
    <div className="md:hidden overflow-hidden bg-gray-100 flex flex-col" style={{ height: 'calc(100vh - 77px)' }}>
      {/* <div className="absolute top-0 left-0 pt-4 sm:pt-6 px-4 flex items-center">
        <SidebarMainMobile />
        <div className="ml-5 text-blue-shade-200 font-semibold text-[32px] font-poppins">
          Chora Club
        </div>
      </div> */}
      <div className="flex-1 flex items-center justify-center px-4 font-poppins">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-sm w-full">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-blue-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Oops!</h2>
          <p className="text-gray-600 mb-4">
            The mobile version of this site isn&apos;t ready yet.
          </p>
          <p className="text-gray-600 font-semibold">
            Please use your desktop computer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileResponsiveMessage;
