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
import ChangeDevice from "./changeDevice";
import { Role } from "@huddle01/server-sdk/auth";
import { PeerMetadata } from "@/utils/types";
import clsx from "clsx";
import toast from "react-hot-toast";
import Dropdown from "../ui/Dropdown";
import Strip from "../sidebars/participantsSidebar/Peers/PeerRole/Strip";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAccount, useNetwork } from "wagmi";
import { PiLinkSimpleBold } from "react-icons/pi";
import { opBlock, arbBlock } from "@/config/constants";
import MeetingRecordingModal from "../utils/MeetingRecordingModal";
import ReactionBar from "./ReactionBar";

const BottomBar = () => {
  const { isAudioOn, enableAudio, disableAudio } = useLocalAudio();
  const { isVideoOn, enableVideo, disableVideo } = useLocalVideo();
  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);
  const { leaveRoom, closeRoom, room } = useRoom();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const meetingCategory = usePathname().split("/")[2];
  const roomId = params.roomId as string | undefined;
  const [s3URL, setS3URL] = useState<string>("");
  const { chain } = useNetwork();
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
  const [showModal, setShowModal] = useState(true);
  const [recordingStatus, setRecordingStatus] = useState<string | null>();
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
          const result = await response.text();
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  const handleRecording = async () => {
    if (isRecording) {
      const stopRecording = await fetch(
        `/rec/stopRecording?roomId=${room.roomId}`
      );
      const res = await stopRecording.json();
      if (res) {
        setIsRecording(false);
      }
    } else {
      const startRecording = await fetch(
        `/rec/startRecording?roomId=${room.roomId}`
      );
      const { msg } = await startRecording.json();
      if (msg) {
        setIsRecording(true);
      }
    }
  };

  const handleStopRecording = async () => {
    console.log("stop recording");
    if (!roomId) {
      console.error("roomId is undefined");
      return;
    }

    try {
      const status = await fetch(`/api/stopRecording/${roomId}`);
      console.log("status: ", status);

      if (!status.ok) {
        console.error(`Request failed with status: ${status.status}`);
        toast.error("Failed to stop recording");
        return;
      }

      setIsRecording(false);
      toast.success("Recording stopped");

      // // Fetch the recordings
      // const recordingsResponse = await fetch(`/api/recordings/${roomId}`);
      // const recordingsData = await recordingsResponse.json();
      // console.log("Recordings:", recordingsData);
      // // Now you can use the recordingsData in your frontend as needed
    } catch (error) {
      console.error("Error during stop recording:", error);
      toast.error("Error during stop recording");
    }
  };

  useEffect(() => {
    if (role === "host") {
      startRecordingAutomatically();
    }
  }, []);

  // useEffect(() => {
  //   const storedStatus = sessionStorage.getItem("isMeetingRecorded");
  //   console.log("storedStatus: ", storedStatus);
  //   setRecordingStatus(storedStatus);
  // }, []);

  // const handleModalClose = async (result: boolean) => {
  //   if (role === "host") {
  //     sessionStorage.setItem("isMeetingRecorded", result.toString());
  //     setShowModal(false);
  //     setRecordingStatus(result.toString());
  //     console.log(
  //       result ? "Meeting will be recorded." : "Meeting will not be recorded."
  //     );

  //     if (result) {
  //       startRecordingAutomatically();
  //     }

  //     try {
  //       const requestOptions = {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           meetingId: roomId,
  //           meetingType: meetingCategory,
  //           recordedStatus: result.toString(),
  //         }),
  //       };

  //       const response = await fetch(
  //         "/api/update-recording-status",
  //         requestOptions
  //       );
  //       console.log("Response: ", response);
  //     } catch (e) {
  //       console.log("Error: ", e);
  //     }
  //   }
  // };

  const startRecordingAutomatically = async () => {
    try {
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
    // Check if the user is the host

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

    console.log("host address", host_address);

    if (role === "host") {
      console.log("addresses: ", address, host_address);

      await handleStopRecording(); // Do not proceed with API calls if not the host
    }

    console.log("s3URL in handleEndCall", s3URL);
    toast("Meeting Ended");
    if (endMeet === "leave") {
      leaveRoom();
      setIsLoading(false);
      setShowLeaveDropDown(false);
    } else if (endMeet === "close") {
      closeRoom();
      setIsLoading(false);
      setShowLeaveDropDown(false);
    } else {
      return;
    }

    let meetingType;
    if (meetingCategory === "officehours") {
      meetingType = 2;
    } else if (meetingCategory === "session") {
      meetingType = 1;
    } else {
      meetingType = 0;
    }

    let dao_name = "";
    if (chain?.name === "Optimism") {
      dao_name = "optimism";
    } else if (chain?.name === "Arbitrum One") {
      dao_name = "arbitrum";
    }

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
          meetingType: meetingType,
          dao_name: dao_name,
        }),
      };
      // console.log("req optionnnn", requestOptions);

      const response2 = await fetch("/api/end-call", requestOptions);
      const result = await response2.text();
      console.log(result);
    } catch (error) {
      console.error("Error handling end call:", error);
    }

    // if (recordingStatus === "true") {
    try {
      toast.success("Giving Attestations");
      const response = await fetch(`/api/get-attest-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
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
    // }

    if (meetingCategory === "officehours") {
      try {
        const res = await fetch(`/api/update-office-hours/${host_address}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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

    // sessionStorage.removeItem("isMeetingRecorded");
  };

  return (
    <>
      <footer className="flex items-center justify-between px-4 py-2">
        {/* <div className="flex items-center">
        {role === Role.HOST ? (
          <Button
            className="flex gap-2 bg-red-500 hover:bg-red-400 text-white text-md font-semibold"
            onClick={handleRecording}
          >
            {isUploading ? BasicIcons.spin : BasicIcons.record}{" "}
            {isRecording
              ? isUploading
                ? "Recording..."
                : "Stop Recording"
              : "Record"}
          </Button>
        ) : (
          <div className="w-24" />
        )}
      </div> */}

        <div>
          <div className="relative">
            <div
              className="mr-auto flex items-center gap-4 w-44 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="bg-blue-shade-200 p-2 rounded-lg">
                <PiLinkSimpleBold
                  className="text-white"
                  size={24}
                ></PiLinkSimpleBold>
              </div>
              <span className="text-gray-800">Quick Links</span>
            </div>
            {isDropdownOpen && chain?.name === "Arbitrum One" && (
              <div className="absolute z-10 top-auto bottom-full left-0 mb-2 w-52 bg-white rounded-lg shadow-lg">
                <div className="arrow-up"></div>
                {arbBlock.map((block, index) => (
                  <a
                    href={block.link}
                    target="_blank"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    key={index}
                  >
                    {block.title}
                  </a>
                ))}
              </div>
            )}
            {isDropdownOpen && chain?.name === "Optimism" && (
              <div className="absolute z-10 top-auto bottom-full left-0 mb-2 w-52 bg-white rounded-lg shadow-lg">
                <div className="arrow-up"></div>
                {opBlock.map((block, index) => (
                  <a
                    href={block.link}
                    target="_blank"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    key={index}
                  >
                    {block.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={clsx("flex space-x-3", role === Role.HOST ? "mr-12" : "")}
        >
          {/* <ChangeDevice deviceType="cam"> */}
          <button
            onClick={() => {
              if (isVideoOn) {
                disableVideo();
              } else {
                enableVideo();
              }
            }}
            className="bg-gray-600/50 p-2.5 rounded-lg hover:bg-gray-600"
          >
            {isVideoOn ? BasicIcons.on.cam : BasicIcons.off.cam}
          </button>
          {/* </ChangeDevice> */}
          {/* <ChangeDevice deviceType="mic"> */}
          <button
            onClick={() => {
              if (isAudioOn) {
                disableAudio();
              } else {
                enableAudio();
              }
            }}
            className="bg-gray-600/50 p-2.5 rounded-lg hover:bg-gray-600"
          >
            {isAudioOn ? BasicIcons.on.mic : BasicIcons.off.mic}
          </button>
          {/* </ChangeDevice> */}
          {/* <ChangeDevice deviceType="speaker">
            <button
              onClick={() => {}}
              className="bg-gray-600/50 p-2.5 rounded-lg"
            >
              {BasicIcons.speaker}
            </button>
          </ChangeDevice> */}
          <ButtonWithIcon
            onClick={() => {
              if (isScreenShared) {
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
              (shareStream !== null || isScreenShared) && "bg-gray-500"
            )}
          >
            {BasicIcons.screenShare}
          </ButtonWithIcon>
          <ButtonWithIcon
            onClick={() => {
              updateMetadata({
                displayName: metadata?.displayName || "",
                avatarUrl: metadata?.avatarUrl || "",
                isHandRaised: !metadata?.isHandRaised,
              });
            }}
            className={clsx(metadata?.isHandRaised && "bg-gray-500")}
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
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
          >
            <div className="flex items-center justify-center">
              {BasicIcons.people}
              <span className="text-white ps-2">
                {Object.keys(peerIds).length + 1}
              </span>
            </div>
          </ButtonWithIcon>
          <ButtonWithIcon onClick={() => setIsChatOpen(!isChatOpen)}>
            {BasicIcons.chat}
          </ButtonWithIcon>
        </div>
      </footer>
      {/* {role === "host" && recordingStatus === null && (
        <MeetingRecordingModal show={showModal} onClose={handleModalClose} />
      )} */}
    </>
  );
};

export default BottomBar;