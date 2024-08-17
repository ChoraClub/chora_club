const TopDelegatesSkeleton = () => (
    <div className="w-full md:w-80 animate-pulse">
      {/* <h2 className={`${styles.heading} text-2xl font-bold mb-14 text-center`}>Top Delegates</h2> */}
      <div className="w-32 h-5 rounded-lg bg-gray-200 animate-pulse"></div>
      <div className="flex justify-center items-end space-x-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`w-${index === 1 ? '28' : '24'} transform hover:scale-105 transition-transform duration-200`}>
            <div className={`bg-gray-100 rounded-t-lg p-3 pb-${index === 1 ? '20' : '12'} relative`}>
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded-full mx-auto mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded-full mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  export default TopDelegatesSkeleton;