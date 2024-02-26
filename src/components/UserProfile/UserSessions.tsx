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
interface UserSessionsProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
}

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
  user_address: string;
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

  const getUserMeetingData = async () => {
    try {
      const response = await fetch(`/api/get-session-data/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      // console.log("result in get session data", result);
      if (result.success) {
        // setSessionDetails(result.data);
        const resultData = await result.data;
        // console.log("resultData", resultData);
        if (Array.isArray(resultData)) {
          let filteredData: any = resultData;
          if (searchParams.get("session") === "hosted") {
            filteredData = resultData.filter((session: Session) => {
              return session.meeting_status === "Recorded";
            });
          } else if (searchParams.get("session") === "attended") {
            filteredData = resultData.filter((session: Session) => {
              return session.user_address === address;
            });
          }
          // console.log("filtered", filteredData);
          setSessionDetails(filteredData);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  useEffect(() => {
    getUserMeetingData();
  }, [address, sessionDetails, searchParams.get("session")]);

  useEffect(() => {
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!isDelegate && searchParams.get("session") === "schedule") {
      router.replace(path + "?active=sessions&session=attending");
    }
  }, [isDelegate]);
  return (
    <div>
      <div className="pr-32 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          {(selfDelegate === true || isDelegate === true) && (
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

          {(selfDelegate === true || isDelegate === true) && (
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
          {(selfDelegate === true || isDelegate === true) && (
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
          {(selfDelegate === true || isDelegate === true) &&
            searchParams.get("session") === "schedule" && (
              <ScheduledUserSessions />
            )}
          {(selfDelegate === true || isDelegate === true) &&
            searchParams.get("session") === "book" && <BookedUserSessions />}
          {searchParams.get("session") === "attending" && (
            <AttendingUserSessions />
          )}
          {(selfDelegate === true || isDelegate === true) &&
            searchParams.get("session") === "hosted" && (
              <SessionTile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={false}
              />
            )}
          {searchParams.get("session") === "attended" && (
            <SessionTile
              sessionDetails={sessionDetails}
              dataLoading={dataLoading}
              isEvent="Recorded"
              isOfficeHour={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
