"use client";

import React, { useState } from "react";
import OngoingDaoOfficeHours from "./OngoingDaoOfficeHours";
import UpcomingDaoOfficeHours from "./UpcomingDaoOfficeHours";
import RecordedDaoOfficeHours from "./RecordedDaoOfficeHours";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function DaoOfficeHours() {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="p-6">
      <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
        Office Hours
      </div>

      <div className="pr-32 pt-4 font-poppins">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=recorded")}
          >
            Recorded
          </button>
        </div>

        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-fit rounded-full my-8 font-poppins"
        >
          <input
            type="text"
            placeholder="Search"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div>

        <div className="py-5">
          {searchParams.get("hours") === "ongoing" && (
            <OngoingDaoOfficeHours params={searchQuery} />
          )}
          {searchParams.get("hours") === "upcoming" && (
            <UpcomingDaoOfficeHours params={searchQuery} />
          )}
          {searchParams.get("hours") === "recorded" && (
            <RecordedDaoOfficeHours params={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DaoOfficeHours;
