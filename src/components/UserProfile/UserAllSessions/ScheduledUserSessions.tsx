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

interface dataToStore {
  userAddress: `0x${string}` | undefined | null;
  timeSlotSizeMinutes: number;
  allowedDates: any;
  dateAndRanges: any;
  dao_name: string;
}

interface TimeObject {
  hour: number;
  minute: number;
  ampm: 'AM' | 'PM';
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
  const [numberOfSessions, setNumberOfSessions] = useState(0);
  const [generatedTimeSlots, setGeneratedTimeSlots] = useState<Array<{ time: string; date: string }>>([]);
  const [startTime, setStartTime] = useState<TimeObject>({ hour: 12, minute: 0, ampm: 'PM' });
  const [endTime, setEndTime] = useState<TimeObject>({ hour: 12, minute: 0, ampm: 'PM' });

  const isEndTimeNextDay = (selectedDate: string, start: TimeObject, end: TimeObject): boolean => {
    const startDateTime = new Date(`${selectedDate}T${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')}:00`);
    const endDateTime = new Date(`${selectedDate}T${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}:00`);
  
    if (start.ampm === 'PM' && start.hour !== 12) startDateTime.setHours(startDateTime.getHours() + 12);
    if (end.ampm === 'PM' && end.hour !== 12) endDateTime.setHours(endDateTime.getHours() + 12);
    if (start.ampm === 'AM' && start.hour === 12) startDateTime.setHours(0);
    if (end.ampm === 'AM' && end.hour === 12) endDateTime.setHours(24);
  
    return endDateTime <= startDateTime;
  };


  const calculateNumberOfSessions = (start: TimeObject, end: TimeObject) => {
    const startDate = new Date(`2000-01-01T${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')}:00`);
    let endDate = new Date(`2000-01-01T${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}:00`);
    
    if (start.ampm === 'PM' && start.hour !== 12) startDate.setHours(startDate.getHours() + 12);
    if (end.ampm === 'PM' && end.hour !== 12) endDate.setHours(endDate.getHours() + 12);
    if (start.ampm === 'AM' && start.hour === 12) startDate.setHours(0);
    if (end.ampm === 'AM' && end.hour === 12) endDate.setHours(24);
  
    if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);
  
    const diffMilliseconds = endDate.getTime() - startDate.getTime();
    const diffMinutes = diffMilliseconds / 60000;
    return Math.floor(diffMinutes / timeSlotSizeMinutes);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    const newEndTime = { ...endTime, [id]: id === 'hour' ? parseInt(value) : value };
    
    if (isEndTimeNextDay(selectedDate, startTime, newEndTime)) {
      toast.error("You can only select session times for the same day. Please select another date to schedule sessions for the next day.");
      return;
    }
  
    setEndTime(newEndTime);
    const sessions = calculateNumberOfSessions(startTime, newEndTime);
    setNumberOfSessions(sessions);
  };

useEffect(() => {
  generateTimeSlots();
}, [startTime,endTime, numberOfSessions, timeSlotSizeMinutes, selectedDate]);
  
const generateTimeSlots = () => {
  if (!selectedDate || !startTime || !endTime || numberOfSessions <= 0) {
    setGeneratedTimeSlots([]);
    setNumberOfSessions(0);
    return;
  }

  let slots: Array<{ time: string; date: string }> = [];
  let currentDate = new Date(`${selectedDate}T00:00:00`);

  let startHour = startTime.hour;
  if (startTime.ampm === 'PM' && startTime.hour !== 12) {
    startHour += 12;
  } else if (startTime.ampm === 'AM' && startTime.hour === 12) {
    startHour = 0;
  }
  
  currentDate.setHours(startHour, startTime.minute);

  for (let i = 0; i < numberOfSessions; i++) {
    let slotTime = new Date(currentDate.getTime() + i * timeSlotSizeMinutes * 60000);
    
    let hours = slotTime.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let minutes = slotTime.getMinutes();

    slots.push({
      time: `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`,
      date: slotTime.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    });

    // Break if we've reached the end time
    if (slots[slots.length - 1].time === `${endTime.hour}:${endTime.minute.toString().padStart(2, '0')} ${endTime.ampm}`) {
      break;
    }
  }

  setGeneratedTimeSlots(slots);
  setNumberOfSessions(slots.length);
};

  const handleStartTimeChange = (e: any) => {
    const { id, value } = e.target;
    const newStartTime = { ...startTime, [id]: id === 'hour' ? parseInt(value) : value };
    setStartTime(newStartTime);
  };

useEffect(() => {
  const sessions = calculateNumberOfSessions(startTime, endTime);
  setNumberOfSessions(sessions);
}, [startTime, endTime, timeSlotSizeMinutes]);

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
    setStartTime({ hour: 12, minute: 0, ampm: 'PM' });
  setEndTime({ hour: 12, minute: 0, ampm: 'PM' });
  setNumberOfSessions(1);
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

                <div className="rounded-md flex items-center space-x-2">
                  <select className="p-2 border rounded cursor-pointer" id="hour" value={startTime.hour} onChange={handleStartTimeChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, "0")}
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
                </div>
              </div>
              <div>
                <label className="text-gray-500 mt-1">End Time</label>

                <div className="rounded-md flex items-center space-x-2">
    <select className="p-2 border rounded cursor-pointer" id="hour" value={endTime.hour} onChange={handleEndTimeChange}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
        <option key={hour} value={hour}>
          {hour.toString().padStart(2, "0")}
        </option>
      ))}
    </select>
    <span>:</span>
    <select className="p-2 border rounded cursor-pointer" id="minute" value={endTime.minute} onChange={handleEndTimeChange}>
      {[0, 30].map((minute) => (
        <option key={minute} value={minute}>
          {minute.toString().padStart(2, "0")}
        </option>
      ))}
    </select>
    <select className="p-2 border rounded cursor-pointer" id="ampm" value={endTime.ampm} onChange={handleEndTimeChange}>
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
              </div>

            </div>

            <div className="mt-4">
            <label className="text-gray-700 font-semibold flex items-center">
              How many sessions scheduled
            </label>
            <input
              type="number"
              min={1}
              max={48}
              placeholder="Enter number"
              className="border border-gray-300 rounded px-3 py-2 mt-1 w-full cursor-pointer "
              value={numberOfSessions}
              readOnly
            />
          </div>

                  <div className="flex flex-col gap-2">

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
              </div>
          </div>

          <button
            onClick={handleAddSelectedDate}
            className="bg-blue-shade-400 hover:bg-blue-shade-500 text-[#0500FF] font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
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
                          const [startHour, startMinute, endHour, endMinute] =
                            time;
                          return `${startHour}:${startMinute} to ${endHour}:${endMinute}`;
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

        {/* Second box- right side */}
        <div
          className={`w-full md:w-auto p-8 bg-white rounded-2xl ${styles.boxshadow} basis-1/2`}
        >
          <AvailableUserSessions
            daoName={daoName}
            scheduledSuccess={scheduledSuccess}
            setScheduledSuccess={setScheduledSuccess}
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
