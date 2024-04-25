import React, { useState, useEffect } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import EventTile from "../utils/EventTile";
// import HostedUserSessions from "./UserAllSessions/HostedUserSessions";
// import AttendedUserSessions from "./UserAllSessions/AttendedUserSessions";
import { useNetwork, useAccount } from "wagmi";
import Tile from "../utils/Tile";
import SessionTile from "../utils/SessionTiles";
import { Oval } from "react-loader-spinner";

interface UserSessionsProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
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

function UserSessions({ isDelegate, selfDelegate }: UserSessionsProps) {
  const { address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { chain, chains } = useNetwork();
  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [daoName, setDaoName] = useState("");

  let dao_name = "";
  const getUserMeetingData = async () => {
    if (chain?.name === "Optimism" || chain?.name === "Optimism Sepolia") {
      // dao_name = "optimism";
      setDaoName("optimism");
    } else if (chain?.name === "Arbitrum One") {
      // dao_name = "arbitrum";
      setDaoName("arbitrum");
    }
    try {
      // setDataLoading(true);
      const response = await fetch(`/api/get-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          setSessionDetails(hostedData);
          console.log("in session hosted");
        } else if (searchParams.get("session") === "attended") {
          setSessionDetails(attendedData);
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
  ]);

  // useEffect(() => {
  //   setDataLoading(true);
  //   setSessionDetails([]);
  // }, [searchParams.get("session")]);

  useEffect(() => {
    if (!selfDelegate && searchParams.get("session") === "schedule") {
      router.replace(path + "?active=sessions&session=attending");
    }
  }, [isDelegate, selfDelegate]);
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
              <ScheduledUserSessions />
            )}
          {selfDelegate === true && searchParams.get("session") === "book" && (
            <BookedUserSessions />
          )}
          {searchParams.get("session") === "attending" && (
            <AttendingUserSessions />
          )}
          {selfDelegate === true &&
            searchParams.get("session") === "hosted" &&
            (dataLoading ? (
              <div className="flex items-center justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : (
              <SessionTile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={false}
                isSession="attended"
              />
            ))}
          {searchParams.get("session") === "attended" &&
            (dataLoading ? (
              <div className="flex items-center justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
            ) : (
              <SessionTile
                sessionDetails={sessionDetails}
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
