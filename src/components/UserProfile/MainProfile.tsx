"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy, IoShareSocialSharp } from "react-icons/io5";
import UserInfo from "./UserInfo";
import UserVotes from "./UserVotes";
import UserSessions from "./UserSessions";
import UserOfficeHours from "./UserOfficeHours";
import ClaimNFTs from "./ClaimNFTs";
import { FaPencil } from "react-icons/fa6";
import { SiFarcaster } from "react-icons/si";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arbCir.png";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import WalletAndPublicClient from "@/helpers/signer";
import dao_abi from "../../artifacts/Dao.sol/GovernanceToken.json";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import lighthouse from "@lighthouse-web3/sdk";
import InstantMeet from "./InstantMeet";
import { useSession } from "next-auth/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import MainProfileSkeletonLoader from "../SkeletonLoader/MainProfileSkeletonLoader";
import { BASE_URL } from "@/config/constants";
import { IoClose } from "react-icons/io5";
import "./MainProfile.module.css";
import { FaUserEdit } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { SiDiscourse } from "react-icons/si";
import { BsDiscord } from "react-icons/bs";
import { TbBrandGithubFilled } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import UpdateProfileModal from "../ComponentUtils/UpdateProfileModal";
import { cookies } from "next/headers";

function MainProfile() {
  const { isConnected, address } = useAccount();
  const { data: session, status } = useSession();
  const { openConnectModal } = useConnectModal();
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { chain, chains } = useNetwork();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [description, setDescription] = useState("");
  const [isDelegate, setIsDelegate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [karmaImage, setKarmaImage] = useState<any>();
  const [karmaEns, setKarmaEns] = useState("");
  const [karmaDesc, setKarmaDesc] = useState("");
  const [votes, setVotes] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selfDelegate, setSelfDelegate] = useState(false);
  const [daoName, setDaoName] = useState("optimism");
  const [isCopied, setIsCopied] = useState(false);
  const [modalData, setModalData] = useState({
    displayImage: "",
    displayName: "",
    emailId: "",
    twitter: "",
    discord: "",
    discourse: "",
    github: "",
  });

  const [userData, setUserData] = useState({
    displayImage: "",
    displayName: "",
    twitter: "",
    discord: "",
    discourse: "",
    github: "",
  });
  const [isToggled, settoggle] = useState(false);

  interface ProgressData {
    total: any;
    uploaded: any;
  }

  useEffect(() => {
    if (chain && chain?.name === "Optimism") {
      setDaoName("optimism");
    } else if (chain && chain?.name === "Arbitrum One") {
      setDaoName("arbitrum");
    }
  }, [chain, chain?.name]);

  useEffect(() => {
    // console.log("path", path);
    if (isConnected && session && path.includes("profile/undefined")) {
      const newPath = path.includes("profile/undefined")
        ? path.replace("profile/undefined", `profile/${address}?active=info`)
        : path;
      // console.log("newPath", newPath);
      router.replace(`${newPath}`);
    } else if (!isConnected && !session) {
      if (openConnectModal) {
        openConnectModal();
      } else {
        console.error("openConnectModal is not defined");
      }
    }
  }, [
    // isConnected,
    // address,
    // router,
    // session,
    path.includes("profile/undefined"),
  ]);

  const uploadImage = async (selectedFile: any) => {
    const progressCallback = async (progressData: any) => {
      let percentageDone =
        100 -
        (
          ((progressData?.total as any) / progressData?.uploaded) as any
        )?.toFixed(2);
      console.log(percentageDone);
    };

    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      ? process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
      : "";

    const output = await lighthouse.upload(selectedFile, apiKey);

    console.log("File Status:", output);
    setModalData((prevUserData) => ({
      ...prevUserData,
      displayImage: output.data.Hash,
    }));

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
  };

  useEffect(() => {
    const checkDelegateStatus = async () => {
      const addr = await walletClient.getAddresses();
      const address1 = addr[0];
      let delegateTxAddr = "";
      const contractAddress =
        chain?.name === "Optimism"
          ? "0x4200000000000000000000000000000000000042"
          : chain?.name === "Arbitrum One"
          ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
          : "";
      console.log(walletClient);
      let delegateTx;
      if (address) {
        delegateTx = await publicClient.readContract({
          address: contractAddress,
          abi: dao_abi.abi,
          functionName: "delegates",
          args: [address],
          // account: address1,
        });
        console.log("Delegate tx", delegateTx);
        delegateTxAddr = delegateTx;
      }

      if (delegateTxAddr.toLowerCase() === address?.toLowerCase()) {
        console.log("Delegate comparison: ", delegateTx, address);
        setSelfDelegate(true);
      } else {
        setSelfDelegate(false);
      }
    };
    checkDelegateStatus();
  }, [address, daoName, selfDelegate]);

  // Pass the address of whom you want to delegate the voting power to
  const handleDelegateVotes = async (to: string) => {
    try {
      const addr = await walletClient.getAddresses();
      const address1 = addr[0];

      const contractAddress =
        chain?.name === "Optimism"
          ? "0x4200000000000000000000000000000000000042"
          : chain?.name === "Arbitrum One"
          ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
          : "";
      console.log("Contract", contractAddress);
      console.log("Wallet Client", walletClient);
      const delegateTx = await walletClient.writeContract({
        address: contractAddress,
        abi: dao_abi.abi,
        functionName: "delegate",
        args: [to],
        account: address1,
      });
      console.log(delegateTx);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setModalData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleToggle = async () => {
    setIsLoading(true);
    const isEmailVisible = !isToggled;
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const raw = JSON.stringify({
        address: address,
        isEmailVisible: isEmailVisible,
      });

      const requestOptions: any = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch("/api/profile/emailstatus", requestOptions);

      if (!response.ok) {
        throw new Error("Failed to toggle");
      }

      const data = await response.json();
      setIsLoading(false);
      settoggle(!isToggled);
      console.log("status successfully change!", data);
    } catch (error) {
      console.error("Error following:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your backend API to check if the address exists
        console.log("Fetching from DB");
        // const dbResponse = await axios.get(`/api/profile/${address}`);

        let dao =
          chain?.name === "Optimism"
            ? "optimism"
            : chain?.name === "Arbitrum One"
            ? "arbitrum"
            : "";
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

        const raw = JSON.stringify({
          address: address,
          // daoName: dao,
        });

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const res = await fetch(`/api/profile/${address}`, requestOptions);

        const dbResponse = await res.json();

        let karmaDetails;

        try {
          const karmaRes = await fetch(
            `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
          );
          karmaDetails = await karmaRes.json();

          if (karmaRes.ok) {
            setKarmaEns(karmaDetails.data.delegate.ensName);
            setKarmaImage(karmaDetails.data.delegate.profilePicture);
            setKarmaDesc(
              karmaDetails.data.delegate.delegatePitch.customFields[1].value
            );
          }
          setIsDelegate(true);
        } catch (e) {
          console.log("error: ", e);
          setIsDelegate(false);
        }

        if (dbResponse.data.length > 0) {
          console.log("db Response", dbResponse.data[0]);
          console.log(
            "dbResponse.data[0]?.networks:",
            dbResponse.data[0]?.networks
          );
          setUserData({
            displayName: dbResponse.data[0]?.displayName,
            discord: dbResponse.data[0]?.socialHandles?.discord,
            discourse:
              dbResponse.data[0]?.networks?.find(
                (network: any) => network?.dao_name === dao
              )?.discourse || "",
            twitter: dbResponse.data[0].socialHandles?.twitter,
            github: dbResponse.data[0].socialHandles?.github,
            displayImage: dbResponse.data[0]?.image,
          });

          setModalData({
            displayName: dbResponse.data[0]?.displayName,
            discord: dbResponse.data[0]?.socialHandles?.discord,
            discourse:
              dbResponse.data[0]?.networks?.find(
                (network: any) => network?.dao_name === dao
              )?.discourse || "",
            emailId: dbResponse.data[0]?.emailId,
            twitter: dbResponse.data[0]?.socialHandles?.twitter,
            github: dbResponse.data[0]?.socialHandles?.github,
            displayImage: dbResponse.data[0]?.image,
          });
          settoggle(dbResponse.data[0]?.isEmailVisible);
          setDescription(
            dbResponse.data[0]?.networks?.find(
              (network: any) => network.dao_name === dao
            )?.description || ""
          );
          setIsPageLoading(false);
        } else {
          // const res = await fetch(
          //   `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
          // );
          // const details = await res.json();
          // console.log("details: ", details.data.delegate);

          setUserData({
            displayName: karmaDetails.data.delegate.ensName,
            discord: karmaDetails.data.delegate.discordHandle,
            discourse: karmaDetails.data.delegate.discourseHandle,
            twitter: karmaDetails.data.delegate.twitterHandle,
            github: karmaDetails.data.delegate.githubHandle,
            displayImage: karmaDetails.data.delegate.profilePicture,
          });
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [chain, address]);

  const handleSave = async (newDescription?: string) => {
    try {
      // Check if the delegate already exists in the database
      if (newDescription) {
        setDescription(newDescription);
        console.log("New Description", description);
      }
      setIsLoading(true);
      const isExisting = await checkDelegateExists(address);

      if (isExisting) {
        // If delegate exists, update the delegate
        await handleUpdate(newDescription);
        setIsLoading(false);
        onClose();
        console.log("Existing True");
      } else {
        // If delegate doesn't exist, add a new delegate
        await handleAdd(newDescription);
        setIsLoading(false);
        onClose();
        console.log("Sorry! Doesn't exist");
      }

      toast.success("Saved");
    } catch (error) {
      console.error("Error handling delegate:", error);
      toast.error("Error saving");
      setIsLoading(false);
    }
  };

  const checkDelegateExists = async (address: any) => {
    try {
      // Make a request to your backend API to check if the address exists
      console.log("Checking");

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        address: address,
        // daoName: dao,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const res = await fetch(`/api/profile/${address}`, requestOptions);

      const response = await res.json();

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Iterate over each item in the response data array
        for (const item of response.data) {
          // Check if address and daoName match
          if (item.address === address) {
            return true; // Return true if match found
          }
        }
      }

      return false;
      // Assuming the API returns whether the delegate exists
    } catch (error) {
      console.error("Error checking delegate existence:", error);
      return false;
    }
  };

  const handleAdd = async (newDescription?: string) => {
    try {
      // Call the POST API function for adding a new delegate
      console.log("Adding the delegate..");
      const response = await axios.post(
        "/api/profile",
        {
          address: address,
          image: modalData.displayImage,
          isDelegate: true,
          displayName: modalData.displayName,
          emailId: modalData.emailId,
          isEmailVisible: false,
          socialHandles: {
            twitter: modalData.twitter,
            discord: modalData.discord,
            github: modalData.github,
          },
          networks: [
            {
              dao_name: daoName,
              network: chain?.name,
              discourse: modalData.discourse,
              description: newDescription,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(address && { "x-wallet-address": address }),
          },
        }
      );

      console.log("Response Add", response);

      if (response.status === 200) {
        // Delegate added successfully
        console.log("Delegate added successfully:", response.data);
        setIsLoading(false);
        setUserData({
          displayImage: modalData.displayImage,
          displayName: modalData.displayName,
          twitter: modalData.twitter,
          discord: modalData.discord,
          discourse: modalData.discourse,
          github: modalData.github,
        });
      } else {
        // Handle error response
        console.error("Failed to add delegate:", response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      // Handle API call error
      console.error("Error calling POST API:", error);
      setIsLoading(false);
    }
  };

  // Function to handle updating an existing delegate
  const handleUpdate = async (newDescription?: string) => {
    try {
      // Call the PUT API function for updating an existing delegate

      let dao =
        chain?.name === "Optimism"
          ? "optimism"
          : chain?.name === "Arbitrum One"
          ? "arbitrum"
          : "";
      console.log("Updating");
      console.log("Inside Updating Description", newDescription);
      // const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // if (address) {
      //   myHeaders.append("x-wallet-address", address);
      // }
      const response: any = await axios.put(
        "/api/profile",
        {
          address: address,
          image: modalData.displayImage,
          isDelegate: true,
          displayName: modalData.displayName,
          emailId: modalData.emailId,
          socialHandles: {
            twitter: modalData.twitter,
            discord: modalData.discord,
            github: modalData.github,
          },
          networks: [
            {
              dao_name: daoName,
              network: chain?.name,
              discourse: modalData.discourse,
              description: newDescription,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(address && { "x-wallet-address": address }),
          },
        }
      );
      console.log("response", response);
      // Handle response from the PUT API function
      if (response.data.success) {
        // Delegate updated successfully
        console.log("Delegate updated successfully");
        setIsLoading(false);
        setUserData({
          displayImage: modalData.displayImage,
          displayName: modalData.displayName,
          twitter: modalData.twitter,
          discord: modalData.discord,
          discourse: modalData.discourse,
          github: modalData.github,
        });
      } else {
        // Handle error response
        console.error("Failed to update delegate:", response.error);
        setIsLoading(false);
      }
    } catch (error) {
      // Handle API call error
      console.error("Error calling PUT API:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isPageLoading ? (
        <div className="font-poppins">
          <div className="flex ps-14 py-5 pe-10 justify-between">
            <div className="flex  items-center justify-center">
              <div
                className="relative object-cover rounded-3xl"
                style={{
                  backgroundColor: "#fcfcfc",
                  border: "2px solid #E9E9E9 ",
                }}
              >
                <div className="w-40 h-40 flex items-center justify-content ">
                  <div className="flex justify-center items-center w-40 h-40">
                    <Image
                      src={
                        (userData.displayImage
                          ? `https://gateway.lighthouse.storage/ipfs/${userData.displayImage}`
                          : karmaImage) ||
                        (daoName === "optimism"
                          ? OPLogo
                          : daoName === "arbitrum"
                          ? ArbLogo
                          : ccLogo)
                      }
                      alt="user"
                      width={256}
                      height={256}
                      className={
                        userData.displayImage
                          ? "w-40 h-40 rounded-3xl"
                          : "w-20 h-20 rounded-3xl"
                      }
                    />
                  </div>

                  <Image
                    src={ccLogo}
                    alt="ChoraClub Logo"
                    className="absolute top-0 right-0 bg-white rounded-full"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginTop: "10px",
                      marginRight: "10px",
                    }}
                  />
                </div>
              </div>

              <div className="px-4">
                <div className=" flex items-center py-1">
                  <div className="font-bold text-lg pr-4">
                    {karmaEns ? (
                      karmaEns
                    ) : userData.displayName ? (
                      userData.displayName
                    ) : (
                      <>
                        {`${address}`.substring(0, 6)} ...{" "}
                        {`${address}`.substring(`${address}`.length - 4)}
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`https://twitter.com/${userData.twitter}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        userData.twitter == "" || userData.twitter == undefined
                          ? "hidden"
                          : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaXTwitter color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={
                        daoName === "optimism"
                          ? `https://gov.optimism.io/u/${userData.discourse}`
                          : daoName == "arbitrum"
                          ? `https://forum.arbitrum.foundation/u/${userData.discourse}`
                          : ""
                      }
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                        userData.discourse == "" ||
                        userData.discourse == undefined
                          ? "hidden"
                          : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://discord.com/${userData.discord}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        userData.discord == "" || userData.discord == undefined
                          ? "hidden"
                          : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaDiscord color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://github.com/${userData.github}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        userData.github == "" || userData.github == undefined
                          ? "hidden"
                          : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaGithub color="#7C7C7C" size={12} />
                    </Link>
                    <Tooltip
                      content="Update your Profile"
                      placement="top"
                      showArrow
                    >
                      <span
                        className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                        style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                        onClick={onOpen}
                      >
                        <FaPencil color="#3e3d3d" size={12} />
                      </span>
                    </Tooltip>
                    <UpdateProfileModal
                      isOpen={isOpen}
                      onClose={onClose}
                      modalData={modalData}
                      handleInputChange={handleInputChange}
                      uploadImage={uploadImage}
                      fileInputRef={fileInputRef}
                      isLoading={isLoading}
                      // displayImage={userData.displayImage}
                      handleSave={handleSave}
                      handleToggle={handleToggle}
                      isToggled={isToggled}
                    />
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <div>
                    {`${address}`.substring(0, 6)} ...{" "}
                    {`${address}`.substring(`${address}`.length - 4)}
                  </div>

                  <Tooltip
                    content="Copy"
                    placement="bottom"
                    closeDelay={1}
                    showArrow
                  >
                    <span className="px-2 cursor-pointer" color="#3E3D3D">
                      <IoCopy onClick={() => handleCopy(`${address}`)} />
                    </span>
                  </Tooltip>
                  <div className="flex space-x-2">
                    {/* <span className="p-2 bg-gray-200 rounded-lg text-black">
                      {typeof window !== "undefined" &&
                        `${BASE_URL}/${
                          chain?.name === "Optimism" ? "optimism" : "arbitrum"
                        }/${address}?active=info`}
                      Copy to Share Profile URL on Warpcast
                    </span> */}
                    <Tooltip
                      content="Copy your profile URL to share on Warpcast or Twitter."
                      placement="bottom"
                      closeDelay={1}
                      showArrow
                    >
                      <Button
                        className="bg-gray-200 hover:bg-gray-300"
                        onClick={() => {
                          if (typeof window === "undefined") return;
                          navigator.clipboard.writeText(
                            `${BASE_URL}/${
                              chain?.name === "Optimism"
                                ? "optimism"
                                : "arbitrum"
                            }/${address}?active=info`
                          );
                          setIsCopied(true);
                          setTimeout(() => {
                            setIsCopied(false);
                          }, 3000);
                        }}
                      >
                        <IoShareSocialSharp />
                        {isCopied ? "Copied" : "Share profile"}
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {selfDelegate === false ? (
                  <div className="pt-2 flex gap-5">
                    {/* pass address of whom you want to delegate the voting power to */}
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => handleDelegateVotes(`${address}`)}
                    >
                      Become Delegate
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <ConnectWalletWithENS />
            </div>
          </div>

          <div className="flex gap-12 bg-[#D9D9D945] pl-16">
            <button
              className={`border-b-2 py-4 px-2 outline-none ${
                searchParams.get("active") === "info"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=info")}
            >
              Info
            </button>
            {selfDelegate === true && (
              <button
                className={`border-b-2 py-4 px-2 outline-none ${
                  searchParams.get("active") === "votes"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=votes")}
              >
                Past Votes
              </button>
            )}
            <button
              className={`border-b-2 py-4 px-2 outline-none ${
                searchParams.get("active") === "sessions"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() =>
                router.push(path + "?active=sessions&session=schedule")
              }
            >
              Sessions
            </button>
            <button
              className={`border-b-2 py-4 px-2 outline-none ${
                searchParams.get("active") === "officeHours"
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() =>
                router.push(path + "?active=officeHours&hours=schedule")
              }
            >
              Office Hours
            </button>

            {selfDelegate === true && (
              <button
                className={`border-b-2 py-4 px-2 outline-none ${
                  searchParams.get("active") === "instant-meet"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=instant-meet")}
              >
                Instant Meet
              </button>
            )}
          </div>

          <div className="py-6 ps-16">
            {searchParams.get("active") === "info" ? (
              <UserInfo
                karmaDesc={karmaDesc}
                description={description}
                isDelegate={isDelegate}
                isSelfDelegate={selfDelegate}
                // descAvailable={descAvailable}
                onSaveButtonClick={(newDescription?: string) =>
                  handleSave(newDescription)
                }
                isLoading={isLoading}
                daoName={daoName}
              />
            ) : (
              ""
            )}
            {selfDelegate === true && searchParams.get("active") === "votes" ? (
              <UserVotes daoName={daoName} />
            ) : (
              ""
            )}
            {searchParams.get("active") === "sessions" ? (
              <UserSessions
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
                daoName={daoName}
              />
            ) : (
              ""
            )}
            {searchParams.get("active") === "officeHours" ? (
              <UserOfficeHours
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
                daoName={daoName}
              />
            ) : (
              ""
            )}

            {selfDelegate === true &&
            searchParams.get("active") === "instant-meet" ? (
              <InstantMeet
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
                daoName={daoName}
              />
            ) : (
              ""
            )}
            {/* {searchParams.get("active") === "claimNft" ? <ClaimNFTs /> : ""} */}
          </div>
        </div>
      ) : (
        <>
          <MainProfileSkeletonLoader />
        </>
      )}
    </>
  );
}

export default MainProfile;
