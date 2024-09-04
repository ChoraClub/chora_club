"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Tile from "../ComponentUtils/Tile";
import SessionTile from "../ComponentUtils/SessionTiles";
import { Oval } from "react-loader-spinner";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import AttestationModal from "../ComponentUtils/AttestationModal";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import { useAccount } from "wagmi";
import { RiErrorWarningLine } from "react-icons/ri";
import { TimeoutError } from "viem";
import { SessionInterface } from "@/types/MeetingTypes";
import { CiSearch } from "react-icons/ci";

function DelegatesSession({ props }: { props: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const dao_name = props;
  const [sessionDetails, setSessionDetails] = useState([]);
  const [tempSession, setTempSession] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify({
          dao_name: dao_name,
          address: "",
        }),
      };

      // console.log("propspropsprops", dao_name);

      const response = await fetch(`/api/get-dao-sessions`, requestOptions);
      const result = await response.json();
      const resultData = await result.data;
      console.log("resultData", resultData);
      if (Array.isArray(resultData)) {
        const filtered: any = resultData.filter((session: SessionInterface) => {
          if (searchParams.get("session") === "upcoming") {
            return session.meeting_status === "Upcoming";
          } else if (searchParams.get("session") === "recorded") {
            return session.meeting_status === "Recorded";
          }
        });
        setSearchQuery("");
        setSessionDetails(filtered);
        setTempSession(filtered);
        setDataLoading(false);
      } else {
        console.error("API response is not an array:", result);
      }
    } catch (error: any) {
      console.error("Error fetching data", error);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setError("Please check your internet connection and try again.");
      } else if (error.name === "TimeoutError") {
        setError(
          "The request is taking longer than expected. Please try again."
        );
      } else if (error.name === "SyntaxError") {
        setError(
          "We're having trouble processing the data. Please try again later."
        );
      } else {
        setError(
          "An unexpected error occurred. Please refresh the page and try again."
        );
      }
      setDataLoading(false);
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchParams.get("session")]);

  useEffect(() => {
    setSessionDetails([]);
  }, [props]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      setDataLoading(true);
      try {
        const raw = JSON.stringify({
          dao_name: dao_name,
        });

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const res = await fetch(`/api/search-session/${query}`, requestOptions);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        const resultData = await result.data;

        if (result.success) {
          const filtered: any = resultData.filter(
            (session: SessionInterface) => {
              if (searchParams.get("session") === "upcoming") {
                return session.meeting_status === "Upcoming";
              } else if (searchParams.get("session") === "recorded") {
                return session.meeting_status === "Recorded";
              }
              return false;
            }
          );
          console.log("filtered: ", filtered);
          setSessionDetails(filtered);
          setError(null);
        } else {
          throw new Error("API request was not successful");
        }
      } catch (error: any) {
        console.error("Error in handleSearchChange:", error);
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
          setError("Please check your internet connection and try again.");
        } else if (error.name === "TimeoutError") {
          setError(
            "The request is taking longer than expected. Please try again."
          );
        } else if (error.name === "SyntaxError") {
          setError(
            "We're having trouble processing the data. Please try again later."
          );
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setDataLoading(false);
      }
    } else {
      setSessionDetails(tempSession);
      setError(null);
      setDataLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchData();
    window.location.reload();
  };

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );

  return (
    <div className="font-poppins">
      {/* <div
        style={{ background: "rgba(238, 237, 237, 0.36)" }}
        className="flex border-[0.5px] border-black w-1/3 rounded-full my-4 font-poppins"
      >
        <input
          type="text"
          placeholder="Search by title and host address"
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="pl-5 rounded-full outline-none w-full"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        ></input>
        <span className="flex items-center bg-black rounded-full px-5 py-2">
          <Image src={search} alt="search" width={20} />
        </span>
      </div> */}
      <div
          className={`flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer my-4 w-[300px] xs:w-[365px]`}
        >
          <CiSearch
            className={`text-base transition-all duration-700 ease-in-out ml-3`}
          />
          <input
            type="text"
            placeholder="Search by title and host address"
            className="w-[100%] pl-2 pr-4 py-1.5 font-poppins md:py-2 text-sm bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

      <div className=" pt-3">
        <div className="flex w-fit gap-16 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
          <button
            className={`py-2 ${
              searchParams.get("session") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=recorded")
            }
          >
            Recorded
          </button>
        </div>

        <div className="">
          {searchParams.get("session") === "recorded" &&
            (dataLoading ? (
              <RecordedSessionsSkeletonLoader />
            ) : sessionDetails.length > 0 ? (
              <RecordedSessionsTile meetingData={sessionDetails} />
            ) : (
              <div className="flex flex-col justify-center items-center pt-10">
                <div className="text-5xl">☹️</div>
                <div className="pt-4 font-semibold text-lg">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : "Oops, no such result available!"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DelegatesSession;
