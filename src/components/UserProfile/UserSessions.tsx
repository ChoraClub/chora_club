import React, { useState, useEffect, useRef } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useAccount } from "wagmi";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import style from "./MainProfile.module.css";
import { ChevronRight } from 'lucide-react';

interface UserSessionsProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
  daoName: string;
}

function UserSessions({
  isDelegate,
  selfDelegate,
  daoName,
}: UserSessionsProps) {
  const { address } = useAccount();
  // const address = "0xc622420AD9dE8E595694413F24731Dd877eb84E1";
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { chain } = useAccount();
  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [attendedDetails, setAttendedDetails] = useState([]);
  const [hostedDetails, setHostedDetails] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const handleRetry = () => {
    setError(null);
    getUserMeetingData();
    window.location.reload();
  };

  useEffect(() => {
    const checkForOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowRightShadow(container.scrollWidth > container.clientWidth);
      }
    };

    checkForOverflow();
    window.addEventListener('resize', checkForOverflow);
    return () => window.removeEventListener('resize', checkForOverflow);
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftShadow(container.scrollLeft > 0);
      setShowRightShadow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const getUserMeetingData = async () => {
    setDataLoading(true);
    try {
      // setDataLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const response = await fetch(`/api/get-sessions`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          address: address,
          dao_name: daoName,
        }),
      });

      const result = await response.json();
      if (result.success) {
        const hostedData = await result.hostedMeetings;
        const attendedData = await result.attendedMeetings;
        if (searchParams.get("session") === "hosted") {
          setHostedDetails(hostedData);
        } else if (searchParams.get("session") === "attended") {
          setAttendedDetails(attendedData);
        }
      }
    } catch (error) {
      setError("Unable to load sessions. Please try again in a few moments.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getUserMeetingData();
  }, [
    address,
    // sessionDetails,
    searchParams.get("session"),
    // dataLoading,
    chain,
    chain?.name,
    daoName,
    // hostedDetails,
    // attendedDetails,
  ]);

  useEffect(() => {
    if (selfDelegate === true && searchParams.get("session") === "schedule") {
      router.replace(path + "?active=sessions&session=attending");
    }
  }, [selfDelegate]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }
  return (
    <div>
      <div className="pt-4 relative">
        <div className={`flex gap-10 sm:gap-16 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm overflow-x-auto whitespace-nowrap relative mx-4 md:mx-6 lg:mx-14`} ref={scrollContainerRef}
        onScroll={handleScroll}>
          {selfDelegate === true && (
            <button
              className={`py-2  ${
                searchParams.get("session") === "schedule"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() =>
                router.push(path + "?active=sessions&session=schedule")
              }
            >
              Schedule
            </button>
          )}

          {selfDelegate === true && (
            <button
              className={`py-2  ${
                searchParams.get("session") === "book"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() =>
                router.push(path + "?active=sessions&session=book")
              }
            >
              Booked
            </button>
          )}
          <button
            className={`py-2 ${
              searchParams.get("session") === "attending"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=sessions&session=attending")
            }
          >
            Attending
          </button>
          {selfDelegate === true && (
            <button
              className={`py-2 ${
                searchParams.get("session") === "hosted"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() =>
                router.push(path + "?active=sessions&session=hosted")
              }
            >
              Hosted
            </button>
          )}
          <button
            className={`py-2 ${
              searchParams.get("session") === "attended"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=sessions&session=attended")
            }
          >
            Attended
          </button>
        </div>
        {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 h-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      )}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 h-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      )}
      
      {/* {showRightShadow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow-md cursor-pointer">
          <ChevronRight className="text-gray-600" size={24} />
        </div>
      )} */}
        {/* <div className="absolute right-0 top-[19px] bg-white p-1 rounded-full shadow-md cursor-pointer" onClick={handleScrollRight}>
        <ChevronRight className="text-gray-600" size={24} />
      </div> */}

        <div className="py-6 sm:py-10 sm:px-20 md:px-6 lg:px-14">
          {selfDelegate === true &&
            searchParams.get("session") === "schedule" && (
              <div className="px-3">
              <ScheduledUserSessions daoName={daoName} />
              </div>
            )}
          {selfDelegate === true && searchParams.get("session") === "book" && (
            <BookedUserSessions daoName={daoName} />
          )}
          {searchParams.get("session") === "attending" && (
            <AttendingUserSessions daoName={daoName} />
          )}
          {selfDelegate === true &&
            searchParams.get("session") === "hosted" &&
            (dataLoading ? (
              <RecordedSessionsSkeletonLoader />
            ) : hostedDetails.length === 0 ? (
              <div className="flex flex-col justify-center items-center pt-10">
                <div className="text-5xl">☹️</div>{" "}
                <div className="pt-4 font-semibold text-lg">
                  Oops, no such result available!
                </div>
              </div>
            ) : (
              <RecordedSessionsTile
                meetingData={hostedDetails}
                showClaimButton={true}
                session="hosted"
              />
            ))}

          {searchParams.get("session") === "attended" &&
            (dataLoading ? (
              <RecordedSessionsSkeletonLoader />
            ) : attendedDetails.length === 0 ? (
              <div className="flex flex-col justify-center items-center pt-10">
                <div className="text-5xl">☹️</div>{" "}
                <div className="pt-4 font-semibold text-lg">
                  Oops, no such result available!
                </div>
              </div>
            ) : (
              <RecordedSessionsTile
                meetingData={attendedDetails}
                showClaimButton={true}
                session="attended"
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
