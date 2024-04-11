"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ccLogo from "@/assets/images/daos/CC.png";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import { Button, Dropdown, Pagination, Tooltip } from "@nextui-org/react";
import { Oval, RotatingLines } from "react-loader-spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import styles from "@/components/IndividualDelegate/DelegateVotes.module.css";
import { FaArrowUp } from "react-icons/fa6";
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import dao_abi from "../../artifacts/Dao.sol/GovernanceToken.json";
import { useAccount } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";

function DelegatesList({ props }: { props: string }) {
  const [delegateData, setDelegateData] = useState<any>({ delegates: [] });
  const { openChainModal } = useChainModal();
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [tempData, setTempData] = useState<any>({ delegates: [] });
  const [searchResults, setSearchResults] = useState<any>({ delegates: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageLoading, setPageLoading] = useState(true);
  const [isDataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [isShowing, setIsShowing] = useState(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleClose = () => {
    setIsShowing(false);
    sessionStorage.setItem("KarmaCreditClosed", JSON.stringify(true));
  };

  useEffect(() => {
    const KarmaCreditClosed = JSON.parse(
      sessionStorage.getItem("KarmaCreditClosed") || "false"
    );
    setIsShowing(!KarmaCreditClosed);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // console.log("Current page: ", currentPage);
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/delegates?name=${props}&offset=${currentPage}&order=desc&field=delegatedVotes&period=lifetime&pageSize=20&statuses=active,inactive,withdrawn,recognized`
        );
        const daoInfo = await res.json().then((delegates) => delegates.data);
        setDelegateData((prevData: any) => ({
          delegates: [...prevData.delegates, ...daoInfo.delegates],
        }));
        setTempData((prevData: any) => ({
          delegates: [...prevData.delegates, ...daoInfo.delegates],
        }));
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleSearchChange = async (query: string) => {
    // console.log("query: ", query.length);

    setSearchQuery(query);
    setPageLoading(true);

    if (query.length > 0) {
      // console.log("Delegate data: ", query, delegateData);
      // console.log(delegateData);
      setIsSearching(true);
      window.removeEventListener("scroll", handleScroll);

      const res = await fetch(
        `https://api.karmahq.xyz/api/dao/search-delegate?user=${query}&pageSize=10&offset=0&period=lifetime&order=desc&dao=${props}`
      );
      const filtered = await res.json().then((delegates) => delegates.data);

      // console.log("Filtered Data: ", query, filtered);
      setDelegateData({ delegates: filtered.delegates });
      setPageLoading(false);
    } else {
      // console.log("in else");
      setIsSearching(false);
      setDelegateData({ ...delegateData, delegates: tempData.delegates });
      setPageLoading(false);
      window.addEventListener("scroll", handleScroll);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const threshold = 100;
    if (
      !isDataLoading &&
      scrollTop + clientHeight >= scrollHeight - threshold
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (isSearching === false) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const WalletOpen = async (to: string) => {
    const adr = await walletClient.getAddresses();
    console.log(adr);
    const address1 = adr[0];
    console.log(address1);

    let parts = path.split("/");
    let firstStringAfterSlash = parts[1];

    let chainAddress;
    console.log(delegateData.delegates[0].daoName);

    if (delegateData.delegates[0].daoName === "optimism") {
      chainAddress = "0x4200000000000000000000000000000000000042";
    } else if (delegateData.delegates[0].daoName === "arbitrum") {
      chainAddress = "0x912CE59144191C1204E64559FE8253a0e49E6548";
    } else {
      return;
    }
    console.log(chainAddress);

    if (isConnected) {
      if (walletClient.chain?.network === firstStringAfterSlash) {
        const delegateTx = await walletClient.writeContract({
          address: chainAddress,
          abi: dao_abi.abi,
          functionName: "delegate",
          args: [to],
          account: address1,
        });
        console.log(delegateTx);
      } else {
        toast.error("Please switch to appropriate network to delegate!");
        if (openChainModal) {
          openChainModal();
        }
      }
    } else {
      if (openConnectModal) {
        openConnectModal();
      }
    }
  };

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return 0;
    }
  };

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    if (
      selectedValue === "Random" ||
      selectedValue === "Most delegators" ||
      selectedValue === "Karma score" ||
      selectedValue === "Most active"
    ) {
      toast("Coming Soon 🚀");
    }
  };

  const scrollToSection = (sectionId: string, duration = 1000) => {
    const section = document.getElementById(sectionId);

    if (section) {
      const startingY = window.scrollY;
      const targetY = section.offsetTop - 250;
      const distance = targetY - startingY;
      const startTime = performance.now();

      function scrollStep(timestamp: any) {
        const elapsed = timestamp - startTime;

        window.scrollTo(
          0,
          startingY + easeInOutQuad(elapsed, 0, distance, duration)
        );

        if (elapsed < duration) {
          requestAnimationFrame(scrollStep);
        }
      }

      function easeInOutQuad(t: any, b: any, c: any, d: any) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(scrollStep);
    }
  };

  return (
    <div>
      {isShowing && (
        <div
          className="bg-yellow-200 border border-gray-300 rounded-md shadow-md text-gray-700 flex items-center p-3 w-70 mb-4"
          style={{ width: "80%" }}
        >
          <span>
            Data of the Delegates is retrieved from Karma API. Find out how they
            empower communities.
          </span>{" "}
          &nbsp;
          <a
            href="http://karmahq.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-medium hover:underline"
          >
            Click Here!🚀
          </a>
          <button
            className="flex ml-auto items-center justify-center p-1 text-gray-500 hover:text-red-500 bg-white border border-gray-300 rounded-md"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
      <div className="flex items-center justify-between pe-10">
        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-1/3 rounded-full my-3 font-poppins"
        >
          <input
            type="text"
            placeholder="Search by Address or ENS Name"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 pr-3 rounded-full outline-none w-full"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div>
        <div>
          <select
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="rounded-full py-2 px-4 outline-none cursor-pointer"
            onChange={handleSelectChange}
          >
            <option>Most voting power</option>
            <option>Random</option>
            <option>Most delegators</option>
            <option>Karma score</option>
            <option>Most active</option>
          </select>
        </div>
      </div>

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
        ) : delegateData.delegates.length > 0 ? (
          <div>
            <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 ">
              {delegateData.delegates.map((daos: any, index: number) => (
                <div
                  onClick={() =>
                    router.push(`/${props}/${daos.publicAddress}?active=info  `)
                  }
                  key={index}
                  style={{
                    boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                  }}
                  className="px-5 py-7 rounded-2xl flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex justify-center relative">
                      <Image
                        src={
                          daos.profilePicture == null
                            ? props == "optimism"
                              ? OPLogo
                              : props == "arbitrum"
                              ? ARBLogo
                              : ""
                            : daos.profilePicture
                        }
                        alt="Image not found"
                        width={80}
                        height={80}
                        className="rounded-full"
                      ></Image>

                      <Image
                        src={ccLogo}
                        alt="ChoraClub Logo"
                        className="absolute top-0 right-0"
                        style={{
                          width: "35px",
                          height: "35px",
                          marginTop: "-20px",
                          marginRight: "-5px",
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="py-3">
                        <div
                          className={`font-semibold overflow-hidden ${styles.desc}`}
                        >
                          {daos.ensName == null ? (
                            <span>
                              {daos.publicAddress.slice(0, 6) +
                                "..." +
                                daos.publicAddress.slice(-4)}
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
                          {daos.publicAddress.slice(0, 6) +
                            "..." +
                            daos.publicAddress.slice(-4)}
                          <Tooltip
                            content="Copy"
                            placement="right"
                            closeDelay={1}
                            showArrow
                          >
                            <span className="cursor-pointer text-sm">
                              <IoCopy
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCopy(daos.publicAddress);
                                }}
                              />
                            </span>
                          </Tooltip>
                        </div>
                        <div className="text-sm border border-[#D9D9D9] py-2 px-1 rounded-lg w-full">
                          <span className="text-blue-shade-200 font-semibold">
                            {formatNumber(daos.delegatedVotes)}&nbsp;
                          </span>
                          delegated tokens
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <button
                        className="bg-blue-shade-100 text-white font-poppins w-full rounded-[4px] text-sm py-1 font-medium"
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent event propagation to parent container
                          WalletOpen(daos.publicAddress);
                        }}
                      >
                        Delegate
                      </button>
                    </div>
                  </div>
                  <div style={{ zIndex: "21474836462" }}>
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
              ))}
            </div>
            {isDataLoading && (
              <div className="flex items-center justify-center my-4">
                <RotatingLines
                  visible={true}
                  width="40"
                  strokeColor="#0500FF"
                  ariaLabel="oval-loading"
                />
              </div>
            )}
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

      <div className="fixed right-5 bottom-5 cursor-pointer">
        <div
          className="bg-blue-shade-100 p-3 rounded-full"
          onClick={() => scrollToSection("secondSection")}
        >
          <FaArrowUp size={25} color="white" />
        </div>
      </div>
    </div>
  );
}

export default DelegatesList;
