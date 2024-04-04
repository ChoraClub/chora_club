import { useLocalPeer, usePeerIds } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import { memo } from "react";
import LocalGridCard from "../GridCard/LocalGridCard";
import RemoteGridCard from "../GridCard/RemoteGridCard";

const Speakers = () => {
  const { peerIds } = usePeerIds({ roles: [Role.LISTENER] });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

  // console.log("Peer ids: ", peerIds);

  return (
    <>
      <div className="h-full w-full space-x-2">
        {localPeerId && <LocalGridCard key={`grid-${localPeerId}`} />}
      </div>
      <div className="h-full w-full">
        {peerIds.map((peerId) => {
          return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
        })}
      </div>
    </>
  );
};

export default memo(Speakers);
