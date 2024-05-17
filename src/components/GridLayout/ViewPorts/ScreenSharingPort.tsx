import {
  useLocalPeer,
  useLocalScreenShare,
  usePeerIds,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import React from "react";
import LocalGridCard from "../GridCard/LocalGridCard";
import RemoteGridCard from "../GridCard/RemoteGridCard";
import RemoteScreenShareGrid from "../GridCard/RemoteScreenShareGrid";
import LocalScreenShareGrid from "../GridCard/LocalScreenShareGrid";

function ScreenSharingPort() {
  const { peerIds } = usePeerIds({
    roles: ["host", "listener", "speaker"],
    labels: ["screen-share-video"],
  });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

  console.log("PeerIDs: ", peerIds);
  console.log("Local PeerID: ", localPeerId);

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

  const {
    videoStream: screenShareVideoStream,
    audioStream: screenShareAudioStream,
    videoTrack: remoteVideoTrack,
    audioTrack: remoteAudioTrack,
    state: screenShareState,
  } = useRemoteScreenShare({
    peerId: peerIds[0],
    onPlayable: (data) => {
      // console.log("Ready to play remote peer's screen being shared!");
      // your code here
    },
    onClose: () => {
      // console.log("Remote peer has stopped sharing their screen!");
      // your code here
    },
  });

  return (
    <>
      {/* {localPeerId && <LocalScreenShareGrid />} */}
      {/* {peerIds && peerIds.map((peerId) => {
        return <RemoteScreenShareGrid peerId={peerId} />;
      })} */}

      <div className="grid grid-cols-4 h-full w-full gap-2">
        <div className="col-span-3 bg-slate-200 rounded-lg">
          {/* <RemoteScreenShareGrid /> */}
          {/* <LocalScreenShareGrid /> */}
          {videoTrack && (
            <video
              className="aspect-video w-full h-full rounded-lg"
              ref={(screenShareRef: any) =>
                screenShareRef && (screenShareRef.srcObject = shareStream)
              }
              autoPlay
            />
          )}
          {remoteVideoTrack && <RemoteScreenShareGrid />}
        </div>
        <div className="grid grid-rows-2 h-full w-full rounded-lg gap-2">
          <div className="rounded-lg">
            <RemoteGridCard key={`grid-${peerIds[0]}`} peerId={peerIds[0]} />
          </div>
          <div className="rounded-lg">
            {localPeerId && <LocalGridCard key={`grid-${localPeerId}`} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default ScreenSharingPort;
