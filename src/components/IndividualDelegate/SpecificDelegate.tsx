"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import DelegateInfo from "./DelegateInfo";
import DelegateVotes from "./DelegateVotes";
import DelegateSessions from "./DelegateSessions";
import DelegateOfficeHrs from "./DelegateOfficeHrs";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

interface Delegate {
  logoUrl: string;
  name: string;
  daoName: string;
  isForumVerified: boolean;
  forumTopicURL: string;
  twitterHandle: string | null;
  socialLinks: {
    discord: string;
    discordGuildId: string;
    forum: string;
    logoUrl: string;
    snapshot: string;
    tally: string;
    twitter: string;
  };
  score: number;
  snapshotId: string[];
  onChainId: string;
  address: string;
  stats: {
    period: string;
    karmaScore: number;
    karmaRank: number;
    forumActivityScore: number | null;
    forumLikesReceived: number | null;
    forumPostsReadCount: number | null;
    proposalsInitiated: number | null;
    proposalsDiscussed: number | null;
    forumTopicCount: number | null;
    forumPostCount: number | null;
    offChainVotesPct: number;
    onChainVotesPct: number;
    updatedAt: string;
    createdAt: string;
    percentile: number;
    gitcoinHealthScore: number | null;
    deworkTasksCompleted: number | null;
    deworkPoints: number | null;
    proposalsOnSnapshot: number;
    discordScore: number | null;
    proposalsOnAragon: number | null;
    aragonVotesPct: number | null;
  }[];
  workstreams: any[];
  delegatorCount: number;
  delegatedVotes: number;
  githubScorePercentile: number | null;
  snapshotDelegatedVotes: number | null;
  voteWeight: string;
  firstTokenDelegatedAt: string;
  discordHandle: string | null;
  discordUsername: string | null;
  acceptedTOS: boolean;
  discussionThread: string | null;
}

interface Data {
  ensName: string | null;
  githubHandle: string | null;
  address: string;
  id: number;
  delegates: Delegate[];
  accomplishments: any[];
  nfts: any[];
  githubStats: any[];
  createdAt: string;
  realName: string | null;
  profilePictureUrl: string | StaticImport | null;
}

function SpecificDelegate({ props }: { props: Type }) {
  const [activeSection, setActiveSection] = useState("info");
  const [delegateInfo, setDelegateInfo] = useState<Data | null>();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/user/${props.individualDelegate}`
        );
        const details = await res.json();
        setDelegateInfo(details.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return number.toString();
    }
  };

  console.log("Path: ", path);

  return (
    <div className="font-poppins">
      <div className="flex ps-14 py-5">
        <Image src={user} alt="user" className="w-40" />

        <div className="px-4">
          <div className=" flex items-center py-1">
            <div className="font-bold text-lg pr-4">
              {delegateInfo?.ensName ? (
                delegateInfo?.ensName
              ) : (
                <>{props.individualDelegate.substring(0, 12)}... </>
              )}
            </div>
            <div className="flex gap-3">
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <FaXTwitter color="#7C7C7C" size={12} />
              </span>
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <BiLogoInstagramAlt color="#7C7C7C" size={12} />
              </span>
              <span
                className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
              >
                <FaDiscord color="#7C7C7C" size={12} />
              </span>
            </div>
          </div>

          <div className="flex items-center py-1">
            <div>
              {props.individualDelegate.substring(0, 6)} ...{" "}
              {props.individualDelegate.substring(
                props.individualDelegate.length - 4
              )}
            </div>

            <Tooltip content="Copy" placement="right" closeDelay={1} showArrow>
              <span className="px-2 cursor-pointer" color="#3E3D3D">
                <IoCopy
                  onClick={() =>
                    copy("0xB351a70dD6E5282A8c84edCbCd5A955469b9b032")
                  }
                />
              </span>
            </Tooltip>
          </div>

          <div className="flex gap-4 py-1">
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              <span className="text-blue-shade-200 font-semibold">
                {formatNumber(
                  Number(delegateInfo?.delegates[0].delegatedVotes)
                )}{" "}
                &nbsp;
              </span>
              delegated tokens
            </div>
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              Delegated from
              <span className="text-blue-shade-200 font-semibold">
                {" "}
                {formatNumber(
                  Number(delegateInfo?.delegates[0].delegatorCount)
                )}{" "}
              </span>
              Addresses
            </div>
          </div>

          <div className="pt-2">
            <button className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]">
              Delegate
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-12 bg-[#D9D9D945] pl-16">
        <button
          className={`border-b-2 py-4 px-2  ${
            searchParams.get("active") === "info"
              ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=info")}
        >
          Info
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "pastVotes"
              ? "text-blue-shade-200 font-semibold border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=pastVotes")}
        >
          Past Votes
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "delegatesSession"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=delegatesSession&session=ongoing")
          }
        >
          Sessions
        </button>
        <button
          className={`border-b-2 py-4 px-2 ${
            searchParams.get("active") === "officeHours"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() =>
            router.push(path + "?active=officeHours&hours=ongoing")
          }
        >
          Office Hours
        </button>
      </div>

      <div className="py-6 ps-16">
        {searchParams.get("active") === "info" && <DelegateInfo />}
        {searchParams.get("active") === "pastVotes" && (
          <DelegateVotes props={props.individualDelegate} />
        )}
        {searchParams.get("active") === "delegatesSession" && (
          <DelegateSessions />
        )}
        {searchParams.get("active") === "officeHours" && <DelegateOfficeHrs />}
      </div>
    </div>
  );
}

export default SpecificDelegate;
