"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState, useCallback } from "react";
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
import { useAccount } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import {
  processAddressOrEnsName,
  resolveENSProfileImage,
  getMetaAddressOrEnsName,
  fetchEnsAvatar,
} from "@/utils/ENSUtils";
import DelegateListSkeletonLoader from "../SkeletonLoader/DelegateListSkeletonLoader";
import DelegateTileModal from "../ComponentUtils/DelegateTileModal";
import {
  arb_client,
  DELEGATE_CHANGED_QUERY,
  op_client,
} from "@/config/staticDataUtils";
import { getChainAddress } from "@/utils/chainUtils";
import { arbitrum, optimism } from "viem/chains";
import { CiSearch } from "react-icons/ci";
const cache: any = {
  optimism: null,
  arbitrum: null,
};
let pageCache: any = null;
function DelegatesList({ props }: { props: string }) {
  const [delegateData, setDelegateData] = useState<any>({ delegates: [] });
  const { openChainModal } = useChainModal();
  const network = useAccount().chain;
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
  const { chain } = useAccount();
  const [delegateInfo, setDelegateInfo] = useState<any>();
  const [selectedDelegate, setSelectedDelegate] = useState<any>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { address } = useAccount();
  const [delegatingToAddr, setDelegatingToAddr] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleRetry = () => {
    setError(null);
    setCurrentPage(0);
    setDelegateData({ delegates: [] });
    setTempData({ delegates: [] });
    window.location.reload();
  };

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

  const fetchData = async (lastCursor: string | null) => {
    try {
      setDataLoading(true);
      const res = await fetch(
        // props === "arbitrum"
        //   ? `/api/get-arbitrum-delegatelist?lastCursor=${lastCursor || ""}`
        //   :
        `/api/get-delegate?skip=${skip}&dao=${props}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const daoInfo = await res.json();
      let formattedDelegates;
      // if (props === "arbitrum") {
      //   formattedDelegates = daoInfo.delegates.nodes.map((delegate: any) => {
      //     return {
      //       delegate: delegate.account.address,
      //       adjustedBalance: delegate.votesCount / 10 ** 18,
      //       ensName: delegate.account.ens,
      //       profilePicture: delegate.account.picture,
      //     };
      //   });
      // } else {
      setSkip(daoInfo.nextSkip);
      setHasMore(daoInfo.hasMore);
      formattedDelegates = await Promise.all(
        daoInfo.delegates.map(async (delegate: any) => {
          // const ensName = await fetchEnsNames(delegate._id);
          // console.log(ensName);
          const avatar = await fetchEnsAvatar(delegate.delegate);
          return {
            delegate: delegate.delegate,
            adjustedBalance: delegate.latestBalance / 10 ** 18,
            newBalance: delegate.latestBalance,
            profilePicture: avatar?.avatar,
            ensName: avatar?.ensName,
          };
        })
      );
      // }

      setDelegateData((prevData: any) => ({
        delegates: [...prevData?.delegates, ...formattedDelegates],
      }));
      setTempData((prevData: any) => ({
        delegates: [...prevData.delegates, ...formattedDelegates],
      }));

      setLastCursor(daoInfo.delegates?.pageInfo?.lastCursor);

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
  useEffect(() => {
    if (cache[props]) {
      // Use cached data if available
      setDelegateData(cache[props]);
      setCurrentPage(pageCache + 1);
      setTempData(cache[props]);
      setLastCursor(cache[props].lastCursor || null);
      setPageLoading(false);
      setDataLoading(false);
    } else {
      setDataLoading(true);
      fetchData(null);
      setDataLoading(false);
    }
  }, [props]);

  useEffect(() => {
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
  const handleSearchChange = async (query: string) => {
    setPageLoading(true);
    if (query.length > 0) {
      setIsSearching(true);
      window.removeEventListener("scroll", handleScroll);

      try {
        const res = await fetch(
          `/api/search-delegate?address=${query}&dao=${props}`
        );
        const filtered = await res.json();
        const data = await fetchEnsAvatar(filtered[0].id);
        if (filtered) {
          const formattedDelegates = {
            delegate: filtered[0].id,
            adjustedBalance: filtered[0].latestBalance / 10 ** 18,
            profilePicture: data?.avatar,
            ensName: data?.ensName,
          };
          setDelegateData({ delegates: [formattedDelegates] });
          setPageLoading(false);
        } else {
          // No results found
          setDelegateData({ delegates: [] });
        }
      } catch (error) {
        // console.error("Error fetching search results:", error);
        console.log("No results found");
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

  const handleScroll = useCallback(
    debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      const threshold = 100;
      if (
        scrollTop + clientHeight >= scrollHeight - threshold &&
        !isDataLoading
      ) {
        fetchData(lastCursor || "");
      }
    }, 200),
    [fetchData, isDataLoading, hasMore]
  );

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
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
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

        const delegate = data.data.delegateChangeds[0]?.toDelegate;
        setSame(
          delegate.toLowerCase() === delegateObject.delegate.toLowerCase()
        );
        setDelegateDetails(delegate);
        setError(null);
      } catch (err: any) {
        console.log(err);
        // setError(err.message);
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
    // let address;
    // let address1;

    // try {
    //   address = await walletClient.getAddresses();
    //   address1 = address[0];
    // } catch (error) {
    //   console.error("Error getting addresses:", error);
    //   toast.error("Please connect your MetaMask wallet!");
    //   return;
    // }

    if (!address) {
      toast.error("Please connect your wallet!");
      return;
    }

    const chainAddress = getChainAddress(chain?.name);
    console.log("walletClient?.chain:: ", walletClient?.chain);
    if (walletClient?.chain === "") {
      toast.error("Please connect your wallet!");
    } else {
      let network;
      if (props === "optimism") {
        network = "OP Mainnet";
      } else if (props === "arbitrum") {
        network = "Arbitrum One";
      }

      console.log("network: ", network);

      if (walletClient?.chain.name === network) {
        try {
          setDelegatingToAddr(true);
          console.log("address::::: ", address);
          const delegateTx = await walletClient.writeContract({
            address: chainAddress,
            chain: props === "arbitrum" ? arbitrum : optimism,
            abi: dao_abi.abi,
            functionName: "delegate",
            args: [to],
            account: address,
          });

          setDelegatingToAddr(false);
          setConfettiVisible(true);
          setTimeout(() => setConfettiVisible(false), 5000);
          // handleCloseDelegateModal();
        } catch (error) {
          setDelegatingToAddr(false);
          toast.error("Transaction failed");
          // handleCloseDelegateModal();
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
      <div className="flex items-center justify-between pe-10">
        {/* <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-1/3 rounded-full my-3 font-poppins"
        >
          <input
            type="text"
            placeholder="Search by Address"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 pr-3 rounded-full outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchChange(searchQuery);  // Call the function when Enter is pressed
              }
            }}
          ></input>
          <span className="flex items-center bg-black rounded-full px-5 py-2">
            <Image src={search} alt="search" width={20} />
          </span>
        </div> */}

        <div
          className={`flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer w-[300px] xs:w-[365px] my-3 font-poppins`}
        >
          <CiSearch
            className={`text-base transition-all duration-700 ease-in-out ml-3`}
          />
          <input
            type="text"
            placeholder="Search by Address"
            className="w-[100%] pl-2 pr-4 py-1.5 font-poppins md:py-2 text-sm bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchChange(searchQuery); // Call the function when Enter is pressed
              }
            }}
          />
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
              {delegateData.delegates.map((delegate: any, index: number) => (
                <>
                  <div
                    onClick={(event) => {
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
                              : delegate?.profilePicture
                          }
                          alt="Image not found"
                          width={200}
                          height={200}
                          className="rounded-full w-20 h-20"
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
                    <div style={{ zIndex: "21474836462" }}></div>
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
                      delegatingToAddr={delegatingToAddr}
                      confettiVisible={confettiVisible}
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
