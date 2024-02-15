import React, { useState } from "react";
import DegelateOngoingSession from "./AllSessions/DegelateOngoingSession";
import DelegateUpcomingSession from "./AllSessions/DelegateUpcomingSession";
import DelegateRecordedSession from "./AllSessions/DelegateRecordedSession";
import BookSession from "./AllSessions/BookSession";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateSessions({ props }: { props: Type }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              searchParams.get("session") === "book"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=book")
            }
          >
            Book
          </button>
          <button
            className={`py-2  ${
              searchParams.get("session") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=ongoing")
            }
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("session") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=upcoming")
            }
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("session") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=recorded")
            }
          >
            Recorded
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("session") === "book" && (
            <BookSession props={props} />
          )}
          {searchParams.get("session") === "ongoing" && (
            <DegelateOngoingSession props={props} />
          )}
          {searchParams.get("session") === "upcoming" && (
            <DelegateUpcomingSession props={props} />
          )}
          {searchParams.get("session") === "recorded" && (
            <DelegateRecordedSession props={props} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DelegateSessions;
