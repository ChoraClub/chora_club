import React from "react";
import RemoteGridCard from "./RemoteGridCard";
import LocalGridCard from "./LocalGridCard";
import {
  useLocalPeer,
  useLocalScreenShare,
  usePeerIds,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";

function LocalScreenShareGrid() {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.LISTENER, Role.SPEAKER],
  });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

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

  return (
    // <div className="grid grid-cols-4 h-full w-full gap-2">
    //   <div className="col-span-3 bg-slate-200 rounded-lg text-black">
        <video
          className="aspect-video w-full h-full rounded-lg"
          ref={(screenShareRef) =>
            screenShareRef && (screenShareRef.srcObject = shareStream)
          }
          autoPlay
        />
    //     local
    //   </div>
    //   <div className="grid grid-rows-2 h-full w-full rounded-lg gap-2">
    //     <div className="rounded-lg">
    //       <RemoteGridCard key={`grid-${peerIds[0]}`} peerId={peerIds[0]} />
    //     </div>
    //     <div className="rounded-lg">
    //       {localPeerId && <LocalGridCard key={`grid-${localPeerId}`} />}
    //     </div>
    //   </div>
    // </div>
  );
}

export default LocalScreenShareGrid;
