"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import user from "@/assets/images/daos/profile.png";
import {
  FaXTwitter,
  FaDiscord,
  FaGithub,
  FaVoicemail,
  FaEnvelope,
} from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy, IoShareSocialSharp } from "react-icons/io5";
import DelegateInfo from "./DelegateInfo";
import DelegateVotes from "./DelegateVotes";
import DelegateSessions from "./DelegateSessions";
import DelegateOfficeHrs from "./DelegateOfficeHrs";
import copy from "copy-to-clipboard";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  Provider,
  cacheExchange,
  createClient,
  fetchExchange,
  gql,
} from "urql";
import WalletAndPublicClient from "@/helpers/signer";
import dao_abi from "../../artifacts/Dao.sol/GovernanceToken.json";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arb.png";
import ccLogo from "@/assets/images/daos/CCLogo2.png";
import { Oval } from "react-loader-spinner";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import {
  arb_client,
  DELEGATE_CHANGED_QUERY,
  GET_LATEST_DELEGATE_VOTES_CHANGED,
  op_client,
} from "@/config/staticDataUtils";
// import { getEnsNameOfUser } from "../ConnectWallet/ENSResolver";
import DelegateTileModal from "../ComponentUtils/DelegateTileModal";
// import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";
import { set } from "video.js/dist/types/tech/middleware";
import MainProfileSkeletonLoader from "../SkeletonLoader/MainProfileSkeletonLoader";
import { fetchEnsNameAndAvatar } from "@/utils/ENSUtils";
import Confetti from "react-confetti";
import { connected } from "process";
import { IoMdNotifications } from "react-icons/io";
import { IoMdNotificationsOff } from "react-icons/io";
import { BASE_URL } from "@/config/constants";
import { getChainAddress, getDaoName } from "@/utils/chainUtils";
import { optimism, arbitrum } from "viem/chains";
import RewardButton from "../ClaimReward/RewardButton";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}

function SpecificDelegate({ props }: { props: Type }) {
  const { chain } = useAccount();
  const { openChainModal } = useChainModal();
  const [delegateInfo, setDelegateInfo] = useState<any>();
  const router = useRouter();
  const path = usePathname();
  const { openConnectModal } = useConnectModal();
  const searchParams = useSearchParams();
  const [selfDelegate, setSelfDelegate] = useState<boolean>();
  const [isDelegate, setIsDelegate] = useState<boolean>();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [description, setDescription] = useState("");
  // const provider = new ethers.BrowserProvider(window?.ethereum);
  const [displayEnsName, setDisplayEnsName] = useState<any>();
  const [delegate, setDelegate] = useState("");
  const [same, setSame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  // const [followed, isFollowed] = useState(false);
  const [isOpenunfollow, setUnfollowmodel] = useState(false);
  // const [isOpenNotification, setNotificationmodel] = useState(false);
  const [notification, isNotification] = useState(false);
  // const [daoname, setDaoName] = useState("");
  const [emailId, setEmailId] = useState<string>();
  const [isEmailVisible, setIsEmailVisible] = useState(false);

  const [delegateOpen, setDelegateOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // const address = useAccount();
  const [followerCountLoading, setFollowerCountLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [isFollowStatusLoading, setIsFollowStatusLoading] = useState(true);
  const [delegatingToAddr, setDelegatingToAddr] = useState(false);
  const { isConnected, address } = useAccount();
  const [confettiVisible, setConfettiVisible] = useState(false);
  const network = useAccount().chain;
  const { publicClient, walletClient } = WalletAndPublicClient();

  const handleDelegateModal = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
      setDelegateOpen(true);
      setLoading(true);
      try {
        let data: any;
        if (props.daoDelegates === "optimism") {
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
          delegate.toLowerCase() === props.individualDelegate.toLowerCase()
        );
        // ens
        // ? setDelegate(ens)
        // :
        setDelegate(delegate);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

      setDelegateOpen(true);
    }
  };

  const handleCloseDelegateModal = () => {
    setDelegateOpen(false);
  };
  useEffect(() => {
    // Lock scrolling when the modal is open
    if (delegateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [delegateOpen]);
  const [votingPower, setVotingPower] = useState<number>();

  const [karmaSocials, setKarmaSocials] = useState({
    twitter: "",
    discord: "",
    discourse: "",
    github: "",
  });

  const [socials, setSocials] = useState({
    twitter: "",
    discord: "",
    discourse: "",
    github: "",
  });
  const [delegatorsCount, setDelegatorsCount] = useState<number>();
  const [votesCount, setVotesCount] = useState<number>();

  const totalCount = `query Delegate($input: DelegateInput!) {
  delegate(input: $input) {
    id
    votesCount
    delegatorsCount
  }
}
 `;
  const variables = {
    input: {
      address: `${props.individualDelegate}`,
      governorId: "",
      organizationId: null as number | null,
    },
  };
  if (props.daoDelegates === "arbitrum") {
    variables.input.governorId =
      "eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4";
    variables.input.organizationId = 2206072050315953936;
  } else {
    variables.input.governorId =
      "eip155:10:0xcDF27F107725988f2261Ce2256bDfCdE8B382B10";
    variables.input.organizationId = 2206072049871356990;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TALLY_API_KEY;
        if (!apiKey) {
          throw new Error("API key is missing");
        }
        fetch("https://api.tally.xyz/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key": apiKey,
          },
          body: JSON.stringify({
            query: totalCount,
            variables: variables,
          }),
        })
          .then((result) => result.json())
          .then((finalCounting) => {
            setVotesCount(finalCounting.data.delegate.votesCount);
            setDelegatorsCount(finalCounting.data.delegate.delegatorsCount);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        const data = await op_client
          .query(GET_LATEST_DELEGATE_VOTES_CHANGED, {
            delegate: props.individualDelegate.toString(),
          })
          .toPromise();

        setVotingPower(data.data.delegateVotesChangeds[0].newBalance);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (props.individualDelegate) {
      fetchData();
    }
  }, [op_client, props.individualDelegate]);

  useEffect(() => {
    // console.log("Network", chain?.network);
    const fetchData = async () => {
      console.log("fetching from karma");
      setIsPageLoading(true);
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/find-delegate?dao=${props.daoDelegates}&user=${props.individualDelegate}`
        );
        const details = await res.json();

        setDelegateInfo(details.data.delegate);
        if (
          props.individualDelegate.toLowerCase() ===
          details.data.delegate.publicAddress.toLowerCase()
        ) {
          setIsDelegate(true);
        }

        setKarmaSocials({
          twitter: details.data.delegate.twitterHandle
            ? details.data.delegate.twitterHandle
            : "",
          discourse: details.data.delegate.discourseHandle
            ? details.data.delegate.discourseHandle
            : "",
          discord: details.data.delegate.discordHandle
            ? details.data.delegate.discordHandle
            : "",
          github: details.data.delegate.githubHandle
            ? details.data.delegate.githubHandle
            : "",
        });
        // await updateFollowerState();
        // await setFollowerscount();
        await fetchDelegateData();

        setIsPageLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkDelegateStatus = async () => {
      setIsPageLoading(true);
      //   const addr = await walletClient.getAddresses();
      //   const address1 = addr[0];
      let delegateTxAddr = "";
      const contractAddress =
        props.daoDelegates === "optimism"
          ? "0x4200000000000000000000000000000000000042"
          : props.daoDelegates === "arbitrum"
          ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
          : "";

      try {
        const delegateTx = await publicClient.readContract({
          address: contractAddress,
          abi: dao_abi.abi,
          functionName: "delegates",
          args: [props.individualDelegate],
          // account: address1,
        });
        delegateTxAddr = delegateTx;
        if (
          delegateTxAddr.toLowerCase() ===
          props.individualDelegate?.toLowerCase()
        ) {
          setSelfDelegate(true);
        }
        setIsPageLoading(false);
      } catch (error) {
        console.error("Error in reading contract", error);
        setIsPageLoading(false);
      }
    };
    checkDelegateStatus();
  }, [props]);

  const formatNumber = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "m";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    } else {
      return number;
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const fetchDelegateData = async () => {
    setIsFollowStatusLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }
    const raw = JSON.stringify({
      address: props.individualDelegate,
    });

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const resp = await fetch(
        `/api/delegate-follow/savefollower`,
        requestOptions
      );

      if (!resp.ok) {
        throw new Error("Failed to fetch delegate data");
      }

      const data = await resp.json();

      if (!data.success || !data.data || data.data.length === 0) {
        console.log("No data returned from API");
        return;
      }

      const followerData = data.data[0];
      const currentDaoName = props.daoDelegates.toLowerCase();
      const daoFollowers = followerData.followers.find(
        (dao: any) => dao.dao_name.toLowerCase() === currentDaoName
      );

      if (daoFollowers) {
        // Update follower count
        const followerCount = daoFollowers.follower.filter(
          (f: any) => f.isFollowing
        ).length;
        setFollowers(followerCount);
        setFollowerCountLoading(false);

        // Update follow and notification status
        // const address = await walletClient.getAddresses();
        // const address_user = address[0].toLowerCase();
        const userFollow = daoFollowers.follower.find(
          (f: any) => f.address.toLowerCase() === address?.toLowerCase()
        );

        if (userFollow) {
          setIsFollowing(userFollow.isFollowing);
          isNotification(userFollow.isNotification);
        } else {
          setIsFollowing(false);
          isNotification(false);
        }
      } else {
        setFollowers(0);
        setIsFollowing(false);
        isNotification(false);
        setFollowerCountLoading(false);
      }
    } catch (error) {
      console.error("Error in fetchDelegateData:", error);
      setFollowers(0);
      setIsFollowing(false);
      isNotification(false);
      setFollowerCountLoading(false);
    } finally {
      setFollowerCountLoading(false);
      setIsFollowStatusLoading(false);
    }
  };

  const handleConfirm = async (action: number) => {
    let delegate_address: string;
    // let follower_address: string;
    let dao: string;
    dao = props.daoDelegates;
    // let address = await walletClient.getAddresses();
    // follower_address = address[0];
    delegate_address = props.individualDelegate;

    if (action == 1) {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      try {
        const response = await fetch("/api/delegate-follow/updatefollower", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            // Add any necessary data
            delegate_address: delegate_address,
            follower_address: address,
            action: action,
            dao: dao,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to unfollow");
        }

        const data = await response.json();
        setLoading(false);
        setUnfollowmodel(false);
        setIsFollowing(false);
        isNotification(false);
        // setFollowers(followers - 1);
        setFollowers((prev) => prev - 1);
        // isFollowed(false);
        toast.success("You have unfollowed the Delegate.");
      } catch (error) {
        console.error("Error following:", error);
      }
    } else if (action == 2) {
      if (!isConnected) {
        toast.error("Please connect your wallet!");
      } else if (!isFollowing) {
        toast.error(
          "You have to follow delegate first in order to get notification!"
        );
      } else {
        let updatenotification: boolean;
        updatenotification = !notification;
        setNotificationLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }
        try {
          const response = await fetch("/api/delegate-follow/updatefollower", {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({
              // Add any necessary data
              delegate_address: delegate_address,
              follower_address: address,
              action: action,
              dao: dao,
              updatenotification: updatenotification,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to notification");
          }

          toast.success("Successfully updated notification status!");
          const data = await response.json();
          isNotification(!notification);
        } catch (error) {
          console.error("Error following:", error);
        } finally {
          setNotificationLoading(false);
        }
      }
    }
  };

  const handleFollow = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else if (isFollowing) {
      setUnfollowmodel(true);
    } else {
      // let address = await walletClient.getAddresses();
      if (address === props.individualDelegate) {
        toast.error("You can't follow your own profile!");
      } else {
        setLoading(true);
        let delegate_address: string;
        let follower_address: any;
        let dao: string;
        // alert(props.daoDelegates);
        dao = props.daoDelegates;
        // let address = await walletClient.getAddresses();
        follower_address = address;
        delegate_address = props.individualDelegate;
        try {
          const response = await fetch("/api/delegate-follow/savefollower", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-wallet-address": follower_address,
            },
            body: JSON.stringify({
              // Add any necessary data
              delegate_address: delegate_address,
              follower_address: follower_address,
              dao: dao,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to follow");
          }

          const data = await response.json();
          setLoading(false);
          toast.success(
            "Successfully followed the Delegate! Stay tuned for their updates."
          );
          // setFollowers(followers + 1);
          setFollowers((prev) => prev + 1);
          // setTimeout(() => isFollowed(true), 1000);
          setIsFollowing(true);
          isNotification(true);

          // Then update the follower count from the server
          await fetchDelegateData();
        } catch (error) {
          setLoading(false);
          console.error("Error following:", error);
        }
      }
    }
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
      toast.error("Please connect your MetaMask wallet!");
      return;
    }

    let chainAddress;
    if (props.daoDelegates === "optimism") {
      chainAddress = "0x4200000000000000000000000000000000000042";
    } else if (props.daoDelegates === "arbitrum") {
      chainAddress = "0x912CE59144191C1204E64559FE8253a0e49E6548";
    } else {
      return;
    }

    if (walletClient?.chain === "") {
      toast.error("Please connect your wallet!");
    } else {
      let network;
      if (props.daoDelegates === "optimism") {
        network = "OP Mainnet";
      } else if (props.daoDelegates === "arbitrum") {
        network = "Arbitrum One";
      }

      console.log("network: ", network);
      if (walletClient?.chain.name === network) {
        try {
          setDelegatingToAddr(true);
          const delegateTx = await walletClient.writeContract({
            address: chainAddress,
            chain: props.daoDelegates === "arbitrum" ? arbitrum : optimism,
            abi: dao_abi.abi,
            functionName: "delegate",
            args: [to],
            account: address,
          });

          setDelegatingToAddr(false);
          setConfettiVisible(true);
          setTimeout(() => setConfettiVisible(false), 5000);
        } catch (e) {
          toast.error("Transaction failed");
          setDelegatingToAddr(false);
        }
      } else {
        toast.error("Please switch to appropriate network to delegate!");

        if (openChainModal) {
          openChainModal();
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your backend API to check if the address exists

        // const dbResponse = await axios.get(`/api/profile/${address}`);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // const raw = JSON.stringify({
        //   address: props.individualDelegate,
        //   // daoName: props.daoDelegates,
        // });

        const requestOptions: any = {
          method: "GET",
          headers: myHeaders,
          // body: raw,
          redirect: "follow",
        };
        const res = await fetch(
          `/api/profile/${props.individualDelegate}`,
          requestOptions
        );

        const dbResponse = await res.json();

        if (
          dbResponse &&
          Array.isArray(dbResponse.data) &&
          dbResponse.data.length > 0
        ) {
          // Iterate over each item in the response data array
          for (const item of dbResponse.data) {
            // Check if address and daoName match
            // console.log("Item: ", item);

            // if (
            //   item.daoName === dao &&
            //   item.address === props.individualDelegate
            // ) {
            // console.log("Data found in the database", item);
            // Data found in the database, set the state accordingly
            // setResponseFromDB(true);
            setDisplayImage(item.image);
            setDescription(item.description);
            if (item.isEmailVisible) {
              setIsEmailVisible(true);
              setEmailId(item.emailId);
            }
            const matchingNetwork = item.networks?.find(
              (network: any) => network.dao_name === props.daoDelegates
            );

            // If a matching network is found, set the discourse ID
            if (matchingNetwork) {
              setDescription(matchingNetwork.description);
            } else {
              // Handle the case where no matching network is found
              console.log(
                "No matching network found for the specified dao_name"
              );
            }
            setDisplayName(item.displayName);

            if (!isConnected) {
              setIsFollowing(false);
              isNotification(false);
            } else {
              // await updateFollowerState();
              // await setFollowerscount();
              await fetchDelegateData();
            }
            setSocials({
              twitter: item.socialHandles.twitter,
              discord: item.socialHandles.discord,
              discourse: item.socialHandles.discourse,
              github: item.socialHandles.github,
            });
            // Exit the loop since we found a match
            //   break;
            // }
          }
        } else {
          console.log(
            "Data not found in the database, fetching from third-party API"
          );
          // Data not found in the database, fetch data from the third-party API
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    const fetchEnsName = async () => {
      const ensName = await fetchEnsNameAndAvatar(props.individualDelegate);
      setDisplayEnsName(ensName?.ensName);
    };
    fetchEnsName();
  }, [props]);

  return (
    <>
      {/* For Mobile Screen */}
      <MobileResponsiveMessage />

      {/* For Desktop Screen  */}
      <div className="hidden md:block">
        {isPageLoading && <MainProfileSkeletonLoader />}
        {!isPageLoading && (isDelegate || selfDelegate) ? (
          <div className="font-poppins">
            {/* {followed && <Confetti recycle={false} numberOfPieces={550} />} */}
            <div className="flex ps-14 py-5 justify-between">
              <div className="flex items-center">
                <div
                  className="relative object-cover rounded-3xl w-40 h-40 "
                  style={{
                    backgroundColor: "#fcfcfc",
                    border: "2px solid #E9E9E9 ",
                  }}
                >
                  <div className="w-40 h-40 flex items-center justify-content ">
                    <div className="flex justify-center items-center w-40 h-40">
                      <Image
                        src={
                          displayImage
                            ? `https://gateway.lighthouse.storage/ipfs/${displayImage}`
                            : delegateInfo?.profilePicture ||
                              (props.daoDelegates === "optimism"
                                ? OPLogo
                                : props.daoDelegates === "arbitrum"
                                ? ArbLogo
                                : ccLogo)
                        }
                        alt="user"
                        width={300}
                        height={300}
                        className={
                          displayImage || delegateInfo?.profilePicture
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
                      {delegateInfo?.ensName ||
                        displayEnsName ||
                        displayName || (
                          <>
                            {props.individualDelegate.slice(0, 6)}...
                            {props.individualDelegate.slice(-4)}
                          </>
                        )}
                    </div>
                    <div className="flex gap-3">
                      {/* {socials.discord + socials.discourse + socials.github + socials.twitter} */}
                      <Link
                        href={
                          socials.twitter
                            ? `https://twitter.com/${socials.twitter}`
                            : karmaSocials.twitter
                        }
                        className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                          socials.twitter == "" && karmaSocials.twitter == ""
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
                          socials.discourse
                            ? props.daoDelegates === "optimism"
                              ? `https://gov.optimism.io/u/${socials.discourse}`
                              : props.daoDelegates === "arbitrum"
                              ? `https://forum.arbitrum.foundation/u/${socials.discourse}`
                              : ""
                            : karmaSocials.discourse
                        }
                        className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1  ${
                          socials.discourse == "" &&
                          karmaSocials.discourse == ""
                            ? "hidden"
                            : ""
                        }`}
                        style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                        target="_blank"
                      >
                        <BiSolidMessageRoundedDetail
                          color="#7C7C7C"
                          size={12}
                        />
                      </Link>
                      <Link
                        href={
                          socials.discord
                            ? `https://discord.com/${socials.discord}`
                            : karmaSocials.discord
                        }
                        className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                          socials.discord == "" && karmaSocials.discord == ""
                            ? "hidden"
                            : ""
                        }`}
                        style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                        target="_blank"
                      >
                        <FaDiscord color="#7C7C7C" size={12} />
                      </Link>
                      {isEmailVisible && (
                        <Link
                          href={`mailto:${emailId}`}
                          className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1"
                          style={{
                            backgroundColor: "rgba(217, 217, 217, 0.42)",
                          }}
                          target="_blank"
                        >
                          <FaEnvelope color="#7C7C7C" size={12} />
                        </Link>
                      )}
                      <Link
                        href={
                          socials.github
                            ? `https://github.com/${socials.github}`
                            : karmaSocials.github
                        }
                        className={`border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 ${
                          socials.github == "" && karmaSocials.github == ""
                            ? "hidden"
                            : ""
                        }`}
                        style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                        target="_blank"
                      >
                        <FaGithub color="#7C7C7C" size={12} />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center py-1">
                    <div>
                      {props.individualDelegate.slice(0, 6)} ...{" "}
                      {props.individualDelegate.slice(-4)}
                    </div>

                    <Tooltip
                      content="Copy"
                      placement="right"
                      closeDelay={1}
                      showArrow
                    >
                      <span className="px-2 cursor-pointer" color="#3E3D3D">
                        <IoCopy
                          onClick={() => handleCopy(props.individualDelegate)}
                        />
                      </span>
                    </Tooltip>
                    <div className="flex space-x-2">
                      <Tooltip
                        content="Copy profile URL to share on Warpcast or Twitter."
                        placement="bottom"
                        closeDelay={1}
                        showArrow
                      >
                        <Button
                          className="bg-gray-200 hover:bg-gray-300"
                          onClick={() => {
                            if (typeof window === "undefined") return;
                            navigator.clipboard.writeText(
                              `${BASE_URL}/${props.daoDelegates}/${props.individualDelegate}?active=info`
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
                    <div style={{ zIndex: "21474836462" }}></div>
                  </div>

                  <div className="flex gap-4 py-1">
                    <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1 flex justify-center items-center w-[109px]">
                      {followerCountLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-shade-100"></div>
                      ) : (
                        <>
                          <span className="text-blue-shade-200 font-semibold">
                            {followers ? followers : 0}
                            &nbsp;
                          </span>
                          {followers === 0 || followers === 1
                            ? "Follower"
                            : "Followers"}
                        </>
                      )}
                    </div>
                    <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
                      <span className="text-blue-shade-200 font-semibold">
                        {props.daoDelegates === "arbitrum"
                          ? votesCount
                            ? formatNumber(votesCount / 10 ** 18)
                            : 0
                          : votingPower
                          ? formatNumber(votingPower / 10 ** 18)
                          : 0}
                        &nbsp;
                      </span>
                      delegated tokens
                    </div>
                    <div className="text-[#4F4F4F] border-[0.5px] border-[#D9D9D9] rounded-md px-3 py-1">
                      Delegated from
                      <span className="text-blue-shade-200 font-semibold">
                        &nbsp;
                        {delegatorsCount ? formatNumber(delegatorsCount) : 0}
                        &nbsp;
                      </span>
                      Addresses
                    </div>
                  </div>

                  <div className="pt-2 flex space-x-4 items-center">
                    <button
                      className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                      // onClick={() =>
                      //   handleDelegateVotes(`${props.individualDelegate}`)
                      // }

                      onClick={handleDelegateModal}
                    >
                      Delegate
                    </button>

                    <button
                      className={`font-bold text-white rounded-full w-[138.5px] h-[44px] py-[10px] flex justify-center items-center ${
                        isFollowing ? "bg-blue-shade-200" : "bg-black"
                      }`}
                      onClick={handleFollow}
                    >
                      {isFollowStatusLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>

                    <Tooltip
                      content={
                        notification
                          ? "Click to mute delegate activity alerts."
                          : "Don't miss out! Click to get alerts on delegate activity."
                      }
                      placement="top"
                      closeDelay={1}
                      showArrow
                    >
                      <div
                        className={`border  rounded-full flex items-center justify-center size-10  ${
                          isFollowing
                            ? "cursor-pointer border-blue-shade-200"
                            : "cursor-not-allowed border-gray-200"
                        }`}
                        onClick={() =>
                          isFollowing &&
                          !notificationLoading &&
                          handleConfirm(2)
                        }
                      >
                        {notificationLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-shade-100"></div>
                        ) : isFollowing ? (
                          notification ? (
                            <IoMdNotifications className="text-blue-shade-200 size-6" />
                          ) : (
                            <IoMdNotificationsOff className="text-blue-shade-200 size-6" />
                          )
                        ) : (
                          <IoMdNotifications className="text-gray-200 size-6" />
                        )}
                      </div>
                    </Tooltip>

                    {isOpenunfollow && (
                      <div className="font-poppins z-[70] fixed inset-0 flex items-center justify-center backdrop-blur-md">
                        <div className="bg-white rounded-[41px] overflow-hidden shadow-lg w-1/2">
                          <div className="relative">
                            <div className="flex flex-col gap-1 text-white bg-[#292929] p-4 py-7">
                              <h2 className="text-lg font-semibold mx-4">
                                Are you sure you want to unfollow this delegate?
                              </h2>
                            </div>
                            <div className="px-8 py-4">
                              <p className="mt-4 text-center">
                                By unfollowing, you will miss out on important
                                updates, exclusive alerts of delegate. Stay
                                connected to keep up with all the latest
                                activities!
                              </p>
                            </div>
                            <div className="flex justify-center px-8 py-4">
                              <button
                                className="bg-gray-300 text-gray-700 px-8 py-3 font-semibold rounded-full mr-4"
                                onClick={() => setUnfollowmodel(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-red-500 text-white px-8 py-3 font-semibold rounded-full"
                                onClick={() => handleConfirm(1)}
                              >
                                {loading ? (
                                  <Oval
                                    visible={true}
                                    height="20"
                                    width="20"
                                    color="white"
                                    secondaryColor="#cdccff"
                                    ariaLabel="oval-loading"
                                  />
                                ) : (
                                  "Unfollow"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pr-[2.2rem]">
                <div className="flex gap-1 xs:gap-2 items-center">
                  <RewardButton />
                  <ConnectWalletWithENS />
                </div>
              </div>
            </div>

            <div className="flex gap-12 bg-[#D9D9D945] pl-16">
              <button
                className={`border-b-2 py-4 px-2  ${
                  searchParams.get("active") === "info"
                    ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=info")}
              >
                Info
              </button>
              <button
                className={`border-b-2 py-4 px-2 ${
                  searchParams.get("active") === "pastVotes"
                    ? "text-blue-shade-200 font-semibold border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() => router.push(path + "?active=pastVotes")}
              >
                Past Votes
              </button>
              <button
                className={`border-b-2 py-4 px-2 ${
                  searchParams.get("active") === "delegatesSession"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() =>
                  router.push(path + "?active=delegatesSession&session=book")
                }
              >
                Sessions
              </button>
              <button
                className={`border-b-2 py-4 px-2 ${
                  searchParams.get("active") === "officeHours"
                    ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                    : "border-transparent"
                }`}
                onClick={() =>
                  router.push(path + "?active=officeHours&hours=ongoing")
                }
              >
                Office Hours
              </button>
            </div>

            <div className="py-6 ps-16">
              {searchParams.get("active") === "info" && (
                <DelegateInfo props={props} desc={description} />
              )}
              {searchParams.get("active") === "pastVotes" && (
                <DelegateVotes props={props} />
              )}
              {searchParams.get("active") === "delegatesSession" && (
                <DelegateSessions props={props} />
              )}
              {searchParams.get("active") === "officeHours" && (
                <DelegateOfficeHrs props={props} />
              )}
            </div>
          </div>
        ) : (
          !isPageLoading &&
          !(isDelegate || selfDelegate) && (
            <div className="flex flex-col justify-center items-center w-full h-screen">
              <div className="text-5xl">☹️</div>{" "}
              <div className="pt-4 font-semibold text-lg">
                Oops, no such result available!
              </div>
            </div>
          )
        )}
        {delegateOpen && (
          <DelegateTileModal
            isOpen={delegateOpen}
            closeModal={handleCloseDelegateModal}
            handleDelegateVotes={() =>
              handleDelegateVotes(`${props.individualDelegate}`)
            }
            fromDelegate={delegate ? delegate : "N/A"}
            delegateName={
              delegateInfo?.ensName ||
              displayEnsName || (
                <>
                  {props.individualDelegate.slice(0, 6)}...
                  {props.individualDelegate.slice(-4)}
                </>
              )
            }
            displayImage={
              displayImage
                ? `https://gateway.lighthouse.storage/ipfs/${displayImage}`
                : delegateInfo?.profilePicture ||
                  (props.daoDelegates === "optimism"
                    ? OPLogo
                    : props.daoDelegates === "arbitrum"
                    ? ArbLogo
                    : ccLogo)
            }
            daoName={props.daoDelegates}
            addressCheck={same}
            delegatingToAddr={delegatingToAddr}
            confettiVisible={confettiVisible}
          />
        )}
      </div>
    </>
  );
}

export default SpecificDelegate;
