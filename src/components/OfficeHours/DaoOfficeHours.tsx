"use client";

import React, { useState } from "react";
import OngoingDaoOfficeHours from "./OngoingDaoOfficeHours";
import UpcomingDaoOfficeHours from "./UpcomingDaoOfficeHours";
import RecordedDaoOfficeHours from "./RecordedDaoOfficeHours";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";

function DaoOfficeHours() {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6">
      <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
        Office Hours
      </div>

      <div className="pr-32 pt-4 font-poppins">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
          <button
            className={`py-2  ${
              activeSection === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              activeSection === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              activeSection === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("recorded")}
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
          {activeSection === "ongoing" && (
            <OngoingDaoOfficeHours params={searchQuery} />
          )}
          {activeSection === "upcoming" && (
            <UpcomingDaoOfficeHours params={searchQuery} />
          )}
          {activeSection === "recorded" && (
            <RecordedDaoOfficeHours params={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DaoOfficeHours;
