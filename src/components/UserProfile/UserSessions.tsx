import React, { useState } from "react";
import ScheduledUserSessions from "./UserAllSessions/ScheduledUserSessions";
import BookedUserSessions from "./UserAllSessions/BookedUserSessions";
import AttendingUserSessions from "./UserAllSessions/AttendingUserSessions";
import RecordedUserSessions from "./UserAllSessions/RecordedUserSessions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function UserSessions() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

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
              searchParams.get("session") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=sessions&session=recorded")
            }
          >
            Recorded
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("session") === "schedule" && (
            <ScheduledUserSessions />
          )}
          {searchParams.get("session") === "book" && <BookedUserSessions />}
          {searchParams.get("session") === "attending" && (
            <AttendingUserSessions />
          )}
          {searchParams.get("session") === "recorded" && (
            <RecordedUserSessions />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSessions;
