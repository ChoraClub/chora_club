"use client";

import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import opImg from "@/assets/images/daos/op.png";
import arbImg from "@/assets/images/daos/arbitrum.jpg";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import text1 from "@/assets/images/daos/texture1.png";
import clockIcn from "@/assets/icon_clock.png";
import ccLogo from "@/assets/images/daos/CC.png";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arbCir.png";
import "@/components/DelegateSessions/DelegateSessionsMain.module.css";

interface Type {
  ensName: string;
  dao_name: string;
  userAddress: string;
  timeSlotSizeMinutes: number;
  allowedDates: string[];
  dateAndRanges: {
    date: string;
    timeRanges: [string, string, string, string][];
    formattedUTCTime_startTime: string;
    utcTime_startTime: string;
    formattedUTCTime_endTime: string;
    utcTime_endTime: string;
  }[];
}

function AvailableSessions() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [daoInfo, setDaoInfo] = useState<Array<Type>>([]);
  const [APIData, setAPIData] = useState<Array<Type>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedDao, setSelectedDao] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let dateToSend = null;

        console.log("selectedDao", selectedDao);
        console.log("selectedDate", selectedDate);
        console.log("startTime", startTime);
        console.log("endTime", endTime);

        const currentDate = new Date();
        let newDate = currentDate.toLocaleDateString();
        if (newDate.length !== 10 || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
          newDate = `${year}-${month}-${day}`;
        }

        console.log("currentDate", newDate);

        const startDateTime = (await startTime)
          ? new Date(`${newDate} ${startTime}:00`)
          : null;

        const endDateTime = (await endTime)
          ? new Date(`${newDate} ${endTime}:00`)
          : null;

        console.log("startDateTime", startDateTime);
        console.log("endDateTime", endDateTime);

        const startTimeToSend = startDateTime
          ?.toISOString()
          .split("T")[1]
          .substring(0, 5);

        const endTimeToSend = endDateTime
          ?.toISOString()
          .split("T")[1]
          .substring(0, 5);

        console.log("startTimeToSend", startTimeToSend);
        console.log("endTimeToSend", endTimeToSend);

        const raw = JSON.stringify({
          dao_name: selectedDao,
          date: selectedDate,
          startTime: startTimeToSend ? startTimeToSend : null,
          endTime: endTimeToSend ? endTimeToSend : null,
        });

        // console.log("")

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        console.log("requestOptions", requestOptions);
        const result = await fetch(
          "/api/get-availability/filter",
          requestOptions
        );
        const response = await result.json();

        let resultData;
        console.log("resultData: ", response);
        if (response.success === true) {
          console.log("response", response.data);
          resultData = await response.data;
          console.log("resultData", resultData);
        }
        setAPIData(resultData);
        setDaoInfo(resultData);
        setIsPageLoading(false);
      } catch (error) {
        console.error("Error Fetching Data of availability:", error);
      }
    };
    fetchData();
  }, [selectedDao, selectedDate, startTime, endTime]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered: any = APIData.filter(
      (item) =>
        item.ensName?.toLowerCase().includes(query.toLowerCase()) ||
        item.userAddress.toLowerCase().includes(query.toLowerCase())
    );
    setDaoInfo(filtered);
  };

  const handleDaoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    // setSelectedDao(selected);
    let filtered: any;
    if (selected === "All-DAOS") {
      // setDaoInfo(APIData);
      setSelectedDao(null);
    } else {
      // filtered = APIData.filter((item) => item.dao_name === selected);
      // setDaoInfo(filtered);
      setSelectedDao(selected);
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    console.log("selected date", selected);
    if (selected === "") {
      console.log("its empty string");
      setSelectedDate(null);
    } else {
      setSelectedDate(selected);
    }
  };

  const handleStartTimeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value;
    console.log("selected startTime", selected);
    if (selected === "Start Time") {
      setStartTime(null);
    } else {
      setStartTime(selected);
    }
  };

  const handleEndTimeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value;
    console.log("selected endTime", selected);
    if (selected === "End Time") {
      setEndTime(null);
    } else {
      setEndTime(selected);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleClearTime = () => {
    setStartTime(null);
    setEndTime(null);
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

  return (
    <>
      <div className="flex gap-7 bg-[#D9D9D945] p-4 mt-4 rounded-2xl font-poppins">
        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-fit rounded-full  "
        >
          <input
            type="text"
            placeholder="Search by Address"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image
              className="min-w-[25px]"
              src={search}
              alt="search"
              width={20}
            />
          </span>
        </div>

        <div className="flex items-center">
        <Tooltip
            showArrow
            content={
              <div className="font-poppins">
                Select a DAO option to view available Delegates of that DAO.
              </div>
            }
            placement="bottom"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
          <select
            value={selectedDao}
            // onChange={(e) => setSelectedDao(e.target.value)}
            onChange={handleDaoChange}
            className="px-3 py-2 rounded-md shadow"
          >
            <option value="All-DAOS">All DAOS</option>
            <option value="optimism">Optimism</option>
            <option value="arbitrum">Arbitrum</option>
          </select>
        
          </Tooltip>
        </div>

        

        <div className="flex items-center">
        <Tooltip
            showArrow
            content={
              <div className="font-poppins">
                Select a date to view available Delegates for that date.
              </div>
            }
            placement="bottom"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={formattedDate}
            // onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 shadow mr-1 rounded-md"
          />
          </Tooltip>
        </div>

        <Tooltip
            showArrow
            content={
              <div className="font-poppins">
                Select a time to view available Delegates for that specific
                time.
              </div>
            }
            placement="bottom"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
        <div className="flex items-center select-container">
          <select
            value={startTime || "Start Time"}
            onChange={handleStartTimeChange}
            className="px-3 py-2 rounded-md shadow mr-1"
          >
            <option disabled>Start Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <span>&nbsp;to</span>
          <select
            value={endTime || "End Time"}
            onChange={handleEndTimeChange}
            className="px-3 py-2 rounded-md shadow ml-2"
          >
            <option disabled>End Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {(startTime || endTime) && (
            <button
              onClick={handleClearTime}
              className="ml-2 text-red-500 px-3 py-1 rounded-md border border-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear Time
            </button>
          )}
        </div>
        </Tooltip>
      </div>
      

      <div className="pt-8 font-poppins">
        {isPageLoading ? (
          <div className="flex items-center justify-center m-6">
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#0500FF"
              secondaryColor="#cdccff"
              ariaLabel="oval-loading"
            />
          </div>
        ) : daoInfo && daoInfo.length > 0 ? (
          <div className="overflow-auto font-poppins grid  grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-12 py-5 px-10">
            {daoInfo.map((daos: any, index: number) => (
              <div
                key={index}
                style={{
                  boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                }}
                className="rounded-3xl flex flex-col bg-white"
              >
                <div className="flex items-center mb-4 border-b-2 py-5 px-5 rounded-tl-3xl rounded-tr-3xl">
                  <div
                    className="relative object-cover rounded-3xl"
                    style={{
                      backgroundColor: "#fcfcfc",
                      border: "2px solid #E9E9E9 ",
                    }}
                  >
                    <div className="w-32 h-32 flex items-center justify-content ">
                      <div className="flex justify-center items-center w-32 h-32">
                        <Image
                          src={
                            daos.profilePicture
                              ? `https://gateway.lighthouse.storage/ipfs/${daos.profilePicture}`
                              : daos.dao_name === "optimism"
                              ? OPLogo
                              : daos.dao_name === "arbitrum"
                              ? ArbLogo
                              : ccLogo
                          }
                          alt="user"
                          width={256}
                          height={256}
                          className={
                            daos?.profilePicture
                              ? "w-32 h-32 rounded-3xl"
                              : "w-20 h-20 rounded-3xl"
                          }
                        />
                      </div>

                      <Image
                        src={ccLogo}
                        alt="ChoraClub Logo"
                        className="absolute top-0 right-0"
                        style={{
                          width: "30px",
                          height: "30px",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-3/4 ml-4">
                    <div className="text-[#3E3D3D] text-lg font-semibold mb-1">
                      {daos.ensName && daos.ensName.length > 15
                        ? daos.ensName.slice(0, 15) + "..."
                        : daos.ensName ||
                          daos.userAddress.slice(0, 6) +
                            "..." +
                            daos.userAddress.slice(-4)}
                    </div>
                    <div className="text-sm flex">
                      <div>
                        {daos.userAddress.slice(0, 6) +
                          "..." +
                          daos.userAddress.slice(-4)}
                      </div>
                      <div className="items-center">
                        <Tooltip
                          content="Copy"
                          placement="right"
                          closeDelay={1}
                          showArrow
                        >
                          <div
                            className="pl-2 pt-[2px] cursor-pointer"
                            color="#3E3D3D"
                          >
                            <IoCopy
                              onClick={() => handleCopy(`${daos.userAddress}`)}
                            />
                          </div>
                        </Tooltip>
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
                    </div>
                    <div className="mt-2 bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold w-fit capitalize">
                      {daos.dao_name}
                    </div>
                    <div>
                      <div
                        className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1 mt-4 "
                        style={{
                          overflowX: "auto",
                          overflowY: "hidden",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          {daos.dateAndRanges
                            .flatMap((dateRange: any) => dateRange.date)
                            .filter(
                              (date: any, index: any, self: any) =>
                                self.indexOf(date) === index
                            )
                            .sort(
                              (a: any, b: any) =>
                                new Date(a).getTime() - new Date(b).getTime()
                            )
                            .map((date: string, index: number) => (
                              <div
                                key={index}
                                className="text-black bg-[#f7f7f7c3] rounded-2xl font-semibold text-small border-[0.5px] border-[#D9D9D9] px-3 py-1 mr-4"
                              >
                                {new Date(date).toLocaleString().split(",")[0]}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center px-5 pb-3">
                  <Image
                    alt="clockIcn"
                    width={20}
                    height={20}
                    src={clockIcn}
                    priority
                  />
                  <div className="w-[60%]">
                    <span className="text-base font-semibold text-[#0500FF] ml-1">
                      Available for {`${daos.timeSlotSizeMinutes}`} minutes
                    </span>
                  </div>
                  <div className="w-[40%] flex justify-end ">
                    {/* <button
                      onClick={() =>
                        router.push(
                          `/${daos.dao_name}/${daos.userAddress}?active=delegatesSession&session=book `
                        )
                      }
                      className="bg-black text-white py-4 px-6 rounded-[36px] text-sm w-[11rem] relative  hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <span className="relative">Book Session</span>
                      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-opacity duration-300"></span>
                    </button> */}
                    <button
                      onClick={() =>
                        router.push(
                          `/${daos.dao_name}/${daos.userAddress}?active=delegatesSession&session=book`
                        )
                      }
                      className="bg-black text-white py-4 px-6 rounded-[36px] text-sm w-[11rem] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AvailableSessions;
