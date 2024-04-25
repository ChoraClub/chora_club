"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import UserInfo from "./UserInfo";
import UserVotes from "./UserVotes";
import UserSessions from "./UserSessions";
import UserOfficeHours from "./UserOfficeHours";
import ClaimNFTs from "./ClaimNFTs";
import { FaPencil } from "react-icons/fa6";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arbCir.png";
import ccLogo from "@/assets/images/daos/CC.png";
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

function MainProfile() {
  const { isConnected, address } = useAccount();
  // const address = "0x5e349eca2dc61abcd9dd99ce94d04136151a09ee";
  const { data: session, status } = useSession();
  const { openConnectModal } = useConnectModal();
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { chain, chains } = useNetwork();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayImage, setDisplayImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [profileDetails, setProfileDetails] = useState<any>();
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [displayName, setDisplayName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [discourse, setDiscourse] = useState("");
  const [github, setGithub] = useState("");
  const [description, setDescription] = useState("");
  const [isDelegate, setIsDelegate] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseFromDB, setResponseFromDB] = useState<boolean>(false);
  const [karmaImage, setKarmaImage] = useState<any>();
  const [ensName, setEnsName] = useState("");
  const [karmaDesc, setKarmaDesc] = useState("");
  const [votes, setVotes] = useState<any>();
  const [descAvailable, setDescAvailable] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selfDelegate, setSelfDelegate] = useState(false);

  interface ProgressData {
    total: any;
    uploaded: any;
  }

  // useEffect(() => {
  //   console.log("path", path);
  //   if (isConnected && session) {
  //     router.replace(`/profile/${address}?active=info`);
  //   } else {
  //     if (openConnectModal) {
  //       openConnectModal();
  //     } else {
  //       console.error("openConnectModal is not defined");
  //     }
  //   }
  // }, [isConnected, address, router, session, path]);

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
    isConnected,
    address,
    router,
    session,
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
    setDisplayImage(output.data.Hash);

    let dao = "";
    if (chain && chain?.name === "Optimism") {
      dao = "optimism";
    } else if (chain && chain?.name === "Arbitrum One") {
      dao = "arbitrum";
    } else {
      return;
    }

    const response = await axios.put("/api/profile", {
      address: address,
      image: output.data.Hash,
      description: description,
      isDelegate: true,
      displayName: displayName,
      daoName: dao,
      emailId: emailId,
      socialHandles: {
        twitter: twitter,
        discord: discord,
        discourse: discourse,
        github: github,
      },
    });

    console.log("response: ", response);

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
  };

  const handleAttestation = async () => {
    const data = {
      recipient: "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
      meetingId: "abc-def-ggi",
      meetingType: 1,
      startTime: 16452456,
      endTime: 16452492,
    };

    console.log(window.location.origin);
    const headers = {
      "Content-Type": "application/json",
      //   Origin: window.location.origin, // Set the Origin header to your frontend URL
    };

    try {
      const response = await axios.post("/api/attest-offchain", data, {
        headers,
      });
      console.log(response.data);
      // Handle response as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
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
      }
    };
    checkDelegateStatus();
  }, [address]);

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

  // useEffect(()=>{
  //   const getDelegatesVotes = async (address: string) => {
  //     const addr = await walletClient.getAddresses();
  //     const address1 = addr[0];
  //     console.log("Get Votes addr", address1);

  //     console.log(walletClient);
  //     const votingPower = await publicClient.readContract({
  //       address: "0x4200000000000000000000000000000000000042",
  //       abi: dao_abi.abi,
  //       functionName: "getVotes",
  //       args: [address],
  //     });
  //     console.log("Delegates Votes:", votingPower);
  //   };
  //   getDelegatesVotes(`${address}`);
  // }, [address])

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const handleInputChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "displayName":
        setDisplayName(value);
        break;
      case "emailId":
        setEmailId(value);
        break;
      case "twitter":
        setTwitter(value);
        break;
      case "discord":
        setDiscord(value);
        break;
      case "discourse":
        setDiscourse(value);
        break;
      case "github":
        setGithub(value);
        break;
      default:
        break;
    }
  };

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return number;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your backend API to check if the address exists
        let dao = "";
        if (chain && chain?.name === "Optimism") {
          dao = "optimism";
        } else if (chain && chain?.name === "Arbitrum One") {
          dao = "arbitrum";
        } else {
          return;
        }
        console.log("Fetching from DB");
        // const dbResponse = await axios.get(`/api/profile/${address}`);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          address: address,
          daoName: dao,
        });

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const res = await fetch(`/api/profile/${address}`, requestOptions);

        const dbResponse = await res.json();
        console.log("db Response", dbResponse);
        if (
          dbResponse &&
          Array.isArray(dbResponse.data) &&
          dbResponse.data.length > 0
        ) {
          // Iterate over each item in the response data array
          for (const item of dbResponse.data) {
            // Check if address and daoName match
            if (item.daoName === dao && item.address === address) {
              console.log("Data found in the database");
              // Data found in the database, set the state accordingly
              setResponseFromDB(true);
              setDisplayImage(item.image);
              setDescription(item.description);
              setDisplayName(item.displayName);
              setEmailId(item.emailId);
              setTwitter(item.socialHandles.twitter);
              setDiscord(item.socialHandles.discord);
              setDiscourse(item.socialHandles.discourse);
              setGithub(item.socialHandles.github);
              // Exit the loop since we found a match
              break;
            }
          }
        } else {
          console.log(
            "Data not found in the database, fetching from third-party API"
          );
          // Data not found in the database, fetch data from the third-party API
          let dao = "";
          if (chain && chain?.name === "Optimism") {
            dao = "optimism";
          } else if (chain && chain?.name === "Arbitrum One") {
            dao = "arbitrum";
          } else {
            return;
          }

          const res = await fetch(
            `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
          );
          if (responseFromDB === false && description == "") {
            setDescAvailable(false);
          }

          const details = await res.json();
          if (res.ok) {
            // Check if delegate data is present in the response
            console.log("Response Success----");
            if (details && details.data && details.data.delegate) {
              // If delegate data is present, set isDelegate to true
              console.log("Setting Up Karma's Data---");
              setIsDelegate(true);
              setProfileDetails(details.data.delegate);
              setDescription(
                details.data.delegate.delegatePitch.customFields[1].value
              );
              setDescAvailable(true);
              if (details.data.delegate.twitterHandle != null) {
                setTwitter(`${details.data.delegate.twitterHandle}`);
              }

              if (details.data.delegate.discourseHandle != null) {
                if (dao === "optimism") {
                  setDiscourse(`${details.data.delegate.discourseHandle}`);
                  console.log("Discourse", discourse);
                }
                if (dao === "arbitrum") {
                  setDiscourse(`${details.data.delegate.discourseHandle}`);
                }
              }

              if (details.data.delegate.discordHandle != null) {
                setDiscord(`${details.data.delegate.discordHandle}`);
              }

              if (details.data.delegate.githubHandle != null) {
                setGithub(`${details.data.delegate.githubHandle}`);
              }
            } else {
              // If delegate data is not present, set isDelegate to false
              setIsDelegate(false);
            }
          } else {
            // If response status is not ok, set isDelegate to false
            setIsDelegate(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [chain, address, searchParams.get("session") === "schedule"]);

  useEffect(() => {
    setIsPageLoading(false);
  }, [isPageLoading]);

  const handleDelegate = () => {
    console.log("IsDelegate Status", isDelegate);
  };
  const handleSubmit = async (newDescription?: string) => {
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
        console.log("Sorry! Doesnt exist");
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
      let dao = "";
      if (chain && chain?.name === "Optimism") {
        dao = "optimism";
      } else if (chain && chain?.name === "Arbitrum One") {
        dao = "arbitrum";
      } else {
        return;
      }
      console.log("Checking");

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        address: address,
        daoName: dao,
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
          if (item.address === address && item.daoName === dao) {
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
      let dao = "";
      if (chain && chain?.name === "Optimism") {
        dao = "optimism";
      } else if (chain && chain?.name === "Arbitrum One") {
        dao = "arbitrum";
      } else {
        return;
      }
      console.log("Adding the delegate..");
      const response = await axios.post("/api/profile", {
        address: address,
        image: displayImage,
        daoName: dao,
        description: newDescription,
        isDelegate: true,
        displayName: displayName,
        emailId: emailId,
        socialHandles: {
          twitter: twitter,
          discord: discord,
          discourse: discourse,
          github: github,
        },
      });

      console.log("Response Add", response);

      if (response.status === 200) {
        // Delegate added successfully
        console.log("Delegate added successfully:", response.data);
        setIsLoading(false);
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

      let dao = "";
      if (chain && chain?.name === "Optimism") {
        dao = "optimism";
      } else if (chain && chain?.name === "Arbitrum One") {
        dao = "arbitrum";
      } else {
        return;
      }

      console.log("Updating");
      console.log("Inside Updating Description", newDescription);
      const response: any = await axios.put("/api/profile", {
        address: address,
        image: displayImage,
        description: newDescription,
        isDelegate: true,
        displayName: displayName,
        daoName: dao,
        emailId: emailId,
        socialHandles: {
          twitter: twitter,
          discord: discord,
          discourse: discourse,
          github: github,
        },
      });
      console.log("response", response);
      // Handle response from the PUT API function
      if (response.data.success) {
        // Delegate updated successfully
        console.log("Delegate updated successfully");
        setIsLoading(false);
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
  useEffect(() => {
    const fetchData = async () => {
      console.log("Description", description);
      try {
        let dao = "";
        if (chain && chain?.name === "Optimism") {
          dao = "optimism";
        } else if (chain && chain?.name === "Arbitrum One") {
          dao = "arbitrum";
        } else {
          return;
        }
        console.log("Fetching Data...");
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
        );
        console.log("Response", res);

        // console.log("Desc.", description)
        if (res.ok) {
          const details = await res.json();
          console.log("Data Fetched...", details.data.delegate.ensName);
          setEnsName(details.data.delegate.ensName);
          setKarmaImage(details.data.delegate.profilePicture);
          setKarmaDesc(
            details.data.delegate.delegatePitch.customFields[1].value
          );
          setVotes(details.data.delegate);
          console.log("Votes", votes);
          // setProfileDetails(details.data.delegate);

          // Check if delegate data is present in the response
          if (details && details.data && details.data.delegate) {
            // If delegate data is present, set isDelegate to true
            setIsDelegate(true);
          } else {
            // If delegate data is not present, set isDelegate to false
            setIsDelegate(false);
          }
        } else if (res.status === 404) {
          // If response status is 404, set isDelegate to false
          setIsDelegate(false);
        } else {
          // Handle other error cases
          setIsDelegate(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [chain, address]);

  return (
    <>
      {!isPageLoading ? (
        <div className="font-poppins">
          <div className="flex ps-14 py-5 pe-10 justify-between">
            <div className="flex  items-center justify-center">
              <div
                className="relative object-cover rounded-3xl "
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  backgroundColor: "#fcfcfc",
                  border: "2px solid #E9E9E9 ",
                }}
              >
                <div className="w-40 h-40 flex items-center justify-content ">
                  <div className="flex justify-center items-center w-40 h-40">
                    <Image
                      src={
                        (displayImage
                          ? `https://gateway.lighthouse.storage/ipfs/${displayImage}`
                          : karmaImage) ||
                        (chain?.name === "Optimism"
                          ? OPLogo
                          : chain?.name === "Arbitrum One"
                          ? ArbLogo
                          : ccLogo)
                      }
                      alt="user"
                      width={256}
                      height={256}
                      className={
                        displayImage
                          ? "w-40 h-40 rounded-3xl"
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

              <div className="px-4">
                <div className=" flex items-center py-1">
                  <div className="font-bold text-lg pr-4">
                    {ensName || profileDetails?.ensName ? (
                      ensName || profileDetails?.ensName
                    ) : displayName ? (
                      displayName
                    ) : (
                      <>
                        {`${address}`.substring(0, 6)} ...{" "}
                        {`${address}`.substring(`${address}`.length - 4)}
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`https://twitter.com/${twitter}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        twitter == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaXTwitter color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={
                        chain?.name == "Optimism"
                          ? `https://gov.optimism.io/u/${discourse}`
                          : chain?.name == "Arbitrum One"
                          ? `https://forum.arbitrum.foundation/u/${discourse}`
                          : ""
                      }
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                        discourse == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://discord.com/${discord}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        discord == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaDiscord color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://github.com/${github}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        github == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank"
                    >
                      <FaGithub color="#7C7C7C" size={12} />
                    </Link>
                    <Tooltip
                      content="Update your Profile"
                      placement="right"
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
                    <Modal
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      className="font-poppins"
                    >
                      <ModalContent>
                        {(onClose: any) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Update your Profile
                            </ModalHeader>
                            <ModalBody>
                              <div className="px-1 font-medium">
                                Upload Profile Image:
                              </div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                placeholder="Upload Image"
                                onChange={(e) => uploadImage(e.target.files)}
                              />
                              <div className="px-1 font-medium">
                                Display name:
                              </div>
                              <input
                                type="text"
                                value={displayName}
                                placeholder="Enter your name here"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange(
                                    "displayName",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="px-1 font-medium">Email:</div>
                              <input
                                type="email"
                                value={emailId}
                                placeholder="Enter your email here"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange("emailId", e.target.value)
                                }
                              />

                              <div className="px-1 font-medium">
                                X (Formerly Twitter):
                              </div>
                              <input
                                type="url"
                                value={twitter}
                                placeholder="Enter twitter username"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange("twitter", e.target.value)
                                }
                              />

                              <div className="px-1 font-medium">Discourse:</div>
                              <input
                                type="url"
                                value={discourse}
                                placeholder="Enter discourse username"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange("discourse", e.target.value)
                                }
                              />

                              <div className="px-1 font-medium">Discord:</div>
                              <input
                                type="url"
                                value={discord}
                                placeholder="Enter discord username"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange("discord", e.target.value)
                                }
                              />
                              <div className="px-1 font-medium">Github:</div>
                              <input
                                type="url"
                                value={github}
                                placeholder="Enter github username"
                                className="outline-none bg-[#D9D9D945] rounded-md px-2 py-1 text-sm"
                                onChange={(e) =>
                                  handleInputChange("github", e.target.value)
                                }
                              />
                            </ModalBody>
                            <ModalFooter>
                              <Button color="default" onPress={onClose}>
                                Close
                              </Button>
                              <Button
                                color="primary"
                                onClick={() => handleSubmit()}
                              >
                                {isLoading ? "Saving" : "Save"}
                              </Button>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <div>
                    {`${address}`.substring(0, 6)} ...{" "}
                    {`${address}`.substring(`${address}`.length - 4)}
                  </div>

                  <Tooltip
                    content="Copy"
                    placement="right"
                    closeDelay={1}
                    showArrow
                  >
                    <span className="px-2 cursor-pointer" color="#3E3D3D">
                      <IoCopy onClick={() => handleCopy(`${address}`)} />
                    </span>
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
                {votes
                  ? selfDelegate === true && (
                      <div className="flex gap-4 py-1">
                        <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
                          <span className="text-blue-shade-200 font-semibold">
                            {votes.delegatedVotes
                              ? formatNumber(Number(votes.delegatedVotes))
                              : "Fetching "}
                            &nbsp;
                          </span>
                          delegated tokens
                        </div>
                        <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
                          <span className="text-blue-shade-200 font-semibold">
                            {formatNumber(votes.delegatorCount)
                              ? null
                              : "Fetching "}
                          </span>
                          Delegated from
                          <span className="text-blue-shade-200 font-semibold">
                            &nbsp;
                            {formatNumber(votes.delegatorCount)
                              ? formatNumber(votes.delegatorCount)
                              : "number of "}
                            &nbsp;
                          </span>
                          Addresses
                        </div>
                      </div>
                    )
                  : null}

                {selfDelegate === false ? (
                  <div className="pt-2 flex gap-5">
                    {/* pass address of whom you want to delegate the voting power to */}
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => handleDelegateVotes(`${address}`)}
                    >
                      Become Delegate
                    </button>
                    {/*
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => handleAttestation()}
                    >
                      Attest
                    </button> */}

                    {/* <div className="">
                <select className="outline-none border border-blue-shade-200 text-blue-shade-200 rounded-full py-2 px-3">
                  <option className="text-gray-700">Optimism</option>
                  <option className="text-gray-700">Arbitrum</option>
                </select>
              </div> */}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <ConnectButton />
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
            {/* <button
          className={`border-b-2 py-4 px-2 outline-none ${
            searchParams.get("active") === "claimNft"
              ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
              : "border-transparent"
          }`}
          onClick={() => router.push(path + "?active=claimNft")}
        >
          Claim NFTs
        </button> */}
          </div>

          <div className="py-6 ps-16">
            {searchParams.get("active") === "info" ? (
              <UserInfo
                karmaDesc={karmaDesc}
                description={description}
                isDelegate={isDelegate}
                isSelfDelegate={selfDelegate}
                descAvailable={descAvailable}
                onSaveButtonClick={(newDescription?: string) =>
                  handleSubmit(newDescription)
                }
                isLoading={isLoading}
              />
            ) : (
              ""
            )}
            {selfDelegate === true && searchParams.get("active") === "votes" ? (
              <UserVotes />
            ) : (
              ""
            )}
            {searchParams.get("active") === "sessions" ? (
              <UserSessions
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
              />
            ) : (
              ""
            )}
            {searchParams.get("active") === "officeHours" ? (
              <UserOfficeHours
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
              />
            ) : (
              ""
            )}

            {selfDelegate === true &&
            searchParams.get("active") === "instant-meet" ? (
              <InstantMeet
                isDelegate={isDelegate}
                selfDelegate={selfDelegate}
              />
            ) : (
              ""
            )}
            {/* {searchParams.get("active") === "claimNft" ? <ClaimNFTs /> : ""} */}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center pt-10">
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#0500FF"
              secondaryColor="#cdccff"
              ariaLabel="oval-loading"
            />
          </div>
        </>
      )}
    </>
  );
}

export default MainProfile;
