"use client";
import React, { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { FaPencil } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useNetwork, useAccount } from "wagmi";

function AvailableUserSessions({ daoName }: { daoName: string }) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [data, setData] = useState([]);
  // const [daoName, setDaoName] = useState<string>("");
  const [dataLoading, setDataLoading] = useState<Boolean>();

  // useEffect(() => {
  //   if (address && isConnected) {
  //     if (chain?.name === "Optimism") {
  //       setDaoName("optimism");
  //     } else if (chain?.name === "Arbitrum One") {
  //       setDaoName("arbitrum");
  //     }
  //   }
  //   console.log("daoName", daoName);
  // }, [chain, address, isConnected]);

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
        setData(result.data);
        setDataLoading(false);
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

function TimeSlotTable({ title, data }: { title: any; data: any }) {
  const handleButtonClick = () => {
    toast("Coming soon 🚀");
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
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2">{dateRange.date}</td>
                  <td className="px-4 py-2">
                    {timeRange[0]}:{timeRange[1]} to {timeRange[2]}:
                    {timeRange[3]}
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
