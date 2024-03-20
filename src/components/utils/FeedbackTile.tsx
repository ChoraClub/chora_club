"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function FeedbackTile() {
  const path = usePathname();
  const [isShowing, setIsShowing] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dataShowing, setDataShowing] = useState(false);

  const handleCloseClick = () => {
    setIsShowing(false);
    sessionStorage.setItem("feedbackTileClosed", JSON.stringify(true));
  };

  useEffect(() => {
    const feedbackTileClosed = JSON.parse(
      sessionStorage.getItem("feedbackTileClosed") || "false"
    );
    setIsShowing(!feedbackTileClosed);
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    console.log("meeting feedback path: ", path);
    if (path.includes("/huddle") || path.includes("/meeting")) {
      console.log("in meeting path");
      setDataShowing(true);
    }
  }, [path]);

  return (
    <>
      {isShowing && !isPageLoading && !dataShowing && (
        <div className="bg-yellow-200 flex justify-center items-center py-2 font-poppins">
          <span className="">
            Enjoying Chora Club? Share your feedback on{" "}
            <Link
              target="_blank"
              className="underline"
              href={`https://app.deform.cc/form/580f4057-b21e-4052-bf93-6b85e28a6032`}
            >
              features
            </Link>
            &nbsp; or &nbsp;
            <Link
              target="_blank"
              className="underline"
              href={`https://app.deform.cc/form/73cb1bd3-282e-4ebb-92ae-87fc91585358`}
            >
              report bugs
            </Link>
            .
          </span>
          <div className="flex absolute right-4">
            <button onClick={handleCloseClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackTile;
