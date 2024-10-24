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
import { FaPencil } from "react-icons/fa6";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
// import { useRouter } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arb.png";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import { Button, useDisclosure } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
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
import { BASE_URL, LIGHTHOUSE_BASE_API_KEY } from "@/config/constants";
import FollowingModal from "../ComponentUtils/FollowingModal";
import { IoClose } from "react-icons/io5";
import style from "./MainProfile.module.css";
import UpdateProfileModal from "../ComponentUtils/UpdateProfileModal";
import { getChainAddress, getDaoName } from "@/utils/chainUtils";
interface Following {
  follower_address: string;
  isFollowing: boolean;
  isNotification: boolean;
}
import { cookies } from "next/headers";
import { m } from "framer-motion";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";
import RewardButton from "../ClaimReward/RewardButton";
import Heading from "../ComponentUtils/Heading";
import { ChevronDownIcon } from "lucide-react";
import { fetchApi } from "@/utils/api";

function MainProfile() {
  const { isConnected, address, chain } = useAccount();
  // const { isConnected, chain } = useAccount();
  // const address = "0xc622420AD9dE8E595694413F24731Dd877eb84E1";
  const { data: session, status } = useSession();
  const { openConnectModal } = useConnectModal();
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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selfDelegate, setSelfDelegate] = useState(false);
  const [daoName, setDaoName] = useState("optimism");
  const [isCopied, setIsCopied] = useState(false);
  const [followings, setFollowings] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isOpentoaster, settoaster] = useState(false);
  const [userFollowings, setUserFollowings] = useState<Following[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  // const [dbResponse, setDbResponse] = useState<any>(null);
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
  const [isToggled, setToggle] = useState(false);
  const { publicClient, walletClient } = WalletAndPublicClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Info");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const tabs = [
    { name: "Info", value: "info" },
    ...(selfDelegate ? [{ name: "Past Votes", value: "votes" }] : []),
    // { name: "Past Votes", value: "votes" },
    { name: "Sessions", value: "sessions" },
    { name: "Office Hours", value: "officeHours" },
    ...(selfDelegate ? [{ name: "Instant Meet", value: "instant-meet" }] : []),
    // { name: "Instant Meet", value: "instant-meet" }
  ];

  const handleTabChange = (tabValue: string) => {
    console.log(tabValue);
    const selected = tabs.find((tab) => tab.value === tabValue);
    console.log(selected);
    if (selected) {
      setSelectedTab(selected.name);
      setIsDropdownOpen(false);
      if (tabValue === "sessions") {
        router.push(
          path +
            `?active=${tabValue}&session=${
              selfDelegate ? "schedule" : "attending"
            }`
        );
      } else if (tabValue === "officeHours") {
        router.push(path + `?active=${tabValue}&hours=schedule`);
      } else {
        router.push(path + `?active=${tabValue}`);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover")) {
        setIsDropdownOpen(false);
      }
    }, 100);
  };

  useEffect(() => {
    const activeTab = searchParams.get("active");
    if (activeTab) {
      const tab = tabs.find((t) => t.value === activeTab);
      setSelectedTab(tab?.name || "Info");
    }
  }, [searchParams, tabs]);

  useEffect(() => {
    // if (chain && chain.name === "Optimism") {
    //   setDaoName("optimism");
    // } else if (chain && chain?.name === "Arbitrum One") {
    //   setDaoName("arbitrum");
    // }
    let daoName = getDaoName(chain?.name);
    setDaoName(daoName);
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
      // console.log(percentageDone);
    };

    const apiKey = LIGHTHOUSE_BASE_API_KEY ? LIGHTHOUSE_BASE_API_KEY : "";

    const output = await lighthouse.upload(selectedFile, apiKey);

    // console.log("File Status:", output);
    setModalData((prevUserData) => ({
      ...prevUserData,
      displayImage: output.data.Hash,
    }));

    // console.log(
    //   "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    // );
  };

  useEffect(() => {
    console.log("chain name:::: ", chain?.name);
    const checkDelegateStatus = async () => {
      // const addr = await walletClient.getAddresses();
      // const address1 = addr[0];
      try {
        const contractAddress = getChainAddress(chain?.name);
        // console.log(walletClient);
        if (address) {
          const delegateTx = await publicClient.readContract({
            address: contractAddress,
            abi: dao_abi.abi,
            functionName: "delegates",
            args: [address],
            // account: address1,
          });
          // console.log("Delegate tx", delegateTx);

          const delegateTxAddr = delegateTx.toLowerCase();

          if (delegateTxAddr === "0x0000000000000000000000000000000000000000") {
            setSelfDelegate(false);
          } else {
            setSelfDelegate(true);
          }
        }
      } catch (e) {
        console.log("error in function: ", e);
        setSelfDelegate(false);
      }
    };
    checkDelegateStatus();
  }, [address, daoName, selfDelegate]);

  // Pass the address of whom you want to delegate the voting power to
  const handleDelegateVotes = async (to: string) => {
    try {
      // const addr = await walletClient.getAddresses();
      // const address1 = addr[0];
      // console.log("addrrr", address1);

      const contractAddress = getChainAddress(chain?.name);

      console.log("contractAddress: ", contractAddress);

      // console.log("Contract", contractAddress);
      console.log("Wallet Client", walletClient);
      const delegateTx = await walletClient.writeContract({
        address: contractAddress,
        abi: dao_abi.abi,
        functionName: "delegate",
        args: [to],
        account: address,
      });

      console.log(delegateTx);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to become delegate. Please try again.");
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };
  const handleUpdateFollowings = async (
    daoname: string,
    isChange: number,
    isfollowingchange: number
  ) => {
    setLoading(true);
    setIsModalLoading(true);
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
    const res = await fetchApi(
      `/delegate-follow/savefollower`,
      requestOptions
    );

    const dbResponse = await res.json();

    if (isfollowingchange == 1) {
      updateFollowerState(dbResponse);
    } else {
      // setDbResponse(dbResponse);
      setIsFollowingModalOpen(true);
      for (const item of dbResponse.data) {
        const matchDao = item.followings.find(
          (daoItem: any) => daoItem.dao === daoname
        );

        if (matchDao) {
          const activeFollowings = matchDao.following.filter(
            (f: Following) => f.isFollowing
          );
          if (isChange == 1) {
            setFollowings(activeFollowings.length);
          }
          setUserFollowings(activeFollowings);
        } else {
          setFollowings(0);
          setUserFollowings([]);
        }
      }
    }
    // Close the modal
    setLoading(false);
    setIsModalLoading(false);
  };

  const toggleFollowing = async (
    index: number,
    userupdate: any,
    unfollowDao: any
  ) => {
    // alert(unfollowDao);
    setUserFollowings((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );

    if (!userupdate.isFollowing) {
      setFollowings(followings + 1);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      try {
        const response = await fetchApi("/delegate-follow/savefollower", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            // Add any necessary data
            delegate_address: userupdate.follower_address,
            follower_address: address,
            dao: unfollowDao,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to follow");
        }

        const data = await response.json();
        // settoaster(false);
        // console.log("Follow successful:", data);
      } catch (error) {
        console.error("Error following:", error);
      }
    } else {
      if (daoName === unfollowDao) {
        setFollowings(followings - 1);
      }
      setLoading(true);
      // settoaster(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        const response = await fetchApi("/delegate-follow/updatefollower", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            // Add any necessary data
            delegate_address: userupdate.follower_address,
            follower_address: address,
            action: 1,
            dao: unfollowDao,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow");
        }

        const data = await response.json();
        // settoaster(false);
        setLoading(false);
        // console.log("unFollow successful:", data);
      } catch (error) {
        setLoading(false);
        console.error("Error following:", error);
      }
    }
  };

  const toggleNotification = async (
    index: number,
    userupdate: any,
    notificationdao: any
  ) => {
    setUserFollowings((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, isNotification: !user.isNotification } : user
      )
    );
    // settoaster(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const response = await fetchApi("/delegate-follow/updatefollower", {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify({
          // Add any necessary data
          delegate_address: userupdate.follower_address,
          follower_address: address,
          action: 2,
          dao: notificationdao,
          updatenotification: !userupdate.isNotification,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to notification");
      }

      const data = await response.json();
      // settoaster(false);
      // console.log("notification successful:", data);
    } catch (error) {
      console.error("Error following:", error);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setModalData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const updateFollowerState = async (dbResponse: any) => {
    const userData = dbResponse?.data?.[0];
    // let address = await walletClient.getAddresses();
    // let address_user = address[0].toLowerCase();
    let currentDaoName = getDaoName(chain?.name);
    // if (chain?.name === "Optimism") {
    //   currentDaoName = "optimism";
    // } else if (chain?.name === "Arbitrum One") {
    //   currentDaoName = "arbitrum";
    // }

    // Process following details
    const matchDao = userData?.followings?.find(
      (daoItem: any) =>
        daoItem.dao.toLowerCase() === currentDaoName.toLowerCase()
    );

    if (matchDao) {
      const activeFollowings = matchDao.following?.filter(
        (f: any) => f.isFollowing
      );
      setFollowings(activeFollowings.length);
      setUserFollowings(activeFollowings);
    } else {
      setFollowings(0);
      setUserFollowings([]);
    }

    const daoFollowers = userData?.followers?.find(
      (dao: any) => dao.dao_name === currentDaoName
    );

    const followerCount = daoFollowers?.follower?.filter(
      (f: any) => f.isFollowing
    ).length;

    // alert(followerCount);
    setFollowers(followerCount);
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
      const response = await fetchApi("/profile/emailstatus", requestOptions);

      if (!response.ok) {
        throw new Error("Failed to toggle");
      }

      const data = await response.json();
      setToggle(!isToggled);
      // console.log("status successfully change!", data);
    } catch (error) {
      console.error("Error following:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching from DB");
        // Fetch data from your backend API to check if the address exists
        // console.log("Fetching from DB");
        // const dbResponse = await axios.get(`/api/profile/${address}`);

        let dao = getDaoName(chain?.name);
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
        const res = await fetchApi(`/profile/${address}`, requestOptions);

        const dbResponse = await res.json();

        let karmaDetails;

        try {
          const karmaRes = await fetch(
            `https://api.karmahq.xyz/api/dao/find-delegate?dao=${dao}&user=${address}`
          );
          karmaDetails = await karmaRes.json();

          if (karmaDetails.length > 0) {
            setKarmaEns(karmaDetails?.data?.delegate?.ensName);
            setKarmaImage(karmaDetails?.data?.delegate?.profilePicture);
            setKarmaDesc(
              karmaDetails?.data?.delegate?.delegatePitch?.customFields[1]
                ?.value
            );
          }
          setIsDelegate(true);
        } catch (e) {
          console.log("error: ", e);
          setIsDelegate(false);
        }

        if (dbResponse.data.length > 0) {
          // console.log("db Response", dbResponse.data[0]);
          // console.log(
          //   "dbResponse.data[0]?.networks:",
          //   dbResponse.data[0]?.networks
          // );
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
          setToggle(dbResponse.data[0]?.isEmailVisible);
          setDescription(
            dbResponse.data[0]?.networks?.find(
              (network: any) => network.dao_name === dao
            )?.description || ""
          );

          if (!isConnected) {
            setFollowings(0);
            setFollowers(0);
          } else {
            await handleUpdateFollowings(daoName, 0, 1);
          }
          setIsPageLoading(false);
        } else {
          setUserData({
            displayName: karmaDetails.data.delegate.ensName,
            discord: karmaDetails.data.delegate.discordHandle,
            discourse: karmaDetails.data.delegate.discourseHandle,
            twitter: karmaDetails.data.delegate.twitterHandle,
            github: karmaDetails.data.delegate.githubHandle,
            displayImage: karmaDetails.data.delegate.profilePicture,
          });
          await handleUpdateFollowings(daoName, 0, 1);
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to load profile data. Please try again later.");
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [chain, address]);

  const handleSave = async (newDescription?: string) => {
    try {
      // Check if the delegate already exists in the database
      if (newDescription) {
        setDescription(newDescription);
        // console.log("New Description", description);
      }
      setIsLoading(true);
      const isExisting = await checkDelegateExists(address);

      if (isExisting) {
        // If delegate exists, update the delegate
        await handleUpdate(newDescription);
        setIsLoading(false);
        onClose();
        // console.log("Existing True");
      } else {
        // If delegate doesn't exist, add a new delegate
        await handleAdd(newDescription);
        setIsLoading(false);
        onClose();
        // console.log("Sorry! Doesn't exist");
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
      // console.log("Checking");

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
      const res = await fetchApi(`/profile/${address}`, requestOptions);

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

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
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
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetchApi("/profile/", requestOptions);
      console.log("Response Add", response);

      if (response.status === 200) {
        // Delegate added successfully
        console.log("Delegate added successfully:", response.status);
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
        console.error("Failed to add delegate:", response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calling POST API:", error);
      setIsLoading(false);
    }
  };

  // Function to handle updating an existing delegate
  const handleUpdate = async (newDescription?: string) => {
    try {
      // console.log("Updating");
      // console.log("Inside Updating Description", newDescription);
      // console.log("Updating");
      // console.log("Inside Updating Description", newDescription);
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
      // console.log("response", response);
      // Handle response from the PUT API function
      if (response.data.success) {
        // Delegate updated successfully
        // console.log("Delegate updated successfully");
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
        console.error("Failed to update delegate:", response.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calling PUT API:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* For Mobile Screen */}
      {/* <MobileResponsiveMessage/> */}

      {/* For Desktop Screen  */}
      {/* <div className="hidden md:block"> */}
      <div className="lg:hidden pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
        <Heading />
      </div>
      {!isPageLoading ? (
        <div className="font-poppins">
          <div className="flex flex-col md:flex-row pb-5 lg:py-5 px-4 md:px-6 lg:px-14 justify-between items-start">
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-start items-center lg:items-start justify-center lg:justify-start w-full lg:w-auto">
              <div
                className={`${
                  userData.displayImage ? "h-full" : "h-[80vw] xs:h-auto"
                } relative object-cover rounded-3xl w-full xs:w-auto`}
                style={{
                  backgroundColor: "#fcfcfc",
                  border: "2px solid #E9E9E9 ",
                }}
              >
                <div className="w-full h-full xs:w-28 xs:h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex items-center justify-center ">
                  {/* <div className="flex justify-center items-center w-40 h-40"> */}
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
                        ? "w-full xs:w-28 xs:h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-3xl"
                        : "w-14 h-14 sm:w-20 sm:h-20 lg:w-20 lg:h-20 rounded-3xl"
                    }
                  />
                  {/* </div> */}

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

              <div className="px-4 mt-4 xs:mt-0 md:mt-2 lg:mt-4 w-full xs:w-auto">
                <div className=" flex items-center py-1">
                  <div className="font-bold text-[22px] xs:text-xl sm:text-xl lg:text-[22px] pr-4">
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
                  <div className="flex gap-2 sm:gap-3">
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
                    <Tooltip
                      content="Copy your profile URL to share on Warpcast or Twitter."
                      placement="bottom"
                      closeDelay={1}
                      showArrow
                    >
                      <Button
                        className="bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm "
                        onClick={() => {
                          if (typeof window === "undefined") return;
                          navigator.clipboard.writeText(
                            `${BASE_URL}/${getDaoName(
                              chain?.name
                            )}/${address}?active=info`
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

                {isFollowingModalOpen && (
                  <FollowingModal
                    userFollowings={userFollowings}
                    toggleFollowing={toggleFollowing}
                    toggleNotification={toggleNotification}
                    setIsFollowingModalOpen={setIsFollowingModalOpen}
                    isLoading={isLoading}
                    handleUpdateFollowings={handleUpdateFollowings}
                    daoName={daoName}
                  />
                )}

                {selfDelegate === false ? (
                  <div className="pt-2 flex flex-col xs:flex-row gap-2 sm:gap-5 w-full">
                    {/* pass address of whom you want to delegate the voting power to */}
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full py-[10px] px-6 xs:py-2 xs:px-4 sm:px-6 xs:text-xs sm:text-sm text-sm lg:px-8 lg:py-[10px] w-full xs:w-auto"
                      onClick={() => handleDelegateVotes(`${address}`)}
                    >
                      Become Delegate
                    </button>

                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-6 py-[10px] xs:py-2 text-sm xs:text-xs sm:text-sm lg:px-8 lg:py-[10px] w-full xs:w-[135px] lg:w-[150px] flex items-center justify-center"
                      onClick={() =>
                        followings
                          ? handleUpdateFollowings(daoName, 1, 0)
                          : toast.error(
                              "You're not following anyone yet. Start exploring delegate profiles now!"
                            )
                      }
                    >
                      {isModalLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        `${followings} Following`
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col xs:flex-row gap-2 sm:gap-5 w-full">
                    <button className="bg-blue-shade-200 font-bold text-white rounded-full py-[10px] px-6 xs:py-2 text-sm xs:text-xs sm:text-sm lg:px-8 lg:py-[10px]  w-full xs:w-auto">
                      {followers}{" "}
                      {followers === 0 || followers === 1
                        ? "Follower"
                        : "Followers"}
                    </button>

                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-6 py-2 text-sm xs:text-xs sm:text-sm lg:px-8 lg:py-[10px]  w-full xs:w-auto"
                      onClick={() =>
                        followings
                          ? handleUpdateFollowings(daoName, 1, 0)
                          : toast.error(
                              "You're not following anyone yet. Start exploring delegate profiles now!"
                            )
                      }
                    >
                      {followings} Followings
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex gap-1 xs:gap-2 items-center">
              <RewardButton />
              <ConnectWalletWithENS />
            </div>
          </div>

          <div className=" ">
            <div
              className="md:hidden mt-4 px-8 xs:px-4 sm:px-8 py-2 sm:py-[10px] bg-[#D9D9D945]"
              ref={dropdownRef}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="w-full flex justify-between items-center text-left font-normal rounded-full capitalize text-lg text-blue-shade-100 bg-white px-4 py-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={handleMouseEnter}
              >
                <span>{selectedTab}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-700 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`w-[calc(100vw-2rem)] mt-1 overflow-hidden transition-all duration-700 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-2 border border-white-shade-100 rounded-xl bg-white shadow-md">
                  {tabs.map((tab, index) => (
                    <React.Fragment key={tab.value}>
                      <div
                        onClick={() => handleTabChange(tab.value)}
                        className="px-3 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-gray-100 capitalize text-base cursor-pointer"
                      >
                        {tab.name}
                      </div>
                      {index !== tabs.length - 1 && <hr className="my-1" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`bg-[#D9D9D945] hidden md:flex overflow-x-auto whitespace-nowrap gap-6 xs:gap-8 sm:gap-12 pl-6 xs:pl-8 sm:pl-16 ${style.hideScrollbarColor} ${style.scrollContainter}`}
            >
              <button
                className={`border-b-2 py-3 xs:py-4 px-2 outline-none flex-shrink-0 ${
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
                  className={`border-b-2 py-3 xs:py-4 px-2 outline-none flex-shrink-0 ${
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
                className={`border-b-2 py-3 xs:py-4 px-2 outline-none flex-shrink-0 ${
                  searchParams.get("active") === "sessions"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() =>
                  router.push(
                    path +
                      `?active=sessions&session=${
                        selfDelegate ? "schedule" : "attending"
                      }`
                  )
                }
              >
                Sessions
              </button>
              <button
                className={`border-b-2 py-3 xs:py-4 px-2 outline-none flex-shrink-0 ${
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
                  className={`border-b-2 py-3 xs:py-4 px-2 outline-none flex-shrink-0 ${
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

            <div>
              {searchParams.get("active") === "info" ? (
                <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
                  <UserInfo
                    karmaDesc={karmaDesc}
                    description={description}
                    isDelegate={isDelegate}
                    isSelfDelegate={selfDelegate}
                    // descAvailable={descAvailable}
                    onSaveButtonClick={(newDescription?: string) =>
                      handleSave(newDescription)
                    }
                    daoName={daoName}
                  />
                </div>
              ) : (
                ""
              )}

              {selfDelegate === true &&
              searchParams.get("active") === "votes" ? (
                <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
                  <UserVotes daoName={daoName} />
                </div>
              ) : (
                ""
              )}

              {searchParams.get("active") === "sessions" ? (
                // <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
                <UserSessions
                  isDelegate={isDelegate}
                  selfDelegate={selfDelegate}
                  daoName={daoName}
                />
              ) : (
                // </div>
                ""
              )}

              {searchParams.get("active") === "officeHours" ? (
                <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
                  <UserOfficeHours
                    isDelegate={isDelegate}
                    selfDelegate={selfDelegate}
                    daoName={daoName}
                  />
                </div>
              ) : (
                ""
              )}

              {selfDelegate === true &&
              searchParams.get("active") === "instant-meet" ? (
                <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
                  <InstantMeet
                    isDelegate={isDelegate}
                    selfDelegate={selfDelegate}
                    daoName={daoName}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <MainProfileSkeletonLoader />
        </>
      )}
      {/* </div> */}
    </>
  );
}

export default MainProfile;
