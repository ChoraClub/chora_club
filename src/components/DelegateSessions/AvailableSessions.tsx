"use client";

import React, { useState, useEffect } from "react";
import search from "@/assets/images/daos/search.png";
import Image, { StaticImageData } from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import clockIcn from "@/assets/images/daos/icon_clock.png";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arb.png";
import "@/components/DelegateSessions/DelegateSessionsMain.module.css";
import AvailableSessionsSkeletonLoader from "../SkeletonLoader/AvailableSessionsSkeletonLoader";
import { fetchEnsName } from "@/utils/ENSUtils";
import onChain_link from "@/assets/images/watchmeeting/onChain_link.png";
import offChain_link from "@/assets/images/watchmeeting/offChain_link.png";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import { useAccount } from "wagmi";
// import { useAccount, useNetwork } from "wagmi";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { MdOutlineHourglassDisabled } from "react-icons/md";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  const [daoInfo, setDaoInfo] = useState<Array<Type>>([]);
  const [APIData, setAPIData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedDao, setSelectedDao] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [ensNames, setEnsNames] = useState<any>({});
  const { address, isConnected } = useAccount();

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [startPeriod, setStartPeriod] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [endPeriod, setEndPeriod] = useState("");
  const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
  const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const { openConnectModal } = useConnectModal();

  const handleBookSession = (daoName: string, userAddress: string) => {
    if (isConnected) {
      router.push(
        `/${daoName}/${userAddress}?active=delegatesSession&session=book`
      );
    } else {
      if (openConnectModal) {
        openConnectModal();
      } else {
        console.error("Connect modal is not available");
        alert(
          "Wallet connection is not available. Please check your wallet configuration."
        );
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  const convertTo24Hour = (hour: any, minute: any, period: any) => {
    let hourNum = parseInt(hour, 10);
    if (period === "PM" && hourNum !== 12) {
      hourNum += 12;
    } else if (period === "AM" && hourNum === 12) {
      hourNum = 0;
    }
    return `${hourNum.toString().padStart(2, "0")}:${minute}`;
  };

  useEffect(() => {
    const startTime24 = convertTo24Hour(startHour, startMinute, startPeriod);
    const endTime24 = convertTo24Hour(endHour, endMinute, endPeriod);
    setStartTime(startTime24);
    setEndTime(endTime24);
  }, [startHour, startMinute, startPeriod, endHour, endMinute, endPeriod]);

  const fetchData = async () => {
    setIsPageLoading(true);
    setError(null);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const currentDate = new Date();
      let newDate = currentDate.toLocaleDateString();
      if (newDate.length !== 10 || !newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        newDate = `${year}-${month}-${day}`;
      }

      let startTimeToSend = null;
      let endTimeToSend = null;

      if (startTime) {
        try {
          const startDateTime = new Date(`${newDate} ${startTime}:00`);
          startTimeToSend = startDateTime
            .toISOString()
            .split("T")[1]
            .substring(0, 5);
        } catch (error) {
          console.error("Invalid start time:", error);
        }
      }

      if (endTime) {
        try {
          const endDateTime = new Date(`${newDate} ${endTime}:00`);
          endTimeToSend = endDateTime
            .toISOString()
            .split("T")[1]
            .substring(0, 5);
        } catch (error) {
          console.error("Invalid end time:", error);
        }
      }

      const raw = JSON.stringify({
        dao_name: selectedDao,
        date: selectedDate,
        startTime: startTimeToSend ? startTimeToSend : null,
        endTime: endTimeToSend ? endTimeToSend : null,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const result = await fetch(
        "/api/get-availability/filter",
        requestOptions
      );
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      const response = await result.json();
      let resultData;
      if (response.success === true) {
        resultData = await response.data;
      }
      setAPIData(resultData);
      setDaoInfo(resultData);
      setInitialFetchComplete(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDao, selectedDate, startTime, endTime]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = APIData.filter((item: any) => {
        const lowercaseQuery = query.toLowerCase();
        const lowercaseAddress = item.session.userAddress.toLowerCase();

        return lowercaseAddress.includes(lowercaseQuery);
      });

      setDaoInfo(filtered);
    } else {
      setDaoInfo(APIData);
    }
  };

  const handleDaoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === "All-DAOS") {
      setSelectedDao(null);
    } else {
      setSelectedDao(selected);
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    if (selected === "") {
      setSelectedDate(null);
    } else {
      setSelectedDate(selected);
    }
  };

  useEffect(() => {
    if (showStartTimeSelector) {
      const time24 = convertTo24Hour(startHour, startMinute, startPeriod);
      setStartTime(time24);
    }
    if (showEndTimeSelector) {
      const time24 = convertTo24Hour(endHour, endMinute, endPeriod);
      setEndTime(time24);
    }
  }, [
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    showStartTimeSelector,
    showEndTimeSelector,
  ]);

  useEffect(() => {
    if (!showStartTimeSelector) {
      setStartTime(null);
    } else if (!showEndTimeSelector) {
      setEndTime(null);
    } else if (!showStartTimeSelector && !showEndTimeSelector) {
      setStartTime(null);
      setEndTime(null);
    }
  }, [showStartTimeSelector, showEndTimeSelector, endTime, startTime]);

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

  const handleClearTime = () => {
    setStartTime(null);
    setEndTime(null);
    setShowStartTimeSelector(false);
    setShowEndTimeSelector(false);
    setStartHour("");
    setStartMinute("");
    setStartPeriod("");
    setEndHour("");
    setEndMinute("");
    setEndPeriod("");
  };

  const handleSetStartTime = () => {
    setShowStartTimeSelector(true);
    setStartTime(null);
    setStartHour("12");
    setStartMinute("00");
    setStartPeriod("AM");
  };

  const handleSetEndTime = () => {
    setShowEndTimeSelector(true);
    setEndTime(null);
    setEndHour("12");
    setEndMinute("00");
    setEndPeriod("AM");
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

  useEffect(() => {
    const fetchEnsNames = async () => {
      const addresses = daoInfo.map((dao: any) => dao.userInfo[0]?.address);
      const names = await Promise.all(
        addresses.map(async (address) => {
          try {
            const ensNames = await fetchEnsName(address);
            const ensName = ensNames?.ensName;
            return { address, ensName };
          } catch (error) {
            console.error(`Error fetching ENS name for ${address}:`, error);
            return { address, ensName: null };
          }
        })
      );
      const ensNameMap: { [address: string]: any } = {};
      names.forEach(({ address, ensName }) => {
        ensNameMap[address] = ensName;
      });
      setEnsNames(ensNameMap);
    };

    if (daoInfo.length > 0) {
      fetchEnsNames();
    }
  }, [daoInfo]);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );

  return (
    <div className="xs:mx-4 ">
      <div className="flex flex-col lg:flex-row lg:gap-3 bg-[#D9D9D945] px-2 py-4 xs:p-4 mt-4 mx-2 rounded-2xl font-poppins">
        {/* <div
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
          <span className="flex items-center bg-black rounded-full px-5 py-2 cursor-pointer">
            <Image
              className="min-w-[25px]"
              src={search}
              alt="search"
              width={20}
            />
          </span>
        </div> */}
        <div className="flex gap-3 items-center">
          <div
            className={`flex items-center rounded-full shadow-lg bg-white text-black cursor-pointer w-[300px] xs:w-[365px] lg:w-[150px] 1.5lg:w-[200px] 2xl:w-[365px]`}
          >
            <CiSearch
              className={`text-base transition-all duration-700 ease-in-out ml-3`}
            />
            <input
              type="text"
              placeholder="Search by Address"
              className="w-[100%] pl-2 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-xs xl:text-sm bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Tooltip
            showArrow
            content={<div className="font-poppins">More Options</div>}
            placement="bottom"
            className="rounded-md bg-opacity-90"
            closeDelay={1}
          >
            <div
              className="lg:hidden rounded-full shadow-lg flex items-center justify-center size-7 sm:size-9 bg-white cursor-pointer"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              <FaChevronDown
                className={`transition-transform duration-300 text-sm sm:text-base ${
                  showFilterOptions ? "rotate-180" : ""
                }`}
              />
            </div>
          </Tooltip>
        </div>

        <div
          className={`lg:flex gap-3 ${
            showFilterOptions ? "flex" : "hidden"
          } flex-col md:flex-row md:flex-wrap  mt-3 lg:mt-0 transition-all duration-300 ease-in-out`}
        >
          <div className="flex gap-3">
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
                  onChange={handleDaoChange}
                  className="2xl:px-3 2xl:py-2 p-1.5 sm:p-2 rounded-full shadow-lg bg-white cursor-pointer text-xs sm:text-sm lg:text-xs xl:text-sm"
                >
                  <option value="All-DAOS">All DAOs</option>
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
                  className="2xl:px-3 2xl:py-2 p-1.5 sm:p-2 shadow-lg rounded-full cursor-pointer text-xs sm:text-sm lg:text-xs xl:text-sm"
                />
              </Tooltip>
            </div>
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
            <div className="flex items-center select-container text-xs sm:text-sm lg:text-xs xl:text-sm">
              {!showStartTimeSelector ? (
                <button
                  onClick={() => handleSetStartTime()}
                  className="2xl:px-3 2xl:py-2 p-1.5 sm:p-2 rounded-full shadow-lg mr-1 cursor-pointer w-[132px] xs:w-[151px]"
                >
                  Set Start Time
                </button>
              ) : (
                <div className="bg-white p-1 sm:p-2 shadow-lg rounded-full">
                  <select
                    className="cursor-pointer mr-1"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={startMinute}
                    onChange={(e) => setStartMinute(e.target.value)}
                    className="ml-1 cursor-pointer"
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <select
                    className="cursor-pointer"
                    value={startPeriod}
                    onChange={(e) => setStartPeriod(e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}

              <span>&nbsp;to&nbsp;</span>

              {!showEndTimeSelector ? (
                <button
                  onClick={() => handleSetEndTime()}
                  className="2xl:px-3 2xl:py-2 p-1.5 sm:p-2 rounded-full shadow-lg ml-1 w-[132px] xs:w-[151px] cursor-pointer"
                >
                  Set End Time
                </button>
              ) : (
                <div className="bg-white p-1 sm:p-2 shadow-lg rounded-full">
                  <select
                    className="ml-1 cursor-pointer"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    className="mr-1 cursor-pointer"
                    value={endMinute}
                    onChange={(e) => setEndMinute(e.target.value)}
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <select
                    className="cursor-pointer"
                    value={endPeriod}
                    onChange={(e) => setEndPeriod(e.target.value)}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}

              {(showStartTimeSelector || showEndTimeSelector) && (
                <Tooltip
                  showArrow
                  content={<div className="">Clear Time</div>}
                  placement="bottom"
                  className="rounded-md bg-opacity-90"
                  closeDelay={1}
                >
                  <button
                    onClick={handleClearTime}
                    className="ml-2 text-red-500 px-2 py-1 rounded-full shadow-lg border border-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <span className="sm:block hidden lg:hidden 1.5lg:block">
                      Clear Time
                    </span>
                    <span className="block sm:hidden lg:block 1.5lg:hidden">
                      <MdOutlineHourglassDisabled />
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="pt-8 font-poppins">
        {!initialFetchComplete || isPageLoading ? (
          <AvailableSessionsSkeletonLoader />
        ) : daoInfo && daoInfo?.length > 0 ? (
          <div className="overflow-auto font-poppins grid grid-cols-1 md:grid-cols-1 1.5lg:grid-cols-2 2xl:grid-cols-2 gap-12 py-5 px-6 md:px-10">
            {daoInfo.map((daos: any, index: number) => (
              <div
                key={index}
                style={{
                  boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                }}
                className="rounded-3xl flex flex-col bg-white h-full justify-between"
              >
                <div className="border-b-2 sm:border-b-0 mb-2 sm:mb-0 relative">
                  <div className="flex py-5 px-5 rounded-tl-3xl rounded-tr-3xl">
                    <div
                      className="relative object-cover rounded-3xl border-none xs:border-[2px] border-[#E9E9E9]"
                      // style={{
                      //   backgroundColor: "#fcfcfc",
                      // }}
                    >
                      <div className="size-24 sm:size-32 flex items-center justify-content ">
                        <div className="flex justify-start sm:justify-center items-center size-24 sm:size-32">
                          <Image
                            src={
                              daos?.userInfo[0]?.image
                                ? `https://gateway.lighthouse.storage/ipfs/${daos?.userInfo[0]?.image}`
                                : daos.session.dao_name === "optimism"
                                ? OPLogo
                                : daos.session.dao_name === "arbitrum"
                                ? ArbLogo
                                : ccLogo
                            }
                            alt="user"
                            width={256}
                            height={256}
                            className={
                              daos?.userInfo[0]?.image
                                ? "size-24 sm:w-32 sm:h-32 rounded-xl xs:rounded-3xl"
                                : "w-20 h-20 rounded-3xl"
                            }
                          />
                        </div>

                        <Image
                          src={ccLogo}
                          alt="ChoraClub Logo"
                          className="absolute hidden xs:flex  xs:size-5 sm:size-[30px] top-0 right-0 rounded-full bg-white"
                          style={{
                            marginTop: "10px",
                            marginRight: "10px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-3/4 ml-2 sm:ml-4">
                      <div className="text-[#3E3D3D] text-base sm:text-lg font-semibold mb-1">
                        {ensNames[daos?.userInfo[0]?.address] ||
                          daos.userInfo[0]?.displayName ||
                          daos.session.userAddress.slice(0, 6) +
                            "..." +
                            daos.session.userAddress.slice(-4)}
                      </div>
                      <div className="text-xs sm:text-sm flex">
                        <div>
                          {daos.session.userAddress.slice(0, 6) +
                            "..." +
                            daos.session.userAddress.slice(-4)}
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
                                onClick={() =>
                                  handleCopy(`${daos.session.userAddress}`)
                                }
                              />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-2 bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-[10px] sm:text-xs px-4 py-0.5 sm:px-5 sm:py-1 font-semibold w-fit capitalize">
                        {daos.session.dao_name}
                      </div>
                      <div>
                        <div
                          className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-1.5 sm:px-3 py-1 mt-2 sm:mt-4 sm:max-h-[86px] sm:overflow-y-scroll overflow-x-auto"
                          style={{
                            scrollbarWidth: "thin",
                            msOverflowStyle: "none",
                          }}
                        >
                          <div className="flex flex-row flex-wrap gap-1 xs:gap-2 sm:gap-4">
                            {daos.session.dateAndRanges
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
                                  className="text-black bg-[#f7f7f7c3] rounded-2xl font-semibold text-[10px] xs:text-xs sm:text-small border-[0.5px] border-[#D9D9D9] px-3 py-1"
                                >
                                  {
                                    new Date(date)
                                      .toLocaleString()
                                      .split(",")[0]
                                  }
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 gap-1">
                    {daos.meetingsInfo.counts.onChainCount > 0 && (
                      <Tooltip
                        content={
                          "Received " +
                          daos.meetingsInfo.counts.onChainCount +
                          " Onchain attestation"
                        }
                        placement="top"
                        closeDelay={1}
                        showArrow
                      >
                        <div className="flex items-center cursor-pointer bg-white rounded-full px-1 mb-2 gap-1 sm:gap-2 border border-blue-shade-200">
                          <div>
                            <Image
                              src={onChain_link}
                              alt="image"
                              width={20}
                              className="size-3 sm:size-4"
                            />
                          </div>
                          <span className="text-sm sm:text-base">
                            {daos.meetingsInfo.counts.onChainCount}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                    {daos.meetingsInfo.counts.offChainCount > 0 && (
                      <Tooltip
                        content={
                          "Received " +
                          daos.meetingsInfo.counts.offChainCount +
                          " Offchain attestation"
                        }
                        placement="top"
                        closeDelay={1}
                        showArrow
                      >
                        <div className="flex items-center cursor-pointer bg-white rounded-full px-1 gap-1 sm:gap-2 border border-blue-shade-200">
                          <div>
                            <Image
                              src={offChain_link}
                              alt="image"
                              width={20}
                              className="size-3 sm:size-4"
                            />
                          </div>
                          <span className="text-sm sm:text-base">
                            {daos.meetingsInfo.counts.offChainCount}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </div>

                <div className="sm:border-t-2 flex items-center sm:pt-4 px-3 sm:px-5 pb-2 sm:pb-3">
                  <Image
                    alt="clockIcn"
                    width={20}
                    height={20}
                    src={clockIcn}
                    className="size-4 xs:size-5"
                    priority
                  />
                  <div className="w-[60%] flex items-center">
                    <span className="text-[10px] xs:text-xs sm:text-base font-semibold text-[#0500FF] ml-1">
                      Available for {`${daos.session.timeSlotSizeMinutes}`}{" "}
                      minutes
                    </span>
                  </div>
                  <div className="w-[40%] flex justify-end ">
                    <button
                      onClick={() =>
                        handleBookSession(
                          daos.session.dao_name,
                          daos.session.userAddress
                        )
                      }
                      className="bg-black text-white py-2 xs:py-3 sm:py-4 px-4 sm:px-6 rounded-[36px] text-[10px] xs:text-xs sm:text-sm w-[11rem] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
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
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "Oops, no such result available!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const HoverableImage = ({
  imageSrc,
  counts,
  index,
}: {
  imageSrc: any;
  counts: any;
  index: any;
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  return (
    <div
      className="hoverable-image"
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {hoveredItem === index ? (
        <div className="counts">
          <p>{counts}</p>
        </div>
      ) : (
        <div>Hi</div>
      )}
    </div>
  );
};

export default AvailableSessions;
