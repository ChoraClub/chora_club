import Image from "next/image";
import React from "react";
import not_found from "@/assets/images/daos/404.png";

function PageNotFound() {
  return (
    // <div className="flex items-center justify-center h-screen">
    //   <div className="text-center">
    //     <h1 className="text-4xl font-bold text-blue-600 mb-4">404</h1>
    //     <p className="text-lg text-gray-800 font-semibold">Page not found</p>
    //   </div>
    // </div>
    <div className="flex flex-col gap-8 justify-center h-screen items-center w-[40%] mx-auto font-poppins">
      <Image alt="image" src={not_found}></Image>
      <div className="font-bold text-3xl animate-fadeIn bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
        Page not found
      </div>
    </div>
  );
}

export default PageNotFound;
