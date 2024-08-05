import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import text1 from "@/assets/images/daos/texture1.png";
import Tile from "../ComponentUtils/Tile";
import { Oval } from "react-loader-spinner";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";
import {useAccount} from "wagmi";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}
interface Session {
  _id: string;
  host_address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  meeting_status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  dao_name: string;
  attendees: any[];
}

function DelegateOfficeHrs({ props }: { props: Type }) {
  const [activeSection, setActiveSection] = useState("ongoing");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const {address}=useAccount();

  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const dao_name = props.daoDelegates;
  // props.daoDelegates.charAt(0).toUpperCase() + props.daoDelegates.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

        const raw = JSON.stringify({
          address: props.individualDelegate,
        });

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        const response = await fetch(
          "/api/get-officehours-address",
          requestOptions
        );
        const result = await response.json();
        console.log(result);

        //api for individual attendees
        const rawData = JSON.stringify({
          attendee_address: props.individualDelegate,
        });

        const requestOption: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: rawData,
        };

        const responseData = await fetch(
          "/api/get-attendee-individual",
          requestOption
        );
        const resultData = await responseData.json();
        console.log(resultData);

        if (
          searchParams.get("hours") === "ongoing" ||
          searchParams.get("hours") === "upcoming" ||
          searchParams.get("hours") === "hosted"
        ) {
          const filteredSessions = result.filter((session: Session) => {
            if (searchParams.get("hours") === "ongoing") {
              return session.meeting_status === "ongoing";
            } else if (searchParams.get("hours") === "upcoming") {
              return session.meeting_status === "active";
            } else if (searchParams.get("hours") === "hosted") {
              return session.meeting_status === "inactive";
            }
          });
          setSessionDetails(filteredSessions);
          setDataLoading(false);
        } else if (searchParams.get("hours") === "attended") {
          const filteredSessions = resultData.filter((session: Session) => {
            return session.attendees.some(
              (attendee: any) =>
                attendee.attendee_address === props.individualDelegate
            );
          });
          setSessionDetails(filteredSessions);
          setDataLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchParams.get("hours")]); // Re-fetch data when filter changes

  useEffect(() => {
    // Set initial session details
    setSessionDetails([]);
    // setDataLoading(true);
  }, [props]);

  return (
    <div>
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
            }>
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
            }>
            Upcoming
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "hosted"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=hosted")
            }>
            Hosted
          </button>
          <button
            className={`py-2 ${
              searchParams.get("hours") === "attended"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=attended")
            }>
            Attended
          </button>
        </div>

        <div className="py-10">
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
          {searchParams.get("hours") === "hosted" &&
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
          {searchParams.get("hours") === "attended" &&
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
  );
}

export default DelegateOfficeHrs;
