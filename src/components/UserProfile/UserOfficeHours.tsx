import React, { useState, useEffect } from "react";
import UserScheduledHours from "./UserAllOfficeHrs/UserScheduledHours";
import UserRecordedHours from "./UserAllOfficeHrs/UserRecordedHours";
import UserUpcomingHours from "./UserAllOfficeHrs/UserUpcomingHours";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Tile from "../ComponentUtils/Tile";
import { useAccount } from "wagmi";
import text1 from "@/assets/images/daos/texture1.png";
import { Oval } from "react-loader-spinner";
import { RxCross2 } from "react-icons/rx";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";

interface UserOfficeHoursProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
  daoName: string;
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

function UserOfficeHours({
  isDelegate,
  selfDelegate,
  daoName,
}: UserOfficeHoursProps) {
  const { address } = useAccount();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(true);

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
          address: address,
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
          attendee_address: address,
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
              return (
                session.meeting_status === "ongoing" &&
                session.dao_name === daoName
              );
            } else if (searchParams.get("hours") === "upcoming") {
              return (
                session.meeting_status === "active" &&
                session.dao_name === daoName
              );
            } else if (searchParams.get("hours") === "hosted") {
              return (
                session.meeting_status === "inactive" &&
                session.dao_name === daoName
              );
            }
          });
          setSessionDetails(filteredSessions);
        } else if (searchParams.get("hours") === "attended") {
          const filteredSessions = resultData.filter((session: Session) => {
            return (
              session.attendees.some(
                (attendee: any) => attendee.attendee_address === address
              ) && session.dao_name === daoName
            );
          });
          setSessionDetails(filteredSessions);
        }

        setDataLoading(false);
      } catch (error) {
        console.error(error);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [searchParams.get("hours")]); // Re-fetch data when filter changes

  useEffect(() => {
    // Set initial session details
    setSessionDetails([]);
    setDataLoading(true);
  }, [address]);

  useEffect(() => {
    if (!selfDelegate && searchParams.get("hours") === "schedule") {
      router.replace(path + "?active=officeHours&hours=attended");
    }
  }, [isDelegate, selfDelegate, searchParams.get("hours")]);

  return (
    <div>
      {showComingSoon && (
        <div className="flex items-center w-fit bg-yellow-100 border border-yellow-400 rounded-full px-3 py-1 font-poppins">
          <p className="text-sm text-yellow-700 mr-2">
            Office hours are currently being developed. In the meantime, please
            enjoy our 1:1 sessions.
          </p>
          <button
            onClick={() => setShowComingSoon(false)}
            className="text-yellow-700 hover:text-yellow-800 ps-3"
          >
            <RxCross2 size={18} />
          </button>
        </div>
      )}
      <div className="pt-3">
        <div className="flex w-fit gap-14 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
          {selfDelegate === true && (
            <button
              className={`py-2  ${
                searchParams.get("hours") === "schedule"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() =>
                router.push(path + "?active=officeHours&hours=schedule")
              }
            >
              Schedule
            </button>
          )}

          {selfDelegate === true && (
            <button
              className={`py-2  ${
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
          )}
          {selfDelegate === true && (
            <button
              className={`py-2 ${
                searchParams.get("hours") === "hosted"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() =>
                router.push(path + "?active=officeHours&hours=hosted")
              }
            >
              Hosted
            </button>
          )}
          <button
            className={`py-2 ${
              searchParams.get("hours") === "attended"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=officeHours&hours=attended")
            }
          >
            Attended
          </button>
        </div>

        <div className="py-10">
          {selfDelegate === true &&
            searchParams.get("hours") === "schedule" && (
              <UserScheduledHours daoName={daoName} />
            )}
          {selfDelegate === true &&
            searchParams.get("hours") === "upcoming" && <UserUpcomingHours />}

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

export default UserOfficeHours;
