import { useStudioState } from "@/store/studioState";
import { BasicIcons } from "@/utils/BasicIcons";
import { PeerMetadata } from "@/utils/types";
import { useRemotePeer } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";

interface RequestedPeersProps {
  peerId: string;
}

const RequestedPeers = ({ peerId }: RequestedPeersProps) => {
  const { metadata, updateRole } = useRemotePeer<PeerMetadata>({ peerId });
  const { removeRequestedPeers } = useStudioState();

  return (
    <div className="flex items-center py-1.5 px-1 justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="flex text-sm font-semibold items-center justify-center min-w-6 min-h-6 bg-gray-700 text-gray-200 rounded-full">
          {metadata?.displayName?.[0].toUpperCase()}
        </div>
        <div className="text-slate-400 tex-sm font-normal">
          {metadata?.displayName}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          role="presentation"
          onClick={() => {
            updateRole(Role.CO_HOST);
            removeRequestedPeers(peerId);
          }}
        >
          {BasicIcons.tick}
        </button>
        <button
          role="presentation"
          onClick={() => {
            removeRequestedPeers(peerId);
          }}
        >
          {BasicIcons.close}
        </button>
      </div>
    </div>
  );
};

export default RequestedPeers;
