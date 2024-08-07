"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
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
import { useAccount, useNetwork } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";
// import { getEnsNameOfUser } from "../ConnectWallet/ENSResolver";
import {
  processAddressOrEnsName,
  resolveENSProfileImage,
  getMetaAddressOrEnsName,
  fetchEnsAvatar,
} from "@/utils/ENSUtils";
import DelegateListSkeletonLoader from "../SkeletonLoader/DelegateListSkeletonLoader";
import DelegateTileModal from "../ComponentUtils/delegateTileModal";
import {
  arb_client,
  DELEGATE_CHANGED_QUERY,
  op_client,
} from "@/config/staticDataUtils";
import { RiErrorWarningLine } from "react-icons/ri";

// Create a cache object outside of the component to persist across re-renders
const cache: any = {
  optimism: null,
  arbitrum: null,
};
let pageCache: any = null;
function DelegatesList({ props }: { props: string }) {
  const [delegateData, setDelegateData] = useState<any>({ delegates: [] });
  const { openChainModal } = useChainModal();
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
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
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [delegateDetails, setDelegateDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [same, setSame] = useState(false);
  const { chain, chains } = useNetwork();
  const [delegateInfo, setDelegateInfo] = useState<any>();
  const [selectedDelegate, setSelectedDelegate] = useState<any>(null);

  const address = useAccount();

  const handleRetry = () => {
    setError(null);
    setCurrentPage(0);
    setDelegateData({ delegates: [] });
    setTempData({ delegates: [] });
    window.location.reload();
    // Retry fetching data
    // fetchData(null);
  };

  const ErrorDisplay = ({ message, onRetry }: any) => (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg shadow-md">
      <RiErrorWarningLine className="text-red-500 text-5xl mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-red-600 text-center mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );

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

  useEffect(() => {
    const fetchData = async (lastCursor: string | null) => {
      try {
        // throw new Error(`fake error :${TimeoutError}`)
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
              // console.log("avatar", avatar);
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
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
          setError("Please check your internet connection and try again.");
        } else if (error.name === "TimeoutError") {
          setError(
            "The request is taking longer than expected. Please try again."
          );
        } else if (error.name === "SyntaxError") {
          setError(
            "We're having trouble processing the data. Please try again later."
          );
        } else {
          setError(
            "Unable to load delegates. Please try again in a few moments."
          );
        }
      } finally {
        setPageLoading(false);
        setDataLoading(false);
      }
    };

    fetchData(lastCursor || "");
  }, [currentPage]);

  // let uniqueDelegates = new Set();
  // useEffect(() => {
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
            // console.log("avatar", avatar);
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
      // { delegates : [...formattedDelegates]};
      setTempData((prevData: any) => ({
        delegates: [...prevData.delegates, ...formattedDelegates],
      }));

      setLastCursor(daoInfo.delegates?.pageInfo?.lastCursor);
      console.log("lastCursor", daoInfo);
      setDataLoading(false);
      cache[props] = {
        delegates: [...(cache[props]?.delegates || []), ...formattedDelegates],
        lastCursor: daoInfo.delegates?.pageInfo?.lastCursor || null,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setPageLoading(false);
    }
  };

  // fetchData(lastCursor || "");
  // }, [currentPage]);
  // useEffect(() => {
  //   fetchData(lastCursor || "");
  // },[currentPage]);

  useEffect(() => {
    console.log(cache[props]);
    if (cache[props]) {
      console.log("Using cached data");
      // Use cached data if available
      console.log("pageCache", pageCache);
      console.log(cache[props]);
      setDelegateData(cache[props]);
      setCurrentPage(pageCache + 1);
      setTempData(cache[props]);
      setLastCursor(cache[props].lastCursor || null);
      setPageLoading(false);
      setDataLoading(false);
    } else {
      // Fetch data if not in cache
      console.log("Fetching data");
      setDataLoading(true);
      fetchData(null);
      setDataLoading(false);
    }
  }, [props]);

  useEffect(() => {
    console.log("last", lastCursor);
    if (currentPage > 0 || lastCursor) {
      fetchData(lastCursor || "");
    }
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

      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/search-delegate?user=${query}&pageSize=10&offset=0&period=lifetime&order=desc&dao=${props}`
        );
        const filtered = await res.json().then((delegates) => delegates.data);

        // console.log(
        //   "Filtered Data: ",
        //   query,
        //   filtered.delegates[0].publicAddress
        // );

        if (filtered.delegates && filtered.delegates.length > 0) {
          const formattedDelegates = filtered.delegates.map(
            (delegate: any) => ({
              // console.log("delegate",delegate)
              delegate: delegate.publicAddress,
              adjustedBalance: delegate.delegatedVotes,
              // newBalance: delegate.newBalance,
              profilePicture: delegate.profilePicture, // Assuming `avatar` is a property of delegate
              ensName: delegate.ensName, // Uncomment if ensName is needed and exists
            })
          );
          console.log("formattedDelegates", formattedDelegates);
          setDelegateData({ delegates: formattedDelegates });
          // setPageLoading(false);
        } else {
          // No results found
          setDelegateData({ delegates: [] });
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setDelegateData({ delegates: [] });
        setPageLoading(false);
      }
    } else {
      // console.log("in else");
      setIsSearching(false);
      setDelegateData({ ...delegateData, delegates: tempData.delegates });
      setPageLoading(false);
      window.addEventListener("scroll", handleScroll);
    }
    setPageLoading(false);
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
      pageCache = currentPage + 1;
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

  const handleDelegateModal = async (delegateObject: any) => {
    setSelectedDelegate(delegateObject);
    console.log("delegateObject----------", delegateObject);
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
      console.log(delegateObject.delegate);
      setDelegateOpen(true);
      // setLoading(true);
      try {
        let data: any;
        if (props === "optimism") {
          data = await op_client.query(DELEGATE_CHANGED_QUERY, {
            delegator: address,
          });
        } else {
          data = await arb_client.query(DELEGATE_CHANGED_QUERY, {
            delegator: address,
          });
        }
        // const ens = await getEnsNameOfUser(
        //   data.delegateChangeds[0]?.toDelegate
        // );
        console.log("data of individual delegate: ", data.data);
        const delegate = data.data.delegateChangeds[0]?.toDelegate;
        console.log("individualDelegate", delegate);
        setSame(
          delegate.toLowerCase() === delegateObject.delegate.toLowerCase()
        );
        // ens
        // ? setDelegate(ens)
        // :
        console.log("delegate N/A: ", delegate);
        setDelegateDetails(delegate);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        // setLoading(false);
      }

      setDelegateOpen(true);
    }
  };

  const handleCloseDelegateModal = () => {
    setSelectedDelegate(null);
    setDelegateOpen(false);
  };

  const handleDelegateVotes = async (to: string) => {
    let address;
    let address1;

    try {
      address = await walletClient.getAddresses();
      address1 = address[0];
    } catch (error) {
      console.error("Error getting addresses:", error);
      toast.error("Please connect your MetaMask wallet!");
      return;
    }

    if (!address1) {
      toast.error("Please connect your MetaMask wallet!");
      return;
    }

    console.log("address", address);
    console.log("address1", address1);
    console.log("to: ", to);

    let chainAddress;
    if (chain?.name === "Optimism") {
      chainAddress = "0x4200000000000000000000000000000000000042";
    } else if (chain?.name === "Arbitrum One") {
      chainAddress = "0x912CE59144191C1204E64559FE8253a0e49E6548";
    } else {
      return;
    }

    console.log("walletClient?.chain?.network", walletClient?.chain?.network);

    if (walletClient?.chain === "") {
      toast.error("Please connect your wallet!");
    } else {
      if (walletClient?.chain?.network === props) {
        try {
          const delegateTx = await walletClient.writeContract({
            address: chainAddress,
            abi: dao_abi.abi,
            functionName: "delegate",
            args: [to],
            account: address1,
          });

          console.log(delegateTx);
          handleCloseDelegateModal();
        } catch (error) {
          toast.error("Transaction failed");
          handleCloseDelegateModal();
        }
      } else {
        toast.error("Please switch to appropriate network to delegate!");

        if (openChainModal) {
          openChainModal();
        }
      }
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

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
                <>
                  <div
                    onClick={(event) => {
                      // handleMouseMove(event,index);
                      router.push(
                        `/${props}/${delegate.delegate}?active=info  `
                      );
                    }}
                    key={index}
                    style={{
                      boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                    }}
                    className="px-5 py-7 rounded-2xl flex flex-col justify-between cursor-pointer relative"
                  >
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
                            handleDelegateModal(delegate);
                          }}
                        >
                          Delegate
                        </button>
                      </div>
                    </div>
                    <div style={{ zIndex: "21474836462" }}>
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
                  </div>
                  {delegateOpen && (
                    <DelegateTileModal
                      isOpen={delegateOpen}
                      closeModal={handleCloseDelegateModal}
                      handleDelegateVotes={() =>
                        handleDelegateVotes(`${selectedDelegate.delegate}`)
                      }
                      fromDelegate={delegateDetails ? delegateDetails : "N/A"}
                      delegateName={
                        !selectedDelegate?.ensName
                          ? selectedDelegate.delegate?.slice(0, 6) +
                            "..." +
                            selectedDelegate.delegate?.slice(-4)
                          : selectedDelegate.ensName ===
                            "[693c70956042e4295f0c73589e9ac0850b5b7d276a02639b83331ec323549b88].sismo.eth"
                          ? "lindajxie.eth"
                          : selectedDelegate.ensName?.length > 15
                          ? selectedDelegate.ensName?.slice(0, 15) + "..."
                          : selectedDelegate.ensName
                      }
                      displayImage={
                        selectedDelegate?.profilePicture == null
                          ? props == "optimism"
                            ? OPLogo
                            : props == "arbitrum"
                            ? ARBLogo
                            : ""
                          : selectedDelegate.profilePicture
                      }
                      daoName={props}
                      addressCheck={same}
                    />
                  )}
                </>
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
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "Oops, no such result available!"}
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
