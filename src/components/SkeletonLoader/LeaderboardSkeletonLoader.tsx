const LeaderboardSkeleton = () => (
    <div className="bg-gray-100 rounded-lg p-4 mb-4 w-full animate-pulse">
      <div className="flex flex-col justify-between sm:flex-row items-center">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="w-32 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end mt-2 sm:mt-0">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center mx-2 my-1">
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-12 h-4 bg-gray-200 rounded-full mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  export default LeaderboardSkeleton;