import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Oval } from "react-loader-spinner";
import text2 from "@/assets/images/daos/texture2.png";
import IndividualSessionTileModal from "./IndividualSessionTileModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  SchemaEncoder,
  SchemaRegistry,
  createOffchainURL,
  EAS,
  Delegated,
  ZERO_BYTES32,
  NO_EXPIRATION,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useNetwork, useAccount } from "wagmi";

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

interface SessionData {
  _id: string;
  img: StaticImageData;
  title: string;
  meetingId: string;
  dao_name: string;
  booking_status: string;
  meeting_status: boolean;
  joined_status: boolean;
  attendees: Attendee[];
  host_address: string;
  slot_time: string;
  description: string;
  session_type: string;
  uid_host: string;
  onchain_host_uid: string;
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
  const provider = new ethers.BrowserProvider(window?.ethereum);

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
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

    if (dao === "optimism") {
      token = "OP";
    } else if (dao === "arbitrum") {
      token = "ARB";
    }

    const data = {
      recipient: address,
      meetingId: `${meetingId}/${token}`,
      meetingType: meetingType,
      startTime: meetingStartTime,
      endTime: meetingEndTime,
    };

    // Configure the request options
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers required by your API
      },
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
      const EASContractAddress = "0x4200000000000000000000000000000000000021";
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

  return (
    <div className="space-y-6">
      {sessionDetails.length > 0 ? (
        sessionDetails.map((data: SessionData, index: any) => (
          <div
            key={index}
            className={`flex p-5 rounded-[2rem] cursor-pointer justify-between ${
              isEvent === "Recorded" ? "cursor-pointer" : ""
            }`}
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
                src={text2}
                alt="image"
                className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
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
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Session - </span>{" "}
                      <span className="font-semibold">Attendee:</span>{" "}
                      {formatWalletAddress(data.attendees[0].attendee_address)}
                    </div>
                  ) : (
                    <div className="text-[#3E3D3D]">
                      <span className="font-semibold">Instant Meet</span>{" "}
                    </div>
                  )}
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Host:</span>{" "}
                    {formatWalletAddress(data.host_address)}
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

                <div className="text-[#1E1E1E] text-sm">{data.description}</div>
              </div>
            </div>

            <div className="flex items-end">
              {isSession === "attended" && data.attendees[0]?.attendee_uid && (
                <button
                  className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold outline-none"
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
                    "Claim"
                  )}
                </button>
              )}

              {isSession === "hosted" && data.uid_host && (
                <button
                  className="bg-blue-shade-100 text-white text-sm py-1 px-3 rounded-full font-semibold outline-none"
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
                    "Claim"
                  )}
                </button>
              )}
            </div>
          </div>
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
  );
}

export default SessionTile;
