"use client";

import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useAccount, useNetwork } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import SchedulingSuccessModal from "./SchedulingSuccessModal";

interface dataToStore {
  userAddress: `0x${string}` | undefined | null;
  timeSlotSizeMinutes: number;
  allowedDates: any;
  dateAndRanges: any;
  dao_name: string;
}

function ScheduledUserSessions() {
  const { address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(15);
  const [selectedDate, setSelectedDate] = useState<any>("");
  const [dateAndRanges, setDateAndRanges] = useState<any>([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allowedDates, setAllowedDates] = useState<any>([]);
  const [daoName, setDaoName] = useState("");
  const { chain, chains } = useNetwork();
  const [utcStartTime, setUtcStartTime] = useState("");
  const [utcEndTime, setUtcEndTime] = useState("");

  const [allData, setAllData] = useState<any>([]);
  const [createSessionLoading, setCreateSessionLoading] = useState<any>();

  const [startTimeOptions, setStartTimeOptions] = useState([]);
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<dataToStore>();

  const handleApplyWithCheck = () => {
    if (allData.length > 0) {
      handleApplyButtonClick();
    } else {
      toast.error("Please select at least one date before applying.");
    }
  };

  const handleApplyButtonClick = async () => {
    console.log("handleApplyButton call");

    const dataToStore: dataToStore = {
      userAddress: address,
      timeSlotSizeMinutes: timeSlotSizeMinutes,
      allowedDates: allowedDates,
      dateAndRanges: dateAndRanges,
      dao_name: daoName,
    };
    setModalData(dataToStore);

    console.log("dataToStore", dataToStore);
    const requestOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToStore),
      redirect: "follow",
    };

    try {
      console.log("calling.......");
      setCreateSessionLoading(true);
      const response = await fetch("/api/store-availability", requestOptions);
      const result = await response.json();
      console.log(result);
      // toast.success("Successfully scheduled your sessions.");
      setModalOpen(true);
      setCreateSessionLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error in scheduling your sessions.");
      setCreateSessionLoading(false);
    }
    setAllData([]);
  };

  const getUTCTime = async (
    selectedDate: any,
    startHour: any,
    startMinute: any,
    endHour: any,
    endMinute: any
  ) => {
    const combinedDateTimeString_startTime = `${selectedDate} ${startHour}:${startMinute}:00`;
    const localDateTime_startTime = new Date(combinedDateTimeString_startTime);

    const utcDateTime_startTime = localDateTime_startTime.toUTCString();
    const formattedUTCTime_startTime = utcDateTime_startTime
      .toLocaleString
      // "en-US",
      // { timeZone: "UTC" }
      ();
    console.log("formattedUTCTime_startTime", formattedUTCTime_startTime);

    const utcFromFormatTime_startTime = DateTime.fromFormat(
      formattedUTCTime_startTime,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
    );
    const utcTime_startTime = utcFromFormatTime_startTime.toFormat("HH:mm");
    setUtcStartTime(utcTime_startTime);
    const [startHourTime, startMinuteTime] = utcTime_startTime.split(":");
    //----------------------------------------------------------------//
    const combinedDateTimeString_endTime = `${selectedDate} ${endHour}:${endMinute}:00`;
    const localDateTime_endTime = new Date(combinedDateTimeString_endTime);

    const utcDateTime_endTime = localDateTime_endTime.toUTCString();

    const formattedUTCTime_endTime = utcDateTime_endTime
      .toLocaleString
      // "en-US",
      // { timeZone: "UTC" }
      ();
    console.log("formattedUTCTime_endTime", formattedUTCTime_endTime);

    const utcFromFormatTime_endTime = DateTime.fromFormat(
      formattedUTCTime_endTime,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
    );
    const utcTime_endTime = utcFromFormatTime_endTime.toFormat("HH:mm");
    setUtcEndTime(utcTime_endTime);
    const [endHourTime, endMinuteTime] = utcTime_endTime.split(":");

    const result = {
      formattedUTCTime_startTime,
      utcTime_startTime,
      startHourTime,
      startMinuteTime,
      formattedUTCTime_endTime,
      utcTime_endTime,
      endHourTime,
      endMinuteTime,
    };
    return result;
  };

  // const handleRemoveDate = (dateToRemove: any, timeRanges: any) => {
  //   console.log("dateToRemove", dateToRemove);
  //   console.log("timeRanges", timeRanges);
  //   const updatedDates = allData.filter(
  //     (item: any) => item.date !== dateToRemove
  //   );
  //   setAllData(updatedDates);
  //   const updatedDateAndRanges = dateAndRanges.filter(
  //     (item: any) => item.date !== dateToRemove
  //   );
  //   setDateAndRanges(updatedDateAndRanges);

  //   const updatedAllowedDates = allowedDates.filter(
  //     (date: any) => date !== dateToRemove
  //   );
  //   setAllowedDates(updatedAllowedDates);
  // };

  const handleRemoveDate = (
    dateToRemove: string,
    timeRangesToRemove: any[]
  ) => {
    const indexToRemove = allData.findIndex(
      (item: any) =>
        item.date === dateToRemove &&
        JSON.stringify(item.timeRanges) === JSON.stringify(timeRangesToRemove)
    );

    if (indexToRemove !== -1) {
      const updatedDates = [...allData];
      updatedDates.splice(indexToRemove, 1);
      setAllData(updatedDates);

      const updatedDateAndRanges = [...dateAndRanges];
      updatedDateAndRanges.splice(indexToRemove, 1);
      setDateAndRanges(updatedDateAndRanges);

      const updatedAllowedDates = [...allowedDates];
      updatedAllowedDates.splice(indexToRemove, 1);
      setAllowedDates(updatedAllowedDates);
    }
  };

  const handleAddSelectedDate = async () => {
    if (!selectedDate || !startHour || !startMinute || !endHour || !endMinute) {
      toast.error("Please select a date and time ranges before adding.");
      return;
    }

    const newAllData = {
      date: selectedDate,
      timeRanges: [[startHour, startMinute, endHour, endMinute]],
    };

    setAllData((prevAllData: any) => [...prevAllData, newAllData]);
    const result = await getUTCTime(
      selectedDate,
      startHour,
      startMinute,
      endHour,
      endMinute
    );

    const newDateAndRange = {
      date: selectedDate,
      timeRanges: [
        [
          result.startHourTime,
          result.startMinuteTime,
          result.endHourTime,
          result.endMinuteTime,
        ],
      ],
      formattedUTCTime_startTime: result.formattedUTCTime_startTime,
      utcTime_startTime: result.utcTime_startTime,
      formattedUTCTime_endTime: result.formattedUTCTime_endTime,
      utcTime_endTime: result.utcTime_endTime,
    };

    setDateAndRanges((prevDateAndRanges: any) => [
      ...prevDateAndRanges,
      newDateAndRange,
    ]);
    setAllowedDates([...allowedDates, selectedDate]);
    setSelectedDate("");
    setStartHour("");
    setStartMinute("");
    setEndHour("");
    setEndMinute("");
    setStartTime("");
    setEndTime("");
    setSelectedStartTime("");
    setSelectedEndTime("");
  };

  useEffect(() => {
    // Function to generate time options based on time slot size
    const generateTimeOptions = () => {
      const timeOptions: any = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += timeSlotSizeMinutes) {
          const formattedHour = hour.toString().padStart(2, "0");
          const formattedMinute = minute.toString().padStart(2, "0");
          timeOptions.push(`${formattedHour}:${formattedMinute}`);
        }
      }
      return timeOptions;
    };

    // Update time options when time slot size changes
    const timeOptions = generateTimeOptions();
    setStartTimeOptions(timeOptions);
    setEndTimeOptions(timeOptions);
  }, [timeSlotSizeMinutes]);

  const handleStartTimeChange = (e: any) => {
    setSelectedStartTime(e.target.value);
    console.log(e.target.value);
    const [hour, minute] = e.target.value.split(":");
    console.log(hour + ":" + minute);
    setStartHour(hour);
    setStartMinute(minute);
  };

  const handleEndTimeChange = (e: any) => {
    setSelectedEndTime(e.target.value);
    const [hour, minute] = e.target.value.split(":");
    console.log(hour + ":" + minute);
    setEndHour(hour);
    setEndMinute(minute);
  };

  const currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString();
  if (
    formattedDate.length !== 10 ||
    !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
  }

  // console.log("formattedDate", formattedDate);

  // console.log("currentDate", currentDate);

  const handleModalClose = () => {
    console.log("Popup Closed");
    setModalOpen(false);
  };

  useEffect(() => {
    if (chain && chain?.name === "Optimism") {
      setDaoName("optimism");
    } else if (chain && chain?.name === "Arbitrum One") {
      setDaoName("arbitrum");
    }
  }, [chain, chain?.name]);

  return (
    <>
      <div
        style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
        className="max-w-lg mx-auto mt-2 p-8 bg-white rounded-2xl"
      >
        <div className="mb-4">
          <label className="text-gray-700 font-semibold flex items-center">
            Select DAO Name:
            <Tooltip
              showArrow
              content={
                <div className="font-poppins">
                  DAO for which the session is to be created. The attestations
                  will be issued for the selected DAO. The attendees of this
                  session will seek questions related to the selected DAO.
                </div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <span className="px-2 justify-end">
                <FaCircleInfo className="cursor-pointer" />
              </span>
            </Tooltip>
          </label>
          <div
            // value={daoName}
            // onChange={(e) => setDaoName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full capitalize"
          >
            {daoName}
            {/* <option value="optimism">Optimism</option>
            <option value="arbitrum">Arbitrum</option> */}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold flex items-center">
            Select Time Slot Size:
            <Tooltip
              showArrow
              content={
                <div className="font-poppins">
                  The duration for which you would be able to take the session.
                  The preferred duration is 30 minutes. And note that the
                  selected time slot size will apply to all the selected dates
                  of your sessions.
                </div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <span className="px-2 justify-end">
                <FaCircleInfo className="cursor-pointer" />
              </span>
            </Tooltip>
          </label>
          <select
            value={timeSlotSizeMinutes}
            onChange={(e) => setTimeSlotSizeMinutes(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold flex items-center">
            Select Date:
            <Tooltip
              showArrow
              content={
                <div className="font-poppins">
                  It is based on your timezone.
                </div>
              }
              placement="right"
              className="rounded-md bg-opacity-90"
              closeDelay={1}
            >
              <span className="px-2 justify-end">
                <FaCircleInfo className="cursor-pointer" />
              </span>
            </Tooltip>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
            min={formattedDate}
          />
        </div>

        <div className="flex flex-col mb-4">
          <div className="">
            <label className="text-gray-700 font-semibold flex items-center">
              Select Available Time:
              <Tooltip
                showArrow
                content={
                  <div className="font-poppins">
                    Session start time and end time based on your timezone.
                  </div>
                }
                placement="right"
                className="rounded-md bg-opacity-90"
                closeDelay={1}
              >
                <span className="px-2 justify-end">
                  <FaCircleInfo className="cursor-pointer" />
                </span>
              </Tooltip>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 mt-1">Start Time</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
                value={selectedStartTime}
                onChange={(e) => handleStartTimeChange(e)}
              >
                {startTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-500 mt-1">End Time</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
                value={selectedEndTime}
                onChange={(e) => handleEndTimeChange(e)}
              >
                {endTimeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddSelectedDate}
          className="bg-blue-shade-100 hover:bg-blue-shade-200 text-white font-bold py-2 px-4 rounded"
        >
          Add Session
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Selected Dates for Session:
          </h3>
          <ul>
            {allData.map((item: any, index: any) => (
              <li key={index} className="mb-1">
                <span className="font-semibold">{index + 1}.</span> {item.date}{" "}
                -{" "}
                {item.timeRanges
                  .map((time: any) => {
                    const [startHour, startMinute, endHour, endMinute] = time;
                    return `${startHour}:${startMinute} to ${endHour}:${endMinute}`;
                  })
                  .join(", ")}
                <button
                  disabled={createSessionLoading}
                  onClick={() => handleRemoveDate(item.date, item.timeRanges)}
                  className="text-red-600 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => handleApplyWithCheck()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-[160px]"
          disabled={createSessionLoading}
        >
          {createSessionLoading ? (
            <div className="flex items-center justify-center">
              <Oval
                visible={true}
                height="28"
                width="28"
                color="#2A5D30"
                secondaryColor="#cdccff"
                ariaLabel="oval-loading"
              />
            </div>
          ) : (
            <>Create Session</>
          )}
        </button>

        <Toaster
          toastOptions={{
            style: {
              fontSize: "14px",
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px",
            },
          }}
        />
      </div>
      {modalOpen && (
        <SchedulingSuccessModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          data={modalData}
        />
      )}
    </>
  );
}

export default ScheduledUserSessions;
