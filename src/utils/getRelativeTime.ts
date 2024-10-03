const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;
const SECONDS_IN_MONTH = 2592000;
const SECONDS_IN_YEAR = 31536000;

const getRelativeTimeString = (diffInSeconds: number): string => {
  if (diffInSeconds < SECONDS_IN_MINUTE) {
    return "Just now";
  } else if (diffInSeconds < SECONDS_IN_HOUR) {
    const minutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < SECONDS_IN_DAY) {
    const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < SECONDS_IN_WEEK) {
    const days = Math.floor(diffInSeconds / SECONDS_IN_DAY);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < SECONDS_IN_MONTH) {
    const weeks = Math.floor(diffInSeconds / SECONDS_IN_WEEK);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < SECONDS_IN_YEAR) {
    const months = Math.floor(diffInSeconds / SECONDS_IN_MONTH);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / SECONDS_IN_YEAR);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

// Convert timestamp to relative time
export const getRelativeTime = (timestamp: number | null) => {
  const now = Date.now() / 1000; // Current time in seconds
  const diffInSeconds = timestamp ? now - timestamp : 0;

  return getRelativeTimeString(diffInSeconds);
};

export const formatTimeAgo = (utcTime: string): string => {
  const parsedTime = new Date(utcTime);
  const currentTime = new Date();
  const differenceInSeconds = Math.abs(
    (currentTime.getTime() - parsedTime.getTime()) / 1000
  );

  return getRelativeTimeString(differenceInSeconds);
};
