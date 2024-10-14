import React from "react";
import { motion } from "framer-motion";

const ExploreDaosSkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:w-[95%] 2md:w-[85%] gap-6 2xl:w-[70%] mx-auto"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200"></div>
              </div>
              <div className="h-5 w-3/4 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded-full mx-auto"></div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ExploreDaosSkeletonLoader;
