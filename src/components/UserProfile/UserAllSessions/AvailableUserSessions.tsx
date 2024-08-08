"use client";
import React, { useEffect, useState } from "react";
import { ImBin } from "react-icons/im";
import { FaPencilAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNetwork, useAccount } from "wagmi";
import { Grid } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

interface AvailableUserSessionsProps {
  daoName: string;
  scheduledSuccess: boolean | undefined;
  setScheduledSuccess: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  sessionCreated: boolean;
  setSessionCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

function AvailableUserSessions({
  daoName,
  scheduledSuccess,
  setScheduledSuccess,
  sessionCreated,
  setSessionCreated,
}: AvailableUserSessionsProps) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState<Boolean>(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!daoName) return;
      setDataLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

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
        if (result.success) {
          setData(result.data);
          setDataLoading(false);
          // setScheduledSuccess(false);
          setSessionCreated(false);
        }
      } catch (error) {
        console.error(error);
        setDataLoading(false);
        toast.error("Failed to fetch data.");
      }
    };
    fetchData();
  }, [
    daoName,
    address,
    scheduledSuccess === true,
    sessionCreated,
    updateTrigger,
  ]);

  return (
    // <div className="max-w-xl mt-2 p-8 bg-white rounded-2xl shadow-lg min-w-[34rem] min-h-[35rem]">
    <div className="">
      <h1 className="text-[#52648c] font-semibold 1.5lg:text-2xl text-xl mb-4 flex justify-center">
        Your Scheduled Availability
      </h1>
      {dataLoading ? (
        <div className="flex justify-center items-center">
          <Grid
            visible={true}
            height="40"
            width="40"
            color="#0E76FD"
            ariaLabel="grid-loading"
            radius="12.5"
          />
        </div>
      ) : data.length > 0 ? (
        <>
          {data.some((item: any) => item.timeSlotSizeMinutes === 15) && (
            <TimeSlotTable
              title="15 Minutes"
              slotSize={15}
              address={address}
              dao_name={daoName}
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 15)}
              setData={setData}
              triggerUpdate={() => setUpdateTrigger((prev) => prev + 1)}
            />
          )}
          {data.some((item: any) => item.timeSlotSizeMinutes === 30) && (
            <TimeSlotTable
              title="30 Minutes"
              slotSize={30}
              address={address}
              dao_name={daoName}
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 30)}
              setData={setData}
              triggerUpdate={() => setUpdateTrigger((prev) => prev + 1)}
            />
          )}
          {data.some((item: any) => item.timeSlotSizeMinutes === 45) && (
            <TimeSlotTable
              title="45 Minutes"
              slotSize={45}
              address={address}
              dao_name={daoName}
              data={data.filter((item: any) => item.timeSlotSizeMinutes === 45)}
              setData={setData}
              triggerUpdate={() => setUpdateTrigger((prev) => prev + 1)}
            />
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">
          No Scheduled Available Time
        </div>
      )}
      {/* <Toaster
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
      /> */}
    </div>
  );
}

export default AvailableUserSessions;

function TimeSlotTable({
  title,
  data,
  slotSize,
  address,
  dao_name,
  setData,
  triggerUpdate,
}: any) {
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handleButtonClick = () => {
    toast("Coming soon 🚀");
  };

  const handleDeleteButtonClick = async ({ date, startTime, endTime }: any) => {
    setDeleting(date);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        dao_name: dao_name,
        userAddress: address,
        timeSlotSizeMinutes: slotSize,
        date: date,
        startTime: startTime,
        endTime: endTime,
      });

      const requestOptions: any = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("/api/get-availability", requestOptions);
      const result = await response.json();
      if (result.success) {
        toast.success("Deleted successfully!");
        setData((prevData: any) =>
          prevData
            .map((item: any) => ({
              ...item,
              dateAndRanges: item.dateAndRanges.map((range: any) => ({
                ...range,
                timeRanges: range.timeRanges.filter(
                  (timeRange: any) =>
                    !(
                      timeRange.startTime === startTime &&
                      timeRange.endTime === endTime &&
                      // item.dateAndRanges.date === date
                      range.date === date
                    )
                ),
              })),
            }))
            .filter((item: any) =>
              item.dateAndRanges.some(
                (range: any) => range.timeRanges.length > 0
              )
            )
        );
      }
      triggerUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const convertUTCToLocalDate = (dateString: any) => {
    const date: any = new Date(dateString);
    let newDate = date.toLocaleDateString();
    if (newDate.length !== 10 || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      newDate = `${year}-${month}-${day}`;
    }
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
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((item: any, index: number) =>
            item.dateAndRanges.map((dateRange: any, subIndex: number) =>
              dateRange.timeRanges.map((timeRange: any, timeIndex: number) => (
                <motion.div
                  key={`${index}-${subIndex}-${timeIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {convertUTCToLocalDate(dateRange.date)}
                    </p>
                    <p>{convertUTCToLocalTime(dateRange.date, timeRange)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:text-blue-800"
                      onClick={handleButtonClick}>
                      <FaPencilAlt />
                    </button>
                    <button
                      className={`p-2 text-red-600 hover:text-red-800 ${
                        deleting === dateRange.date
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => {
                        handleDeleteButtonClick({
                          date: dateRange.date,
                          startTime: dateRange.utcTime_startTime,
                          endTime: dateRange.utcTime_endTime,
                        });
                      }}
                      disabled={deleting === dateRange.date}>
                      <ImBin />
                    </button>
                  </div>
                </motion.div>
              ))
            )
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
