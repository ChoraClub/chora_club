import React, { useState } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import RecordedUserSessions from "./UserAllSessions/RecordedUserSessions";

function UserSessions() {
  const [activeSection, setActiveSection] = useState("schedule");

  return (
    <div>
      <div className="pr-32 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
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
            className={`py-2  ${
              activeSection === "book"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("book")}
          >
            Booked
          </button>
          <button
            className={`py-2 ${
              activeSection === "attending"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("attending")}
          >
            Attending
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
          {activeSection === "schedule" && <ScheduledUserSessions />}
          {activeSection === "book" && <BookedUserSessions />}
          {activeSection === "attending" && <AttendingUserSessions />}
          {activeSection === "recorded" && <RecordedUserSessions />}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
