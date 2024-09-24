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
import WatchComponentSkeletonLoader from "../SkeletonLoader/WatchComponentSkeletonLoader";
import { v4 as uuidv4 } from "uuid";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";
import RewardButton from "../ClaimReward/RewardButton";
// import { id } from "ethers";
import { gql } from 'urql';
import { nft_client } from "@/config/staticDataUtils";
import { set } from "video.js/dist/types/tech/middleware";
import { ethers } from 'ethers'
// Define your GraphQL query
const LEADERBOARD_QUERY = gql`
  query MyQuery ($address: String!){
    zoraCreateTokens(where: {contract_: {address: $address}}) {
      creator
      maxSupply
      timestamp
      totalSupply
      totalMinted
      holders1155 {
        balance
        id
        lastUpdatedBlock
        user
      }
      contract {
        address
      }
      txn {
        timestamp
      }
    }
  }
`;

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
  const [leaderBoardData, setLeaderBoardData] = useState<any>();

  const fetchData = async () => {
    if (!data) {
      // Set default values when data is not available
      setLeaderBoardData({
        TopTen: [],
        firstCollector: null,
        latestCollector: null,
        maxSupply: null,
        selectedToken: null,
      });
      return;
    }
    try {
      const result = await nft_client.query(LEADERBOARD_QUERY, {
        address: data?.deployedContractAddress,
      }).toPromise();

      // console.log(result);

      // Check if result data is valid and tokens exist
      const selectedToken = result?.data?.zoraCreateTokens?.find(
        (token: any) => token?.holders1155 && token.holders1155.length > 0
      );

      if (!selectedToken) {
        setLeaderBoardData({
          TopTen: [],
          firstCollector: null,
          latestCollector: null,
          maxSupply: null,
          selectedToken: null,
        });
        return;
      }

      const maxSupply = selectedToken?.totalSupply ?? null;

      // Extract all holders and assign timestamps from the token transactions
      const allHolders = result?.data?.zoraCreateTokens?.flatMap((token: any) =>
        token?.holders1155?.map((holder: any) => ({
          ...holder,
          timestamp: token?.txn?.timestamp ?? null,
        }))
      ) ?? [];

      // Sort the holders based on balance and get the top 10
      const sortedHolders = allHolders?.sort((a: any, b: any) => (b.balance ?? 0) - (a.balance ?? 0));
      const TopTen = sortedHolders?.slice(0, 10) ?? [];

      // Handle case when there's only one holder
      // If allHolders is empty, return early
      if (!allHolders?.length) {
        return;
      }

      // Find the first and latest collectors based on lastUpdatedBlock
      const firstCollector = allHolders?.reduce((min: any, p: any) =>
        parseInt(p?.lastUpdatedBlock ?? 'Infinity') < parseInt(min?.lastUpdatedBlock ?? 'Infinity') ? p : min,
        allHolders[0]
      ) ?? null;

      const latestCollector = allHolders?.reduce((max: any, p: any) =>
        parseInt(p?.lastUpdatedBlock ?? '0') > parseInt(max?.lastUpdatedBlock ?? '0') ? p : max,
        allHolders[0]
      ) ?? null;

      // Fetch timestamps from block numbers using the ethers provider
      const getTimestampFromBlock = async (blockNumber: any) => {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC);
        const block = await provider.getBlock(parseInt(blockNumber));
        return block?.timestamp ?? null;
      };

      // Convert timestamp to relative time
      const getRelativeTime = (timestamp: number | null) => {
        const now = Date.now() / 1000; // Current time in seconds
        const diffInSeconds = timestamp ? now - timestamp : 0;

        const secondsInMinute = 60;
        const secondsInHour = 3600;
        const secondsInDay = 86400;
        const secondsInWeek = 604800;

        if (diffInSeconds < secondsInMinute) {
          return 'just now';
        } else if (diffInSeconds < secondsInHour) {
          const minutes = Math.floor(diffInSeconds / secondsInMinute);
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < secondsInDay) {
          const hours = Math.floor(diffInSeconds / secondsInHour);
          return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < secondsInWeek) {
          const days = Math.floor(diffInSeconds / secondsInDay);
          return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
          const weeks = Math.floor(diffInSeconds / secondsInWeek);
          return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
      };

      const firstBlockTimestamp = firstCollector?.lastUpdatedBlock
        ? await getTimestampFromBlock(firstCollector.lastUpdatedBlock)
        : null;

      const latestBlockTimestamp = latestCollector?.lastUpdatedBlock
        ? await getTimestampFromBlock(latestCollector.lastUpdatedBlock)
        : null;

      // Set leader board data
      setLeaderBoardData({
        TopTen,
        firstCollector: {
          ...firstCollector,
          timestamp: firstBlockTimestamp !== null ? getRelativeTime(firstBlockTimestamp) : null,
        },
        latestCollector: {
          ...latestCollector,
          timestamp: latestBlockTimestamp !== null ? getRelativeTime(latestBlockTimestamp) : null,
        },
        maxSupply,
        selectedToken,
      });

    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setLeaderBoardData({
        TopTen: [],
        firstCollector: null,
        latestCollector: null,
        maxSupply: null,
        selectedToken: null,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [data]);
  const sessionDetails = {
    title: "",
    description: "",
    image: "",
  };
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
        // console.log("result::::", result);
        setData(result.data[0]);
        setCollection(result.collection);
        // console.log(result.data[0].video_uri);
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
      {/* For Mobile Screen */}
      <MobileResponsiveMessage />

      {/* For Desktop Screen  */}
      <div className="hidden md:block">
        {data ? (
          <div className=" 1.7xl:ps-14 lg:ps-5 ps-4 xl:ps-10">
            <div className="flex justify-between items-center pt-6 pb-3 1.7xl:pe-10 lg:pe-3 pe-2">
              <div className="font-poppins font-medium text-4xl">
                <span className="text-black">Chora</span>{" "}
                <span className="text-blue-shade-200">Club</span>
              </div>
              <div className="flex gap-1 xs:gap-2 items-center">
                <RewardButton />
                <ConnectWalletWithENS />
              </div>
            </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-4 1.7xl:gap-x-6 pt-6 relative 1.7xl:pr-14 pr-4 lg:pr-5 xl-pr-10">
            {/* Left side */}
            <div className="col-span-2 space-y-5 font-poppins pb-10 ">
              <WatchSessionVideo
                data={data}
                collection={collection}
                autoplay={true}
                sessionDetails={sessionDetails}
              />
              <WatchSession
                data={data}
                collection={collection}
                sessionDetails={sessionDetails}
              />

              {/* /Video Recommendation */}
              <WatchVideoRecommendation data={data} />
            </div>

            {/* Right side */}
            <div
              className={`col-span-1  pb-8 ${styles.customScrollbar} gap-y-6 flex flex-col`}
            >
              {/* <WatchSessionList /> */}

              {/* Free */}
              <WatchFreeCollect leaderBoardData={leaderBoardData} data={data} collection={collection} />

              {/* Leader BOARD */}
              <WatchLeaderBoard leaderBoardData={leaderBoardData} data={data} collection={collection} />

              {/* COLLECTIBLE INFO */}
              <WatchCollectibleInfo leaderBoardData={leaderBoardData} data={data} collection={collection} />

              {/* SOCIAL LINKS */}
              <WatchSocialLinks data={data} collection={collection} />
            </div>
          </div>
        </div>
      ) : (
        <WatchComponentSkeletonLoader />
      )}
      </div>
    </>
  );
}

export default WatchComponentMain;
