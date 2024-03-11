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

  const { leaveRoom, closeRoom, state } = useRoom();

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

  // const handleRecordingButtonClick = async () => {
  //   if (!roomId) {
  //     console.error("roomId is undefined");
  //     return;
  //   }

  //   try {
  //     const status = isRecording
  //       ? await fetch(`/api/stopRecording/${roomId}`)
  //       : await fetch(`/api/startRecording/${roomId}`);

  //     if (!status.ok) {
  //       console.error(`Request failed with status: ${status.status}`);
  //       toast.error(`Failed to ${isRecording ? "stop" : "start"} recording`);
  //       return;
  //     }

  //     setIsRecording(!isRecording);
  //     toast.success(`Recording ${isRecording ? "stopped" : "started"}`);

  //     // If it's a stop recording action, you can fetch the recordings
  //     if (!isRecording) {
  //       const recordingsResponse = await fetch("/api/stopRecording/:roomId");
  //       const recordingsData = await recordingsResponse.json();
  //       console.log("Recordings:", recordingsData);
  //       // Now you can use the recordingsData in your frontend as needed
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Error during ${isRecording ? "stop" : "start"} recording:`,
  //       error
  //     );
  //     toast.error(`Error during ${isRecording ? "stop" : "start"} recording`);
  //   }
  // };

  useEffect(() => {
    if (role === "host") {
      startRecordingAutomatically();
    }
  }, []);

  const startRecordingAutomatically = async () => {
    try {
      // Check if it's the host

      const status = await fetch(`/api/startRecording/${params.roomId}`);
      if (!status.ok) {
        console.error(`Request failed with status: ${status.status}`);
        toast.error("Failed to start recording");
        return;
      }
      setIsRecording(true); // Assuming this should be true after starting recording
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Error starting recording");
    }
  };

  const handleEndCall = async (endMeet: string) => {
    if (endMeet === "leave") {
      leaveRoom();
    } else if (endMeet === "close") {
      closeRoom();
    } else {
      return;
    }

    // Check if the user is the host
    if (role !== "host") {
      return; // Do not proceed with API calls if not the host
    }

    let meetingType;
    if (meetingCategory === "officehours") {
      meetingType = 2;
    } else if (meetingCategory === "session") {
      meetingType = 1;
    } else {
      meetingType = 0;
    }

    try {
      const response = await fetch(`/api/stopRecording/${roomId}`);
      if (!response.ok) {
        console.error("Failed to fetch recordings data");
        return;
      }
      const recordingsData = await response.json();
      console.log("Recordings:", recordingsData);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
          meetingType: meetingType,
          video_uri: recordingsData,
        }),
      };

      const response2 = await fetch("/api/end-call", requestOptions);
      const result = await response2.text();
      console.log(result);
    } catch (error) {
      console.error("Error handling end call:", error);
    }

    try {
      const response = await fetch(`/api/get-host`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId: roomId,
        }),
      });
      const response_data = await response.json();
      const host_address = await response_data.address;

      const res = await fetch(`/api/update-office-hours/${host_address}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res_data = await res.json();

      // if (res_data.success) {
        console.log("Updated",res_data);
      // }
    } catch (e) {}
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
                onClick={() => handleEndCall("close")}
              />
            )}
            <Strip
              type="leave"
              title="Leave the spaces"
              variant="danger"
              onClick={() => handleEndCall("leave")}
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
