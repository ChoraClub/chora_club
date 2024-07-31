"use client";

import React, { useState, useEffect, ReactEventHandler } from "react";
import { DateTime } from "luxon";
import { useAccount, useNetwork } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { FaChevronDown, FaCircleInfo, FaPlus } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import SchedulingSuccessModal from "./SchedulingSuccessModal";
import { RxCross2 } from "react-icons/rx";
import AddEmailModal from "@/components/ComponentUtils/AddEmailModal";

import Image from "next/image";

import AvailableUserSessions from "./AvailableUserSessions";
import styles from "./ScheduleUserSessions.module.css";
// import { Input } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { AbiEncodingLengthMismatchError } from "viem";
import { all } from "axios";
import { fetchEnsAvatar } from "@/utils/ENSUtils";

interface dataToStore {
  userAddress: `0x${string}` | undefined | null;
  timeSlotSizeMinutes: number;
  allowedDates: any;
  dateAndRanges: any;
  dao_name: string;
}

function ScheduledUserSessions({ daoName }: { daoName: string }) {
  const { address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const [timeSlotSizeMinutes, setTimeSlotSizeMinutes] = useState(30);
  const [selectedDate, setSelectedDate] = useState<any>("");
  const [dateAndRanges, setDateAndRanges] = useState<any>([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  const [allowedDates, setAllowedDates] = useState<any>([]);
  // const [daoName, setDaoName] = useState("");
  const { chain, chains } = useNetwork();
  const [utcStartTime, setUtcStartTime] = useState("");
  const [utcEndTime, setUtcEndTime] = useState("");
  const [allData, setAllData] = useState<any>([]);
  const [createSessionLoading, setCreateSessionLoading] = useState<any>();
  const [startTimeOptions, setStartTimeOptions] = useState([]);
  const [endTimeOptions, setEndTimeOptions] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [finalData, setFinalData] = useState<dataToStore>();

  const [mailId, setMailId] = useState<string>();
  const [hasEmailID, setHasEmailID] = useState<Boolean>();
  const [showGetMailModal, setShowGetMailModal] = useState<Boolean>();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [continueAPICalling, setContinueAPICalling] = useState<Boolean>(false);
  const [userRejected, setUserRejected] = useState<Boolean>();
  const [addingEmail, setAddingEmail] = useState<boolean>();
  const [scheduledSuccess, setScheduledSuccess] = useState<boolean>();
  const [sessionCreated, setSessionCreated] = useState(false);
  // const [numberOfSessions, setNumberOfSessions] = useState(0);
  // const [generatedTimeSlots, setGeneratedTimeSlots] = useState<
  //   Array<{ time: string; date: string }>
  // >([]);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [sessions, setSessions] = useState(0);
  const [startTime, setStartTime] = useState({
    hour: "12",
    minute: "00",
    ampm: "AM",
  });
  const [endTime, setEndTime] = useState({
    hour: "12",
    minute: "00",
    ampm: "AM",
  });

  const convertTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  useEffect(() => {
    if (selectedDate && startTime && endTime) {
      generateTimeSlots();
    }
  }, [selectedDate, startTime, endTime]);

  const handleTimeChange = (
    type: "start" | "end",
    field: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (type === "start") {
      setStartTime({ ...startTime, [field]: value });
    } else {
      setEndTime({ ...endTime, [field]: value });
    }
  };

  const generateTimeSlots = () => {
    const start = new Date(
      `${selectedDate} ${startTime.hour}:${startTime.minute} ${startTime.ampm}`
    );
    const end = new Date(
      `${selectedDate} ${endTime.hour}:${endTime.minute} ${endTime.ampm}`
    );

    console.log(startTime.hour, "s.t. hour");
    console.log(startTime.minute, "s.t. minute");
    console.log(endTime.hour, "e.t. hour");
    console.log(endTime.minute, "s.t. minute");

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    if (end > nextDay) {
      toast.error(
        "Oops! Your end time is on the next day.For multi-day scheduling, please add each day separately."
      );
      setTimeSlots([]);
      setSessions(0);
      return;
    }

    const slots = [];
    let current = new Date(start);

    while (current < end) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30);

      console.log(current, "current");
    }

    setTimeSlots(slots);
    setSessions(slots.length);
  };
  const [EnsName, setDisplayEnsName] = useState<string>();

  const checkUser = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        address: address,
        // daoName: daoName,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(`/api/profile/${address}`, requestOptions);
      const result = await response.json();
      console.log("result", result);
      if (Array.isArray(result.data) && result.data.length > 0) {
        console.log("inside array");
        // Iterate over each item in the response data array
        for (const item of result.data) {
          console.log("item::", item);
          // Check if address and daoName match
          if (item.address === address) {
            if (item.emailId === null || item.emailId === "") {
              console.log("NO emailId found");
              setHasEmailID(false);
              return false;
            } else if (item.emailId) {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const isValid = emailPattern.test(item.emailId);
              if (isValid) {
                setMailId(item.emailId);
                setContinueAPICalling(true);
                setHasEmailID(true);
                console.log("emailId:", item.emailId);
                return true;
              } else {
                setContinueAPICalling(false);
                return false;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    // checkUser();
    console.log("continueAPICalling", continueAPICalling);
    if (continueAPICalling) {
      handleApplyButtonClick();
    }
  }, [continueAPICalling]);

  useEffect(() => {
    const fetchEnsName = async () => {
      const ensName = await fetchEnsAvatar(address ? address : "");
      if (ensName) {
        setDisplayEnsName(ensName?.ensName);
      } else {
        setDisplayEnsName("");
      }
    };
    fetchEnsName();
  }, [chain, address]);

  useEffect(() => {
    console.log("userRejected in useEffect", userRejected);
    const hasRejected = JSON.parse(
      sessionStorage.getItem("schedulingMailRejected") || "false"
    );
    console.log("hasRejected in useEffect", hasRejected);
    setUserRejected(hasRejected);
  }, [userRejected, sessionStorage.getItem("schedulingMailRejected")]);

  const handleApplyWithCheck = async () => {
    if (allData.length > 0) {
      try {
        setCreateSessionLoading(true);
        const checkUserMail = await checkUser();
        const userRejectedLocal: any = await sessionStorage.getItem(
          "schedulingMailRejected"
        );
        // setUserRejected(userRejectedLocal);
        console.log("userRejectedLocal", userRejectedLocal);
        console.log("checkUserMail in handleApplyWithCheck", checkUserMail);
        console.log("userRejected in handleApplyWithCheck", userRejected);
        if (!checkUserMail && (!userRejected || !userRejectedLocal)) {
          setShowGetMailModal(true);
        } else {
          console.log("inside else condition!!!!!");
          console.log("continueAPICalling", continueAPICalling);
          console.log("!continueAPICalling", !continueAPICalling);
          if (!continueAPICalling || continueAPICalling === false) {
            // console.log("inside if(!continueAPICalling)", !continueAPICalling);
            setContinueAPICalling(true);
          } else if (continueAPICalling) {
            handleApplyButtonClick();
          }
        }
        console.log("inside handleApplyWithCheck");
        // if (continueAPICalling) {
        //   handleApplyButtonClick();
        // }
      } catch (error) {
        console.log("error:", error);
      }
    } else {
      toast.error(
        "Please select a time. After selecting, click 'Add Session' and then 'Create Session'"
      );
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
    setFinalData(dataToStore);

    console.log("dataToStore", dataToStore);
    const requestOptions: any = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToStore),
      redirect: "follow",
    };

    try {
      console.log("storing....");
      setCreateSessionLoading(true);
      const response = await fetch("/api/store-availability", requestOptions);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setSuccessModalOpen(true);
        setCreateSessionLoading(false);
        setContinueAPICalling(false);
        setScheduledSuccess(true);
        setSessionCreated(true);

        //calling api endpoint for sending mail to user who follow this delegate
        try {
          const response = await fetch("/api/delegate-follow/send-mails", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Add any necessary data
              address: address,
              daoName: daoName,
              ensName: EnsName,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send mails");
          }

          const data = await response.json();
        } catch (error) {
          console.error("Something going wrong!", error);
        }
      } else {
        setScheduledSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error in scheduling your sessions.");
      setCreateSessionLoading(false);
      setContinueAPICalling(false);
    }
    setAllData([]);
    setAllowedDates([]);
    setDateAndRanges([]);
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
    const formattedUTCTime_startTime = utcDateTime_startTime.toLocaleString();
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

    const formattedUTCTime_endTime = utcDateTime_endTime.toLocaleString();
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

  // const handleAddSelectedDate = async () => {
  //   if (!selectedDate || !startHour || !startMinute || !endHour || !endMinute) {
  //     toast.error("Please select a date and time ranges before adding.");
  //     return;
  //   }
  const handleAddSelectedDate = async () => {
    if (!selectedDate || !startTime || !endTime) {
      toast.error("Please select a date and time ranges before adding.");
      return;
    }

    const formatTime = (time: {
      hour: string;
      minute: string;
      ampm: string;
    }) => {
      let hour = parseInt(time.hour);
      if (time.ampm === "PM" && hour !== 12) hour += 12;
      if (time.ampm === "AM" && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:${time.minute}`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const newAllData = {
      date: selectedDate,
      // timeRanges: [[startHour, startMinute, endHour, endMinute]],
      timeRanges: [[formattedStartTime, formattedEndTime]],
    };

    const [startHour, startMinute] = formattedStartTime.split(":");
    const [endHour, endMinute] = formattedEndTime.split(":");

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
    setStartTime({ hour: "12", minute: "00", ampm: "AM" });
    setEndTime({ hour: "12", minute: "00", ampm: "AM" });
    setSessions(0);
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
      console.log(allData, "all data");
      return timeOptions;
    };

    // Update time options when time slot size changes
    const timeOptions = generateTimeOptions();
    setStartTimeOptions(timeOptions);
    setEndTimeOptions(timeOptions);
  }, [timeSlotSizeMinutes]);

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

  const handleModalClose = () => {
    console.log("Popup Closed");
    setSuccessModalOpen(false);
  };

  const handleEmailChange = (email: string) => {
    setMailId(email);
    setIsValidEmail(validateEmail(email));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (address) {
      if (mailId && (mailId !== "" || mailId !== undefined)) {
        if (isValidEmail) {
          try {
            setAddingEmail(true);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              address: address,
              emailId: mailId,
              // daoName: daoName,
            });

            const requestOptions: any = {
              method: "PUT",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            const response = await fetch("/api/profile", requestOptions);
            const result = await response.json();
            if (result.success) {
              setContinueAPICalling(true);
              setAddingEmail(false);
            }
            console.log("result", result);
            console.log("Email submitted:", mailId);
            // Optionally, close the modal
            // handleGetMailModalClose();
            setShowGetMailModal(false);
          } catch (error) {
            console.log("Error", error);
            setAddingEmail(false);
          }
        } else {
          toast.error("Enter Valid Email");
          setShowGetMailModal(true);
          console.log("Error");
        }
      } else {
        toast.error("Enter Valid Email");
        setShowGetMailModal(true);
        console.log("Error");
      }
    }
  };

  const handleGetMailModalClose = () => {
    if (!userRejected) {
      sessionStorage.setItem("schedulingMailRejected", JSON.stringify(true));
      setUserRejected(true);
    }
    setContinueAPICalling(true);
    setShowGetMailModal(false);
  };

  // useEffect(() => {
  //   if (chain && chain?.name === "Optimism") {
  //     setDaoName("optimism");
  //   } else if (chain && chain?.name === "Arbitrum One") {
  //     setDaoName("arbitrum");
  //   }
  // }, [chain, chain?.name]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-10 1.5lg:gap-20 p-4">
        {/* First box- left side */}
        <div
          className={`w-full md:w-auto p-8 bg-white rounded-2xl ${styles.boxshadow} basis-1/2`}
        >
          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center">
              Select DAO Name:
              <Tooltip
                content={
                  <div className="font-poppins p-2 max-w-80 text-black rounded-md">
                    DAO for which the session is to be created. The attestations
                    will be issued for the selected DAO. The attendees of this
                    session will seek questions related to the selected DAO.
                  </div>
                }
                showArrow
                placement="right"
                delay={1}
              >
                <span className="px-2">
                  <FaCircleInfo className="cursor-pointer text-blue-500" />
                </span>
              </Tooltip>
            </label>
            <div className="border border-gray-300 rounded px-3 py-2 mt-1 w-full capitalize">
              {daoName}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center">
              Select Time Slot Size:
              <Tooltip
                content={
                  <div className="font-poppins p-2 max-w-80 text-black rounded-md">
                    The duration for which you would be able to take the
                    session. The preferred duration is 30 minutes. And note that
                    the selected time slot size will apply to all the selected
                    dates of your sessions.
                  </div>
                }
                showArrow
                placement="right"
                delay={1}
              >
                <span className="px-2">
                  <FaCircleInfo className="cursor-pointer text-blue-500" />
                </span>
              </Tooltip>
            </label>
            <select
              value={timeSlotSizeMinutes}
              onChange={(e: any) => setTimeSlotSizeMinutes(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mt-1 w-full cursor-pointer"
            >
              {/* <option value={15}>15 minutes</option> */}
              <option value={30}>30 minutes</option>
              <option value={45} disabled>
                45 minutes (Under development - It will be live soon)
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-gray-700 font-semibold flex items-center">
              Select Date:
              <Tooltip
                content={
                  <div className="font-poppins p-2 text-black rounded-md">
                    It is based on your timezone.
                  </div>
                }
                showArrow
                placement="right"
                delay={1}
              >
                <span className="px-2">
                  <FaCircleInfo className="cursor-pointer text-blue-500" />
                </span>
              </Tooltip>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mt-1 w-full cursor-pointer"
              min={formattedDate}
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-semibold flex items-center">
              Select Available Time:
              <Tooltip
                content={
                  <div className="font-poppins p-2 max-w-80 text-black rounded-md">
                    Session start time and end time based on your timezone.
                  </div>
                }
                showArrow
                placement="right"
                delay={1}
              >
                <span className="px-2">
                  <FaCircleInfo className="cursor-pointer text-blue-500" />
                </span>
              </Tooltip>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 mt-2">Start Time</label>

                {/* <div className="rounded-md flex items-center space-x-2">
                  <select className="p-2 border rounded cursor-pointer" id="hour" value={startTime.hour} onChange={handleStartTimeChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, "0")}
                <label className="text-gray-500 mt-1">Start Time</label>
                <div className="relative">
                  <select
                    className="appearance-none border border-gray-300 rounded px-3 py-2 mt-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 transition duration-300 ease-in-out cursor-pointer"
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}>
                    {startTimeOptions.map((time) => (
                      <option
                        key={time}
                        value={time}
                        className={`py-2 px-4 hover:bg-blue-100 dark:hover:bg-gray-700 custom-time-picker-option`}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select className="p-2 border rounded cursor-pointer" id="minute" value={startTime.minute} onChange={handleStartTimeChange}>
                    {[0, 30].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select className="p-2 border rounded cursor-pointer" id="ampm" value={startTime.ampm} onChange={handleStartTimeChange}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div> */}

                <div className="rounded-md flex items-center space-x-2">
                  <select
                    value={startTime.hour}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("start", "hour", e.target.value)
                    }
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={startTime.minute}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("start", "minute", e.target.value)
                    }
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <select
                    value={startTime.ampm}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("start", "ampm", e.target.value)
                    }
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-500 mt-1">End Time</label>

                {/* <div className="rounded-md flex items-center space-x-2">
                  <select
                    className="p-2 border rounded cursor-pointer"
                    id="hour"
                    value={endTime.hour}
                    onChange={handleEndTimeChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, "0")}
                    className="appearance-none border border-gray-300 rounded px-3 py-2 mt-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 transition duration-300 ease-in-out cursor-pointer"
                    value={selectedEndTime}
                    onChange={handleEndTimeChange}>
                    {endTimeOptions.map((time) => (
                      <option
                        key={time}
                        value={time}
                        className={`py-2 px-4 hover:bg-blue-100 dark:hover:bg-gray-700 custom-time-picker-option`}
                        style={{ cursor: "pointer" }}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    className="p-2 border rounded cursor-pointer"
                    id="minute"
                    value={endTime.minute}
                    onChange={handleEndTimeChange}
                  >
                    {[0, 30].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-2 border rounded cursor-pointer"
                    id="ampm"
                    value={endTime.ampm}
                    onChange={handleEndTimeChange}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div> */}
                <div className="rounded-md flex items-center space-x-2">
                  <select
                    value={endTime.hour}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("end", "hour", e.target.value)
                    }
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={endTime.minute}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("end", "minute", e.target.value)
                    }
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <select
                    value={endTime.ampm}
                    className="p-2 border rounded cursor-pointer"
                    onChange={(e) =>
                      handleTimeChange("end", "ampm", e.target.value)
                    }
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-700 font-semibold flex items-center">
                Total Session Count:
                <Tooltip
                  content={
                    <div className="font-poppins p-2 max-w-80 text-black rounded-md">
                      Displays the number of individual time slots available for
                      booking, calculated based on your selected time range and
                      slot duration.
                    </div>
                  }
                  showArrow
                  placement="right"
                  delay={1}
                >
                  <span className="px-2">
                    <FaCircleInfo className="cursor-pointer text-blue-500" />
                  </span>
                </Tooltip>
              </label>
              <div className="border border-gray-300 rounded px-3 py-2 mt-1 w-full cursor-pointer ">
                {sessions}
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              {generatedTimeSlots.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Generated Time Slots:
                  </h3>
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {generatedTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 p-1.5 rounded-md flex flex-col items-center text-left basis-1/3 text-sm font-poppins bg-[#f5f5f5]"
                      >
                        <p>{slot.time}</p>
                        <p>{slot.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div> */}

            <div className="flex flex-col gap-2">
              {timeSlots.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Generated Time Slots:
                  </h3>
                  <div className="grid grid-cols-4 gap-2 w-full">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="shadow hover:bg-gray-50 p-1.5 rounded-md flex flex-col items-center text-left basis-1/3 text-sm font-poppins bg-[#f5f5f5]"
                      >
                        {slot.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddSelectedDate}
            disabled={sessions === 0}
            className={`bg-blue-shade-400 hover:bg-blue-shade-500 text-[#0500FF] font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out ${
              sessions === 0 ? "cursor-not-allowed " : "cursor-pointer"
            }`}
          >
            <span className="flex items-center gap-3">
              <FaPlus className="" />
              Add Session
            </span>
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Selected Dates for Session:
            </h3>
            <div className="grid gap-4">
              {allData.map((item: any, index: any) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-700">{item.date}</p>
                    <p className="text-gray-600">
                      {item.timeRanges
                        .map((time: any) => {
                          const [startTime, endTime] = time;
                          const start12 = convertTo12Hour(startTime);
                          const end12 = convertTo12Hour(endTime);
                          return `${start12} to ${end12}`;
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <button
                    disabled={createSessionLoading}
                    onClick={() => handleRemoveDate(item.date, item.timeRanges)}
                    className={`text-red-600 ml-2 px-3 py-1 rounded-full ${
                      createSessionLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-100"
                    }`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleApplyWithCheck()}
            className={`${
              createSessionLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-bold py-3 px-4 rounded-3xl mt-4 w-[160px] flex justify-center items-center`}
            disabled={createSessionLoading}
          >
            {createSessionLoading ? (
              <Oval
                visible={true}
                height="28"
                width="28"
                color="#ffffff"
                secondaryColor="#cdccff"
                ariaLabel="oval-loading"
                wrapperClass="flex justify-center items-center"
              />
            ) : (
              "Create Session"
            )}
          </button>

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

        {/* Second box- right side */}
        <div
          className={`w-full md:w-auto p-8 bg-white rounded-2xl ${styles.boxshadow} basis-1/2`}
        >
          <AvailableUserSessions
            daoName={daoName}
            scheduledSuccess={scheduledSuccess}
            setScheduledSuccess={setScheduledSuccess}
            sessionCreated={sessionCreated}
            setSessionCreated={setSessionCreated}
          />
        </div>
      </div>

      {/* {modalOpen && ( */}
      {successModalOpen && (
        <SchedulingSuccessModal
          isOpen={successModalOpen}
          onClose={handleModalClose}
          data={finalData}
        />
      )}
      {showGetMailModal && (
        <AddEmailModal
          addingEmail={addingEmail}
          isOpen={showGetMailModal}
          onClose={handleGetMailModalClose}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
          mailId={mailId}
          isValidEmail={isValidEmail}
        />
      )}
    </>
  );
}

export default ScheduledUserSessions;
