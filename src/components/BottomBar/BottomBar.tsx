"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/components/store/slices";
import Strip from "../Sidebar/Peers/PeerRole/Strip";

// Assets
import { BasicIcons, NestedBasicIcons } from "@/assets/BasicIcons";
import { cn } from "@/components/utils/helpers";
import Dropdown from "../common/Dropdown";
import EmojiTray from "../EmojiTray/EmojiTray";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useRoom,
  useLocalVideo,
  useLocalScreenShare,
  useDataMessage,
} from "@huddle01/react/hooks";
import toast, { Toaster } from "react-hot-toast";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import { PiLinkSimpleBold } from "react-icons/pi";
import { useAccount, useNetwork } from "wagmi";
import { FaCircleInfo } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";

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

  const newMessage = useStore((state) => state.hasNewMessage);
  const setHasNewMessage = useStore((state) => state.setHasNewMessage);

  const setSidebarView = useStore((state) => state.setSidebarView);

  const setPromptView = useStore((state) => state.setPromptView);

  const { role, metadata, updateRole, peerId: localPeerId } = useLocalPeer();

  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);
  const [s3URL, setS3URL] = useState<string>("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(true);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleStopRecording = async () => {
    if (!roomId) {
      console.error("roomId is undefined");
      return;
    }

    try {
      const status = await fetch(`/api/stopRecording/${roomId}`);

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

  const handleCopy = (link: string) => {
    copy(link);
    toast("Meeting link Copied");
  };

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

  const handleEndCall = async (endMeet: string) => {
    setIsLoading(true);
    // Check if the user is the host
    if (role === "host") {
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

    if (meetingCategory === "officehours") {
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

        console.log("host address", host_address);

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
  };

  const opBlock = [
    {
      title: "Forum",
      link: "https://gov.optimism.io/",
    },
    {
      title: "Website",
      link: "https://optimism.io/",
    },
    {
      title: "Block Explorer",
      link: "https://optimistic.etherscan.io/",
    },
    {
      title: "Optimism Twitter Profile",
      link: "https://twitter.com/Optimism",
    },
    {
      title: "Optimism DAO Twitter Profile",
      link: "https://twitter.com/OptimismGov",
    },
  ];

  const arbBlock = [
    {
      title: "Forum",
      link: "https://forum.arbitrum.foundation",
    },
    {
      title: "Website",
      link: "https://arbitrum.io",
    },
    {
      title: "Arbitrum Foundation Website",
      link: "https://arbitrum.foundation",
    },
    {
      title: "Block Explorer",
      link: "https://arbiscan.io",
    },
    {
      title: "Arbitrum Twitter Profile",
      link: "https://twitter.com/arbitrum",
    },
    {
      title: "Arbitrum DAO Twitter Profile",
      link: "https://twitter.com/DAO_Arbitrum",
    },
  ];

  return (
    <div className="w-full flex items-center px-10 justify-between pb-6 font-poppins">
      {/* Bottom Bar Left */}
      <div>
        {role === "host" ||
        role === "coHost" ||
        role === "speaker" ||
        role === "listener" ? (
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
        ) : (
          // <OutlineButton
          //   className="mr-auto flex items-center justify-between gap-3"
          //   onClick={() => setPromptView("request-to-speak")}
          // >
          //   {BasicIcons.requestToSpeak}
          //   <div className="text-black ">Request to speak</div>
          // </OutlineButton>
          <></>
        )}
      </div>

      {/* Bottom Bar Center */}
      <div className="flex items-center gap-4">
        {!isAudioOn ? (
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
        )}
        {role === "host" &&
          meetingCategory === "session" &&
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
          meetingCategory === "session" &&
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

        <div></div>
      </div>
      <div className="flex items-center gap-4">
        {/* Bottom Bar Right */}

        <div
          className="cursor-pointer"
          onClick={() => setMeetingDetailsVisible(!meetingDetailsVisible)}
        >
          <FaCircleInfo color="#0500FF" size={24} />
        </div>

        {meetingDetailsVisible && (
          <div className="absolute bottom-24 right-6 bg-white shadow-md p-4 rounded-lg text-black">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Your meeting&apos;s ready
              </h3>
              <button
                onClick={() => setMeetingDetailsVisible(!meetingDetailsVisible)}
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
              <div>{"app.chora.club" + path}</div>
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
            {
              Object.keys(peerIds).filter((peerId) => peerId !== localPeerId)
                .length
            }
          </span>
        </OutlineButton>
        <OutlineButton
          className="ml-auto flex items-center gap-3 border-[#0500FF] relative"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (sidebarView !== "close") {
              setSidebarView("close");
            }
          }}
        >
          {BasicIcons.chat}
          {/* <div className="absolute -top-2 -right-3">
            <GoDotFill color="#0500FF" size={25} />
          </div> */}
          {/* {newMessage && (
            <div className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
              <GoDotFill color="#0500FF" size={25} />
            </div>
          )} */}
        </OutlineButton>
      </div>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "14px",
            backgroundColor: "#3E3D3D",
            color: "#fff",
            boxShadow: "none",
            borderRadius: "50px",
            padding: "3px 5px",
          },
        }}
      />
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
