import React, { useState } from "react";
import OngoingDelegateOfficeHrs from "./DelegateOfficeHours/OngoingDelegateOfficeHrs";
import UpcomingDelegateOfficeHrs from "./DelegateOfficeHours/UpcomingDelegateOfficeHrs";
import RecordedDelegateOfficeHrs from "./DelegateOfficeHours/RecordedDelegateOfficeHrs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function DelegateOfficeHrs({ props }: { props: string }) {
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
              searchParams.get("hours") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=recorded")
            }
          >
            Recorded
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("hours") === "ongoing" && (
            <OngoingDelegateOfficeHrs props={props} />
          )}
          {searchParams.get("hours") === "upcoming" && (
            <UpcomingDelegateOfficeHrs props={props} />
          )}
          {searchParams.get("hours") === "recorded" && (
            <RecordedDelegateOfficeHrs props={props} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DelegateOfficeHrs;
