"use client";

import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useAccount } from "wagmi";
import toast, { Toaster } from "react-hot-toast";

function ScheduledUserSessions() {
  const { address } = useAccount();
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
  const [daoName, setDaoName] = useState("optimism");

  const [utcStartTime, setUtcStartTime] = useState("");
  const [utcEndTime, setUtcEndTime] = useState("");

  const [allData, setAllData] = useState<any>([]);

  const handleApplyWithCheck = () => {
    if (allData.length > 0) {
      handleApplyButtonClick();
    } else {
      toast.error("Please select at least one date before applying.");
    }
  };

  const handleApplyButtonClick = async () => {
    console.log("handleApplyButton call");

    const dataToStore = {
      userAddress: address,
      timeSlotSizeMinutes: timeSlotSizeMinutes,
      allowedDates: allowedDates,
      dateAndRanges: dateAndRanges,
      dao_name: daoName,
    };

    console.log("dataToStore", dataToStore);
    const requestOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToStore),
      redirect: "follow",
    };

    try {
      console.log("calling.......");
      const response = await fetch("/api/store-availability", requestOptions);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
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

  const handleRemoveDate = (dateToRemove: any) => {
    const updatedDates = allData.filter(
      (item: any) => item.date !== dateToRemove
    );
    setAllData(updatedDates);
    const updatedDateAndRanges = dateAndRanges.filter(
      (item: any) => item.date !== dateToRemove
    );
    setDateAndRanges(updatedDateAndRanges);

    const updatedAllowedDates = allowedDates.filter(
      (date: any) => date !== dateToRemove
    );
    setAllowedDates(updatedAllowedDates);
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
  };
  return (
    <div className="max-w-lg mx-auto mt-2 p-8 bg-white rounded shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700">Select DAO Name:</label>
        <select
          value={daoName}
          onChange={(e) => setDaoName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
        >
          <option value="optimism">Optimism</option>
          <option value="arbitrum">Arbitrum</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Select Time Slot Size:</label>
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
        <label className="block text-gray-700">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Start Time:</label>
          <input
            type="time"
            value={`${startHour}:${startMinute}`}
            onChange={(e) => {
              const [hour, minute] = e.target.value.split(":");
              setStartHour(hour);
              setStartMinute(minute);
            }}
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Time:</label>
          <input
            type="time"
            value={`${endHour}:${endMinute}`}
            onChange={(e) => {
              const [hour, minute] = e.target.value.split(":");
              setEndHour(hour);
              setEndMinute(minute);
            }}
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-full"
          />
        </div>
        {/* <br></br> */}
        {/* <div>
          <b>Development in Progress🚀 </b>
        </div> */}
      </div>

      <button
        onClick={handleAddSelectedDate}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Add Date
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Selected Dates:</h3>
        <ul>
          {allData.map((item: any, index: any) => (
            <li key={index} className="mb-1">
              {item.date} -{" "}
              {item.timeRanges
                .map((time: any) => {
                  const [startHour, startMinute, endHour, endMinute] = time;
                  return `${startHour}:${startMinute} to ${endHour}:${endMinute}`;
                })
                .join(", ")}
              <button
                onClick={() => handleRemoveDate(item.date)}
                className="text-red-600 ml-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleApplyWithCheck}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Apply
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
  );
}

export default ScheduledUserSessions;
