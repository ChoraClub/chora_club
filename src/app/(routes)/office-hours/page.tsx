import DaoOfficeHours from "@/components/OfficeHours/DaoOfficeHours";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.chora.club/"),
  title: "Chora Club",
  description: "Discover. Learn. Engage.",
  openGraph: {
    title: "Office Hours",
    description:
      "Find all the current, upcoming, and past office hours hosted by different DAOs, and easily search them by using Title or Host Address.",
    url: "https://app.chora.club/office-hours?hours=ongoing",
    siteName: "Chora Club",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmPjZZxacLkRM1kPSBMmyV45MUtCHJPAPYW21cSds8gUet",
        width: 800,
        height: 600,
        alt: "img",
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmPjZZxacLkRM1kPSBMmyV45MUtCHJPAPYW21cSds8gUet",
        width: 1800,
        height: 1600,
        alt: "img",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

function page() {
  return (
    <div>
        <DaoOfficeHours />
    </div>
  );
}

export default page;
