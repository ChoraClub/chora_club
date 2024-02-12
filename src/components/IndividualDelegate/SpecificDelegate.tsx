"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import user from "@/assets/images/daos/profile.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import DelegateInfo from "./DelegateInfo";
import DelegateVotes from "./DelegateVotes";
import DelegateSessions from "./DelegateSessions";
import DelegateOfficeHrs from "./DelegateOfficeHrs";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Provider, cacheExchange, createClient, fetchExchange } from "urql";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function SpecificDelegate({ props }: { props: Type }) {
  const [delegateInfo, setDelegateInfo] = useState<any>();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [discourse, setDiscourse] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/find-delegate?dao=${props.daoDelegates}&user=${props.individualDelegate}`
        );
        const details = await res.json();
        console.log("Socials: ", details.data.delegate);
        setDelegateInfo(details.data.delegate);

        if (details.data.delegate.twitterHandle != null) {
          setTwitter(
            `https://twitter.com/${details.data.delegate.twitterHandle}`
          );
        }

        if (details.data.delegate.discourseHandle != null) {
          if (props.daoDelegates === "optimism") {
            setDiscourse(
              `https://gov.optimism.io/u/${details.data.delegate.discourseHandle}`
            );
          }
          if (props.daoDelegates === "arbitrum") {
            setDiscourse(
              `https://forum.arbitrum.foundation/u/${details.data.delegate.discourseHandle}`
            );
          }
        }

        if (details.data.delegate.discordHandle != null) {
          setDiscord(
            `https://discord.com/${details.data.delegate.discordHandle}`
          );
        }

        if (details.data.delegate.githubHandle != null) {
          setGithub(
            `https://discord.com/${details.data.delegate.githubHandle}`
          );
        }
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
      return number;
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  return (
    <div className="font-poppins">
      <div className="flex ps-14 py-5">
        <Image
          src={delegateInfo?.profilePicture || user}
          alt="user"
          width={40}
          height={40}
          className="w-40 rounded-3xl"
        />

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
              <Link
                href={twitter}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  twitter == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaXTwitter color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={discourse}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                  discourse == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={discord}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  discord == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaDiscord color="#7C7C7C" size={12} />
              </Link>
              <Link
                href={github}
                className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                  github == "" ? "hidden" : ""
                }`}
                style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                target="_blank"
              >
                <FaGithub color="#7C7C7C" size={12} />
              </Link>
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
                <IoCopy onClick={() => handleCopy(props.individualDelegate)} />
              </span>
            </Tooltip>
            <Toaster
              toastOptions={{
                style: {
                  fontSize: "14px",
                  backgroundColor: "#3E3D3D",
                  color: "#fff",
                  boxShadow: "none",
                  borderRadius: "50px",
                  padding: "3px 5px",
                },
              }}
            />
          </div>

          <div className="flex gap-4 py-1">
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              <span className="text-blue-shade-200 font-semibold">
                {formatNumber(Number(delegateInfo?.delegatedVotes))}
                &nbsp;
              </span>
              delegated tokens
            </div>
            <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
              Delegated from
              <span className="text-blue-shade-200 font-semibold">
                &nbsp;{formatNumber(delegateInfo?.delegatorCount)}&nbsp;
              </span>
              Addresses
            </div>
          </div>

          <div className="pt-2">
            <button
              className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
              onClick={() => toast("Coming Soon 🚀")}
            >
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
            router.push(path + "?active=delegatesSession&session=book")
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
        {searchParams.get("active") === "info" && (
          <DelegateInfo props={props}  />
        )}
        {searchParams.get("active") === "pastVotes" && (
          <DelegateVotes props={props} />
        )}
        {searchParams.get("active") === "delegatesSession" && (
          <DelegateSessions props={props} />
        )}
        {searchParams.get("active") === "officeHours" && (
          <DelegateOfficeHrs props={props} />
        )}
      </div>
    </div>
  );
}

export default SpecificDelegate;
