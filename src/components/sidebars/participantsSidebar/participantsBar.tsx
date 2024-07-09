import { usePeerIds } from "@huddle01/react/hooks";
import PeerData from "./peerData";
import RequestedPeers from "./requestedPeers";
import { useStudioState } from "@/store/studioState";
import clsx from "clsx";
import { BasicIcons } from "@/utils/BasicIcons";
import Peers from "./Peers/Peers";

const ParticipantsBar = () => {
  const { peerIds } = usePeerIds();
  const { requestedPeers, setIsParticipantsOpen } = useStudioState();

  return (
    <aside className="w-96 bg-gray-100 h-full mr-2 rounded-lg transition-all duration-300 ease-in-out">
      <div className="mb-6">
        {requestedPeers.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-center text-gray-200">
              Requests for Mainstage
            </span>
            <div className="p-2 rounded-lg bg-gray-800">
              {requestedPeers.map((peerId) => (
                <RequestedPeers peerId={peerId} key={peerId} />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-[#0500FF]">Participants</h1>
          <button type="button" onClick={() => setIsParticipantsOpen(false)}>
            {BasicIcons.close}
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-2 px-4 py-2">
          {/* {peerIds.map((peerId) => (
            <PeerData peerId={peerId} key={peerId} />
          ))} */}
          <Peers />
        </div>
      </div>
    </aside>
  );
};

export default ParticipantsBar;
