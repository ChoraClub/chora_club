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
import ButtonWithIcon from "../ui/buttonWithIcon";
import { Role } from "@huddle01/server-sdk/auth";
import { PeerMetadata } from "@/utils/types";
import clsx from "clsx";
import toast from "react-hot-toast";
import Dropdown from "../ui/Dropdown";
import Strip from "./sidebars/participantsSidebar/Peers/PeerRole/Strip";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { PiLinkSimpleBold } from "react-icons/pi";
import { opBlock, arbBlock } from "@/config/staticDataUtils";
import MeetingRecordingModal from "../ComponentUtils/MeetingRecordingModal";
import ReactionBar from "./ReactionBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SessionInterface } from "@/types/MeetingTypes";

const BottomBar = ({
  daoName,
  hostAddress,
  meetingStatus,
  meetingData,
}: {
  daoName: string;
  hostAddress: string;
  meetingStatus: boolean | undefined;
  meetingData?: SessionInterface;
}) => {
  const { isAudioOn, enableAudio, disableAudio } = useLocalAudio();
  const { isVideoOn, enableVideo, disableVideo } = useLocalVideo();
  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);
  const { leaveRoom, closeRoom, room } = useRoom();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const meetingCategory = usePathname().split("/")[2];
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
  const [roomClosed, setRoomClosed] = useState<Boolean>();
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

  const handleStopRecording = async () => {
    console.log("stop recording");
    if (!roomId) {
      console.error("roomId is undefined");
      return;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          roomId: roomId,
        }),
      };
      const response = await fetch(
        `/api/stopRecording/${roomId}`,
        requestOptions
      );
      const data = await response.json();
      console.log("response: ", response);

      if (!response.ok) {
        console.error(`Request failed with status: ${response.status}`);
        toast.error("Failed to stop recording");
        return;
      }

      if (data.success === true) {
        setIsRecording(false);
        toast.success("Recording stopped");
        const success = true;
        return success;
      }
    } catch (error) {
      console.error("Error during stop recording:", error);
      toast.error("Error during stop recording");
    }
  };

  const { state } = useRoom({
    onLeave: async ({ reason }) => {
      if (reason === "LEFT") {
        console.log("inside reason left");
      }
      if (reason === "CLOSED") {
        console.log("inside reason closed");
        console.log("room:::", room);
        console.log("state:::", state);
        setRoomClosed(true);
      }
    },
  });

  const handleCloseMeeting = async () => {
    // if (role === "host") {
    let meetingType;
    if (meetingCategory === "officehours") {
      meetingType = 2;
    } else if (meetingCategory === "session") {
      meetingType = 1;
    } else {
      meetingType = 0;
    }

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          roomId: roomId,
          meetingType: meetingType,
          dao_name: daoName,
          hostAddress: hostAddress,
        }),
      };

      const response = await fetch("/api/end-call", requestOptions);
      const result = await response.json();
      console.log("result in end call::", result);

      if (meetingStatus === true && result.success) {
        try {
          toast.success("Giving Attestations");
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          if (address) {
            myHeaders.append("x-wallet-address", address);
          }
          const response = await fetch(`/api/get-attest-data`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
              roomId: roomId,
              connectedAddress: address,
              meetingData: meetingData,
            }),
          });
          const response_data = await response.json();
          console.log("Updated", response_data);
          if (response_data.success) {
            toast.success("Attestation successful");
          }
        } catch (e) {
          console.log("Error in attestation: ", e);
          toast.error("Attestation denied");
        }
      }
    } catch (error) {
      console.error("Error handling end call:", error);
    }
    // }
  };

  const handleEndCall = async (endMeet: string) => {
    setIsLoading(true);

    if (role === "host" && meetingStatus === true) {
      await handleStopRecording();
    }

    console.log("s3URL in handleEndCall", s3URL);
    toast("Meeting Ended");
    if (endMeet === "leave") {
      leaveRoom();
      setIsLoading(false);
      setShowLeaveDropDown(false);
    } else if (endMeet === "close") {
      if (role === "host") {
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

    // if (role === "host") {
    //   let meetingType;
    //   if (meetingCategory === "officehours") {
    //     meetingType = 2;
    //   } else if (meetingCategory === "session") {
    //     meetingType = 1;
    //   } else {
    //     meetingType = 0;
    //   }

    //   try {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     if (address) {
    //       myHeaders.append("x-wallet-address", address);
    //     }
    //     const requestOptions = {
    //       method: "POST",
    //       headers: myHeaders,
    //       body: JSON.stringify({
    //         roomId: roomId,
    //         meetingType: meetingType,
    //         dao_name: daoName,
    //         hostAddress: hostAddress,
    //       }),
    //     };

    //     const response = await fetch("/api/end-call", requestOptions);
    //     const result = await response.json();
    //     console.log("result in end call::", result);

    //     if (meetingStatus === true && result.success) {
    //       try {
    //         toast.success("Giving Attestations");
    //         const myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");
    //         if (address) {
    //           myHeaders.append("x-wallet-address", address);
    //         }
    //         const response = await fetch(`/api/get-attest-data`, {
    //           method: "POST",
    //           headers: myHeaders,
    //           body: JSON.stringify({
    //             roomId: roomId,
    //             connectedAddress: address,
    //             meetingData: meetingData,
    //           }),
    //         });
    //         const response_data = await response.json();
    //         console.log("Updated", response_data);
    //         if (response_data.success) {
    //           toast.success("Attestation successful");
    //         }
    //       } catch (e) {
    //         console.log("Error in attestation: ", e);
    //         toast.error("Attestation denied");
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error handling end call:", error);
    //   }
    // }

    if (role === "host") {
      await handleCloseMeeting();
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-white hover:bg-white">
              <div className="flex gap-2 items-center">
                <div className="bg-blue-shade-200 p-2 rounded-lg">
                  <PiLinkSimpleBold
                    className="text-white"
                    size={24}
                  ></PiLinkSimpleBold>
                </div>
                <div className="text-gray-800 text-base">Quick Links</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-white items-start"
            sideOffset={8}
            align="start"
          >
            <div className="">
              {/* <div className="arrow-up"></div> */}
              {(daoName === "arbitrum"
                ? arbBlock
                : daoName === "optimism"
                ? opBlock
                : []
              ).map((block, index) => (
                <a
                  href={block.link}
                  target="_blank"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:rounded-md"
                  key={index}
                >
                  {block.title}
                </a>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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
              `bg-blue-shade-100 hover:bg-blue-shade-200 ${
                (shareStream !== null || isScreenShared) && "bg-blue-shade-100"
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
              `bg-blue-shade-100 hover:bg-blue-shade-200 ${
                metadata?.isHandRaised && "bg-blue-shade-100"
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
