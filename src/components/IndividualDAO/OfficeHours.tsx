import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Tile from "../ComponentUtils/Tile";
import { Oval } from "react-loader-spinner";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import { headers } from "next/headers";
import { useAccount } from "wagmi";
import { CiSearch } from "react-icons/ci";

interface Session {
  _id: string;
  host_address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  meeting_status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  dao_name: string;
}

function OfficeHours({ props }: { props: string }) {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const dao_name = props;
  const { address } = useAccount();
  // const dao_name = props.charAt(0).toUpperCase() + props.slice(1);

  const [sessionDetails, setSessionDetails] = useState([]);
  const [tempDetails, setTempDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        dao_name: dao_name,
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
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
      setSearchQuery("");
      setSessionDetails(filteredSessions);
      setTempDetails(filteredSessions);
      setError(null);
    } catch (error: any) {
      console.error(error);
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
          "Unable to load office hours. Please try again in a few moments."
        );
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams.get("hours")]); // Re-fetch data when filter changes

  useEffect(() => {
    // Set initial session details
    setSessionDetails([]);
  }, [props]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    setDataLoading(true);
    setNoResults(false);

    try {
      if (query.length > 0) {
        setDataLoading(true);
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
        const res = await fetch(
          `/api/search-officehours/${query}`,
          requestOptions
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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
          setNoResults(filtered.length === 0);
          setError(null);
        }
      } else {
        setSessionDetails(tempDetails);
        setNoResults(tempDetails.length === 0);
        setError(null);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setError("Please check your internet connection and try again.");
      } else if (error.name === "TimeoutError") {
        setError(
          "The search request is taking longer than expected. Please try again."
        );
      } else if (error.name === "SyntaxError") {
        setError(
          "We're having trouble processing the search data. Please try again later."
        );
      } else {
        setError(
          `Unable to perform search for "${query}". Please try again in a few moments.`
        );
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
    fetchData();
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div>
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
          className={`flex items-center rounded-full shadow-lg my-4 bg-gray-100 text-black cursor-pointer w-[300px] xs:w-[365px]`}
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

      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              searchParams.get("hours") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=ongoing")
            }
          >
            Ongoing
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=upcoming")
            }
          >
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "recorded"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=recorded")
            }
          >
            Recorded
          </button>
        </div>

        <div className="py-10">
          {noResults ? (
            <div className="flex flex-col justify-center items-center pt-10">
              <div className="text-5xl">☹️</div>
              <div className="pt-4 font-semibold text-lg">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : "Oops, no such result available!"}
              </div>
            </div>
          ) : (
            <>
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
                  <div>
                    <Tile
                      sessionDetails={sessionDetails}
                      dataLoading={dataLoading}
                      isEvent="Recorded"
                      isOfficeHour={true}
                    />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfficeHours;
