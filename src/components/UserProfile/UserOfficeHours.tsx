import React, { useState, useEffect } from "react";
import UserScheduledHours from "./UserAllOfficeHrs/UserScheduledHours";
import UserRecordedHours from "./UserAllOfficeHrs/UserRecordedHours";
import UserUpcomingHours from "./UserAllOfficeHrs/UserUpcomingHours";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tile from "../utils/Tile";
import { useNetwork } from "wagmi";
import text1 from "@/assets/images/daos/texture1.png";

interface UserOfficeHoursProps {
  isDelegate: boolean | undefined;
}
function UserOfficeHours({isDelegate}:UserOfficeHoursProps) {
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
      started: "07/09/2023 12:15 PM EST",
      desc: `Join the conversation about the future of ${
        chain && chain.name
      }. Discuss governance proposals, dApp adoption, and technical developments.`,
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
      <div className="pt-3 pr-32">
        <div className="flex w-fit gap-14 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
          {/* {isDelegate === true &&( */}
          <button
            className={`py-2  ${
              searchParams.get("hours") === "schedule"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=schedule")
            }
          >
            Schedule
          </button>
          {/* )} */}

          {isDelegate === true &&(
          <button
            className={`py-2  ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=upcoming")
            }
          >
            Upcoming
          </button>
          )}
          <button
            className={`py-2 ${
              searchParams.get("hours") === "hosted"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=hosted")
            }
          >
            Hosted
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "attended"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=attended")
            }
          >
            Attended
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("hours") === "schedule" && <UserScheduledHours />}
          {isDelegate === true && searchParams.get("hours") === "upcoming" && <UserUpcomingHours />}

          {searchParams.get("hours") === "hosted" && (
            <Tile
              sessionDetails={sessionDetails}
              dataLoading={dataLoading}
              isEvent="Recorded"
              isOfficeHour={true}
            />
          )}
          {searchParams.get("hours") === "attended" && (
            <Tile
              sessionDetails={sessionDetails}
              dataLoading={dataLoading}
              isEvent="Recorded"
              isOfficeHour={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserOfficeHours;
