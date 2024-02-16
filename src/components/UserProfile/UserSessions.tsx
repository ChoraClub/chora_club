import React, { useState, useEffect} from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import EventTile from "../utils/EventTile";
// import HostedUserSessions from "./UserAllSessions/HostedUserSessions";
// import AttendedUserSessions from "./UserAllSessions/AttendedUserSessions";
import { useNetwork } from "wagmi";
import Tile from "../utils/Tile";
function UserSessions() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { chain, chains } = useNetwork();
  const details = [
      {
        img: text1,
        title: "Open Forum: Governance, Applications, and Beyond",
        dao: `${chain && chain.name}`,
        participant: 12,
        attendee: "0xf4b0556b9b6f53e00a1fdd2b0478ce841991d8fa",
        host: "lindaxie.eth",
        started: "07/09/2023 12:15 PM IST",
        desc: `Join the conversation about the future of ${chain && chain.name}. Discuss governance proposals, dApp adoption, and technical developments.`,
      },
    ];
  
    const [sessionDetails, setSessionDetails] = useState(details);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        setSessionDetails(details);
        setDataLoading(false);
    }, []);

  return (
    <div>
      <div className="pr-32 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
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
          <button
            className={`py-2  ${
              searchParams.get("session") === "book"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?active=sessions&session=book")}
          >
            Booked
          </button>
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
          {searchParams.get("session") === "schedule" && (
            <ScheduledUserSessions />
          )}
          {searchParams.get("session") === "book" &&  
          (
            <BookedUserSessions />
          )}
          {searchParams.get("session") === "attending" && (
            <AttendingUserSessions/>
          )}
          {searchParams.get("session") === "hosted" && (
            <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Recorded" isOfficeHour={false} />
          )}
          {searchParams.get("session") === "attended" && (
            <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Recorded" isOfficeHour={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
