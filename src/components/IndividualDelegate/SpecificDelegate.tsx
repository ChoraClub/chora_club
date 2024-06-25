"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import user from "@/assets/images/daos/profile.png";
import { FaXTwitter, FaDiscord, FaGithub } from "react-icons/fa6";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import DelegateInfo from "./DelegateInfo";
import DelegateVotes from "./DelegateVotes";
import DelegateSessions from "./DelegateSessions";
import DelegateOfficeHrs from "./DelegateOfficeHrs";
import copy from "copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
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
import { useAccount, useNetwork } from "wagmi";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arbCir.png";
import ccLogo from "@/assets/images/daos/CC.png";
import { Oval } from "react-loader-spinner";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { getEnsNameOfUser } from "../ConnectWallet/ENSResolver";
import DelegateTileModal from "../utils/delegateTileModal";
// import { cacheExchange, createClient, fetchExchange, gql } from "urql/core";
import { set } from "video.js/dist/types/tech/middleware";
import MainProfileSkeletonLoader from "../SkeletonLoader/MainProfileSkeletonLoader";
import { fetchEnsAvatar } from "@/utils/ENSUtils";

interface Type {
  daoDelegates: string;
  individualDelegate: string;
}
const client = createClient({
  url: "https://api.studio.thegraph.com/query/68573/op/v0.0.1",
  exchanges: [cacheExchange, fetchExchange],
});
const GET_LATEST_DELEGATE_VOTES_CHANGED = gql`
  query MyQuery($delegate: String!) {
    delegateVotesChangeds(
      first: 1
      orderBy: blockTimestamp
      orderDirection: desc
      where: { delegate: $delegate }
    ) {
      newBalance
    }
  }
`;

const DELEGATE_CHANGED_QUERY = gql`
  query MyQuery($delegator: String!) {
    delegateChangeds(
      orderBy: blockTimestamp
      orderDirection: desc
      where: { delegator: $delegator }
      first: 1
    ) {
      toDelegate
    }
  }
`;

function SpecificDelegate({ props }: { props: Type }) {
  const { publicClient, walletClient } = WalletAndPublicClient();
  const { chain, chains } = useNetwork();
  console.log(chain?.name);
  const { openChainModal } = useChainModal();
  const [delegateInfo, setDelegateInfo] = useState<any>();
  const router = useRouter();
  const path = usePathname();
  const { openConnectModal } = useConnectModal();
  console.log(path);
  const searchParams = useSearchParams();
  const [selfDelegate, setSelfDelegate] = useState<boolean>();
  const [isDelegate, setIsDelegate] = useState<boolean>();
  const addressFromUrl = path.split("/")[2];
  const [isPageLoading, setIsPageLoading] = useState(true);
  console.log("Props", props.daoDelegates);
  const [displayName, setDisplayName] = useState("");
  const [displayImage, setDisplayImage] = useState("");
  const [description, setDescription] = useState("");
  // const provider = new ethers.BrowserProvider(window?.ethereum);
  const [displayEnsName, setDisplayEnsName] = useState<string>();
  const [delegate, setDelegate] = useState("");
  const [same, setSame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [delegateOpen, setDelegateOpen] = useState(false);
  const address = useAccount();
  const { isConnected } = useAccount();

  const handleDelegateModal = async () => {
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
      console.log(address);
      setDelegateOpen(true);
      setLoading(true);
      try {
        const { data } = await client.query(DELEGATE_CHANGED_QUERY, {
          delegator: address,
        });
        // const ens = await getEnsNameOfUser(
        //   data.delegateChangeds[0]?.toDelegate
        // );
        const delegate = data.delegateChangeds[0]?.toDelegate;
        console.log("individualDelegate", props.individualDelegate);
        setSame(delegate === props.individualDelegate);
        // ens
        // ? setDelegate(ens)
        // :
        setDelegate(delegate.slice(0, 6) + "..." + delegate.slice(-4));
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
        console.log("API key", apiKey);
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
            console.log(finalCounting);
            console.log("dataa", finalCounting.data);
            setVotesCount(finalCounting.data.delegate.votesCount);
            setDelegatorsCount(finalCounting.data.delegate.delegatorsCount);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        console.log("Props", props.individualDelegate);
        const data = await client
          .query(GET_LATEST_DELEGATE_VOTES_CHANGED, {
            delegate: props.individualDelegate.toString(),
          })
          .toPromise();
        console.log("voting data", data.data.delegateVotesChangeds[0]);
        setVotingPower(data.data.delegateVotesChangeds[0].newBalance);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (props.individualDelegate) {
      fetchData();
    }
  }, [client, props.individualDelegate]);

  useEffect(() => {
    console.log("Network", chain?.network);
    const fetchData = async () => {
      setIsPageLoading(true);
      try {
        const res = await fetch(
          `https://api.karmahq.xyz/api/dao/find-delegate?dao=${props.daoDelegates}&user=${props.individualDelegate}`
        );
        const details = await res.json();
        console.log("Socials: ", details.data.delegate);
        setDelegateInfo(details.data.delegate);
        if (
          addressFromUrl.toLowerCase() ===
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
        chain?.name === "Optimism"
          ? "0x4200000000000000000000000000000000000042"
          : chain?.name === "Arbitrum One"
          ? "0x912CE59144191C1204E64559FE8253a0e49E6548"
          : "";
      try {
        const delegateTx = await publicClient.readContract({
          address: contractAddress,
          abi: dao_abi.abi,
          functionName: "delegates",
          args: [addressFromUrl],
          // account: address1,
        });
        console.log("Delegate tx", delegateTx);
        delegateTxAddr = delegateTx;
        if (delegateTxAddr.toLowerCase() === addressFromUrl?.toLowerCase()) {
          console.log("Delegate comparison: ", delegateTx, addressFromUrl);
          setSelfDelegate(true);
        }
        setIsPageLoading(false);
      } catch (error) {
        console.error("Error in reading contract", error);
        setIsPageLoading(false);
      }
    };
    checkDelegateStatus();
  }, []);

  // if (isPageLoading) {
  //   return null;
  // }

  // if (!isDelegate && !selfDelegate && !isPageLoading) {
  //   return <div>No such Delegate for this address</div>;
  // }

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

    console.log(address);
    console.log(address1);

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
      if (walletClient?.chain?.network === props.daoDelegates) {
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your backend API to check if the address exists

        console.log("Fetching from DB");
        // const dbResponse = await axios.get(`/api/profile/${address}`);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          address: props.individualDelegate,
          // daoName: props.daoDelegates,
        });

        const requestOptions: any = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const res = await fetch(
          `/api/profile/${props.individualDelegate}`,
          requestOptions
        );

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
            const matchingNetwork = item.networks.find(
              (network: any) => network.dao_name === chain?.name
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
            // setEmailId(item.emailId);

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
  }, [chain, props.individualDelegate]);

  useEffect(() => {
    const fetchEnsName = async () => {
      const ensName = await fetchEnsAvatar(props.individualDelegate);
      setDisplayEnsName(ensName?.ensName);
    };
    fetchEnsName();
  }, [chain, props.individualDelegate]);

  return (
    <>
      {isPageLoading && <MainProfileSkeletonLoader />}
      {!(isPageLoading || (!isDelegate && !selfDelegate)) ? (
        <div className="font-poppins">
          <div className="flex ps-14 py-5 justify-between">
            <div className="flex">
              {/* <Image
            src={delegateInfo?.profilePicture || user}
            alt="user"
            width={256}
            height={256}
            className="w-40 rounded-3xl"
          /> */}
              <div
                className="relative object-cover rounded-3xl"
                style={{
                  backgroundColor: "#fcfcfc",
                  border: "2px solid #E9E9E9 ",
                }}>
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
                      width={256}
                      height={256}
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
                    {delegateInfo?.ensName || displayEnsName || displayName || (
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
                      target="_blank">
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
                        socials.discourse == "" && karmaSocials.discourse == ""
                          ? "hidden"
                          : ""
                      }`}
                      style={{ backgroundColor: "rgba(217, 217, 217, 0.42)" }}
                      target="_blank">
                      <BiSolidMessageRoundedDetail color="#7C7C7C" size={12} />
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
                      target="_blank">
                      <FaDiscord color="#7C7C7C" size={12} />
                    </Link>
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
                      target="_blank">
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
                    showArrow>
                    <span className="px-2 cursor-pointer" color="#3E3D3D">
                      <IoCopy
                        onClick={() => handleCopy(props.individualDelegate)}
                      />
                    </span>
                  </Tooltip>
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

                <div className="flex gap-4 py-1">
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

                <div className="pt-2">
                  <button
                    className="bg-blue-shade-200 font-bold text-white rounded-full px-8 py-[10px]"
                    // onClick={() =>
                    //   handleDelegateVotes(`${props.individualDelegate}`)
                    // }

                    onClick={handleDelegateModal}>
                    Delegate
                  </button>
                </div>
              </div>
            </div>
            <div className="pr-[2.2rem]">
              <ConnectWalletWithENS />
            </div>
          </div>

          <div className="flex gap-12 bg-[#D9D9D945] pl-16">
            <button
              className={`border-b-2 py-4 px-2  ${
                searchParams.get("active") === "info"
                  ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=info")}>
              Info
            </button>
            <button
              className={`border-b-2 py-4 px-2 ${
                searchParams.get("active") === "pastVotes"
                  ? "text-blue-shade-200 font-semibold border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => router.push(path + "?active=pastVotes")}>
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
              }>
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
              }>
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
        !isDelegate &&
        !selfDelegate && (
          <div className="flex flex-col justify-center items-center w-full h-screen">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )
      )}
      {console.log("Delegate", delegate)}
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
              // displayName ||
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
          addressCheck={same}
        />
      )}
    </>
  );
}

export default SpecificDelegate;
