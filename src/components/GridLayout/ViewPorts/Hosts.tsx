import { useLocalPeer, usePeerIds } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import { memo } from "react";
import LocalGridCard from "../GridCard/LocalGridCard";
import RemoteGridCard from "../GridCard/RemoteGridCard";
import ParticipantsCard from "../GridCard/ParticipantsCard";

const Speakers = () => {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.LISTENER, Role.SPEAKER],
  });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();

  return (
    <div
      className={`h-full w-full ${
        peerIds.length + 1 === 1
          ? "h-full w-full"
          : peerIds.length + 1 === 2
          ? "grid grid-cols-2 gap-2"
          : "grid grid-cols-2 grid-rows-2 gap-2"
      } `}
    >
      {localPeerId && <LocalGridCard key={`grid-${localPeerId}`} />}
      {/* <> */}
      {peerIds.length === 3 ? (
        peerIds.slice(0, 3).map((peerId) => {
          return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
        })
      ) : peerIds.length > 3 ? (
        <>
          {peerIds.slice(0, 2).map((peerId) => {
            return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
          })}
          <ParticipantsCard />
        </>
      ) : (
        peerIds.map((peerId) => {
          return <RemoteGridCard key={`grid-${peerId}`} peerId={peerId} />;
        })
      )}

      {/* </> */}
    </div>
  );
};

export default memo(Speakers);
