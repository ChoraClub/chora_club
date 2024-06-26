// import { NestedPeerListIcons, PeerListIcons } from "@/assets/PeerListIcons";
import Dropdown from "@/components/ui/Dropdown";
// import { cn } from "@/components/utils/helpers";
import Image from "next/image";
import HostData from "../PeerRole/HostData";
import CoHostData from "../PeerRole/CoHostData";
import SpeakerData from "../PeerRole/SpeakerData";
import ListenersData from "../PeerRole/ListenersData";
import { useLocalAudio, useLocalPeer } from "@huddle01/react/hooks";
// import useStore from "@/components/store/slices";
import { Role } from "@huddle01/server-sdk/auth";
import { memo } from "react";
import clsx from "clsx";
import { cn } from "@/utils/helper";
import { NestedPeerListIcons, PeerListIcons } from "@/utils/PeerListIcons";
import { useStudioState } from "@/store/studioState";

interface PeerMetaDatProps {
  isRequested?: boolean;
  className?: string;
}

const PeerMetaData: React.FC<PeerMetaDatProps> = ({
  className,
  isRequested,
}) => {
  const { metadata, peerId, role, updateRole, updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();
  const { name, avatarUrl } = useStudioState();

  const RoleData = {
    host: peerId && <HostData peerId={peerId} />,
    coHost: peerId && <CoHostData peerId={peerId} />,
    speaker: peerId && <SpeakerData peerId={peerId} />,
    listener: peerId && <ListenersData peerId={peerId} />,
  } as const;

  const {
    enableAudio,
    disableAudio,
    stream: micStream,
    isAudioOn,
  } = useLocalAudio();

  // const removeRequestedPeers = useStore((state) => state.removeRequestedPeers);

  return (
    <div className={cn(className, "flex items-center justify-between w-full")}>
      <div className="flex items-center gap-2">
      {metadata?.avatarUrl &&
        metadata.avatarUrl !== "/avatars/avatars/0.png" ? (
          <div className="bg-pink-50 border border-pink-100 rounded-full w-6 h-6">
            <img
              src={metadata?.avatarUrl}
              className="maskAvatar object-cover"
            />
          </div>
        ) : (
          <div className="flex text-sm font-semibold items-center justify-center w-6 h-6 bg-[#004DFF] text-gray-200 rounded-full">
           {metadata?.displayName} (You)
            {/* <img src={metadata?.avatarUrl} /> */}
          </div>
        )}
        {/* <div className="flex text-sm font-semibold items-center justify-center w-6 h-6 bg-[#004DFF] text-gray-200 rounded-full">
          {name[0]?.toUpperCase()}
        </div> */}
        <div className="text-slate-400 tex-sm font-normal">
          {metadata?.displayName} (You)
        </div>
      </div>
      {/* {isRequested ? (
        <AcceptDenyGroup
          onDeny={() => {
            if (peerId) {
              removeRequestedPeers(peerId);
            }
          }}
          onAccept={() => {
            if (peerId && role && ["host", "coHost"].includes(role)) {
              updateRole({ role: Role.SPEAKER });
              removeRequestedPeers(peerId);
            }
          }}
        />
      ) : ( */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => {
            // if (peerId === localPeerId) {
            updateMetadata({
              displayName: metadata?.displayName ?? "Guest",
              avatarUrl: metadata?.avatarUrl ?? "/avatars/avatars/0.png",
              isHandRaised: !metadata?.isHandRaised,
            });
            // }
          }}
          className="cursor-pointer"
        >
          {metadata?.isHandRaised
            ? NestedPeerListIcons.active.hand
            : NestedPeerListIcons.inactive.hand}
        </div>
        <div
          onClick={() => {
            if (role && ["host", "guest"].includes(role)) {
              isAudioOn ? disableAudio() : enableAudio();
            }
          }}
          className="cursor-pointer"
        >
          {isAudioOn
            ? NestedPeerListIcons.active.mic
            : NestedPeerListIcons.inactive.mic}
        </div>
        {/* {role === "host" ? ( */}
        <div className="flex items-center cursor-pointer">
          <Dropdown
            triggerChild={<div>{NestedPeerListIcons.inactive.more}</div>}
            align="end"
          >
            {role && RoleData[role as keyof typeof RoleData]}
          </Dropdown>
        </div>
        {/* ) : null} */}
      </div>
      {/* )} */}
    </div>
  );
};

export default memo(PeerMetaData);

interface IAcceptDenyProps {
  onAccept?: () => void;
  onDeny?: () => void;
}

const AcceptDenyGroup: React.FC<IAcceptDenyProps> = ({ onAccept, onDeny }) => (
  <div className="flex items-center gap-4">
    <div role="presentation" onClick={onAccept}>
      {PeerListIcons.accept}
    </div>
    <div role="presentation" onClick={onDeny}>
      {PeerListIcons.deny}
    </div>
  </div>
);
