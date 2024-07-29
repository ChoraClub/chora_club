// NotificationActions.tsx

import React from "react";
import { FaClock, FaUserCheck } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { PiVideoFill } from "react-icons/pi";
import { GiChaingun } from "react-icons/gi";
import { BASE_URL } from "@/config/constants";

export const getBackgroundColor = (data: any) => {
  if (data?.notification_type === "newBooking") {
    if (data?.notification_name === "newBookingForHost") {
      return "#FFE6CC";
    } else if (data?.notification_name === "newBookingForGuest") {
      return "#D4F1E0";
    }
  } else if (data?.notification_type === "recordedSession") {
    return "#E5CCFF";
  } else if (data?.notification_type === "newFollower") {
    return "#C2DFFF";
  } else if (data?.notification_type === "attestation") {
    if (data?.notification_name === "offchain") {
      return "#E5CCFF";
    } else if (data?.notification_name === "onchain") {
      return "#E5CCFF";
    }
  }
  return "#bed9f8";
};

export const getIcon = (data: any) => {
  if (data?.notification_type === "newBooking") {
    if (data?.notification_name === "newBookingForHost") {
      return <FaClock color="#FF8A00" size={18} />;
    } else if (data?.notification_name === "newBookingForGuest") {
      return <IoCheckmarkCircle color="#00C259" size={18} />;
    }
  } else if (data?.notification_type === "recordedSession") {
    return <PiVideoFill color="#9747FF" size={18} />;
  } else if (data?.notification_type === "newFollower") {
    return <FaUserCheck color="#0057FF" size={18} />;
  } else if (data?.notification_type === "attestation") {
    if (data?.notification_name === "offchain") {
      return <BsDatabaseFillCheck color="#9747FF" size={18} />;
    } else if (data?.notification_name === "onchain") {
      return <GiChaingun color="#9747FF" size={18} />;
    }
  }
  return null;
};

export const markAsRead = async (data: any): Promise<void> => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      id: data?._id,
      receiver_address: data.receiver_address,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    const response = await fetch(
      "/api/notifications/mark-as-read",
      requestOptions
    );
    const result = await response.json();
    if (!result.success) {
      console.error("Error marking as read:", result.message);
    }
  } catch (error) {
    console.error("Error marking as read:", error);
  }
};

export const handleRedirection = async (
  data: any,
  router: any,
  markAsReadFunction: (data: any) => Promise<void>
): Promise<void> => {
  if (data.notification_type === "newBooking") {
    if (data.notification_name === "newBookingForHost") {
      router.push(
        `${BASE_URL}/profile/${data.receiver_address}?active=sessions&session=book`
      );
    } else if (data.notification_name === "newBookingForGuest") {
      router.push(
        `${BASE_URL}/profile/${data.receiver_address}?active=sessions&session=attending`
      );
    }
  }
  if (!data.read_status) {
    await markAsReadFunction(data);
  }
};
