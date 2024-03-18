import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { BasicIcons } from "@/assets/BasicIcons";
import {
  useDataMessage,
  useRemoteAudio,
  useRemotePeer,
  useRemoteVideo,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";
import AudioElem from "@/components/common/AudioElem";

type GridCardProps = {
  peerId: string;
};

const GridCard: React.FC<GridCardProps> = ({ peerId }) => {
  const [reaction, setReaction] = useState("");
  const { stream: videoStream, state } = useRemoteVideo({ peerId });
  const vidRef = useRef<HTMLVideoElement>(null);

  const { metadata, role } = useRemotePeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>({ peerId });

  const { stream: audioStream, isAudioOn } = useRemoteAudio({
    peerId,
    onPlayable: () => {
      console.debug("ON AUDIO PLAYABLE");
    },
  });

  const {
    videoStream: screenShareVideoStream,
    audioStream: screenShareAudioStream,
    state: screenShareState,
  } = useRemoteScreenShare({
    peerId,
    onPlayable: (data) => {
      console.log("Ready to play remote peer's screen being shared!");
      // your code here
    },
    onClose: () => {
      console.log("Remote peer has stopped sharing their screen!");
      // your code here
    },
  });

  useEffect(() => {
    console.log("video stream", videoStream);
    if (videoStream && vidRef.current && state === "playable") {
      vidRef.current.srcObject = videoStream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          await vidRef.current?.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is happening...");
      };
    }
  }, [videoStream, state]);

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === peerId) {
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
    <div className="flex w-full h-full justify-center items-center rounded-xl p-3 gap-4">
      {(!screenShareVideoStream || !videoStream) && (
        <div className="mt-4 flex flex-col items-center bg-slate-100 w-full h-full justify-center py-4 px-7 rounded-xl">
          {audioStream && <AudioElem peerId={peerId} />}
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

            <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 mb-2 text-4xl">
              {reaction}
            </div>
            {role && ["host", "coHost", "speaker"].includes(role) && (
              <div className="absolute top-0 right-0">{BasicIcons.audio}</div>
            )}
            {metadata?.isHandRaised && (
              <div className="absolute flex bottom-0 w-8 h-8 right-0 rounded-full justify-center items-center bg-gray-600 text-xl border-gray-600 border-2">
                ✋
              </div>
            )}
          </div>
          <div className="mt-1 text-center">
            <div className="text-gray-800 text-base font-medium">
              {metadata?.displayName}
            </div>
            <div className="text-gray-800 text-sm font-normal">{role}</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 justify-center items-center mt-3">
        {audioStream && <AudioElem peerId={peerId} />}
        {screenShareVideoStream && (
          <div className={!videoStream ? "col-span-2" : "col-span-1 w-full"}>
            <video
              autoPlay
              playsInline
              controls
              className="aspect-video w-full"
              ref={(screenRef) =>
                screenRef && (screenRef.srcObject = screenShareVideoStream)
              }
            />
          </div>
        )}
        {videoStream && (
          <div
            className={
              !screenShareVideoStream ? "col-span-2" : "col-span-1 w-full"
            }
          >
            <video
              ref={vidRef}
              autoPlay
              playsInline
              className="aspect-video w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(GridCard);
