import { useLocalPeer, usePeerIds } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import { memo } from "react";
import LocalGridCard from "../GridCard/LocalGridCard";
import RemoteGridCard from "../GridCard/RemoteGridCard";

const Speakers = () => {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.LISTENER, Role.SPEAKER],
  });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

  return (
    <div className="h-full w-full grid grid-flow-col grid-rows-2 gap-3">
      {/* <>{localPeerId && <LocalGridCard key={`grid-${localPeerId}`} />}</> */}
      {/* <> */}
        {peerIds.map((peerId) => {
          return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
        })}
      {/* </> */}
    </div>
  );
};

export default memo(Speakers);
