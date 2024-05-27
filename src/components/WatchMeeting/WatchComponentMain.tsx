"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import search from "@/assets/images/daos/search.png";
import WatchSession from "./WatchSession";
import WatchSessionList from "./WatchSessionList";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./WatchSession.module.css";
import WatchSessionVideo from "./WatchSessionVideo";
import WatchSocialLinks from "./WatchSocialLinks";
import { color } from "framer-motion";
import WatchCollectibleInfo from "./WatchCollectibleInfo";
import WatchLeaderBoard from "./WatchLeaderBoard";
import WatchFreeCollect from "./WatchFreeCollect";
import WatchVideoRecommendation from "./WatchVideoRecommendation";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";

interface AttestationObject {
  attendee_address: string;
  attendee_uid: string;
}

function WatchComponentMain({ props }: { props: { id: string } }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>();
  const [collection, setCollection] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [watchSessionHeight, setWatchSessionHeight] = useState<number | 0>();

  useEffect(() => {
    async function fetchData() {
      try {
        const requestOptions: any = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `/api/get-watch-data/${props.id}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data[0]);
        setCollection(result.collection);
        console.log(result.data[0].video_uri.video_uri);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [props.id]);

  function utcToLocal(utcDateString: any) {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcDateString);

    // Get the local date and time components
    const localDate = utcDate.toLocaleDateString();
    const localTime = utcDate.toLocaleTimeString();

    // Combine and return the formatted local date and time
    return `${localDate} ${localTime}`;
  }

  return (
    <>
      {data ? (
        <div className=" ps-14">
          <div className="flex justify-between items-center pt-6 pb-3 pe-10">
            <div className="font-poppins font-medium text-4xl">
              <span className="text-black">Chora</span>{" "}
              <span className="text-blue-shade-200">Club</span>
            </div>
            <ConnectWalletWithENS />
          </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-6 pt-6 relative pr-6">
            {/* Left side */}
            <div className="sticky top-10 z-10 col-span-2 space-y-5 font-poppins pb-10 ">
              <WatchSessionVideo data={data} collection={collection} />
              <WatchSession data={data} collection={collection} />

              {/* /Video Recommendation */}
              {/* <WatchVideoRecommendation /> */}
            </div>

            {/* Right side */}
            <div
              className={`col-span-1 me-5 pb-8 ${styles.customScrollbar} gap-y-6 flex flex-col`}
            >
              {/* <WatchSessionList /> */}

              {/* Free */}
              <WatchFreeCollect />

              {/* Leader BOARD */}
              <WatchLeaderBoard />

              {/* COLLECTIBLE INFO */}
              <WatchCollectibleInfo />

              {/* SOCIAL LINKS */}
              <WatchSocialLinks data={data} collection={collection} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-5">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
      )}
    </>
  );
}

export default WatchComponentMain;
