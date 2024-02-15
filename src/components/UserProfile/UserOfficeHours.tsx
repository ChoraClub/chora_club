import React, { useState } from "react";
import UserScheduledHours from "./UserAllOfficeHrs/UserScheduledHours";
import UserRecordedHours from "./UserAllOfficeHrs/UserRecordedHours";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserAttendedHours from "./UserAllOfficeHrs/UserAttendedHours";
import UserHostedHours from "./UserAllOfficeHrs/UserHostedHours";

function UserOfficeHours() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <div className="pt-3">
        <div className="flex w-fit gap-14 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
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

        <div className="py-10 pr-32 ">
          {searchParams.get("hours") === "schedule" && <UserScheduledHours />}
          {searchParams.get("hours") === "attended" && <UserHostedHours />}
          {searchParams.get("hours") === "hosted" && <UserAttendedHours/>}
        </div>
      </div>
    </div>
  );
}

export default UserOfficeHours;
