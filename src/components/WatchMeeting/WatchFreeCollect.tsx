"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
  useSwitchChain,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { createCollectorClient, createCreatorClient } from "chora-protocol-sdk";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { IoArrowUpOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Holder } from "@/types/LeaderBoardTypes";

// const WatchFreeCollect = ({leaderBoardData}:{leaderBoardData:Holder}) => {
// import { BasicMintIcons, MinusIcon, PlusIcon } from "@/utils/MintIcons";
import styles from "./WatchSession.module.css";
import { NFT_LIGHTHOUSE_BASE_API_KEY } from "@/config/constants";
import op from "@/assets/images/daos/op.png";
import arb from "@/assets/images/daos/arbitrum.jpg";
import {
  DynamicAttendeeInterface,
  DynamicSessionInterface,
} from "@/types/MeetingTypes";
import { UserProfileInterface } from "@/types/UserProfileTypes";
import toast from "react-hot-toast";
// import { RefreshCw } from "lucide-react";
import {
  MinusIcon,
  PlusIcon,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Attendee extends DynamicAttendeeInterface {
  profileInfo: UserProfileInterface;
}

interface Meeting extends DynamicSessionInterface {
  attendees: Attendee[];
  hostProfileInfo: UserProfileInterface;
}

const TARGET_CHAIN_ID = 421614;
const API_KEY = NFT_LIGHTHOUSE_BASE_API_KEY || "";

const WatchFreeCollect = ({
  leaderBoardData,
  data,
  collection,
}: {
  leaderBoardData:Holder,
  data: Meeting;
  collection: string;
}) => {
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient()!;
  const { address, chain } = useAccount();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { writeContractAsync, writeContract } = useWriteContract();
  const [meetingInfo, setMeetingInfo] = useState<Meeting>();
  const [hasDeployedContractAddress, setHasDeployedContractAddress] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [number, setNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractDeploying, setIsContractDeploying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [deployedContractAddress, setDeployedContractAddress] = useState<
    string | null
  >(null);
  const [contractUri, setContractUri] = useState<string | null>(null);
  const [tokenMetadataURI, setTokenMetadataUri] = useState<string | null>(null);
  const [jsonUri, setJsonUri] = useState("");
  const [mintFee, setMintFee] = useState("0 ETH");
  const [ethToUsdConversionRate, setEthToUsdConversionRate] = useState(0);
  const [totalCostEth, setTotalCostEth] = useState("0 ETH");
  const [totalPurchaseCostCurrency, setTotalPurchaseCostCurrency] =
    useState("0 USD");
  const [mintComment, setMintComment] = useState("");
  const [mintReferral, setMintReferral] = useState<string>("");

  useEffect(() => {
    setMeetingInfo(data);
    if (data?.deployedContractAddress) {
      setDeployedContractAddress(data.deployedContractAddress);
      setHasDeployedContractAddress(true);
    }
    setMintReferral(searchParams.get("referrer") || "");
  }, [data, searchParams, address, session]);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthToUsdConversionRate(data.ethereum.usd);
      } catch (error) {
        console.error("Failed to fetch ETH to USD conversion rate:", error);
      }
    };
    fetchEthToUsdRate();
  }, []);

  useEffect(() => {
    const fetchCosts = async () => {
      if (deployedContractAddress) {
        try {
          const mintFeeResult = await publicClient.readContract({
            address: deployedContractAddress as `0x${string}`,
            abi: [
              {
                inputs: [],
                name: "mintFee",
                outputs: [
                  { internalType: "uint256", name: "", type: "uint256" },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            functionName: "mintFee",
          });

          const mintFeeEth = parseFloat(ethers.formatEther(mintFeeResult));
          const totalCostEthValue = mintFeeEth * number;
          setMintFee(`${mintFeeEth} ETH`);
          setTotalCostEth(`${totalCostEthValue} ETH`);

          if (ethToUsdConversionRate) {
            const totalPurchaseCostCurrencyValue =
              totalCostEthValue * ethToUsdConversionRate;
            setTotalPurchaseCostCurrency(
              `${totalPurchaseCostCurrencyValue.toFixed(2)} USD`
            );
          }
        } catch (error) {
          console.error("Failed to fetch costs:", error);
        }
      }
    };
    fetchCosts();
  }, [publicClient, deployedContractAddress, number, ethToUsdConversionRate]);

  const handleNetworkSwitch = async () => {
    if (chain?.id !== TARGET_CHAIN_ID) {
      if (switchChain) {
        try {
          setIsLoading(true);
          await switchChain({ chainId: TARGET_CHAIN_ID });
        } catch (error) {
          console.error("Failed to switch network:", error);
          alert(
            "Please switch to Arbitrum Sepolia network in your wallet and try again."
          );
          return false;
        } finally {
          setIsLoading(false);
        }
      } else {
        alert(
          "Network switching is not supported. Please manually switch to Arbitrum Sepolia network in your wallet and try again."
        );
        return false;
      }
    }
    return true;
  };

  const handleMint = async () => {
    if (!address && !session) {
      toast("Wallet not connected");
      openConnectModal?.();
      return;
    }

    if (!(await handleNetworkSwitch())) return;
    setIsMinting(true);
    try {
      const collectorClient = createCollectorClient({
        chainId: TARGET_CHAIN_ID,
        publicClient,
      });
      const mintReferralAddress =
        mintReferral.startsWith("0x") && mintReferral.length === 42
          ? (mintReferral as `0x${string}`)
          : undefined;

      const { parameters } = await collectorClient.mint({
        tokenContract: deployedContractAddress as `0x${string}`,
        mintType: "1155",
        tokenId: BigInt(1),
        quantityToMint: BigInt(number),
        mintComment,
        mintReferral: mintReferralAddress,
        minterAccount: address!,
      });

      const txHash = await writeContractAsync(parameters);
      console.log("txHash of minting:", txHash);
    } catch (error) {
      console.error("Minting failed:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleContractSubmit = async (contractAddress: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) myHeaders.append("x-wallet-address", address);

    const raw = JSON.stringify({
      meetingId: data.meetingId,
      host_address: data.host_address,
      deployedContractAddress: contractAddress,
    });

    try {
      const response = await fetch("/api/update-recorded-session", {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });
      const responseData = await response.json();
      console.log("responseData: ", responseData);
      return responseData;
    } catch (error) {
      console.error("Error submitting contract:", error);
    }
  };

  const handleDataSubmit = async () => {
    try {
      const jsonData = {
        name: data.title,
        description: data.description,
        imageCid: data?.nft_image,
      };

      const tokenMetadata = {
        name: data.title,
        description: data.description,
        image: data?.nft_image,
        attributes: [
          {
            trait_type: "Host",
            value: data.host_address,
          },
          {
            trait_type: "Meeting Id",
            value: data.meetingId,
          },
          // {
          //   trait_type: "Start Time",
          //   value: "1719468207",
          // },
          // {
          //   trait_type: "End Time",
          //   value: "1719469044",
          // },
        ],
      };
      const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });
      const jsonFile = new File(
        [jsonBlob],
        `${data.meetingId}-${data.dao_name}-metadata.json`,
        {
          type: "application/json",
        }
      );
      const jsonUploadResponse = await lighthouse.upload([jsonFile], API_KEY);
      const jsonCid = jsonUploadResponse.data.Hash;

      setJsonUri(jsonCid);
      setContractUri(`ipfs://${jsonCid}`);
      console.log("Form submitted with JSON URI:", jsonCid);

      const tokenMetadataJsonBlob = new Blob([JSON.stringify(tokenMetadata)], {
        type: "application/json",
      });
      const tokenMetadataJsonFile = new File(
        [tokenMetadataJsonBlob],
        `${data.meetingId}-${data.dao_name}-token-metadata.json`,
        {
          type: "application/json",
        }
      );
      const tokenMetadataJsonUploadResponse = await lighthouse.upload(
        [tokenMetadataJsonFile],
        API_KEY
      );
      const tokenMetadataJsonCid = tokenMetadataJsonUploadResponse.data.Hash;
      setTokenMetadataUri(`ipfs://${tokenMetadataJsonCid}`);
    } catch (error) {
      console.error("Error uploading to Lighthouse:", error);
      alert("Error uploading data. Please try again.");
    } finally {
    }
  };

  const handleFirstMinter = async () => {
    if (!address && !session) {
      toast("Wallet not connected");
      console.log("Not connected");
      openConnectModal?.();
      return;
    }

    if (!(await handleNetworkSwitch())) return;

    setIsLoading(true);
    setIsContractDeploying(true);
    try {
      await handleDataSubmit();
      const creatorClient = createCreatorClient({
        chainId: TARGET_CHAIN_ID,
        publicClient,
      });
      const { parameters } = await creatorClient.create1155({
        contract: { name: data.title, uri: contractUri || "" },
        token: {
          tokenMetadataURI: tokenMetadataURI || "",
        },
        account: address!,
      });

      const txHash: `0x${string}` = await writeContractAsync(parameters);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const transactionReceipt = await publicClient.getTransactionReceipt({
        hash: txHash,
      });
      const newContractAddress = transactionReceipt.logs[0].address;
      setDeployedContractAddress(newContractAddress);
      await handleContractSubmit(newContractAddress);
    } catch (error) {
      console.error("Error handling transaction:", error);
    } finally {
      setIsLoading(false);
      setIsContractDeploying(false);
    }
  };

  return (
    <div className="font-poppins overflow-hidden bg-gradient-to-br p-1 rounded-3xl transition-all duration-300 hover:shadow-lg">
      <div className="bg-white rounded-3xl overflow-hidden">
        <div className="flex justify-between items-center w-full bg-blue-600 py-4 px-6">
          <div className="flex items-center space-x-2 animate-fade-in">
            <span className="text-2xl">💎</span>
            <p className="font-bold text-lg text-white">Free NFT</p>
          </div>
          <div className="px-3 py-1 bg-blue-700 rounded-full transition-transform duration-300 hover:scale-105">
            <p className="text-blue-100 font-medium text-sm">
              {leaderBoardData?.maxSupply} Collected
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 px-6 py-4 bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setNumber((prev) => Math.max(prev - 1, 1))}
              disabled={
                !deployedContractAddress || isLoading || isContractDeploying
              }
              className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors duration-300 hover:bg-blue-600"
            >
              <MinusIcon size={16} />
            </button>
            <div className="bg-white py-2 px-4 rounded-lg shadow-inner">
              <span className="font-bold text-lg">
                {deployedContractAddress && !isLoading && !isContractDeploying
                  ? number
                  : 0}
              </span>
            </div>
            <button
              onClick={() => setNumber((prev) => prev + 1)}
              disabled={
                !deployedContractAddress || isLoading || isContractDeploying
              }
              className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors duration-300 hover:bg-blue-600"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full py-3 px-6 text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {isOpen ? "Close Details" : "Collect Now"}
              {isOpen ? (
                <ChevronUp className="inline-block ml-2" />
              ) : (
                <ChevronDown className="inline-block ml-2" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-6">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg font-semibold text-blue-700 animate-pulse">
                  Loading...
                </p>
              </div>
            ) : deployedContractAddress ? (
              <>
                <p className="font-medium text-sm mb-2 text-gray-600">
                  Pay Using
                </p>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-md mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={chain?.name === "OP Mainnet" ? op : arb}
                      alt=""
                      width={29}
                      height={29}
                      className="rounded-full"
                    />
                    <p className="font-medium">{chain?.name}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Cost</p>
                    <p className="text-green-600 font-medium">Free</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Platform Fee</p>
                    <p className="text-gray-800">{totalCostEth}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <p className="text-gray-800">Total</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-600">
                        ~{totalPurchaseCostCurrency}
                      </p>
                      <p className="text-gray-800">{totalCostEth}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {isMinting ? "Minting..." : "Mint NFT"}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Deploy the contract and become the first minter!
                </p>
                <button
                  onClick={handleFirstMinter}
                  disabled={isContractDeploying}
                  className="mt-4 py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg disabled:opacity-50 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {isContractDeploying ? "Deploying..." : "Deploy Contract"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchFreeCollect;
