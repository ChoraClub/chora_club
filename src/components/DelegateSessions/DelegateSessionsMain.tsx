"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import search from "@/assets/images/daos/search.png";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import opImg from "@/assets/images/daos/op.png";
import arbImg from "@/assets/images/daos/arbitrum.jpg";
import { Tooltip } from "@nextui-org/react";

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

function DelegateSessionsMain() {
  const [daoInfo, setDaoInfo] = useState<Array<Type>>([]);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedDao, setSelectedDao] = useState<any>("All-DAOS");
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [APIData, setAPIData] = useState<Array<Type>>([]);

  useEffect(() => {
    setIsPageLoading(false);
  }, [selectedDao]);

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

  const handleDaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedDao(selected);
    let filtered: any;
    if (selected === "All-DAOS") {
      filtered = APIData;
    } else {
      filtered = APIData.filter((item) => item.dao_name === selected);
    }
    setDaoInfo(filtered);
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

  useEffect(() => {
    let tempData: any;
    const fetchData = async () => {
      try {
        const requestOptions: any = {
          method: "GET",
          redirect: "follow",
        };

        const result = await fetch("/api/get-availability", requestOptions);
        const response = await result.json();
        if (response.success) {
          // console.log("response", response.data);
          setAPIData(response.data);
          tempData = await response.data;
          // setDaoInfo(response.data);
        }
      } catch (error) {
        console.error("Error Fetching Data of availability:", error);
      }
    };
    fetchData();
    setDaoInfo(tempData);
  }, [APIData]);

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between pe-10">
          <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
            Delegate Sessions
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>

        <div className="pr-32 pt-4 font-poppins">
          <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
            <button
              className={`py-2  ${
                searchParams.get("sessions") === "available"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() => router.push(path + "?sessions=available")}
            >
              Available
            </button>
            <button
              className={`py-2 ${
                searchParams.get("sessions") === "recorded"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() => router.push(path + "?sessions=recorded")}
            >
              Recorded
            </button>
          </div>

          <div className="flex">
            <div
              style={{ background: "rgba(238, 237, 237, 0.36)" }}
              className="flex border-[0.5px] border-black w-fit rounded-full my-8 font-poppins"
            >
              <input
                type="text"
                placeholder="Search"
                style={{ background: "rgba(238, 237, 237, 0.36)" }}
                className="pl-5 rounded-full outline-none text-sm"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              ></input>
              <span className="flex items-center bg-black rounded-full px-5 py-2">
                <Image src={search} alt="search" width={20} />
              </span>
            </div>

            <div className="flex items-center m-8">
              <select
                value={selectedDao}
                onChange={handleDaoChange}
                className="px-3 py-2 rounded-md border border-gray-300 "
              >
                <option value="All-DAOS">All DAOS</option>
                <option value="optimism">Optimism</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </div>

            <div className="flex items-center m-8">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 mr-2"
              />
            </div>

            <div className="flex items-center m-8 select-container">
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 mr-2"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span>to</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 ml-2"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="">
          <div className="py-8 pe-10 font-poppins">
            {isPageLoading ? (
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
            ) : daoInfo.length > 0 ? (
              <div>
                <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 ">
                  {daoInfo.map((daos: any, index: number) => (
                    <>
                      <div
                        key={index}
                        style={{
                          boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                        }}
                        className="px-5 py-7 rounded-2xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-center">
                            <Image
                              src={
                                daos.profilePicture
                                  ? daos.profilePicture === null
                                    ? daos.dao_name === "optimism"
                                      ? opImg
                                      : daos.dao_name === "arbitrum"
                                      ? arbImg
                                      : ""
                                    : ""
                                  : daos.dao_name === "optimism"
                                  ? opImg
                                  : daos.dao_name === "arbitrum"
                                  ? arbImg
                                  : ""
                              }
                              alt="Image not found"
                              width={80}
                              height={80}
                              className="rounded-full"
                            ></Image>
                          </div>

                          <div className="text-center">
                            <div className="py-3">
                              <div className={`font-semibold overflow-hidden `}>
                                {daos.ensName == null ? (
                                  <span>
                                    {daos.userAddress
                                      ? daos.userAddress.slice(0, 6) +
                                        "..." +
                                        daos.userAddress.slice(-4)
                                      : ""}
                                  </span>
                                ) : (
                                  <span>
                                    {daos.ensName.length > 15
                                      ? daos.ensName.slice(0, 15) + "..."
                                      : daos.ensName}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-center items-center gap-2 pb-2 pt-1">
                                {daos.userAddress
                                  ? daos.userAddress.slice(0, 6) +
                                    "..." +
                                    daos.userAddress.slice(-4)
                                  : ""}
                                <Tooltip
                                  content="Copy"
                                  placement="right"
                                  closeDelay={1}
                                  showArrow
                                >
                                  <span className="cursor-pointer text-sm">
                                    <IoCopy
                                      onClick={() =>
                                        handleCopy(daos.userAddress)
                                      }
                                    />
                                  </span>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            className="bg-blue-shade-100 text-white font-poppins w-full rounded-[4px] text-sm py-1 font-medium"
                            onClick={() =>
                              router.push(
                                `/${daos.dao_name}/${daos.userAddress}?active=delegatesSession&session=book `
                              )
                            }
                          >
                            Book Session
                          </button>
                        </div>
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
                    </>
                  ))}
                </div>
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
        </div>
      </div>
    </>
  );
}

export default DelegateSessionsMain;
