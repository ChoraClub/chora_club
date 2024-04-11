"use client";

import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import { StaticImageData } from "next/image";
import Tile from "../utils/Tile";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Oval } from "react-loader-spinner";

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

        const response = await fetch(
          "/api/get-specific-officehours",
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

      const requestOptions: any = {
        method: "POST",
        body: JSON.stringify({
          dao_name: null,
        }),
        redirect: "follow",
      };
      const res = await fetch(
        `/api/search-officehours/${query}`,
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
    <div className="pt-6 pl-14 pr-6">
      <div className="flex justify-between pe-10">
        <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
          Office Hours
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>

      <div className="pr-32 pt-4 font-poppins">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() => router.push(path + "?hours=recorded")}
          >
            Recorded
          </button>
        </div>

        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-fit rounded-full my-8 font-poppins"
        >
          <input
            type="text"
            placeholder="Search by title "
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div>

        <div className="py-5">
          {searchParams.get("hours") === "ongoing" &&
            (dataLoading ? (
              <div className="flex items-center justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
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
              <div className="flex items-center justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
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
              <div className="flex items-center justify-center">
                <Oval
                  visible={true}
                  height="40"
                  width="40"
                  color="#0500FF"
                  secondaryColor="#cdccff"
                  ariaLabel="oval-loading"
                />
              </div>
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
  );
}

export default DaoOfficeHours;
