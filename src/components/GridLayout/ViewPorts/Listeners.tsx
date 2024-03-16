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
      {localPeerRole === Role.LISTENER && localPeerId && (
        <LocalGridCard key={`grid-${localPeerId}`} />
      )}

      {localPeerRole == Role.HOST
        ? peerIds.slice(0, 4).map((peerId) => {
            return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
          })
        : ""}
    </>
  );
};

export default memo(Speakers);
