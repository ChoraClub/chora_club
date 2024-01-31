import React, { useState } from "react";
import UserScheduledHours from "./UserAllOfficeHrs/UserScheduledHours";
import UserRecordedHours from "./UserAllOfficeHrs/UserRecordedHours";

function UserOfficeHours() {
  const [activeSection, setActiveSection] = useState("schedule");

  return (
    <div>
      <div className="pt-3">
        <div className="flex w-fit gap-14 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              activeSection === "schedule"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("schedule")}
          >
            Schedule
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

        <div className="py-10 pr-32 ">
          {activeSection === "schedule" && <UserScheduledHours />}
          {activeSection === "recorded" && <UserRecordedHours />}
        </div>
      </div>
    </div>
  );
}

export default UserOfficeHours;
