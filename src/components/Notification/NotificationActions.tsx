"use client";

import React from "react";
import { FaClock, FaPlay, FaUserCheck } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  BsDatabaseFillCheck,
  BsFillExclamationCircleFill,
} from "react-icons/bs";
import { PiVideoFill } from "react-icons/pi";
import { GiChaingun } from "react-icons/gi";
import { BASE_URL } from "@/config/constants";
import { useAccount } from "wagmi";
import { useNotificationStudioState } from "@/store/notificationStudioState";

export const getBackgroundColor = (data: any) => {
  if (data?.notification_type === "newBooking") {
    if (data?.notification_name === "newBookingForHost") {
      return "#FFE6CC";
    } else if (data?.notification_name === "newBookingForGuest") {
      return "#D4F1E0";
    } else if (data?.notification_name === "sessionRejectionForGuest") {
      return "#fcc5b8";
    } else if (
      data?.notification_name === "sessionStartedByHost" ||
      data?.notification_name === "sessionStartedByGuest"
    ) {
      return "#b9cef0";
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
    } else if (data?.notification_name === "sessionRejectionForGuest") {
      return <BsFillExclamationCircleFill color="#f7552d" size={18} />;
    } else if (
      data?.notification_name === "sessionStartedByHost" ||
      data?.notification_name === "sessionStartedByGuest"
    ) {
      return <FaPlay color="#1061e6" size={18} />;
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
  const { setNotifications, updateCombinedNotifications } =
    useNotificationStudioState.getState();
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (data.receiver_address) {
      myHeaders.append("x-wallet-address", data.receiver_address);
    }

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
    if (result.success) {
      // Update the state in the store
      setNotifications((prev) =>
        prev.map((n) => (n._id === data._id ? { ...n, read_status: true } : n))
      );
      updateCombinedNotifications();
    } else {
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
        `/profile/${data.receiver_address}?active=sessions&session=book`
      );
    } else if (data.notification_name === "newBookingForGuest") {
      router.push(
        `/profile/${data.receiver_address}?active=sessions&session=attending`
      );
    } else if (data.notification_name === "sessionRejectionForGuest") {
      router.push(
        `/profile/${data.receiver_address}?active=sessions&session=attending`
      );
    } else if (data.notification_name === "sessionStartedByHost") {
      router.push(`/meeting/session/${data.additionalData.meetingId}/lobby`);
    } else if (data.notification_name === "sessionStartedByGuest") {
      router.push(`/meeting/session/${data.additionalData.meetingId}/lobby`);
    }
  } else if (data.notification_type === "attestation") {
    if (data.additionalData.notification_user_role === "session_hosted") {
      router.push(
        `/profile/${data.receiver_address}?active=sessions&session=hosted`
      );
    } else if (
      data.additionalData.notification_user_role === "session_attended"
    ) {
      router.push(
        `/profile/${data.receiver_address}?active=sessions&session=attended`
      );
    }
  }
  if (!data.read_status) {
    await markAsReadFunction(data);
  }
};
