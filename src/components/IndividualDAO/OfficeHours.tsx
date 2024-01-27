import React, { useState } from "react";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import OngoingOfficeHours from "./DelegatesOfficeHours/OngoingOfficeHours";
import UpcomingOfficeHours from "./DelegatesOfficeHours/UpcomingOfficeHours";
import RecordedOfficeHours from "./DelegatesOfficeHours/RecordedOfficeHours";

function OfficeHours() {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div
        style={{ background: "rgba(238, 237, 237, 0.36)" }}
        className="flex border-[0.5px] border-black w-fit rounded-full my-4 font-poppins"
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

      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
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

        <div className="py-10">
          {activeSection === "ongoing" && (
            <OngoingOfficeHours params={searchQuery} />
          )}
          {activeSection === "upcoming" && (
            <UpcomingOfficeHours params={searchQuery} />
          )}
          {activeSection === "recorded" && (
            <RecordedOfficeHours params={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}

export default OfficeHours;
