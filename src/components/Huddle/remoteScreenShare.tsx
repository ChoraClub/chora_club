import { PeerMetadata } from "@/utils/types";
import { useRemotePeer, useRemoteScreenShare } from "@huddle01/react/hooks";
import Video from "../Media/Video";
import Audio from "../Media/Audio";
import GridContainer from "./GridContainer";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useStudioState } from "@/store/studioState";

interface RemotePeerProps {
  peerId: string;
}

const RemoteScreenShare = ({ peerId }: RemotePeerProps) => {
  const { setIsScreenShared } = useStudioState();
  const { videoTrack, audioTrack } = useRemoteScreenShare({
    peerId,
    onPlayable(data) {
      if (data) {
        setIsScreenShared(true);
      }
    },
    onClose() {
      setIsScreenShared(false);
    },
  });
  const { metadata } = useRemotePeer<PeerMetadata>({ peerId });
  const [videoStreamTrack, setVideoStreamTrack] = useState<any>("");

  useEffect(() => {
    setVideoStreamTrack(videoTrack && new MediaStream([videoTrack]));
    console.log("videoTrack", videoTrack);
  }, [videoTrack]);

  return (
    <>
      {videoTrack && (
        <div className="w-3/4">
          <GridContainer className="w-full h-full">
            <>
              <Video
                stream={videoStreamTrack}
                name={metadata?.displayName ?? "guest"}
              />
              {audioTrack && (
                <Audio
                  stream={audioTrack && new MediaStream([audioTrack])}
                  name={metadata?.displayName ?? "guest"}
                />
              )}
            </>
          </GridContainer>
        </div>
      )}
    </>
  );
};

export default RemoteScreenShare;
