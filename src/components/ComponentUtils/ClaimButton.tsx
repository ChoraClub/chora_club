// import React from 'react';
// import { Oval } from "react-loader-spinner";
// import { FaGift } from "react-icons/fa6";
// import { Tooltip } from "@nextui-org/react";
// import styles from "./ClaimButton.module.css";

// interface ClaimButtonProps {
//   isClaiming: boolean;
//   isClaimed: boolean;
//   onChainId: string | undefined;
//   onClick: (e: React.MouseEvent) => void;
// }

// const ClaimButton: React.FC<ClaimButtonProps> = ({ isClaiming, isClaimed, onChainId, onClick }) => {
//   return (
//     <Tooltip
//       content={
//         isClaiming
//           ? "Claiming Onchain Attestation"
//           : onChainId || isClaimed
//           ? "Received Onchain Attestation"
//           : "Claim Onchain Attestation"
//       }
//       placement="top"
//       showArrow
//     >
//       <button
//         className={styles.button}
//         onClick={onClick}
//         disabled={!!onChainId || isClaiming || isClaimed}
//       >
//         {isClaiming ? (
//           <div className="flex items-center justify-center px-3">
//             <Oval
//               visible={true}
//               height="20"
//               width="20"
//               color="#fff"
//               secondaryColor="#cdccff"
//               ariaLabel="oval-loading"
//             />
//           </div>
//         ) : onChainId || isClaimed ? (
//           "Claimed"
//         ) : (
//           <>
//             <div className="flex items-center justify-center translate-y-[1px]">
//               Claim
//             </div>
//             <FaGift className={styles.icon} />
//           </>
//         )}
//       </button>
//     </Tooltip>
//   );
// };

// export default ClaimButton;

import React, { useState } from "react";
import { Oval } from "react-loader-spinner";
import { FaCheck, FaGift } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import styles from "./ClaimButton.module.css";
import { ethers } from "ethers";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import toast from "react-hot-toast";

interface ClaimButtonProps {
  meetingId: string;
  meetingType: number;
  startTime: number;
  endTime: number;
  dao: string;
  address: string;
  onChainId: string | undefined;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({
  meetingId,
  meetingType,
  startTime,
  endTime,
  dao,
  address,
  onChainId
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  // const [isClaimed, setIsClaimed] = useState(!!onChainId);
  const [isClaimed, setIsClaimed] = useState(false);

  const handleAttestationOnchain = async () => {
    setIsClaiming(true);
    if (
      typeof window.ethereum === "undefined" ||
      !window.ethereum.isConnected()
    ) {
      console.log("not connected");
      setIsClaiming(false);
      return;
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
      const res = await fetch("/api/attest-onchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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
          toast.success("On-chain attestation claimed successfully!");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to claim on-chain attestation.");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Tooltip
      content={
        isClaiming
          ? "Claiming Onchain Attestation"
          : onChainId || isClaimed
          ? "Received Onchain Attestation"
          : "Claim Onchain Attestation"
      }
      placement="top"
      showArrow
    >
      <button
        className={`${styles.button} ${
          !!onChainId || isClaimed ? styles.claimed : ""
        } w-full `}
        onClick={(e) => {
          e.stopPropagation();
          handleAttestationOnchain();
        }}
        disabled={!!onChainId || isClaiming || isClaimed}
      >
        <span className={styles.buttonText}>
          {isClaiming
            ? "Claiming..."
            : onChainId || isClaimed
            ? "Claimed"
            : "Claim"}
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
          ) : onChainId || isClaimed ? (
            <FaCheck className={styles.icon} />
          ) : (
            <FaGift className={styles.icon} />
          )}
        </span>
      </button>
    </Tooltip>
  );
};

export default ClaimButton;
