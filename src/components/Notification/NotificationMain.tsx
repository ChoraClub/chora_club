"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import NotificationAll from "./NotificationAll";
import SessionBookings from "./SessionBookings";
import RecordedSessions from "./RecordedSessions";
import Followers from "./Followers";
import Attestation from "./Attestation";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { Notification } from "./NotificationTypeUtils";
import { useAccount } from "wagmi";
import { useSocket } from "@/app/hooks/useSocket";
import { PiEnvelopeOpen } from "react-icons/pi";
import { useSession } from "next-auth/react";

function NotificationMain() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ address });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch("/api/notifications", requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return null;
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (session) {
  //       const result = await fetchNotifications();
  //       const data = await result.data;
  //       setNotifications(data);
  //     }
  //   };
  //   fetchData();
  // }, [address, session]);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const result = await fetchNotifications();
        if (result && Array.isArray(result.data)) {
          setNotifications(result.data);
        } else {
          console.error("Fetched data is not an array:", result);
        }
      }
    };
    fetchData();
  }, [address, session]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketId(socket.id);
      });

      socket.on("disconnect", () => {
        setSocketId(null);
      });
    }
  }, [socket]);

  useEffect(() => {
    const hostAddress = address;
    if (socket && address && socketId) {
      socket.emit("register_host", { hostAddress, socketId });

      socket.on("new_notification", (message: Notification) => {
        const notificationData: Notification = {
          _id: message?._id,
          receiver_address: message.receiver_address,
          content: message.content,
          createdAt: Date.now(),
          read_status: false,
          notification_name: message.notification_name,
          notification_type: message.notification_type,
          notification_title: message.notification_title,
        };
        setNewNotifications((prevNotifications) => [
          ...prevNotifications,
          notificationData,
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [socket, address, socketId]);

  const combinedNotifications = [...notifications, ...newNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sessionBookings = combinedNotifications.filter(
    (item) => item.notification_type === "newBooking"
  );
  const recordedSessions = combinedNotifications.filter(
    (item) => item.notification_type === "recordedSession"
  );
  const followers = combinedNotifications.filter(
    (item) => item.notification_type === "newFollower"
  );
  const attestations = combinedNotifications.filter(
    (item) => item.notification_type === "attestation"
  );

  const markAllAsRead = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        markAll: true,
        receiver_address: address,
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

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read_status: true,
          }))
        );
        setNewNotifications((prevNewNotifications) =>
          prevNewNotifications.map((notification) => ({
            ...notification,
            read_status: true,
          }))
        );
      } else {
        console.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="font-poppins mb-12">
      <div className="flex items-center justify-between 1.7xl:pe-10 lg:pe-3 pe-2">
        <div className="font-semibold text-4xl text-blue-shade-100 pb-8 pt-9 px-16">
          Notifications
        </div>
        <ConnectWalletWithENS />
      </div>
      <div className="flex bg-[#D9D9D945]">
        <div className="flex gap-12 pl-16">
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "all"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=all")}
          >
            All
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "sessionBookings"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=sessionBookings")}
          >
            Session Bookings
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "recordedSessions"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=recordedSessions")}
          >
            Recorded Sessions
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "followers"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=followers")}
          >
            Followers
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "attestations"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=attestations")}
          >
            Attestations
          </button>
        </div>
        <div className="ml-auto pe-16">
          <button
            className="my-4 py-2 px-4 border border-blue-shade-100 text-blue-shade-100 rounded-xl flex items-center shadow-md hover:bg-blue-shade-100 hover:text-white transition duration-300 ease-in-out font-bold"
            onClick={markAllAsRead}
          >
            <PiEnvelopeOpen className="mr-2" width={10} />
            Mark all as read
          </button>
        </div>
      </div>
      <div className="px-16">
        {searchParams.get("active") === "all" && (
          <NotificationAll notifications={combinedNotifications} />
        )}
        {searchParams.get("active") === "sessionBookings" && (
          <SessionBookings notifications={sessionBookings} />
        )}
        {searchParams.get("active") === "recordedSessions" && (
          <RecordedSessions notifications={recordedSessions} />
        )}
        {searchParams.get("active") === "followers" && (
          <Followers notifications={followers} />
        )}
        {searchParams.get("active") === "attestations" && (
          <Attestation notifications={attestations} />
        )}
      </div>
    </div>
  );
}

export default NotificationMain;
