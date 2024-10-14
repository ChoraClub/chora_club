"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const FeedbackTile = () => {
  const path = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const feedbackTileClosed = JSON.parse(
      sessionStorage.getItem("feedbackTileClosed") || "false"
    );
    const isRelevantPath =
      !path.includes("/huddle") && !path.includes("/meeting");
    setIsVisible(!feedbackTileClosed && isRelevantPath);
  }, [path]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("feedbackTileClosed", JSON.stringify(true));
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-200 border-b border-yellow-300 bg-opacity-80 hidden lg:flex justify-between items-center px-4 py-2 font-poppins text-sm text-yellow-800 relative z-[1] shadow-sm">
      <span className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Enjoying Chora Club? Share feedback on{" "}
          <Link
            href="https://app.deform.cc/form/580f4057-b21e-4052-bf93-6b85e28a6032"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-900"
          >
            features
          </Link>{" "}
          or{" "}
          <Link
            href="https://app.deform.cc/form/73cb1bd3-282e-4ebb-92ae-87fc91585358"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-900"
          >
            report bugs
          </Link>
          .
        </span>
      </span>
      <button
        onClick={handleClose}
        className="ml-2 p-1 rounded-full hover:bg-yellow-300 transition-colors"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default FeedbackTile;
