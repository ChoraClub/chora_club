import React, { useState, useEffect } from "react";
import UserScheduledHours from "./UserAllOfficeHrs/UserScheduledHours";
import UserRecordedHours from "./UserAllOfficeHrs/UserRecordedHours";
import UserUpcomingHours from "./UserAllOfficeHrs/UserUpcomingHours";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Tile from "../utils/Tile";
import { useNetwork, useAccount } from "wagmi";
import text1 from "@/assets/images/daos/texture1.png";
import { Oval } from "react-loader-spinner";

interface UserOfficeHoursProps {
  isDelegate: boolean | undefined;
  selfDelegate: boolean;
}

interface Session {
  _id: string;
  address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  status: "ongoing" | "active" | "inactive"; // Define the possible statuses
  chain_name: string;
  attendees: any[];
}

function UserOfficeHours({ isDelegate, selfDelegate }: UserOfficeHoursProps) {
  const { address } = useAccount();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { chain, chains } = useNetwork();

  const [sessionDetails, setSessionDetails] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

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
              return session.status === "ongoing" && chain?.name === "Optimism"
                ? session.chain_name === "Optimism"
                : chain?.name === "Arbitrum One"
                ? session.chain_name === "Arbitrum"
                : "";
            } else if (searchParams.get("hours") === "upcoming") {
              return session.status === "active" && chain?.name === "Optimism"
                ? session.chain_name === "Optimism"
                : chain?.name === "Arbitrum One"
                ? session.chain_name === "Arbitrum"
                : "";
            } else if (searchParams.get("hours") === "hosted") {
              return session.status === "inactive" && chain?.name === "Optimism"
                ? session.chain_name === "Optimism"
                : chain?.name === "Arbitrum One"
                ? session.chain_name === "Arbitrum"
                : "";
            }
          });
          setSessionDetails(filteredSessions);
        } else if (searchParams.get("hours") === "attended") {
          const filteredSessions = resultData.filter((session: Session) => {
            return session.attendees.some(
              (attendee: any) => attendee.attendee_address === address
            ) && chain?.name === "Optimism"
              ? session.chain_name === "Optimism"
              : chain?.name === "Arbitrum One"
              ? session.chain_name === "Arbitrum"
              : "";
          });
          setSessionDetails(filteredSessions);
        }

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
  }, [address]);

  return (
    <div>
      <div className="pt-3 pr-32">
        <div className="flex w-fit gap-14 border-1 border-[#7C7C7C] px-6 rounded-xl text-sm">
          {(selfDelegate === true || isDelegate === true) && (
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

          {(selfDelegate === true || isDelegate === true) && (
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
          {(selfDelegate === true || isDelegate === true) && (
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
          {searchParams.get("hours") === "schedule" && <UserScheduledHours />}
          {isDelegate === true && searchParams.get("hours") === "upcoming" && (
            <UserUpcomingHours />
          )}

          {searchParams.get("hours") === "hosted" &&
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
          {searchParams.get("hours") === "attended" &&
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

export default UserOfficeHours;
