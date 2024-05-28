import {
  useLocalPeer,
  usePeerIds,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";
import React from "react";
import RemoteGridCard from "./RemoteGridCard";
import LocalGridCard from "./LocalGridCard";
import { Role } from "@huddle01/server-sdk/auth";

function RemoteScreenShareGrid() {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.LISTENER, Role.SPEAKER],
    labels: ["screen-video"],
  });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

  const {
    videoStream: screenShareVideoStream,
    audioStream: screenShareAudioStream,
    state: screenShareState,
  } = useRemoteScreenShare({
    peerId: peerIds[0],
    onPlayable: (data) => {
      console.log("Ready to play remote peer's screen being shared!");
      // your code here
    },
    onClose: () => {
      console.log("Remote peer has stopped sharing their screen!");
      // your code here
    },
  });

  console.log("Screen share peer ids: ", peerIds[0]);

  return (
    <video
      autoPlay
      playsInline
      className="aspect-video w-full"
      ref={(screenRef: any) =>
        screenRef && (screenRef.srcObject = screenShareVideoStream)
      }
    />
  );
}

export default RemoteScreenShareGrid;
