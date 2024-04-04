import React, { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { BasicIcons } from "@/assets/BasicIcons";
import useStore from "@/components/store/slices";
import {
  useDataMessage,
  useLocalPeer,
  useLocalVideo,
  useLocalScreenShare,
} from "@huddle01/react/hooks";

const LocalGridCard: FC = () => {
  const [reaction, setReaction] = useState("");
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    metadata,
    peerId: localPeerId,
    role,
  } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  const {
    shareStream,
    startScreenShare,
    stopScreenShare,
    audioTrack,
    videoTrack,
  } = useLocalScreenShare({
    onProduceStart: (producer) => {
      console.log("Started screen share!");
      console.log(producer);
      // your code here
    },
    onProduceClose: () => {
      console.log("Stopped screen share!");
      // your code here
    },
    onProduceError: () => {
      console.log("There was an error in sharing your screen!");
      // your code here
    },
  });

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === localPeerId) {
        if (label === "reaction") {
          setReaction(payload);
          setTimeout(() => {
            setReaction("");
          }, 5000);
        }
      }
    },
  });

  return (
    <div
      className={`h-screen w-full rounded-lg pt-2 gap-4`}
      style={{
        height: "100%",
        width: "100%",
        minHeight: "50%",
        minWidth: "32%",
      }}
    >
      {!stream && (
        <div className="flex flex-col items-center justify-center bg-slate-100 py-5 px-10 rounded-lg w-full h-full">
          <div className="relative flex flex-col items-center justify-center">
            <Image
              src={metadata?.avatarUrl || "/avatars/avatars/0.png"}
              alt="default-avatar"
              width={100}
              height={100}
              quality={100}
              priority
              className="maskAvatar"
            />

            <div className="absolute left-1/2 -translate-x-1/2 mb-2 text-4xl z-10">
              {reaction}
            </div>

            {role && ["host", "coHost", "speaker"].includes(role) && (
              <div className="absolute right-0 top-0">{BasicIcons.audio}</div>
            )}

            {metadata?.isHandRaised && (
              <div className="absolute flex bottom-0 right-0 w-8 h-8 rounded-full justify-center items-center bg-gray-600 text-xl border-gray-600 border-2">
                ✋
              </div>
            )}
          </div>
          <div className="mt-1 text-center">
            <div className="text-gray-700 text-base font-medium">
              {`${metadata?.displayName} (You)`}
            </div>
            {/* <div className="text-gray-500 text-sm font-normal">{role}</div> */}
          </div>
        </div>
      )}

      <div>
        {shareStream ? (
          <div className="grid grid-cols-2 h-full justify-center items-center">
            {stream && (
              <div className="col-span-1 w-full h-full">
                <video
                  ref={videoRef}
                  className="rounded-xl w-full h-full"
                  autoPlay
                />
              </div>
            )}

            <div className={stream ? "col-span-1" : "col-span-2"}>
              <video
                className="aspect-video w-full h-full"
                ref={(screenShareRef) =>
                  screenShareRef && (screenShareRef.srcObject = shareStream)
                }
                autoPlay
              />
            </div>
          </div>
        ) : (
          <div className="flex grid-cols-2 justify-center items-center">
            {/* <div className="w-full h-full"></div> */}
            {stream && (
              <div className="col-span-2 h-full w-[60%]">
                <video
                  ref={videoRef}
                  className="aspect-video w-full h-full"
                  autoPlay
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LocalGridCard);
