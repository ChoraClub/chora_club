"use client"

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import NotificationAll from "./NotificationAll";
import SessionBookings from "./SessionBookings";
import RecordedSessions from "./RecorderSessions";
import Followers from "./Followers";
import Attestations from "./Attestation";
function NotificationMain() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  return (
    <>
      <div className="font-poppins mb-12">
        <div className="font-semibold text-4xl text-blue-shade-100 pb-8 pt-9 px-16">
          Notifications
        </div>
        <div className="flex gap-12 bg-[#D9D9D945] pl-16">
        <button className={`py-4 px-2 outline-none ${
                searchParams.get("active") === "all"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=all")} >
              All
            </button>
        <button className={`py-4 px-2 outline-none ${
                searchParams.get("active") === "sessionBookings"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=sessionBookings")}>
              Session Bookings
            </button>
        <button className={`py-4 px-2 outline-none ${
                searchParams.get("active") === "recordedSessions"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=recordedSessions")}>
              Recorded Sessions
            </button>
        <button className={`py-4 px-2 outline-none ${
                searchParams.get("active") === "followers"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=followers")}>
              Followers
            </button>
        <button className={`py-4 px-2 outline-none ${
                searchParams.get("active") === "attestations"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=attestations")}>
              Attestations
            </button>
        </div>

              <div className="px-16">
              {searchParams.get("active") === "all" ? (
                <NotificationAll/>
              ):("")}
              {searchParams.get("active") === "sessionBookings" ? (
                <SessionBookings/>
              ):("")}
              {searchParams.get("active") === "recordedSessions" ? (
                <RecordedSessions/>
              ):("")}
              {searchParams.get("active") === "followers" ? (
                <Followers/>
              ):("")}
              {searchParams.get("active") === "attestations" ? (
                <Attestations/>
              ):("")}
              </div>
        
      </div>
    </>
  );
}
export default NotificationMain;
