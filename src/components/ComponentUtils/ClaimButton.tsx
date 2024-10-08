import React, { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import { FaCheck, FaGift } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import styles from "./Button.module.css";
import { ethers } from "ethers";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

interface ClaimButtonProps {
  meetingId: string;
  meetingType: number;
  startTime: number;
  endTime: number;
  dao: string;
  address: string;
  onChainId: string | undefined;
  disabled: boolean;
  onClaimStart: () => void;
  onClaimEnd: () => void;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({
  meetingId,
  meetingType,
  startTime,
  endTime,
  dao,
  address,
  onChainId,
  disabled,
  onClaimStart,
  onClaimEnd,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(!!onChainId);

  useEffect(() => {
    setIsClaimed(!!onChainId);
  }, [onChainId]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
  };

  const handleAttestationOnchain = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isClaimed || isClaiming || disabled) return;

    setIsClaiming(true);
    onClaimStart();

    try {
      if (
        typeof window.ethereum === "undefined" ||
        !window.ethereum.isConnected()
      ) {
        console.log("not connected");
        setIsClaiming(false);
        onClaimEnd();
        return;
      }
    } catch (e) {
      toast.error("Connect your wallet");
      onClaimEnd();
    }

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
      startTime: startTime,
      endTime: endTime,
      daoName: dao,
    };

    try {
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

      const res = await fetch("/api/attest-onchain", requestOptions);

      // if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const attestationObject = await res.json();
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const eas = new EAS(EASContractAddress);
      const signer = await provider.getSigner();
      eas.connect(signer);

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
        const updateResponse = await fetch(`/api/update-attestation-uid`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingId: meetingId,
            meetingType: meetingType,
            uidOnchain: newAttestationUID,
            address: address,
          }),
        });
        const updateData = await updateResponse.json();
        if (updateData.success) {
          console.log("On-chain attestation Claimed");
          setIsClaimed(true);
          setTimeout(() => {
            triggerConfetti();
          }, 100);
          toast.success("On-chain attestation claimed successfully!");
        }
      }
    } catch (error: any) {
      console.error("Error claim:", error.message);
      toast.error(`Failed to claim on-chain attestation`);
      onClaimEnd();
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      <Tooltip
        content={
          isClaiming
            ? "Claiming Onchain Attestation"
            : onChainId || isClaimed
            ? "Received Onchain Attestation"
            : disabled
            ? "Claiming in progress for another session"
            : "Claim Onchain Attestation"
        }
        placement="top"
        showArrow
      >
        <button
          className={`${styles.button} ${
            !!onChainId || isClaimed ? styles.claimed : ""
          } w-full `}
          onClick={handleAttestationOnchain}
          disabled={!!onChainId || isClaiming || isClaimed || disabled}
        >
          <span className={styles.buttonText}>
            {isClaiming ? "Claiming..." : isClaimed ? "Claimed" : "Claim"}
          </span>
          <span className={styles.iconWrapper}>
            {isClaiming ? (
              <Oval
                visible={true}
                height="20"
                width="20"
                color="#fff"
                secondaryColor="#cdccff"
                ariaLabel="oval-loading"
              />
            ) : isClaimed ? (
              <FaCheck className={styles.icon} />
            ) : (
              <FaGift className={styles.icon} />
            )}
          </span>
        </button>
      </Tooltip>
    </>
  );
};

export default ClaimButton;
