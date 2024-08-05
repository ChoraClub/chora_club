import React, { useState, useEffect } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import EventTile from "../ComponentUtils/EventTile";
// import HostedUserSessions from "./UserAllSessions/HostedUserSessions";
// import AttendedUserSessions from "./UserAllSessions/AttendedUserSessions";
import { useNetwork, useAccount } from "wagmi";
import Tile from "../ComponentUtils/Tile";
import SessionTile from "../ComponentUtils/SessionTiles";
import { Oval } from "react-loader-spinner";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";

interface UserSessionsProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
  daoName: string;
}

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
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
  // const [daoName, setDaoName] = useState("");
  const [attendedDetails, setAttendedDetails] = useState([]);
  const [hostedDetails, setHostedDetails] = useState([]);

  let dao_name = "";
  const getUserMeetingData = async () => {
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

      // console.log("Response", response);

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        const hostedData = await result.hostedMeetings;
        console.log("hostedData", hostedData);
        const attendedData = await result.attendedMeetings;
        console.log("attendedData", attendedData);
        setDataLoading(true);
        if (searchParams.get("session") === "hosted") {
          // setSessionDetails(hostedData);
          setHostedDetails(hostedData);
          console.log("in session hosted");
        } else if (searchParams.get("session") === "attended") {
          // setSessionDetails(attendedData);
          setAttendedDetails(attendedData);
        }
        setDataLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  useEffect(() => {
    getUserMeetingData();
  }, [
    address,
    sessionDetails,
    searchParams.get("session"),
    dataLoading,
    chain,
    chain?.name,
    daoName,
    hostedDetails,
    attendedDetails,
  ]);

  // useEffect(() => {
  //   setDataLoading(true);
  //   setSessionDetails([]);
  // }, [searchParams.get("session")]);

  useEffect(() => {
    if (selfDelegate === true && searchParams.get("session") === "schedule") {
      router.replace(path + "?active=sessions&session=attending");
    }
  }, [selfDelegate]);
  return (
    <div>
      <div className="pr-32 pt-3">
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
              }>
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
              }>
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
            }>
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
              }>
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
            }>
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
              <SessionTileSkeletonLoader />
            ) : (
              <SessionTile
                sessionDetails={hostedDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={false}
                isSession="hosted"
              />
            ))}
          {searchParams.get("session") === "attended" &&
            (dataLoading ? (
              <SessionTileSkeletonLoader />
            ) : (
              <SessionTile
                sessionDetails={attendedDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={false}
                isSession="attended"
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
