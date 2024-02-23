import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import text1 from "@/assets/images/daos/texture1.png";
import Tile from "../utils/Tile";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateOfficeHrs({ props }: { props: Type }) {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const details = [
    {
      img: text1,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: props.daoDelegates,
      participant: 12,
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "22/09/2023 12:15 PM EST",
      desc: `Join the conversation about the future of ${props.daoDelegates}. Discuss governance proposals, dApp adoption, and technical developments.`,
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
      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=ongoing")
            }
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
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
          {searchParams.get("hours") === "ongoing" && (
            <Tile
              sessionDetails={sessionDetails}
              dataLoading={dataLoading}
              isEvent="Ongoing"
              isOfficeHour={true}
            />
          )}
          {searchParams.get("hours") === "upcoming" && (
            <Tile
              sessionDetails={sessionDetails}
              dataLoading={dataLoading}
              isEvent="Upcoming"
              isOfficeHour={true}
            />
          )}
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

export default DelegateOfficeHrs;
