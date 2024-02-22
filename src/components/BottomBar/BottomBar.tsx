"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/components/store/slices";
import Strip from "../Sidebar/Peers/PeerRole/Strip";

// Assets
import { BasicIcons, NestedBasicIcons } from "@/assets/BasicIcons";
import { cn } from "@/components/utils/helpers";
import Dropdown from "../common/Dropdown";
import EmojiTray from "../EmojiTray/EmojiTray";
import { useRouter } from "next/navigation";
import {
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useRoom,
  useLocalVideo,
  useLocalScreenShare,
} from "@huddle01/react/hooks";
import toast from "react-hot-toast";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";

type BottomBarProps = {};

const BottomBar: React.FC<BottomBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const params = useParams();
  const meetingCategory = usePathname().split("/")[2];
  const roomId = params.roomId as string | undefined;
  // console.log(roomId);
  console.log("Value: ", meetingCategory);

  const { peerIds } = usePeerIds();

  const { leaveRoom, closeRoom } = useRoom();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio({
    onProduceStart(producer) {
      toast.success("Producer created");
      console.debug("Producer created", producer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  // const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream, videoTrack } =
    useLocalScreenShare();

  const sidebarView = useStore((state) => state.sidebar.sidebarView);

  const isChatOpen = useStore((state) => state.isChatOpen);
  const setIsChatOpen = useStore((state) => state.setIsChatOpen);

  const setSidebarView = useStore((state) => state.setSidebarView);

  const setPromptView = useStore((state) => state.setPromptView);

  const { role, metadata, updateRole, peerId: localPeerId } = useLocalPeer();

  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);

  const handleRecordingButtonClick = async () => {
    if (!roomId) {
      console.error("roomId is undefined");
      return;
    }

    try {
      const status = isRecording
        ? await fetch(`/api/stopRecording/${roomId}`)
        : await fetch(`/api/startRecording/${roomId}`);

      if (!status.ok) {
        console.error(`Request failed with status: ${status.status}`);
        toast.error(`Failed to ${isRecording ? "stop" : "start"} recording`);
        return;
      }

      setIsRecording(!isRecording);
      toast.success(`Recording ${isRecording ? "stopped" : "started"}`);

      // If it's a stop recording action, you can fetch the recordings
      if (!isRecording) {
        const recordingsResponse = await fetch("/api/stopRecording/:roomId");
        const recordingsData = await recordingsResponse.json();
        console.log("Recordings:", recordingsData);
        // Now you can use the recordingsData in your frontend as needed
      }
    } catch (error) {
      console.error(
        `Error during ${isRecording ? "stop" : "start"} recording:`,
        error
      );
      toast.error(`Error during ${isRecording ? "stop" : "start"} recording`);
    }
  };

  const getSessionData = async () => {
    try {
      const response = await fetch(`/api/meeting-session-data/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("result in get meeting", result);
      return result;
    } catch (error) {
      console.log("error in catch", error);
    }
  };

const handleAttestation = async (endMeet: string) => {
  if (endMeet == "leave") {
    leaveRoom();
  } else if (endMeet == "close") {
    closeRoom();
  } else {
    return;
  }

  let sessionData;
  if (meetingCategory === "session") {
    const data = await getSessionData();
    console.log("session data: ", data.data[0]);
    sessionData = data.data[0];
  } else {
    console.log("error");
  }

  const response = await fetch(
    `https://api.huddle01.com/api/v1/rooms/meetings?roomId=${roomId}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
      },
    }
  );
  const result = await response.json();
  console.log("meeting details: ", result);

  const slotTimeUnix = Math.floor(
    new Date(sessionData.slot_time).getTime() / 1000
  );
  const endTimeUnix = Math.floor(Date.now() / 1000); // Current time in Unix timestamp format

  const hostData = {
    recipient: sessionData.host_address,
    meetingId: roomId,
    meetingType: 1,
    startTime: slotTimeUnix, 
    endTime: endTimeUnix, 
  };

  console.log(window.location.origin);
  const headers = {
    "Content-Type": "application/json",
    //   Origin: window.location.origin, // Set the Origin header to your frontend URL
  };

  const userData = {
    recipient: sessionData.user_address,
    meetingId: roomId,
    meetingType: 2,
    startTime: slotTimeUnix, 
    endTime: endTimeUnix, 
  };

  try {
    const response = await axios.post("/api/attest-offchain", hostData, {
      headers,
    });
    console.log(response.data);
    // Handle response as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }

  try {
    const response = await axios.post("/api/attest-offchain", userData, {
      headers,
    });
    console.log(response.data);
    // Handle response as needed
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }
};


  return (
    <div className="w-full flex items-center px-10 justify-between pb-6 font-poppins">
      {/* Bottom Bar Left */}
      <div>
        {role === "host" || role === "coHost" || role === "speaker" ? (
          <div className="mr-auto flex items-center justify-between gap-3 w-44"></div>
        ) : (
          <OutlineButton
            className="mr-auto flex items-center justify-between gap-3"
            onClick={() => setPromptView("request-to-speak")}
          >
            {BasicIcons.requestToSpeak}
            <div className="text-black ">Request to speak</div>
          </OutlineButton>
        )}
      </div>

      {/* Bottom Bar Center */}
      <div className="flex items-center gap-4">
        {role !== "listener" &&
          (!isAudioOn ? (
            <button
              onClick={() => {
                enableAudio();
              }}
            >
              {NestedBasicIcons.inactive.mic}
            </button>
          ) : (
            <button
              onClick={() => {
                disableAudio();
              }}
            >
              {NestedBasicIcons.active.mic}
            </button>
          ))}
        {role === "host" &&
          (!isVideoOn ? (
            <button
              className="rounded-lg inline-flex items-center"
              style={{ backgroundColor: "#0500FF" }}
              onClick={() => {
                enableVideo();
              }}
            >
              {NestedBasicIcons.inactive.video}
            </button>
          ) : (
            <button
              className=" rounded-lg inline-flex items-center"
              style={{ backgroundColor: "#0500FF" }}
              onClick={() => {
                disableVideo();
              }}
            >
              {NestedBasicIcons.active.video}
            </button>
          ))}
        {role === "host" &&
          (!videoTrack ? (
            <button
              className=" rounded-lg inline-flex items-center"
              style={{ backgroundColor: "#0500FF" }}
              onClick={() => {
                startScreenShare();
              }}
            >
              {NestedBasicIcons.inactive.screen}
            </button>
          ) : (
            <button
              className=" rounded-lg inline-flex items-center"
              style={{ backgroundColor: "#0500FF" }}
              onClick={() => {
                stopScreenShare();
              }}
            >
              {NestedBasicIcons.active.screen}
            </button>
          ))}
        {/* <button
          type="button"
          className="text-white bg-blue-700 px-4 py-2 rounded-full"
          onClick={handleRecordingButtonClick}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button> */}
        {/* <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>stop Recording</button> */}

        <div className="flex cursor-pointer items-center">
          <Dropdown
            triggerChild={BasicIcons.avatar}
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}
          >
            <EmojiTray
              onClick={() => alert("todo")}
              onClose={() => setIsOpen(false)}
            />
          </Dropdown>
        </div>
        <div className="flex cursor-pointer items-center">
          <Dropdown
            triggerChild={BasicIcons.leave}
            open={showLeaveDropDown}
            onOpenChange={() => setShowLeaveDropDown((prev) => !prev)}
          >
            {role === "host" && (
              <Strip
                type="close"
                title="End spaces for all"
                variant="danger"
                onClick={() => handleAttestation("close")}
              />
            )}
            <Strip
              type="leave"
              title="Leave the spaces"
              variant="danger"
              onClick={() => handleAttestation("leave")}
            />
          </Dropdown>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Bottom Bar Right */}

        <OutlineButton
          className="ml-auto flex items-center gap-3 border-[#0500FF]"
          onClick={() => {
            setSidebarView(sidebarView === "peers" ? "close" : "peers");
            if (isChatOpen) {
              setIsChatOpen(false);
            }
          }}
        >
          {BasicIcons.peers}
          <span className="text-black">
            {Object.keys(peerIds).filter((peerId) => peerId !== localPeerId)
              .length + 1}
          </span>
        </OutlineButton>
        <OutlineButton
          className="ml-auto flex items-center gap-3 border-[#0500FF]"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (sidebarView !== "close") {
              setSidebarView("close");
            }
          }}
        >
          {BasicIcons.chat}
        </OutlineButton>
      </div>
    </div>
  );
};
export default React.memo(BottomBar);

interface OutlineButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  className,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={cn("border border-custom-4 rounded-lg py-2 px-3", className)}
  >
    {children}
  </button>
);




