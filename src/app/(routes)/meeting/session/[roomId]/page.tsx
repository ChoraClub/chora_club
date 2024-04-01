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
import { usePathname, useRouter } from "next/navigation";
import AcceptRequest from "@/components/Modals/AcceptRequest";
import useStore from "@/components/store/slices";
import { toast } from "react-hot-toast";
import { Role } from "@huddle01/server-sdk/auth";
import Chat from "@/components/Chat/Chat";
import { useAccount } from "wagmi";
import AttestationModal from "@/components/utils/AttestationModal";
import { PiRecordFill } from "react-icons/pi";
import { Tooltip } from "@nextui-org/react";
import { RxCross2 } from "react-icons/rx";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";

// import Chat from '@/components/Chat/Chat';

const Home = ({ params }: { params: { roomId: string } }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    console.log("Popup Closed");
    setModalOpen(false); // Close the modal
    // Push the router after the modal is closed

    push(`/meeting/session/${params.roomId}/lobby`);
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

  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(true);

  const path = usePathname();

  useEffect(() => {
    if (state === "idle") {
      push(`/meeting/session/${params.roomId}/lobby`);
      return;
    } else {
      updateMetadata({
        displayName: userDisplayName,
        avatarUrl: avatarUrl,
        isHandRaised: metadata?.isHandRaised || false,
      });

      if (role === "listener" || role === "speaker") {
        // Get the attendee address based on the role
        const attendeeAddress = role === "listener" ? address : peerId;
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

        fetch("/api/update-session-attendees", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      }
    }
  }, []);

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

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Meeting link Copied");
  };

  return (
    <section className="bg-white flex h-screen text-slate-100 flex-col justify-between overflow-hidden">
      <div className="flex w-full h-[90%] pb-4">
        <div className="relative top-4">
          <Tooltip
            showArrow
            content={
              <div className="font-poppins">This meeting is being recorded</div>
            }
            placement="right"
            className="rounded-md bg-opacity-90 max-w-96"
            closeDelay={1}
          >
            <span>
              <PiRecordFill color="#c42727" size={22} />
            </span>
          </Tooltip>
        </div>
        <GridLayout />
        <Sidebar />
        <div className="absolute right-4 bottom-20">
          {Role.HOST
            ? showAcceptRequest && <AcceptRequest peerId={requestedPeerId} />
            : null}
        </div>
        {isChatOpen && <Chat />}

        {meetingDetailsVisible && (
          <div className="absolute bottom-20 bg-white shadow-md p-4 rounded-lg text-black">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Your meeting's ready</h3>
              <button
                onClick={() => setMeetingDetailsVisible(false)}
                className="p-2 hover:bg-slate-100 hover:rounded-full"
              >
                <RxCross2 size={20} />
              </button>
            </div>

            <div className="pb-3 text-sm">
              Or share this meeting link with others that you want in the
              meeting
            </div>

            <div className="flex mb-2 bg-slate-100 rounded-sm px-2 py-1 justify-between items-center">
              <div>{"https://app.chora.club" + path}</div>
              <div className="pl-5 cursor-pointer">
                <IoCopy
                  onClick={() =>
                    handleCopy("https://app.chora.club" + `${path}`)
                  }
                />
              </div>
            </div>

            <div className="text-sm py-2">Joined in as {address}</div>
          </div>
        )}
      </div>

      <BottomBar />
      {Role.HOST ? <Prompts /> : null}

      {modalOpen && (
        <AttestationModal isOpen={modalOpen} onClose={handleModalClose} />
      )}
    </section>
  );
};
export default Home;
