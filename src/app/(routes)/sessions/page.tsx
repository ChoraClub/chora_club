import React from "react";
import DelegateSessionsMain from "@/components/DelegateSessions/DelegateSessionsMain";
import type { Metadata } from "next";
import ButtonWithCircle from "@/components/Circle/ButtonWithCircle";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.chora.club/"),
  title: "Chora Club",
  description: "Discover. Learn. Engage.",
  openGraph: {
    title: "Available Delegates",
    description:
      "Explore available delegates by DAO, date, and time to book sessions and unlock Web3 opportunities.",
    url: "https://app.chora.club/available-delegates",
    siteName: "Chora Club",
    images: [
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmUEoQqvoYbfp9ZD3AHzDNBYTmwovDifVBxWByzr8mMKnT",
        width: 800,
        height: 600,
        alt: "img",
      },
      {
        url: "https://gateway.lighthouse.storage/ipfs/QmUEoQqvoYbfp9ZD3AHzDNBYTmwovDifVBxWByzr8mMKnT",
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
    <>
    <ButtonWithCircle>
      <DelegateSessionsMain />
      </ButtonWithCircle>
    </>
  );
}

export default page;
