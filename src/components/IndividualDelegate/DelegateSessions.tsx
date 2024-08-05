import React, { useState, useEffect } from "react";
import Tile from "../ComponentUtils/Tile";
import BookSession from "./AllSessions/BookSession";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import text1 from "@/assets/images/daos/texture1.png";
import SessionTile from "../ComponentUtils/SessionTiles";
import { Oval } from "react-loader-spinner";
import SessionTileSkeletonLoader from "../SkeletonLoader/SessionTileSkeletonLoader";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};

interface Session {
  booking_status: string;
  dao_name: string;
  description: string;
  host_address: string;
  joined_status: string;
  meetingId: string;
  meeting_status: "Upcoming" | "Recorded" | "Denied" | "";
  slot_time: string;
  title: string;
  attendees: Attendee[];
  _id: string;
}

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function DelegateSessions({ props }: { props: Type }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [dataLoading, setDataLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState([]);
  const dao_name = props.daoDelegates;
  const [error, setError] = useState<string | null>(null);

  const getMeetingData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        dao_name: dao_name,
        address: props.individualDelegate,
      });
      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("/api/get-dao-sessions", requestOptions);
      const result = await response.json();
      console.log("result in get meetinggggg", result);

      if (result) {
        const resultData = await result.data;
        if (Array.isArray(resultData)) {
          let filteredData: any = resultData;
          if (searchParams.get("session") === "upcoming") {
            setDataLoading(true);
            filteredData = resultData.filter((session: Session) => {
              return session.meeting_status === "Upcoming";
            });
            console.log("upcoming filtered: ", filteredData);
            setSessionDetails(filteredData);
          } else if (searchParams.get("session") === "hosted") {
            setDataLoading(true);
            filteredData = resultData.filter((session: Session) => {
              return (
                session.meeting_status === "Recorded" &&
                session.host_address.toLowerCase() === props.individualDelegate
              );
            });
            console.log("hosted filtered: ", filteredData);
            setSessionDetails(filteredData);
          } else if (searchParams.get("session") === "attended") {
            setDataLoading(true);
            filteredData = resultData.filter((session: Session) => {
              return (
                session.meeting_status === "Recorded" &&
                session.attendees?.some(
                  (attendee) =>
                    attendee.attendee_address === props.individualDelegate
                )
              );
            });
            console.log("attended filtered: ", filteredData);
            setSessionDetails(filteredData);
          }
          setDataLoading(false);
        } else {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
      setDataLoading(false);
      setError("An unexpected error occurred. Please refresh the page and try again.");
    }
  };

  useEffect(() => {
    getMeetingData();
  }, [
    props.daoDelegates,
    props.individualDelegate,
    sessionDetails,
    searchParams.get("session"),
  ]);

  const handleRetry = () => {
    setError(null);
    getMeetingData();
    window.location.reload();
  };
  
  if (error) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <ErrorDisplay 
        message={error}
        onRetry={handleRetry}
      />
    </div>
  );

  return (
    <div>
      <div className="pr-36 pt-3">
        <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl text-sm">
          <button
            className={`py-2  ${
              searchParams.get("session") === "book"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=book")
            }
          >
            Book
          </button>
          {/* <button
            className={`py-2  ${
              searchParams.get("session") === "ongoing"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=ongoing")
            }
          >
            Ongoing
          </button> */}
          {/* <button
            className={`py-2 ${
              searchParams.get("session") === "upcoming"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=upcoming")
            }
          >
            Upcoming
          </button> */}
          <button
            className={`py-2 ${
              searchParams.get("session") === "hosted"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=hosted")
            }
          >
            Hosted
          </button>
          <button
            className={`py-2 ${
              searchParams.get("session") === "attended"
                ? "text-[#3E3D3D] font-bold"
                : "text-[#7C7C7C]"
            }`}
            onClick={() =>
              router.push(path + "?active=delegatesSession&session=attended")
            }
          >
            Attended
          </button>
        </div>

        <div className="py-10">
          {searchParams.get("session") === "book" && (
            <BookSession props={props} />
          )}
          {/* {searchParams.get("session") === "ongoing" && (
            <>
            <Tile sessionDetails={sessionDetails} dataLoading={dataLoading} isEvent="Ongoing" isOfficeHour={false} />
            </>
          )} */}
          {/* {searchParams.get("session") === "upcoming" &&
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
              <SessionTile
                sessionDetails={sessionDetails}
                dataLoading={dataLoading}
                isEvent="Upcoming"
                isOfficeHour={false}
                isSession=""
              />
            ))} */}
          {searchParams.get("session") === "hosted" &&
            (dataLoading ? (
              <RecordedSessionsSkeletonLoader />
            ) : sessionDetails.length === 0 ? (
              <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
            Oops, no such result available!
            </div>
            </div>
            ) : (
              // <SessionTile
              //   sessionDetails={sessionDetails}
              //   dataLoading={dataLoading}
              //   isEvent="Recorded"
              //   isOfficeHour={false}
              //   isSession=""
              // />
              <RecordedSessionsTile meetingData={sessionDetails}/>
            ))}
          {searchParams.get("session") === "attended" &&
            (dataLoading ? (
              <RecordedSessionsSkeletonLoader />
            ) : sessionDetails.length === 0 ? (
              <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
            Oops, no such result available!
            </div>
            </div>
            ) : (
              // <SessionTile
              //   sessionDetails={sessionDetails}
              //   dataLoading={dataLoading}
              //   isEvent="Recorded"
              //   isOfficeHour={false}
              //   isSession=""
              // />
              <RecordedSessionsTile meetingData={sessionDetails}/>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DelegateSessions;
