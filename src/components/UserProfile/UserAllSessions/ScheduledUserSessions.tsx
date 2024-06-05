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
import AddEmailModal from "@/components/utils/AddEmailModal";

import Image from "next/image";

import AvailableUserSessions from "./AvailableUserSessions";
import styles from './ScheduleUserSessions.module.css'

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
      toast.error("Please select a time. After selecting, click 'Add Session' and then 'Create Session'");
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
        <div className={`w-full md:w-auto p-8 bg-white rounded-2xl ${styles.boxshadow} basis-1/2`}>
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
              onChange={(e) => setTimeSlotSizeMinutes(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 mt-1 w-full cursor-pointer"
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
                <label className="text-gray-500 mt-1">Start Time</label>
                <div className="relative">
                  <select
                    className="appearance-none border border-gray-300 rounded px-3 py-2 mt-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 transition duration-300 ease-in-out cursor-pointer"
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}
                  >
                    {startTimeOptions.map((time) => (
                      <option
                        key={time}
                        value={time}
                        className={`py-2 px-4 hover:bg-blue-100 dark:hover:bg-gray-700 custom-time-picker-option`}
                        
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-200" />
                </div>
              </div>
              <div>
                <label className="text-gray-500 mt-1">End Time</label>
                <div className="relative">
                  <select
                    className="appearance-none border border-gray-300 rounded px-3 py-2 mt-1 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 transition duration-300 ease-in-out cursor-pointer"
                    value={selectedEndTime}
                    onChange={handleEndTimeChange}
                  >
                    {endTimeOptions.map((time) => (
                      <option
                        key={time}
                        value={time}
                        className={`py-2 px-4 hover:bg-blue-100 dark:hover:bg-gray-700 custom-time-picker-option`}
                        style={{ cursor: 'pointer' }} 
                      >
                        {time}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-200" />
                </div>
              </div>
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
        <div className={`w-full md:w-auto p-8 bg-white rounded-2xl ${styles.boxshadow} basis-1/2`}>
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
