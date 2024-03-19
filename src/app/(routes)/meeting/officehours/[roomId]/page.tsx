"use client";

import React, { useEffect, useState } from "react";

// Components
import BottomBar from "@/components/BottomBar/BottomBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import GridLayout from "@/components/GridLayout/GridLayout";
import Prompts from "@/components/common/Prompts";
import {
  useRoom,
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useHuddle01,
  useDataMessage,
} from "@huddle01/react/hooks";
import { useRouter } from "next/navigation";
import AcceptRequest from "@/components/Modals/AcceptRequest";
import useStore from "@/components/store/slices";
import { toast } from "react-hot-toast";
import { Role } from "@huddle01/server-sdk/auth";
import Chat from "@/components/Chat/Chat";
import { useAccount } from "wagmi";
import AttestationModal from "@/components/utils/AttestationModal";

// import Chat from '@/components/Chat/Chat';

const Home = ({ params }: { params: { roomId: string } }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    console.log("Popup Closed");
    setModalOpen(false); // Close the modal
    // Push the router after the modal is closed

    push(`/meeting/officehours/${params.roomId}/lobby`);
    console.log("Popup 3");
  };

  const displayPopup = async () => {
    console.log("Popup");
    setModalOpen(true);
    console.log("Popup 2");
  };

  const { state } = useRoom({
    onLeave: () => {
      displayPopup();
    },
  });
  const { push } = useRouter();
  // const { changePeerRole } = useAcl();
  const [requestedPeerId, setRequestedPeerId] = useState("");
  const { showAcceptRequest, setShowAcceptRequest } = useStore();
  const addChatMessage = useStore((state) => state.addChatMessage);
  const addRequestedPeers = useStore((state) => state.addRequestedPeers);
  const removeRequestedPeers = useStore((state) => state.removeRequestedPeers);
  const requestedPeers = useStore((state) => state.requestedPeers);
  const avatarUrl = useStore((state) => state.avatarUrl);
  const userDisplayName = useStore((state) => state.userDisplayName);
  const isChatOpen = useStore((state) => state.isChatOpen);
  const { updateMetadata, metadata, peerId, role } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();
  const { peerIds } = usePeerIds();

  const { huddleClient } = useHuddle01();

  const { address } = useAccount();

  useEffect(() => {
    if (state === "idle") {
      push(`/meeting/officehours/${params.roomId}/lobby`);
      return;
    } else {
      updateMetadata({
        displayName: userDisplayName,
        avatarUrl: avatarUrl,
        isHandRaised: metadata?.isHandRaised || false,
      });

      // Check if the role is "listener" or "speaker"
      if (role === "listener" || role === "speaker") {
        // Get the attendee address based on the role
        const attendeeAddress = role === "listener" ? address : peerId;

        // Construct the request body
        // let attendees = [];

        // Add the attendee dynamically one by one
        // attendees.push({
        //   attendee_address: attendeeAddress,
        // });

        let uniqueAddresses = new Set();
        let attendees = [];

        if (!uniqueAddresses.has(attendeeAddress)) {
          // Add the address to the set of unique addresses
          uniqueAddresses.add(attendeeAddress);

          // Construct the request body

          // Add the attendee dynamically one by one
          attendees.push({
            attendee_address: attendeeAddress,
          });
        }

        console.log("All attendees: ", attendees);

        const raw = JSON.stringify({
          meetingId: params.roomId,
          attendees: attendees,
        });

        // Make the API request
        const requestOptions = {
          method: "PUT",
          body: raw,
        };

        fetch("/api/update-attendee", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      }
    }
  }, []); // empty dependency array

  console.log("role from office hours", role);

  useDataMessage({
    onMessage(payload, from, label) {
      if (label === "requestToSpeak") {
        setShowAcceptRequest(true);
        setRequestedPeerId(from);
        addRequestedPeers(from);
        setTimeout(() => {
          setShowAcceptRequest(false);
        }, 5000);
      }

      if (label === "chat" && from !== peerId) {
        const messagePayload = JSON.parse(payload);
        const newChatMessage = {
          name: messagePayload.name,
          text: messagePayload.message,
          is_user: false,
        };
        addChatMessage(newChatMessage);
      }
    },
  });

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeers]);

  return (
    <section className="bg-white flex h-screen text-slate-100 flex-col justify-between overflow-hidden">
      <div className="flex w-full h-[90%]">
        <GridLayout />
        <Sidebar />
        <div className="absolute right-4 bottom-20">
          {showAcceptRequest && <AcceptRequest peerId={requestedPeerId} />}
        </div>
        {isChatOpen && <Chat />}
      </div>

      <BottomBar />
      <Prompts />
      {modalOpen && (
        <AttestationModal isOpen={modalOpen} onClose={handleModalClose} />
      )}
    </section>
  );
};
export default Home;
