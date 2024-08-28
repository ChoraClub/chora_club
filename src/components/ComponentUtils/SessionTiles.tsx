import React, { useEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Oval } from "react-loader-spinner";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { useNetwork, useAccount } from "wagmi";
import styles from "./Tile.module.css";
import { ethers } from "ethers";
// import { getEnsName } from "../ConnectWallet/ENSResolver";
import lighthouse from "@lighthouse-web3/sdk";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import { FaGift } from "react-icons/fa6";
import style from "./SessionTiles.module.css";
// const { ethers } = require("ethers");
import copy from "copy-to-clipboard";
import UpdateHostedSessionModal from "./UpdateHostedSessionModal";
import { SessionInterface } from "@/types/MeetingTypes";

type Attendee = {
  attendee_address: string;
  attendee_uid?: string;
  onchain_attendee_uid?: string;
};

interface Participant {
  displayName: string;
  walletAddress: string | null;
  joinedAt: string;
  exitedAt: string;
  attestation: string;
}

interface AttestationData {
  roomId: string;
  participants: Participant[];
  meetingTimePerEOA: {
    [key: string]: number;
  };
  totalMeetingTimeInMinutes: number;
  hosts: Participant[];
  startTime: number;
  endTime: number;
  meetingType: string;
  attestation: string;
}

interface SessionData extends SessionInterface {
  attestations: AttestationData[];
}

interface SessionTileProps {
  tileIndex?: number;
  isEvent: string;
  sessionDetails: SessionData[];
  dataLoading: boolean;
  isOfficeHour: boolean;
  isSession: string;
}

interface AttestationDataParams {
  meetingId: string;
  meetingType: number;
  meetingStartTime: number;
  meetingEndTime: number;
  index: number;
  dao: string;
}

function SessionTile({
  sessionDetails,
  dataLoading,
  isEvent,
  isOfficeHour,
  isSession,
}: // query,
SessionTileProps) {
  const { address } = useAccount();
  const router = useRouter();
  const path = usePathname();
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null
  );
  const [isClaiming, setIsClaiming] = useState<{ [index: number]: boolean }>(
    {}
  );
  const [isClaimed, setIsClaimed] = useState<{ [index: number]: boolean }>({});
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleEditModal = (index: number) => {
    setSelectedTileIndex(index);
    setEditOpen(true);
  };
  const handleCloseEdit = () => {
    setEditOpen(false);
  };
  // const provider = new ethers.BrowserProvider(window?.ethereum);
  // const provider =
  //   window.ethereum != null
  //     ? new ethers.providers.Web3Provider(window.ethereum)
  //     : null;
  // const provider =
  //   window.ethereum && window.ethereum.isConnected()
  //     ? new ethers.providers.Web3Provider(window.ethereum)
  //     : null;

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
    // const ensName = getEnsName(address.toLowerCase());
    // return ensName;
  };
  const formatSlotTimeToLocal = (slotTime: any) => {
    const date = new Date(slotTime);
    return date.toLocaleString();
  };

  const openModal = (index: number) => {
    setSelectedTileIndex(index);
  };

  const closeModal = () => {
    setSelectedTileIndex(null);
  };

  const [pageLoading, setPageLoading] = useState(true);
  const [applyStyles, setApplyStyles] = useState(true);
  const [expanded, setExpanded] = useState<{ [index: number]: boolean }>({});

  const handleDescription = () => {
    setApplyStyles(!applyStyles);
  };

  const toggleDescription = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAttestationOnchain = async ({
    meetingId,
    meetingType,
    meetingStartTime,
    meetingEndTime,
    index,
    dao,
  }: AttestationDataParams) => {
    setIsClaiming((prev: any) => ({ ...prev, [index]: true }));
    if (
      typeof window.ethereum === "undefined" ||
      !window.ethereum.isConnected()
    ) {
      console.log("not connected");
    }

    // const address = await walletClient.getAddresses();
    // console.log(address);
    let token = "";
    let EASContractAddress = "";

    if (dao === "optimism") {
      token = "OP";
      EASContractAddress = "0x4200000000000000000000000000000000000021";
    } else if (dao === "arbitrum") {
      token = "ARB";
      EASContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
    }

    const data = {
      recipient: address,
      meetingId: `${meetingId}/${token}`,
      meetingType: meetingType,
      startTime: meetingStartTime,
      endTime: meetingEndTime,
      daoName: dao,
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (address) {
      myHeaders.append("x-wallet-address", address);
    }

    // Configure the request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(data),
    };

    try {
      // Make the API call with the provided JSON data
      const res = await fetch("/api/attest-onchain", requestOptions);

      // Check if the request was successful
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Parse the response as JSON
      const attestationObject = await res.json();

      // console.log(attestationObject);
      const provider = new ethers.BrowserProvider(window?.ethereum);

      const eas = new EAS(EASContractAddress);
      const signer = await provider.getSigner();
      console.log("the wallet2 obj", signer);
      eas.connect(signer);
      console.log("obj created");
      console.log("eas obj", eas);
      const schemaUID =
        "0xf9e214a80b66125cad64453abe4cef5263be3a7f01760d0cc72789236fca2b5d";
      const tx = await eas.attestByDelegation({
        schema: schemaUID,
        data: {
          recipient: attestationObject.delegatedAttestation.message.recipient,
          expirationTime:
            attestationObject.delegatedAttestation.message.expirationTime,
          revocable: attestationObject.delegatedAttestation.message.revocable,
          refUID: attestationObject.delegatedAttestation.message.refUID,
          data: attestationObject.delegatedAttestation.message.data,
        },
        signature: attestationObject.delegatedAttestation.signature,
        attester: "0x7B2C5f70d66Ac12A25cE4c851903436545F1b741",
      });
      const newAttestationUID = await tx.wait();
      console.log("New attestation UID: ", newAttestationUID);

      if (newAttestationUID) {
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          if (address) {
            myHeaders.append("x-wallet-address", address);
          }

          const raw = JSON.stringify({
            meetingId: meetingId,
            meetingType: meetingType,
            uidOnchain: newAttestationUID,
            address: address,
          });
          const requestOptions: any = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };
          const response = await fetch(
            `/api/update-attestation-uid`,
            requestOptions
          );
          const responseData = await response.json();
          console.log("responseData", responseData);
          if (responseData.success) {
            console.log("On-chain attestation Claimed");
            setIsClaimed((prev) => ({ ...prev, [index]: true }));
            setIsClaiming((prev) => ({ ...prev, [index]: false }));
          }
        } catch (e) {
          console.error(e);
          setIsClaiming((prev) => ({ ...prev, [index]: false }));
        }
      }
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error:", error);
      setIsClaiming((prev) => ({ ...prev, [index]: false }));
    }
  };

  const [isTextOverflow, setIsTextOverflow] = useState<{
    [index: number]: boolean;
  }>({});
  const descriptionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    descriptionRefs.current.forEach((ref, index) => {
      if (ref) {
        const isOverflowing = ref.scrollHeight > ref.clientHeight;
        setIsTextOverflow((prev) => ({
          ...prev,
          [index]: isOverflowing,
        }));
      }
    });
  }, [sessionDetails]);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    console.log("name-value-files", name, value, files);
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value,
    }));
  };

  const handleSave = async (sessionData: any) => {
    // Handle save logic here, such as making an API call
    setLoading(true);
    console.log(formData);
    console.log(sessionData);
    // Close the modal after saving
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
    try {
      let imageCid = "";
      if (formData.image) {
        const output = await lighthouse.upload(formData.image, apiKey);
        imageCid = output.data.Hash;
        console.log("image output: ", output.data.Hash);
      }

      if (formData.title === "") {
        formData.title = sessionData.title;
      }
      if (formData.description === "") {
        formData.description = sessionData.description;
      }

      if (formData.image === "") {
        imageCid = sessionData.thumbnail_image;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        meetingId: sessionData.meetingId,
        host_address: sessionData.host_address,
        title: formData.title,
        description: formData.description,
        thumbnail_image: imageCid,
      });

      const requestOptions: any = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        `/api/update-recorded-session`,
        requestOptions
      );
      if (response) {
        const responseData = await response.json();
        console.log("responseData: ", responseData);
        setLoading(false);
      } else {
        setLoading(false);
      }

      handleCloseEdit();
    } catch (e) {
      console.log("errorrrrrr: ", e);
      toast.error("Unable to update the data.");
      setLoading(false);
      handleCloseEdit();
    }
  };

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  return (
    <>
      <div className="">
        {sessionDetails.length > 0 ? (
          sessionDetails.map((data: any, index: any) => (
            <>
              <div
                key={index}
                className={`flex p-5 rounded-[2rem] cursor-pointer justify-between mb-5 ${
                  isEvent === "Recorded" ? "cursor-pointer" : ""
                } ${style.hover}`}
                style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
                // onClick={() => openModal(index)}
                onClick={
                  isEvent === "Recorded"
                    ? () => router.push(`/watch/${data.meetingId}`)
                    : () => null
                }
              >
                <div className="flex">
                  <Image
                    src={
                      data.thumbnail_image
                        ? `https://gateway.lighthouse.storage/ipfs/${data.thumbnail_image}`
                        : "https://gateway.lighthouse.storage/ipfs/QmekMpcR49QGSPRAnmJsEgWDvM7JKji8bUT4S4oXmYBHYU"
                    }
                    width={200}
                    height={200}
                    alt="image"
                    className="w-44 h-44 rounded-3xl border border-[#D9D9D9] object-cover object-center"
                  />

                  <div className="ps-6 pe-12 py-1">
                    <div className="font-semibold text-blue-shade-200 text-xl">
                      {data.title}
                    </div>

                    <div className="flex space-x-4 py-2">
                      <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold capitalize">
                        {data.dao_name}
                      </div>
                      {/* <div className="border border-[#1E1E1E] rounded-md text-[#1E1E1E] text-xs px-5 py-1 font-medium">
                    {data.participant} Participants
                  </div> */}
                    </div>

                    <div className="pt-2 pe-10">
                      <hr />
                    </div>

                    <div className="flex gap-x-16 text-sm py-3">
                      {data.session_type === "session" ? (
                        <div className="text-[#3E3D3D] flex">
                          <span className="font-semibold">Session - </span>{" "}
                          <span className="font-semibold">Guest:</span>{" "}
                          {formatWalletAddress(
                            data.attendees[0].attendee_address
                          )}
                          <Tooltip
                            content="Copy"
                            placement="right"
                            closeDelay={1}
                            showArrow
                          >
                            <div
                              className="pl-2 pt-[2px] cursor-pointer"
                              color="#3E3D3D"
                            >
                              <IoCopy
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(
                                    `${data.attendees[0].attendee_address}`
                                  );
                                }}
                              />
                            </div>
                          </Tooltip>
                        </div>
                      ) : (
                        <div className="text-[#3E3D3D]">
                          <span className="font-semibold">Instant Meet</span>{" "}
                        </div>
                      )}
                      <div className="text-[#3E3D3D] flex">
                        <span className="font-semibold">Host:</span>{" "}
                        {formatWalletAddress(data.host_address)}
                        <Tooltip
                          content="Copy"
                          placement="right"
                          closeDelay={1}
                          showArrow
                        >
                          <div
                            className="pl-2 pt-[2px] cursor-pointer"
                            color="#3E3D3D"
                          >
                            <IoCopy
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(`${data.host_address}`);
                              }}
                            />
                          </div>
                        </Tooltip>
                      </div>
                      <div className="text-[#3E3D3D]">
                        {isEvent === "Upcoming" ? (
                          <span className="font-semibold">Starts at: </span>
                        ) : isEvent === "Recorded" ? (
                          <span className="font-semibold">Started at: </span>
                        ) : null}
                        {formatSlotTimeToLocal(data.slot_time)}
                      </div>
                    </div>

                    <div
                      className={`text-[#1E1E1E] text-sm ${
                        expanded[index] ? "" : `${styles.desc} cursor-pointer`
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleDescription(index);
                      }}
                    >
                      {data.description}
                    </div>
                  </div>
                </div>

                {isSession === "attended" &&
                  data.attendees[0]?.attendee_uid && (
                    <div className="flex items-end gap-2">
                      <Tooltip
                        content={
                          isClaiming[index]
                            ? "Claiming Onchain Attestation"
                            : data.attendees[0].onchain_attendee_uid ||
                              isClaimed[index]
                            ? "Received Onchain Attestation"
                            : "Claim Onchain Attestation"
                        }
                        placement="top"
                        showArrow
                      >
                        <button
                          className={`${style.button}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttestationOnchain({
                              meetingId: data.meetingId,
                              meetingType: 2,
                              meetingStartTime: data.attestations[0].startTime,
                              meetingEndTime: data.attestations[0].endTime,
                              index,
                              dao: data.dao_name,
                            });
                          }}
                          disabled={
                            !!data.attendees[0].onchain_attendee_uid ||
                            isClaiming[index] ||
                            isClaimed[index]
                          }
                        >
                          {isClaiming[index] ? (
                            <div className="flex items-center justify-center px-3">
                              <Oval
                                visible={true}
                                height="20"
                                width="20"
                                color="#fff"
                                secondaryColor="#cdccff"
                                ariaLabel="oval-loading"
                              />
                            </div>
                          ) : data.attendees[0].onchain_attendee_uid ||
                            isClaimed[index] ? (
                            "Claimed"
                          ) : (
                            <>
                              <div className="flex items-center justify-center translate-y-[1px]">
                                Claim
                              </div>
                              <FaGift className={`${style.icon}`} />
                            </>
                          )}
                        </button>
                      </Tooltip>
                    </div>
                  )}

                {isSession === "hosted" && data.uid_host && (
                  <div className="flex flex-col justify-between ">
                    {/* <button
                      className="bg-blue-shade-100 text-white text-sm py-1 px-5 rounded-full font-semibold outline-none"
                      onClick={handleEditModal}
                    >
                      Edit
                    </button> */}
                    <div className="flex justify-end items-center">
                      <Tooltip
                        content="Edit Details"
                        placement="right"
                        showArrow
                      >
                        <span
                          className="border-[0.5px] border-[#8E8E8E] rounded-full h-fit p-1 cursor-pointer w-6"
                          style={{
                            backgroundColor: "rgba(217, 217, 217, 0.42)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModal(index);
                          }}
                        >
                          <FaPencil color="#3e3d3d" size={12} />
                        </span>
                      </Tooltip>
                    </div>

                    <Tooltip
                      content={
                        isClaiming[index]
                          ? "Claiming Onchain Attestation"
                          : data.onchain_host_uid || isClaimed[index]
                          ? "Received Onchain Attestation"
                          : "Claim Onchain Attestation"
                      }
                      placement="top"
                      showArrow
                    >
                      {/* <button
                      className="bg-blue-shade-100 text-white text-sm py-2 px-4 rounded-full font-semibold outline-none flex gap-1 items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttestationOnchain({
                          meetingId: data.meetingId,
                          meetingType: 1,
                          meetingStartTime: data.attestations[0].startTime,
                          meetingEndTime: data.attestations[0].endTime,
                          index,
                          dao: data.dao_name,
                        });
                      }}
                      disabled={
                        !!data.onchain_host_uid ||
                        isClaiming[index] ||
                        isClaimed[index]
                      }
                    >
                      
                      {isClaiming[index] ? (
                        <div className="flex items-center justify-center px-3">
                          <Oval
                            visible={true}
                            height="20"
                            width="20"
                            color="#fff"
                            secondaryColor="#cdccff"
                            ariaLabel="oval-loading"
                          />
                        </div>
                      ) : data.onchain_host_uid || isClaimed[index] ? (
                        "Claimed"
                      ) : (
                        <>
                        <FaGift/> <div className="flex items-center justify-center translate-y-[1px]">Claim</div>
                        </>
                      )}
                    </button> */}
                      <button
                        className={`${style.button}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAttestationOnchain({
                            meetingId: data.meetingId,
                            meetingType: 1,
                            meetingStartTime: data.attestations[0].startTime,
                            meetingEndTime: data.attestations[0].endTime,
                            index,
                            dao: data.dao_name,
                          });
                        }}
                        disabled={
                          !!data.onchain_host_uid ||
                          isClaiming[index] ||
                          isClaimed[index]
                        }
                      >
                        {isClaiming[index] ? (
                          <div className="flex items-center justify-center px-3">
                            <Oval
                              visible={true}
                              height="20"
                              width="20"
                              color="#fff"
                              secondaryColor="#cdccff"
                              ariaLabel="oval-loading"
                            />
                          </div>
                        ) : data.onchain_host_uid || isClaimed[index] ? (
                          "Claimed"
                        ) : (
                          <>
                            <div className="flex items-center justify-center translate-y-[1px]">
                              Claim
                            </div>
                            <FaGift className={`${style.icon}`} />
                          </>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>

      {editOpen && selectedTileIndex !== null && (
        <UpdateHostedSessionModal
          isOpen={editOpen}
          onClose={handleCloseEdit}
          onSave={handleSave}
          sessionData={sessionDetails[selectedTileIndex]}
          formData={formData}
          handleChange={handleChange}
          loading={loading}
        />
      )}
    </>
  );
}

export default SessionTile;
