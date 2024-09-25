   // Convert timestamp to relative time
   export const getRelativeTime = (timestamp: number | null) => {
    const now = Date.now() / 1000; // Current time in seconds
    const diffInSeconds = timestamp ? now - timestamp : 0;

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;

    if (diffInSeconds < secondsInMinute) {
      return 'just now';
    } else if (diffInSeconds < secondsInHour) {
      const minutes = Math.floor(diffInSeconds / secondsInMinute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < secondsInDay) {
      const hours = Math.floor(diffInSeconds / secondsInHour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < secondsInWeek) {
      const days = Math.floor(diffInSeconds / secondsInDay);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / secondsInWeek);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  };
