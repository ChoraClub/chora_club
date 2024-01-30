import React, { useState } from "react";
import DegelateOngoingSession from "./AllSessions/DegelateOngoingSession";
import DelegateUpcomingSession from "./AllSessions/DelegateUpcomingSession";
import DelegateRecordedSession from "./AllSessions/DelegateRecordedSession";
import BookSession from "./AllSessions/BookSession";

function DelegateSessions() {
  const [activeSection, setActiveSection] = useState("book");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              activeSection === "book"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => setActiveSection("book")}
          >
            Book
          </button>
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
          {activeSection === "book" && <BookSession />}
          {activeSection === "ongoing" && <DegelateOngoingSession />}
          {activeSection === "upcoming" && <DelegateUpcomingSession />}
          {activeSection === "recorded" && <DelegateRecordedSession />}
        </div>
      </div>
    </div>
  );
}

export default DelegateSessions;
