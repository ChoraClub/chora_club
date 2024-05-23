"use client";
import React, { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { FaPencil } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useNetwork, useAccount } from "wagmi";

function AvailableUserSessions() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [data, setData] = useState([]);
  const [daoName, setDaoName] = useState<string>("");
  const [dataLoading, setDataLoading] = useState<Boolean>();

  useEffect(() => {
    if (address && isConnected) {
      if (chain?.name === "Optimism") {
        setDaoName("optimism");
      } else if (chain?.name === "Arbitrum One") {
        setDaoName("arbitrum");
      }
    }
    console.log("daoName", daoName);
  }, [chain, address, isConnected]);

  useEffect(() => {
    const fetchData = async () => {
      if (!daoName) return;
      setDataLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          dao_name: daoName,
          userAddress: address,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        const response = await fetch("/api/get-availability", requestOptions);
        const result = await response.json();
        console.log("result", result);
        if (result.success) {
          setData(result.data);
          setDataLoading(false);
        }
      } catch (error) {
        console.error(error);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [daoName, address]);

  return (
    <div
      style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
      className="max-w-xl mt-2 p-8 bg-white rounded-2xl h-fit"
    >
      <h1 className="text-black font-semibold text-2xl">
        Your Scheduled Availability
      </h1>
      {dataLoading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <>
          {data.some((item: any) => item.timeSlotSizeMinutes === 15) && (
            <TimeSlotTable
              title="15 Minutes"
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 15)}
            />
          )}
          {data.some((item: any) => item.timeSlotSizeMinutes === 30) && (
            <TimeSlotTable
              title="30 Minutes"
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 30)}
            />
          )}
          {data.some((item: any) => item.timeSlotSizeMinutes === 45) && (
            <TimeSlotTable
              title="45 Minutes"
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 45)}
            />
          )}
        </>
      ) : (
        <p className="mt-5">No Scheduled Available Time</p>
      )}
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
  );
}

export default AvailableUserSessions;

let dateAndRanges: any = [];
let allowedDates: any = [];
let data: any = [];

if (data) {
  // console.log("APIData", APIData)
  data.forEach((item: any) => {
    // console.log("item", item)
    dateAndRanges.push(...item.dateAndRanges);
    allowedDates.push(...item.allowedDates);
  });

  dateAndRanges.forEach((range: any) => {
    range.date = new Date(range.date);
    range.formattedUTCTime_startTime = new Date(
      range.formattedUTCTime_startTime
    );
    range.formattedUTCTime_endTime = new Date(range.formattedUTCTime_endTime);

    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const formattedStartTime =
      range.formattedUTCTime_startTime.toLocaleTimeString(
        undefined,
        timeOptions
      );
    const formattedEndTime = range.formattedUTCTime_endTime.toLocaleTimeString(
      undefined,
      timeOptions
    );

    range.utcTime_startTime = formattedStartTime;
    range.utcTime_endTime = formattedEndTime;

    const [startHourTime, startMinuteTime] = formattedStartTime.split(":");
    const [endHourTime, endMinuteTime] = formattedEndTime.split(":");

    range.timeRanges = [
      [startHourTime, startMinuteTime, endHourTime, endMinuteTime],
    ];
  });

  allowedDates = [
    ...new Set(
      dateAndRanges.flatMap(
        ({ formattedUTCTime_startTime, formattedUTCTime_endTime }: any) => [
          formattedUTCTime_startTime,
          formattedUTCTime_endTime,
        ]
      )
    ),
  ];
}

function TimeSlotTable({ title, data }: { title: any; data: any }) {
  const handleButtonClick = () => {
    toast("Coming soon 🚀");
  };

  console.log("data:::", data);

  const convertUTCToLocalDate = (dateString: any) => {
    const date: any = new Date(dateString);
    console.log("date:--", date);
    let newDate = date.toLocaleDateString();
    if (newDate.length !== 10 || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      newDate = `${year}-${month}-${day}`;
    }
    console.log("newDate:--", newDate);

    return newDate;
  };

  const convertUTCToLocalTime = (dateString: any, timeArray: any) => {
    const [hourStart, minuteStart, hourEnd, minuteEnd] = timeArray;

    const startDate = new Date(
      `${dateString}T${hourStart.padStart(2, "0")}:${minuteStart.padStart(
        2,
        "0"
      )}:00Z`
    );
    const endDate = new Date(
      `${dateString}T${hourEnd.padStart(2, "0")}:${minuteEnd.padStart(
        2,
        "0"
      )}:00Z`
    );

    const options: any = { hour: "2-digit", minute: "2-digit" };
    const localStartTime = new Intl.DateTimeFormat([], options).format(
      startDate
    );
    const localEndTime = new Intl.DateTimeFormat([], options).format(endDate);

    return `${localStartTime} to ${localEndTime}`;
  };

  return (
    <>
      <p className="text-gray-700 font-semibold my-2">{title}:</p>
      <table className="w-full table-auto text-sm">
        <tbody>
          {data.map((item: any, index: number) =>
            item.dateAndRanges.map((dateRange: any, subIndex: number) =>
              dateRange.timeRanges.map((timeRange: any, timeIndex: number) => (
                <tr
                  key={`${index}-${subIndex}-${timeIndex}`}
                  className={`${
                    (index + subIndex + timeIndex) % 2 === 0
                      ? "bg-[#D9D9D945]"
                      : "bg-white"
                  } row`}
                >
                  {/* <td className="px-4 py-2">{index + 1}.</td> */}
                  <td className="px-4 py-2">
                    {convertUTCToLocalDate(dateRange.date)}
                  </td>
                  <td className="px-4 py-2">
                    {convertUTCToLocalTime(dateRange.date, timeRange)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="buttons inline-flex">
                      <button
                        className="mr-2 cursor-pointer"
                        onClick={handleButtonClick}
                      >
                        <FaPencil className="text-blue-600" />
                      </button>
                      <button
                        className="cursor-pointer"
                        onClick={handleButtonClick}
                      >
                        <ImBin className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </>
  );
}
