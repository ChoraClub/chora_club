import React, { useState } from "react";
import OngoingDelegateOfficeHrs from "./DelegateOfficeHours/OngoingDelegateOfficeHrs";
import UpcomingDelegateOfficeHrs from "./DelegateOfficeHours/UpcomingDelegateOfficeHrs";
import RecordedDelegateOfficeHrs from "./DelegateOfficeHours/RecordedDelegateOfficeHrs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HostedDelegateOfficeHrs from "./DelegateOfficeHours/HostedDelegateOfficeHrs";
import AttendedDelegateOfficeHrs from "./DelegateOfficeHours/AttendedDelegateOfficeHrs";

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
            <OngoingDelegateOfficeHrs props={props} />
          )}
          {searchParams.get("hours") === "upcoming" && (
            <UpcomingDelegateOfficeHrs props={props} />
          )}
          {searchParams.get("hours") === "hosted" && (
            <HostedDelegateOfficeHrs props={props} />
          )}
          {searchParams.get("hours") === "attended" && (
            <AttendedDelegateOfficeHrs props={props} />
          )}
         
        </div>
      </div>
    </div>
  );
}

export default DelegateOfficeHrs;
