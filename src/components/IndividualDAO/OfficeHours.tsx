import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tile from "../utils/Tile";
import { Oval } from "react-loader-spinner";

interface Session {
  _id: string;
  address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  chain_name: string;
}

function OfficeHours({ props }: { props: string }) {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const dao_name = props.charAt(0).toUpperCase() + props.slice(1);

  const [sessionDetails, setSessionDetails] = useState([]);
  const [tempDetails, setTempDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          chain_name: dao_name,
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

        // Filter sessions based on status
        const filteredSessions = result.filter((session: Session) => {
          if (searchParams.get("hours") === "ongoing") {
            return session.status === "ongoing";
          } else if (searchParams.get("hours") === "upcoming") {
            return session.status === "active";
          } else if (searchParams.get("hours") === "recorded") {
            return session.status === "inactive";
          }
        });
        setSearchQuery("");
        setSessionDetails(filteredSessions);
        setTempDetails(filteredSessions);
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
  }, [props]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 0) {
      setDataLoading(true);
      const raw = JSON.stringify({
        dao_name: dao_name,
      });

      const requestOptions: any = {
        method: "POST",
        body: raw,
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
            return session.status === "ongoing";
          } else if (searchParams.get("hours") === "upcoming") {
            return session.status === "active";
          } else if (searchParams.get("hours") === "recorded") {
            return session.status === "inactive";
          }
        });
        console.log("filtered: ", filtered);
        setSessionDetails(filtered);
        setDataLoading(false);
      }
    } else {
      setSessionDetails(tempDetails);
      setDataLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{ background: "rgba(238, 237, 237, 0.36)" }}
        className="flex border-[0.5px] border-black w-fit rounded-full my-4 font-poppins"
      >
        <input
          type="text"
          placeholder="Search"
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="pl-5 rounded-full outline-none"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        ></input>
        <span className="flex items-center bg-black rounded-full px-5 py-2">
          <Image src={search} alt="search" width={20} />
        </span>
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
              <div>
                <Tile
                  sessionDetails={sessionDetails}
                  dataLoading={dataLoading}
                  isEvent="Recorded"
                  isOfficeHour={true}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default OfficeHours;
