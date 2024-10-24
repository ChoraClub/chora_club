import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next-nprogress-bar";
import toast from "react-hot-toast";
// import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import { fetchEnsNameAndAvatar } from "@/utils/ENSUtils";
import DelegateTileModal from "../ComponentUtils/DelegateTileModal";
import {
  arb_client,
  DELEGATE_CHANGED_QUERY,
  op_client,
} from "@/config/staticDataUtils";
import { getChainAddress } from "@/utils/chainUtils";
import { arbitrum, optimism } from "viem/chains";
import { CiSearch } from "react-icons/ci";
import { IoCopy } from "react-icons/io5";
import { Tooltip } from "@nextui-org/react";
import dao_abi from "../../artifacts/Dao.sol/GovernanceToken.json";
import { useConnection } from "@/app/hooks/useConnection";
import OPLogo from "@/assets/images/daos/op.png";
import ARBLogo from "@/assets/images/daos/arbitrum.jpg";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import DelegateInfoCard from "./DelegateInfoCard";
import { truncateAddress } from "@/utils/text";
import DelegateListSkeletonLoader from "../SkeletonLoader/DelegateListSkeletonLoader";
import { ChevronDown } from "lucide-react";
import debounce from "lodash/debounce";
import { usePrivy } from "@privy-io/react-auth";

const DELEGATES_PER_PAGE = 20;
const DEBOUNCE_DELAY = 500;

function DelegatesList({ props }: { props: string }) {
  const {
    isConnected: isUserConnected,
    isSessionLoading,
    isLoading,
    isPageLoading,
    isReady,
  } = useConnection();
  const [delegateData, setDelegateData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDelegate, setSelectedDelegate] = useState<any>(null);
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [delegateDetails, setDelegateDetails] = useState<any>();
  const [same, setSame] = useState(false);
  const [delegatingToAddr, setDelegatingToAddr] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const router = useRouter();
  // const { openChainModal } = useChainModal();
  // const { openConnectModal } = useConnectModal();
  const { isConnected, address, chain } = useAccount();
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { ready, authenticated, login, logout } = usePrivy();

  const fetchDelegates = useCallback(async () => {
    setIsAPICalling(true);
    try {
      const res = await fetch(
        `/api/get-delegate?skip=${skip}&dao=${props}&limit=${DELEGATES_PER_PAGE}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const formattedDelegates = await Promise.all(
        data.delegates.map(async (delegate: any) => {
          return {
            ...delegate,
            adjustedBalance: delegate.latestBalance / 10 ** 18,
            profilePicture: props === "optimism" ? OPLogo : ARBLogo,
            ensName: truncateAddress(delegate.delegate),
          };
        })
      );

      setDelegateData((prev) => [...prev, ...formattedDelegates]);
      setSkip(data.nextSkip);
      setHasMore(data.hasMore);
      setError(null);
    } catch (error) {
      console.error("Error fetching delegates:", error);
      setError("Failed to fetch delegate data. Please try again.");
    } finally {
      setIsAPICalling(false);
    }
  }, [skip, props, hasMore, isAPICalling]);

  useEffect(() => {
    fetchDelegates();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query) {
          setDelegateData([]);
          setSkip(0);
          setHasMore(true);
          fetchDelegates();
          return;
        }

        setIsAPICalling(true);
        try {
          const res = await fetch(
            `/api/search-delegate?address=${query}&dao=${props}`
          );
          const filtered = await res.json();
          if (filtered.length > 0) {
            const formattedDelegate = {
              delegate: filtered[0].id,
              adjustedBalance: filtered[0].latestBalance / 10 ** 18,
              profilePicture: props === "optimism" ? OPLogo : ARBLogo,
              ensName: truncateAddress(filtered[0].id),
            };
            setDelegateData([formattedDelegate]);
          } else {
            setDelegateData([]);
          }
          setHasMore(false);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setDelegateData([]);
        } finally {
          setIsAPICalling(false);
          setSkip(0);
        }
      }, DEBOUNCE_DELAY),
    [props, fetchDelegates]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [debouncedSearch]);

  const handleDelegateModal = async (delegateObject: any) => {
    console.log("delegateObject", delegateObject);
    setSelectedDelegate(delegateObject);
    if (!isConnected && !authenticated)  {
      login()
      return;
    }

    setDelegateOpen(true);
    try {
      const data = await (props === "optimism" ? op_client : arb_client).query(
        DELEGATE_CHANGED_QUERY,
        {
          delegator: address,
        }
      );
      const delegate = data.data.delegateChangeds[0]?.toDelegate;
      setSame(
        delegate?.toLowerCase() === delegateObject.delegate.toLowerCase()
      );
      setDelegateDetails(delegate);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelegateVotes = async (to: string) => {
    if (!address) {
      toast.error("Please connect your wallet!");
      return;
    }

    const chainAddress = getChainAddress(chain?.name);
    const network = props === "optimism" ? "OP Mainnet" : "Arbitrum One";

    if (walletClient?.chain.name !== network) {
      toast.error("Please switch to the appropriate network to delegate!");
      // openChainModal?.();
      return;
    }

    try {
      setDelegatingToAddr(true);
      await walletClient.writeContract({
        address: chainAddress,
        chain: props === "arbitrum" ? arbitrum : optimism,
        abi: dao_abi.abi,
        functionName: "delegate",
        args: [to],
        account: address,
      });

      setConfettiVisible(true);
      setTimeout(() => setConfettiVisible(false), 5000);
      toast.success("Delegation successful!");
    } catch (error) {
      console.error("Delegation failed:", error);
      toast.error("Transaction failed");
    } finally {
      setDelegatingToAddr(false);
    }
  };

  const formatNumber = (number: number) => {
    if (number >= 1e6) return `${(number / 1e6).toFixed(2)}m`;
    if (number >= 1e3) return `${(number / 1e3).toFixed(2)}k`;
    return number.toFixed(2);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay
          message={error}
          onRetry={() => {
            setDelegateData([]);
            setSkip(0);
            setHasMore(true);
            fetchDelegates();
          }}
        />
      </div>
    );
  }

  const renderContent = () => {
    if (delegateData.length === 0 && !isLoading && !isAPICalling) {
      return (
        <>
          <div className="text-center py-12">
            <p className="text-2xl font-semibold mb-4">No delegates found</p>
            <p className="text-gray-600">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Try adjusting your search or filters"}
            </p>
          </div>
        </>
      );
    }

    if (delegateData.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {delegateData.map((delegate) => (
              <DelegateInfoCard
                key={delegate.delegate}
                delegate={delegate}
                daoName={props}
                onCardClick={() =>
                  router.push(`/${props}/${delegate.delegate}?active=info`)
                }
                onDelegateClick={handleDelegateModal}
                formatNumber={formatNumber}
              />
            ))}
          </div>
          {isAPICalling && <DelegateListSkeletonLoader />}
          {hasMore && !searchQuery && !isLoading && (
            <div className="flex justify-center mt-8">
              <button
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                onClick={fetchDelegates}
                disabled={isAPICalling}
              >
                {isAPICalling ? (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Load More
                    <ChevronDown className="w-4 h-4 ml-2 transform group-hover:translate-y-0.5 transition-transform duration-150 ease-in-out" />
                  </span>
                )}
              </button>
            </div>
          )}
        </>
      );
    }

    if (!isLoading) {
      return (
        <>
          <DelegateListSkeletonLoader />
        </>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-96 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search by Address"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {renderContent()}

      {delegateOpen && selectedDelegate && (
        <DelegateTileModal
          isOpen={delegateOpen}
          closeModal={() => setDelegateOpen(false)}
          handleDelegateVotes={() =>
            handleDelegateVotes(selectedDelegate.delegate)
          }
          fromDelegate={delegateDetails || "N/A"}
          delegateName={
            selectedDelegate.ensName ||
            `${selectedDelegate.delegate.slice(
              0,
              6
            )}...${selectedDelegate.delegate.slice(-4)}`
          }
          displayImage={
            selectedDelegate.profilePicture ||
            (props === "optimism" ? OPLogo : ARBLogo)
          }
          daoName={props}
          addressCheck={same}
          delegatingToAddr={delegatingToAddr}
          confettiVisible={confettiVisible}
        />
      )}
    </div>
  );
}

export default DelegatesList;
