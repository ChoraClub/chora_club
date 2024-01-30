import React, { useState } from "react";
import OngoingDelegateOfficeHrs from "./DelegateOfficeHours/OngoingDelegateOfficeHrs";
import UpcomingDelegateOfficeHrs from "./DelegateOfficeHours/UpcomingDelegateOfficeHrs";
import RecordedDelegateOfficeHrs from "./DelegateOfficeHours/RecordedDelegateOfficeHrs";

function DelegateOfficeHrs() {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
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
          {activeSection === "ongoing" && <OngoingDelegateOfficeHrs />}
          {activeSection === "upcoming" && <UpcomingDelegateOfficeHrs />}
          {activeSection === "recorded" && <RecordedDelegateOfficeHrs />}
        </div>
      </div>
    </div>
  );
}

export default DelegateOfficeHrs;
