"use client";

import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import { StaticImageData } from "next/image";
import Tile from "../ComponentUtils/Tile";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Oval } from "react-loader-spinner";
import { Tooltip } from "@nextui-org/react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { RxCross2 } from "react-icons/rx";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";
import {useAccount} from "wagmi";
import SidebarMainMobile from "../MainSidebar/SidebarMainMobile";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";
import Heading from "../ComponentUtils/Heading";
import { CiSearch } from "react-icons/ci";
import { fetchApi } from "@/utils/api";
interface Type {
  img: StaticImageData;
  title: string;
  dao: string;
  participant: number;
  attendee: string;
  host: string;
  started: string;
  desc: string;
}

interface Session {
  _id: string;
  host_address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  meeting_status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  dao_name: string;
}

function DaoOfficeHours() {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [sessionDetails, setSessionDetails] = useState<Type[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(true);

  const {address}=useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetchApi(
          "/get-specific-officehours",
          requestOptions
        );
        const result = await response.json();
        console.log(result);

        // Filter sessions based on meeting_status
        const filteredSessions = result.filter((session: Session) => {
          if (searchParams.get("hours") === "ongoing") {
            return session.meeting_status === "ongoing";
          } else if (searchParams.get("hours") === "upcoming") {
            return session.meeting_status === "active";
          } else if (searchParams.get("hours") === "recorded") {
            return session.meeting_status === "inactive";
          }
        });

        setSessionDetails(filteredSessions);
        setDataLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchParams.get("hours")]); // Re-fetch data when filter changes

  useEffect(() => {
    // Set initial session details
    setSessionDetails([]);
    setDataLoading(true);
  }, []);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      setDataLoading(true);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const requestOptions: any = {
        method: "POST",
        headers:myHeaders,
        body: JSON.stringify({
          dao_name: null,
        }),
        redirect: "follow",
      };
      const res = await fetchApi(
        `/search-officehours/${query}`,
        requestOptions
      );
      const result = await res.json();
      const resultData = await result.data;

      if (result.success) {
        const filtered: any = resultData.filter((session: Session) => {
          if (searchParams.get("hours") === "ongoing") {
            return session.meeting_status === "ongoing";
          } else if (searchParams.get("hours") === "upcoming") {
            return session.meeting_status === "active";
          } else if (searchParams.get("hours") === "recorded") {
            return session.meeting_status === "inactive";
          }
        });
        console.log("filtered: ", filtered);
        setSessionDetails(filtered);
        setDataLoading(false);
      }
    } else {
      // setSessionDetails(tempDetails);
      setDataLoading(false);
    }
  };

  return (
    <>
    {/* For Mobile Screen */}
<MobileResponsiveMessage/>

{/* For Desktop Screen  */}
    <div className="hidden md:block pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14 ">
      {/* <div className="flex flex-row justify-between items-center mb-6">
            <Tooltip
            showArrow
            content={
              <div className="font-poppins">
                Find all the current, upcoming, and past office hours hosted by
                different DAOs, and easily search them by using Title or Host
                Address.
              </div>
            }
            placement="right"
            className="rounded-md bg-opacity-90 max-w-96"
            closeDelay={1}>
            <div className="text-blue-shade-200 font-medium text-3xl md:text-4xl font-quanty ">
              Office Hours
            </div>
            </Tooltip>
          <ConnectWalletWithENS />
        </div> */}
        <Heading/>

      {showComingSoon && (
        <div className="flex items-center w-fit bg-yellow-100 border border-yellow-400 rounded-full px-3 py-1 font-poppins">
          <p className="text-sm text-yellow-700 mr-2">
            Office hours are currently being developed. In the meantime, please
            enjoy our 1:1 sessions.
          </p>
          <button
            onClick={() => setShowComingSoon(false)}
            className="text-yellow-700 hover:text-yellow-800 ps-3">
            <RxCross2 size={18} />
          </button>
        </div>
      )}

      <div className="pr-32 pt-4 font-poppins">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=ongoing")}>
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=upcoming")}>
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=recorded")}>
            Recorded
          </button>
        </div>

        {/* <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-1/3 rounded-full my-8 font-poppins">
          <input
            type="text"
            placeholder="Search by title or host address"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none w-full py-2"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}></input>
          <span className="flex items-center bg-black rounded-full px-6 py-2">
            <Image src={search} alt="search" width={22} />
          </span>
        </div> */}

        <div
          className={`flex items-center my-8 rounded-full shadow-lg bg-gray-100 text-black cursor-pointer w-[300px] xs:w-[365px]`}
        >
          <CiSearch
            className={`text-base transition-all duration-700 ease-in-out ml-3`}
          />
          <input
            type="text"
            placeholder="Search by title or host address"
            className="w-[100%] pl-2 pr-4 py-1.5 font-poppins md:py-2 text-sm bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="py-5">
          {searchParams.get("hours") === "ongoing" &&
            (dataLoading ? (
              <SessionTileSkeletonLoader />
            ) : (
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Ongoing"
                isOfficeHour={true}
              />
            ))}
          {searchParams.get("hours") === "upcoming" &&
            (dataLoading ? (
              <SessionTileSkeletonLoader />
            ) : (
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Upcoming"
                isOfficeHour={true}
              />
            ))}
          {searchParams.get("hours") === "recorded" &&
            (dataLoading ? (
              <SessionTileSkeletonLoader />
            ) : (
              <Tile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Recorded"
                isOfficeHour={true}
              />
            ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default DaoOfficeHours;
