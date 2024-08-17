import React, { useState, useEffect } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useNetwork, useAccount } from "wagmi";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";

interface UserSessionsProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
  daoName: string;
}

type Attendee = {
  attendee_address: string;
  attendee_uid?: string;
};

interface Session {
  booking_status: string;
  dao_name: string;
  description: string;
  host_address: string;
  joined_status: string;
  meetingId: string;
  meeting_status: "Upcoming" | "Recorded" | "Denied";
  slot_time: string;
  title: string;
  attendees: Attendee[];
  _id: string;
}

function UserSessions({
  isDelegate,
  selfDelegate,
  daoName,
}: UserSessionsProps) {
  const { address } = useAccount();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { chain, chains } = useNetwork();
  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [attendedDetails, setAttendedDetails] = useState([]);
  const [hostedDetails, setHostedDetails] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    getUserMeetingData();
    window.location.reload();
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
      <div className="pr-14 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
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

        <div className="py-10">
          {selfDelegate === true &&
            searchParams.get("session") === "schedule" && (
              <ScheduledUserSessions daoName={daoName} />
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
