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
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import toast, { Toaster } from "react-hot-toast";
import styles from "@/components/IndividualDelegate/DelegateVotes.module.css";
import { FaArrowUp } from "react-icons/fa6";
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import dao_abi from "../../artifacts/Dao.sol/GovernanceToken.json";
import { useAccount } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";
// import { getEnsNameOfUser } from "../ConnectWallet/ENSResolver";
import {
  processAddressOrEnsName,
  resolveENSProfileImage,
  getMetaAddressOrEnsName,
  fetchEnsAvatar,
} from "@/utils/ENSUtils";
import DelegateListSkeletonLoader from "../SkeletonLoader/DelegateListSkeletonLoader";

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
  const [lastCursor, setLastCursor] = useState<string | null>(null);

  // const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  // const [clickedTileIndex,setClickedTileIndex]=useState(null);

  const handleClose = () => {
    setIsShowing(false);
    sessionStorage.setItem("KarmaCreditClosed", JSON.stringify(true));
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("inside useEffect");

  //       const [avatar] = await Promise.all([
  //         fetchEnsAvatar("0x5e349eca2dc61abcd9dd99ce94d04136151a09ee"),
  //       ]);

  //       console.log("avatar...", avatar);
  //     } catch (error) {
  //       console.error("Error fetching ENS avatar:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const KarmaCreditClosed = JSON.parse(
      sessionStorage.getItem("KarmaCreditClosed") || "false"
    );
    setIsShowing(!KarmaCreditClosed);
  }, []);

  // let uniqueDelegates = new Set();
  useEffect(() => {
    const fetchData = async (lastCursor: string | null) => {
      try {
        setDataLoading(true);
        console.log("its props", props);
        console.log("currentPage", currentPage);
        const res = await fetch(
          props === "arbitrum"
            ? `/api/get-arbitrum-delegatelist?lastCursor=${lastCursor || ""}`
            : `/api/get-delegatelist?currentPage=${currentPage}`
        );
        console.log("res", res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const daoInfo = await res.json();

        let formattedDelegates;
        if (props === "arbitrum") {
          formattedDelegates = daoInfo.delegates.nodes.map((delegate: any) => {
            return {
              delegate: delegate.account.address,
              adjustedBalance: delegate.votesCount / 10 ** 18,
              ensName: delegate.account.ens,
              profilePicture: delegate.account.picture,
            };
          });
        } else {
          formattedDelegates = await Promise.all(
            daoInfo.map(async (delegate: any) => {
              // const ensName = await getEnsNameOfUser(delegate._id);
              const avatar = await fetchEnsAvatar(delegate._id);
              console.log("avatar", avatar);
              return {
                delegate: delegate._id,
                adjustedBalance: delegate.adjustedBalance,
                newBalance: delegate.newBalance,
                profilePicture: avatar?.avatar,
                ensName: avatar?.ensName,
              };
            })
          );
        }

        setDelegateData((prevData: any) => ({
          delegates: [...prevData.delegates, ...formattedDelegates],
        }));

        setTempData((prevData: any) => ({
          delegates: [...prevData.delegates, ...formattedDelegates],
        }));

        setLastCursor(daoInfo.delegates?.pageInfo?.lastCursor);
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData(lastCursor || "");
  }, [currentPage]);
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  // const handleSearchChange = async (query: string) => {
  //   console.log("query: ", query.length);

  //   setSearchQuery(query);
  //   setPageLoading(true);

  //   if (query.length > 0) {
  //     // console.log("Delegate data: ", query, delegateData);
  //     // console.log(delegateData);
  //     setIsSearching(true);
  //     window.removeEventListener("scroll", handleScroll);
  //     console.log(props)
  //     console.log("lowercasee", query.toLowerCase())
  //     const res = await fetch(
  //       props === "optimism" ? `/api/get-delegatelist?user=${query.toLowerCase()}` : `/api/get-arbitrum-delegatelist?user=${query}`
  //       // `https://api.karmahq.xyz/api/dao/search-delegate?user=${query}&pageSize=10&offset=0&period=lifetime&order=desc&dao=${props}`
  //     );
  //     console.log("res: ", res);
  //     let filtered: any = await res.json();
  //     filtered.delegate === null ? filtered = [] : null;
  //     console.log(filtered);

  //     if (props === "optimism") {
  //       const formattedDelegates = await Promise.all(
  //         filtered.map(async (delegate: any) => {
  //           // const ensName = await getEnsNameOfUser(delegate._id);
  //           return {
  //             delegate: delegate._id,
  //             adjustedBalance: delegate.adjustedBalance,
  //             newBalance: delegate.newBalance,
  //             // ensName: ensName,
  //           };
  //         })
  //       );
  //       console.log("formate", formattedDelegates);

  //       setDelegateData({ delegates: [...formattedDelegates] });

  //       setPageLoading(false);
  //     } else {
  //       let formattedDelegates: any;
  //       filtered.delegate ? formattedDelegates = {
  //         delegate: filtered.delegate?.account.address,
  //         adjustedBalance: filtered.delegate?.votesCount / 10 ** 18,
  //         ensName: filtered.delegate?.account.ens,
  //       } : formattedDelegates = [];
  //       console.log("formattedDelegates", formattedDelegates)
  //       // setDelegateData({ delegates: [formattedDelegates] });
  //       setDelegateData({ delegates: Array.isArray(formattedDelegates) ? formattedDelegates : [formattedDelegates] });

  //       setPageLoading(false);

  //     }

  //   } else {

  //     setIsSearching(false);
  //     setDelegateData({ ...delegateData, delegates: tempData.delegates });
  //     setPageLoading(false);
  //     window.addEventListener("scroll", handleScroll);
  //   }
  // };
  // // Debounced version of handleSearchChange
  // const debouncedHandleSearchChange = debounce(handleSearchChange, 300); // Delay of 300ms

  // // Use the debounced function instead of handleSearchChange
  // const handleSearchChangeWithDebounce = async (query: string) => {
  //   debouncedHandleSearchChange(query);
  // };
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

      console.log(
        "Filtered Data: ",
        query,
        filtered.delegates[0].publicAddress
      );
      const formattedDelegates = filtered.delegates.map((delegate: any) => ({
        // console.log("delegate",delegate)
        delegate: delegate.publicAddress,
        adjustedBalance: delegate.delegatedVotes,
        // newBalance: delegate.newBalance,
        profilePicture: delegate.profilePicture, // Assuming `avatar` is a property of delegate
        ensName: delegate.ensName, // Uncomment if ensName is needed and exists
      }));
      console.log("formattedDelegates", formattedDelegates);
      setDelegateData({ delegates: formattedDelegates });
      setPageLoading(false);
    } else {
      // console.log("in else");
      setIsSearching(false);
      setDelegateData({ ...delegateData, delegates: tempData.delegates });
      setPageLoading(false);
      window.addEventListener("scroll", handleScroll);
    }
  };

  const handleScroll = debounce(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const threshold = 100;
    if (
      !isDataLoading &&
      scrollTop + clientHeight >= scrollHeight - threshold
    ) {
      console.log("fetching more data");
      setCurrentPage((prev) => prev + 1);
    }
  }, 200); // Adjust the debounce wait time as necessary

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDataLoading, currentPage]);

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
  // const handleMouseMove = (event:any,index:any) => {
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   setCirclePosition({ x, y });
  //   setClickedTileIndex(index);
  //   console.log(circlePosition);

  //   setTimeout(() => {
  //     setClickedTileIndex(null);
  //   }, 1500); // Adjust the time as needed

  // };

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
            We apologize for the inconvenience; we&apos;re currently working on
            sourcing accurate data and it will be available soon.
          </span>{" "}
          &nbsp;
          {/* <a
            href="http://karmahq.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-medium hover:underline"
          >
            Click Here!🚀
          </a> */}
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
            placeholder="Search by Address"
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
          <DelegateListSkeletonLoader />
        ) : delegateData.delegates.length > 0 ? (
          <div>
            <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10">
              {console.log("data............", delegateData)}
              {delegateData.delegates.map((delegate: any, index: number) => (
                <div
                  onClick={(event) => {
                    // handleMouseMove(event,index);
                    router.push(`/${props}/${delegate.delegate}?active=info  `);
                  }}
                  key={index}
                  style={{
                    boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                  }}
                  className="px-5 py-7 rounded-2xl flex flex-col justify-between cursor-pointer relative"
                >
                  {/* {clickedTileIndex === index && (
                    <div
                    className="absolute bg-blue-200 rounded-full animate-ping"
                    style={{
                    width: "30px",
                    height: "30px",
                    left: `${circlePosition.x -10}px`,
                    top: `${circlePosition.y - 10}px`,
                    zIndex: "9999",
                   }}
                   ></div>
                  )} */}
                  <div>
                    <div className="flex justify-center relative">
                      <Image
                        src={
                          delegate?.profilePicture == null
                            ? props == "optimism"
                              ? OPLogo
                              : props == "arbitrum"
                              ? ARBLogo
                              : ""
                            : delegate.profilePicture
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
                          {!delegate?.ensName ? (
                            <span>
                              {delegate.delegate?.slice(0, 6) +
                                "..." +
                                delegate.delegate?.slice(-4)}
                            </span>
                          ) : (
                            <span>
                              {delegate.ensName ===
                              "[693c70956042e4295f0c73589e9ac0850b5b7d276a02639b83331ec323549b88].sismo.eth"
                                ? "lindajxie.eth"
                                : delegate.ensName.length > 15
                                ? delegate.ensName.slice(0, 15) + "..."
                                : delegate.ensName}
                              {/* {delegate.ensName.length > 15
                                ? delegate.ensName.slice(0, 15) + "..."
                                : delegate.ensName} */}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-center items-center gap-2 pb-2 pt-1">
                          {delegate.delegate?.slice(0, 6) +
                            "..." +
                            delegate.delegate?.slice(-4)}
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
                                  handleCopy(delegate.delegate);
                                }}
                              />
                            </span>
                          </Tooltip>
                        </div>
                        <div className="text-sm border border-[#D9D9D9] py-2 px-1 rounded-lg w-full">
                          <span className="text-blue-shade-200 font-semibold">
                            {formatNumber(delegate.adjustedBalance)}&nbsp;
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
                          WalletOpen(delegate.delegate);
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
