import {
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import CoHosts from "./ViewPorts/CoHosts";
import Hosts from "./ViewPorts/Hosts";
import Speakers from "./ViewPorts/Speakers";
import Listeners from "./ViewPorts/Listeners";
import {
  useDataMessage,
  useRemoteAudio,
  useRemotePeer,
  useRemoteVideo,
  useRemoteScreenShare,
} from "@huddle01/react/hooks";

type GridLayoutProps = {};

const GridLayout: React.FC<GridLayoutProps> = () => {
  // const { peerIds } = usePeerIds({ roles: [Role.LISTENER] });
  const { peerId: localPeerId, role: localPeerRole } = useLocalPeer();
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.LISTENER] });
  // console.log("peerIds----- ", peerIds);
  // console.log("Peer id: ", peerIds[0]);
  const hostId = peerIds[0];
  const { stream: videoStream, state } = useRemoteVideo({ peerId: hostId });
  const { startScreenShare, stopScreenShare, shareStream, videoTrack } =
    useLocalScreenShare();
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();

  const {
    videoStream: screenShareVideoStream,
    audioStream: screenShareAudioStream,
    state: screenShareState,
  } = useRemoteScreenShare({
    peerId: hostId,
    onPlayable: (data) => {
      console.log("Ready to play remote peer's screen being shared!");
      // your code here
    },
    onClose: () => {
      console.log("Remote peer has stopped sharing their screen!");
      // your code here
    },
  });

  return (
    <div className="w-full flex items-center justify-center flex-col h-full font-poppins">
      <div className="flex-wrap flex items-center justify-center gap-4">
        <Hosts />
      </div>
      <div className="mt-2">
        {(!screenShareVideoStream || !videoStream) && (
          <div className="text-black text-base font-normal text-center mb-5">
            Listeners : {peerIds.length}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 w-full">
          {localPeerRole == Role.HOST ? (
            <>
              <CoHosts />
              <Speakers />
              <Listeners />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default GridLayout;
