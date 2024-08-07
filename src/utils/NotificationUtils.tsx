import { getEnsName } from "./ENSUtils";
import { truncateAddress } from "./text";

export function formatTimestampOrDate(timestamp: string | number) {
  const date = new Date(timestamp);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    // let hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const strTime = hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm;
    // return strTime;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    if (date.getFullYear() === today.getFullYear()) {
      const options: any = { day: "2-digit", month: "short" };
      return date.toLocaleDateString(undefined, options);
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
}

export async function getDisplayNameOrAddr(userAddress: string) {
  try {
    // Attempt to get the ENS name or address
    const ensNameOrUserAddress = await getEnsName(userAddress);

    // Check if an ENS name is returned
    if (ensNameOrUserAddress?.ensNameOrAddress) {
      return ensNameOrUserAddress.ensNameOrAddress;
    } else {
      // If no ENS name is found, truncate the address
      return truncateAddress(userAddress);
    }
  } catch (error) {
    console.error("Error fetching ENS name:", error);
    // In case of any errors, return the truncated address as a fallback
    return truncateAddress(userAddress);
  }
}

// export async function formatSlotDateAndTime({
//   dateInput,
//   locale = "en-US",
//   options = {},
// }: any) {
//   // Convert the input into a Date object
//   const date = new Date(dateInput);

//   // Set default options if none are provided
//   const defaultOptions = {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//     hour12: true,
//   };

//   // Merge default options with user-provided options
//   const formatOptions: any = { ...defaultOptions, ...options };

//   // Format the date using toLocaleString
//   return date.toLocaleString(locale, formatOptions);
// }

export async function formatSlotDateAndTime({
  dateInput,
  locale = "en-US",
  options = {},
}: {
  dateInput: string | number | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  // Attempt to convert the input into a Date object
  let date: Date;
  if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    throw new Error("Invalid date input");
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid Date");
  }

  // Set default options if none are provided
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Merge default options with user-provided options
  const formatOptions: Intl.DateTimeFormatOptions = {
    ...defaultOptions,
    ...options,
  };

  // Format the date using toLocaleString
  return date.toLocaleString(locale, formatOptions);
}
