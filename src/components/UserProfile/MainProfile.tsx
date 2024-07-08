"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import user from "@/assets/images/daos/user3.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import {
  BiSolidBellOff,
  BiSolidBellRing,
  BiSolidMessageRoundedDetail,
} from "react-icons/bi";
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
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import MainProfileSkeletonLoader from "../SkeletonLoader/MainProfileSkeletonLoader";
import { BASE_URL } from "@/config/constants";
import { fetchData } from "next-auth/client/_utils";

function MainProfile() {
  const { isConnected, address } = useAccount();
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
  const [daoName, setDaoName] = useState("optimism");
  const [isCopied, setIsCopied] = useState(false);
  const [followings, setfollowings] = useState(0);
  const [followers, setfollowers] = useState(0);
  const [isFollowing, setfollwing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setnotification] = useState(true);
  const [isOpenFollowings, setfollowingmodel] = useState(false);
  const [isOpentoaster, settoaster] = useState(false);
  const [userFollowings, setUserFollowings] = useState<Following[]>([]);
  const [dbResponse, setDbResponse] = useState<any>(null);

  interface ProgressData {
    total: any;
    uploaded: any;
  }

  interface Following {
    follower_address: string;
    isFollowing: boolean;
    isNotification: boolean;
  }

  // useEffect(() => {
  //   if (chain?.name === "Optimism") {
  //     setDaoName("optimism");
  //   } else if (chain?.name === "Arbitrum One") {
  //     setDaoName("arbitrum");
  //   }
  //   console.log("daoName", daoName);
  // }, [chain, daoName]);
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

    let dao = daoName;
    const response = await axios.put("/api/profile", {
      address: address,
      image: displayImage,
      description: description,
      isDelegate: true,
      displayName: displayName,
      emailId: emailId,
      socialHandles: {
        twitter: twitter,
        discord: discord,
        github: github,
      },
      networks: {
        dao_name: daoName,
        network: chain?.name,
        discourse: discourse,
      },
    });

    console.log("response: ", response);

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
  };

  useEffect(() => {
    const checkDelegateStatus = async () => {
      const addr = await walletClient.getAddresses();
      const address1 = addr[0];
      let delegateTxAddr = "";
      // const contractAddress =
      //   daoName === "optimism"
      //     ? "0x4200000000000000000000000000000000000042"
      //     : daoName === "arbitrum"
      //     ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
      //     : "";
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
        // daoName === "optimism"
        //   ? "0x4200000000000000000000000000000000000042"
        //   : daoName === "arbitrum"
        //   ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
        //   : "";
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
  const handleCloseAndUpdateFollowings = async () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
    setDbResponse(dbResponse);

    for (const item of dbResponse.data) {
      const matchDao = item.followings.find(
        (daoItem: any) => daoItem.dao === daoName
      );

      if (matchDao) {
        const activeFollowings = matchDao.following.filter(
          (f: Following) => f.isFollowing
        );
        setfollowings(activeFollowings.length);
        setUserFollowings(activeFollowings);
      } else {
        setfollowings(0);
        setUserFollowings([]);
      }
    }
    // Close the modal
    setLoading(false);
    setfollowingmodel(false);
  };
  const toggleFollowing = async (index: number, userupdate: any) => {
    setUserFollowings((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
    settoaster(true);

    if (!userupdate.isFollowing) {
      setfollowings(followings + 1);

      try {
        const response = await fetch("/api/delegate-follow/savefollower", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add any necessary data
            delegate_address: userupdate.follower_address,
            follower_address: address,
            dao: daoName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to follow");
        }

        const data = await response.json();
        settoaster(false);
        console.log("Follow successful:", data);
      } catch (error) {
        console.error("Error following:", error);
      }
    } else {
      setfollowings(followings - 1);
      settoaster(true);
      try {
        const response = await fetch("/api/delegate-follow/updatefollower", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add any necessary data
            delegate_address: userupdate.follower_address,
            follower_address: address,
            action: 1,
            dao: daoName,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow");
        }

        const data = await response.json();
        settoaster(false);
        console.log("unFollow successful:", data);
      } catch (error) {
        console.error("Error following:", error);
      }
    }
  };

  const toggleNotification = async (index: number, userupdate: any) => {
    setUserFollowings((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isNotification: !user.isNotification } : user
      )
    );
    settoaster(true);

    try {
      const response = await fetch("/api/delegate-follow/updatefollower", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add any necessary data
          delegate_address: userupdate.follower_address,
          follower_address: address,
          action: 2,
          dao: daoName,
          updatenotification: !userupdate.isNotification,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to notification");
      }

      const data = await response.json();
      settoaster(false);
      console.log("notification successful:", data);
    } catch (error) {
      console.error("Error following:", error);
    }
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
        // let dao = daoName;
        let dao =
          chain?.name === "Optimism"
            ? "optimism"
            : chain?.name === "Arbitrum One"
            ? "arbitrum"
            : "";
        console.log("Fetching from DB");
        // const dbResponse = await axios.get(`/api/profile/${address}`);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

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
        setDbResponse(dbResponse);
        console.log("db Response", dbResponse);
        if (
          dbResponse &&
          Array.isArray(dbResponse.data) &&
          dbResponse.data.length > 0
        ) {
          // Iterate over each item in the response data array
          for (const item of dbResponse.data) {
            // Check if address and daoName match
            if (item.address === address) {
              console.log("Data found in the database");
              // Data found in the database, set the state accordingly
              setResponseFromDB(true);
              setDisplayImage(item.image);
              setDescription(item.description);
              setDisplayName(item.displayName);
              setEmailId(item.emailId);
              setTwitter(item.socialHandles.twitter);
              setDiscord(item.socialHandles.discord);

              if (!isConnected) {
                setfollowings(0);
                setfollowers(0);
              } else {
                const matchDao = item.followings.find(
                  (daoItem: any) => daoItem.dao === dao
                );

                if (matchDao) {
                  const activeFollowings = matchDao.following.filter(
                    (f: Following) => f.isFollowing
                  );
                  setfollowings(activeFollowings.length);
                  setUserFollowings(activeFollowings);
                } else {
                  setfollowings(0);
                  setUserFollowings([]);
                }

                const daoFollowers = item.followers.find(
                  (dao: any) => dao.dao_name === daoName
                );

                const followerCount = daoFollowers.follower.filter(
                  (f: any) => f.isFollowing
                ).length;

                // alert(followerCount);
                setfollowers(followerCount);
              }

              const matchingNetwork = item.networks.find(
                (network: any) => network.dao_name === dao
              );

              // If a matching network is found, set the discourse ID
              if (matchingNetwork) {
                setDiscourse(matchingNetwork.discourse);
              } else {
                // Handle the case where no matching network is found
                console.log(
                  "No matching network found for the specified dao_name"
                );
              }

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
          let dao =
            chain?.name === "Optimism"
              ? "optimism"
              : chain?.name === "Arbitrum One"
              ? "arbitrum"
              : "";
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
  }, [
    daoName,
    chain,
    address,
    searchParams.get("session") === "schedule",
    chain?.name,
  ]);

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
      let dao =
        chain?.name === "Optimism"
          ? "optimism"
          : chain?.name === "Arbitrum One"
          ? "arbitrum"
          : "";
      console.log("Checking");

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

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
      let dao =
        chain?.name === "Optimism"
          ? "optimism"
          : chain?.name === "Arbitrum One"
          ? "arbitrum"
          : "";
      console.log("Adding the delegate..");
      const response = await axios.post("/api/profile", {
        address: address,
        image: displayImage,
        description: newDescription,
        isDelegate: true,
        displayName: displayName,
        emailId: emailId,
        socialHandles: {
          twitter: twitter,
          discord: discord,
          github: github,
        },
        networks: [
          {
            dao_name: daoName,
            network: chain?.name,
            discourse: discourse,
          },
        ],
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

      let dao =
        chain?.name === "Optimism"
          ? "optimism"
          : chain?.name === "Arbitrum One"
          ? "arbitrum"
          : "";
      console.log("Updating");
      console.log("Inside Updating Description", newDescription);
      const response: any = await axios.put("/api/profile", {
        address: address,
        image: displayImage,
        description: newDescription,
        isDelegate: true,
        displayName: displayName,
        emailId: emailId,
        socialHandles: {
          twitter: twitter,
          discord: discord,
          github: github,
        },
        networks: [
          {
            dao_name: daoName,
            network: chain?.name,
            discourse: discourse,
          },
        ],
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
        let dao =
          chain?.name === "Optimism"
            ? "optimism"
            : chain?.name === "Arbitrum One"
            ? "arbitrum"
            : "";
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
  }, [chain, address, daoName, chain?.name]);

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
                }}>
                <div className="w-40 h-40 flex items-center justify-content ">
                  <div className="flex justify-center items-center w-40 h-40">
                    <Image
                      src={
                        (displayImage
                          ? `https://gateway.lighthouse.storage/ipfs/${displayImage}`
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
                      target="_blank">
                      <FaXTwitter color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={
                        daoName === "optimism"
                          ? `https://gov.optimism.io/u/${discourse}`
                          : daoName == "arbitrum"
                          ? `https://forum.arbitrum.foundation/u/${discourse}`
                          : ""
                      }
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                        discourse == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank">
                      <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://discord.com/${discord}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        discord == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank">
                      <FaDiscord color="#7C7C7C" size={12} />
                    </Link>
                    <Link
                      href={`https://github.com/${github}`}
                      className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                        github == "" ? "hidden" : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank">
                      <FaGithub color="#7C7C7C" size={12} />
                    </Link>
                    <Tooltip
                      content="Update your Profile"
                      placement="top"
                      showArrow>
                      <span
                        className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer"
                        style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                        onClick={onOpen}>
                        <FaPencil color="#3e3d3d" size={12} />
                      </span>
                    </Tooltip>
                    <Modal
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      className="font-poppins">
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
                                onClick={() => handleSubmit()}>
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
                    placement="bottom"
                    closeDelay={1}
                    showArrow>
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
                      showArrow>
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
                        }}>
                        <IoShareSocialSharp />
                        {isCopied ? "Copied" : "Share profile"}
                      </Button>
                    </Tooltip>
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
                {/* {selfDelegate === true
                  ? votes && (
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
                  : null} */}

                {isOpentoaster && toast.loading("Saving...")}

                {isOpenFollowings && (
                  <div className="font-poppins z-[70] fixed inset-0 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-white rounded-[41px] overflow-hidden shadow-lg w-3/4">
                      <div className="relative">
                        <div className="flex flex-col gap-1 text-white bg-[#292929] p-4 py-7">
                          <h2 className="text-lg font-semibold mx-4">
                            Followings
                          </h2>
                        </div>
                        <div className="px-8 py-4 max-h-[60vh] overflow-y-auto">
                          {userFollowings.map((user, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center border-b py-4">
                              <div className="flex items-center">
                                <img
                                  src={
                                    "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1719619200&semt=sph " ||
                                    "default-image-url"
                                  } // Add a default image URL
                                  alt={user.follower_address}
                                  className="w-10 h-10 rounded-full mr-4"
                                />
                                <div>
                                  <p className="font-semibold">
                                    {user.follower_address.slice(0, 6)}...
                                    {user.follower_address.slice(-4)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {user.follower_address}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <button
                                  className={`font-bold text-white rounded-full px-8 py-[10px] flex items-center ${
                                    user.isFollowing
                                      ? "bg-red-600"
                                      : "bg-blue-shade-200"
                                  }`}
                                  onClick={() => toggleFollowing(index, user)}>
                                  {user.isFollowing ? "Unfollow" : "Follow"}
                                </button>
                                <span className="text-sm text-blue-700 mx-1">
                                  {user.isNotification ? (
                                    <BiSolidBellRing
                                      className=""
                                      color="bg-blue-shade-200"
                                      size={24}
                                      onClick={() =>
                                        toggleNotification(index, user)
                                      }
                                    />
                                  ) : (
                                    <BiSolidBellOff
                                      className="mr-1"
                                      color="bg-blue-shade-200"
                                      size={24}
                                      onClick={() =>
                                        toggleNotification(index, user)
                                      }
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center px-8 py-4">
                          <button
                            className="bg-gray-300 text-gray-700 px-8 py-3 font-semibold rounded-full"
                            onClick={handleCloseAndUpdateFollowings}>
                            {loading ? (
                              <Oval
                                visible={true}
                                height="20"
                                width="20"
                                color="black"
                                secondaryColor="#cdccff"
                                ariaLabel="oval-loading"
                              />
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                          <button
                            className="bg-red-300 text-gray-700 px-8 py-3 ml-4 font-semibold rounded-full"
                            onClick={() => setfollowingmodel(false)}>
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selfDelegate === false ? (
                  <div className="pt-2 flex gap-5">
                    {/* pass address of whom you want to delegate the voting power to */}
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => handleDelegateVotes(`${address}`)}>
                      Become Delegate
                    </button>

                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() =>
                        followings
                          ? setfollowingmodel(true)
                          : toast.error(
                              "You have 0 following explore delegate profile now!"
                            )
                      }>
                      {followings} Following
                    </button>

                    {/* <div className="">
                      <select
                        value={daoName}
                        onChange={(e) => setDaoName(e.target.value)}
                        className="outline-none border border-blue-shade-200 text-blue-shade-200 rounded-full py-2 px-3"
                      >
                        <option value="optimism" className="text-gray-700">
                          Optimism
                        </option>
                        <option value="arbitrum" className="text-gray-700">
                          Arbitrum
                        </option>
                      </select>
                    </div> */}
                  </div>
                ) : (
                  <div className="pt-2 flex gap-5">
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => alert("nothing to call")}>
                      {followers} Followers
                    </button>

                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      onClick={() => setfollowingmodel(true)}>
                      {followings} Following
                    </button>
                  </div>
                )}
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
              onClick={() => router.push(path + "?active=info")}>
              Info
            </button>
            {selfDelegate === true && (
              <button
                className={`border-b-2 py-4 px-2 outline-none ${
                  searchParams.get("active") === "votes"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=votes")}>
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
              }>
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
              }>
              Office Hours
            </button>

            {selfDelegate === true && (
              <button
                className={`border-b-2 py-4 px-2 outline-none ${
                  searchParams.get("active") === "instant-meet"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=instant-meet")}>
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
