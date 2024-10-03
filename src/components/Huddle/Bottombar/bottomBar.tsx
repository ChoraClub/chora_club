"use client";
import {
  useDataMessage,
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from "@huddle01/react/hooks";
import { Button } from "@/components/ui/button";
import { BasicIcons } from "@/utils/BasicIcons";
import { useStudioState } from "@/store/studioState";
import ButtonWithIcon from "../../ui/buttonWithIcon";
import { Role } from "@huddle01/server-sdk/auth";
import { PeerMetadata } from "@/utils/types";
import clsx from "clsx";
import toast from "react-hot-toast";
import Dropdown from "../../ui/Dropdown";
import Strip from "../sidebars/participantsSidebar/Peers/PeerRole/Strip";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { PiLinkSimpleBold } from "react-icons/pi";
import { opBlock, arbBlock } from "@/config/staticDataUtils";
import MeetingRecordingModal from "../../ComponentUtils/MeetingRecordingModal";
import ReactionBar from "../ReactionBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SessionInterface } from "@/types/MeetingTypes";
import QuickLinks from "./QuickLinks";
import {
  handleCloseMeeting,
  handleRecording,
  handleStopRecording,
} from "../HuddleUtils";
import { BASE_URL } from "@/config/constants";
import { uploadFile } from "@/actions/uploadFile";

const BottomBar = ({
  daoName,
  hostAddress,
  meetingStatus,
  meetingData,
  meetingCategory,
}: {
  daoName: string;
  hostAddress: string;
  meetingStatus: boolean | undefined;
  meetingData?: SessionInterface;
  meetingCategory: string;
}) => {
  const { isAudioOn, enableAudio, disableAudio } = useLocalAudio();
  const { isVideoOn, enableVideo, disableVideo } = useLocalVideo();
  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);
  const { leaveRoom, closeRoom, room } = useRoom();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const roomId = params.roomId as string | undefined;
  const [s3URL, setS3URL] = useState<string>("");
  const { chain } = useAccount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { address } = useAccount();
  const {
    role,
    metadata,
    updateMetadata,
    peerId: localPeerId,
  } = useLocalPeer<PeerMetadata>();
  const { peerIds } = usePeerIds({ roles: ["host", "guest"] });

  const {
    isChatOpen,
    setIsChatOpen,
    isParticipantsOpen,
    setIsParticipantsOpen,
    isRecording,
    setIsRecording,
    isUploading,
    isScreenShared,
    setIsScreenShared,
  } = useStudioState();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare({
      onProduceStart(data) {
        if (data) {
          setIsScreenShared(true);
        }
      },
      onProduceClose(label) {
        if (label) {
          setIsScreenShared(false);
        }
      },
    });

  useDataMessage({
    async onMessage(payload, from, label) {
      if (label === "server-message") {
        const { s3URL } = JSON.parse(payload);
        console.log("s3URL", s3URL);
        const videoUri = s3URL;
        setS3URL(videoUri);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

        const raw = JSON.stringify({
          meetingId: roomId,
          video_uri: videoUri,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        try {
          const response = await fetch("/api/update-video-uri", requestOptions);
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (role === "host") {
        event.preventDefault();
        event.returnValue = "Changes you made may not be saved.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [role]);

  const handleEndCall = async (endMeet: string) => {
    setIsLoading(true);

    if (role === "host" && meetingStatus === true) {
      await handleStopRecording(roomId, address, setIsRecording);
    }

    console.log("s3URL in handleEndCall", s3URL);
    toast("Meeting Ended");
    if (endMeet === "leave") {
      leaveRoom();
      setIsLoading(false);
      setShowLeaveDropDown(false);
    } else if (endMeet === "close") {
      if (role === "host") {
        let nft_image;
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          const requestOptions = {
            method: "GET",
            headers: myHeaders,
          };
          const imageResponse = await fetch(
            `${BASE_URL}/api/images/og/nft?daoName=${daoName}&meetingId=${roomId}`,
            requestOptions
          );

          try {
            const arrayBuffer = await imageResponse.arrayBuffer();
            const result = await uploadFile(arrayBuffer, daoName, roomId);
            console.log("Upload result:", result);
            console.log("Hash:", result.Hash);
            nft_image = `ipfs://` + result.Hash;
          } catch (error) {
            console.error("Error in uploading file:", error);
          }
        } catch (error) {
          console.log("Error in generating OG image:::", error);
        }
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          if (address) {
            myHeaders.append("x-wallet-address", address);
          }
          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({
              meetingId: roomId,
              meetingType: meetingCategory,
              recordedStatus: meetingStatus,
              meetingStatus: meetingStatus === true ? "Recorded" : "Finished",
              nft_image: nft_image,
            }),
          };

          const response = await fetch(
            "/api/update-recording-status",
            requestOptions
          );
          console.log("Response: ", response);
        } catch (e) {
          console.log("Error: ", e);
        }
      }
      closeRoom();
      setIsLoading(false);
      setShowLeaveDropDown(false);
    } else {
      return;
    }

    if (meetingCategory === "officehours") {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      try {
        const res = await fetch(`/api/update-office-hours/${hostAddress}`, {
          method: "PUT",
          headers: myHeaders,
        });
        const res_data = await res.json();

        // if (res_data.success) {
        console.log("Updated", res_data);
        toast.success("Next Office hour is scheduled!");

        // }
      } catch (e) {
        console.log("error: ", e);
      }
    }
  };

  return (
    <>
      <footer className="flex items-center justify-between px-4 py-2 font-poppins">
        <QuickLinks daoName={daoName} />

        <div className={clsx("flex space-x-3")}>
          <ButtonWithIcon
            content={isVideoOn ? "Turn off camera" : "Turn on camera"}
            onClick={() => {
              if (isVideoOn) {
                disableVideo();
              } else {
                enableVideo();
              }
            }}
            className={clsx(
              isVideoOn ? "bg-gray-500" : "bg-red-400 hover:bg-red-500"
            )}
          >
            {isVideoOn ? BasicIcons.on.cam : BasicIcons.off.cam}
          </ButtonWithIcon>
          <ButtonWithIcon
            content={isAudioOn ? "Turn off microphone" : "Turn on microphone"}
            onClick={() => {
              if (isAudioOn) {
                disableAudio();
              } else {
                enableAudio();
              }
            }}
            className={clsx(
              isAudioOn ? "bg-gray-500" : "bg-red-400 hover:bg-red-500"
            )}
          >
            {isAudioOn ? BasicIcons.on.mic : BasicIcons.off.mic}
          </ButtonWithIcon>
          <ButtonWithIcon
            content={
              isScreenShared && shareStream !== null
                ? "Stop Sharing"
                : shareStream !== null
                ? "Stop Sharing"
                : isScreenShared
                ? "Only one screen share is allowed at a time"
                : "Share Screen"
            }
            onClick={() => {
              if (isScreenShared && shareStream !== null) {
                stopScreenShare();
              } else if (isScreenShared) {
                toast.error("Only one screen share is allowed at a time");
                return;
              }
              if (shareStream !== null) {
                stopScreenShare();
              } else {
                startScreenShare();
              }
            }}
            className={clsx(
              `bg-gray-500/80 hover:bg-gray-600 ${
                (shareStream !== null || isScreenShared) && "bg-gray-500/80"
              }`
            )}
          >
            {BasicIcons.screenShare}
          </ButtonWithIcon>
          <ButtonWithIcon
            content={metadata?.isHandRaised ? "Lower Hand" : "Raise Hand"}
            onClick={() => {
              updateMetadata({
                displayName: metadata?.displayName || "",
                avatarUrl: metadata?.avatarUrl || "",
                isHandRaised: !metadata?.isHandRaised,
                walletAddress: metadata?.walletAddress || address || "",
              });
            }}
            className={clsx(
              `bg-gray-500/80 hover:bg-gray-600 ${
                metadata?.isHandRaised && "bg-gray-500/80"
              }`
            )}
          >
            {BasicIcons.handRaise}
          </ButtonWithIcon>
          {/* <ButtonWithIcon onClick={leaveRoom}>{BasicIcons.end}</ButtonWithIcon> */}

          <div>
            <ReactionBar />
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
                  title={isLoading ? "Leaving..." : "End spaces for all"}
                  variant="danger"
                  onClick={() => handleEndCall("close")}
                />
              )}
              {role !== "host" && (
                <Strip
                  type="leave"
                  title={isLoading ? "Leaving..." : "Leave the spaces"}
                  variant="danger"
                  onClick={() => handleEndCall("leave")}
                />
              )}
            </Dropdown>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            className="flex gap-2 bg-red-500 hover:bg-red-400 text-white text-md font-semibold"
            onClick={() =>
              handleRecording(roomId, address, isRecording, setIsRecording)
            }
          >
            {isUploading ? BasicIcons.spin : BasicIcons.record}{" "}
            {isRecording
              ? isUploading
                ? "Recording..."
                : "Stop Recording"
              : "Record"}
          </Button>
          <ButtonWithIcon
            content="Participants"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            className={clsx("bg-gray-600/50 hover:bg-gray-600")}
          >
            <div className="flex items-center justify-center">
              {BasicIcons.people}
              <span className="text-white ps-2">
                {Object.keys(peerIds).length + 1}
              </span>
            </div>
          </ButtonWithIcon>
          <ButtonWithIcon
            content="Chat"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={clsx("bg-gray-600/50 hover:bg-gray-600")}
          >
            {BasicIcons.chat}
          </ButtonWithIcon>
        </div>
      </footer>
    </>
  );
};

export default BottomBar;
