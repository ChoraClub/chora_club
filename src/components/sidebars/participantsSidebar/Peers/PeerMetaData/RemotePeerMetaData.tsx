// import { NestedPeerListIcons, PeerListIcons } from "@/assets/PeerListIcons";
import Dropdown from "@/components/ui/Dropdown";
// import { cn } from "@/components/utils/helpers";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import HostData from "../PeerRole/HostData";
import CoHostData from "../PeerRole/CoHostData";
import SpeakerData from "../PeerRole/SpeakerData";
import ListenersData from "../PeerRole/ListenersData";
import {
  useDataMessage,
  useLocalPeer,
  useRemoteAudio,
  useRemotePeer,
} from "@huddle01/react/hooks";
// import useStore from "@/components/store/slices";
import { Role } from "@huddle01/server-sdk/auth";
import clsx from "clsx";
import { cn } from "@/utils/helper";
import { NestedPeerListIcons } from "@/utils/PeerListIcons";
import { useStudioState } from "@/store/studioState";

interface PeerMetaDatProps {
  isRequested?: boolean;
  className?: string;
  peerId: string;
}

const PeerMetaData: React.FC<PeerMetaDatProps> = ({
  className,
  isRequested,
  peerId,
}) => {
  const RoleData = {
    host: <HostData peerId={peerId} />,
    coHost: <CoHostData peerId={peerId} />,
    speaker: <SpeakerData peerId={peerId} />,
    guest: <ListenersData peerId={peerId} />,
  } as const;

  const { role, metadata, updateRole } = useRemotePeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>({ peerId });

  const { isAudioOn } = useRemoteAudio({ peerId });
  const { peerId: localPeerId } = useLocalPeer();

  // const removeRequestedPeers = useStore((state) => state.removeRequestedPeers);

  const renderRoleData = () => {
    if (role === "host") {
      return (
        <>
          {RoleData.host}
          {RoleData.coHost}
          {RoleData.speaker}
          {RoleData.guest}
        </>
      );
    } else if (role === "coHost") {
      return RoleData.coHost;
    } else if (role === "speaker") {
      return RoleData.speaker;
    } else {
      return null; // For guest and other roles, do not render anything
    }
  };

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
            {metadata?.displayName[0]?.toUpperCase()}
            {/* <img src={metadata?.avatarUrl} /> */}
          </div>
        )}
        {/* <div className="flex text-sm font-semibold items-center justify-center w-6 h-6 bg-[#004DFF] text-gray-200 rounded-full">
          {metadata?.displayName[0]?.toUpperCase()}
        </div> */}
        <div className="text-slate-400 tex-sm font-normal">
          {metadata?.displayName}
        </div>
      </div>
      {/* {isRequested ? (
        <AcceptDenyGroup
          onDeny={() => {
            if (peerId) {
              // removeRequestedPeers(peerId);
            }
          }}
          onAccept={() => {
            if (peerId && role && ["host", "coHost"].includes(role)) {
              updateRole(Role.SPEAKER);
              // removeRequestedPeers(peerId);
            }
          }}
        />
      ) : ( */}
      <div className="flex items-center gap-3">
        <div onClick={() => {}}>
          {metadata?.isHandRaised
            ? NestedPeerListIcons.active.hand
            : NestedPeerListIcons.inactive.hand}
        </div>
        <div>
          {isAudioOn
            ? NestedPeerListIcons.active.mic
            : NestedPeerListIcons.inactive.mic}
        </div>
        {/* {role === "host" && ( */}
        <div className="cursor-pointer flex items-center">
          <Dropdown
            triggerChild={<div>{NestedPeerListIcons.inactive.more}</div>}
            align="end"
          >
            {role && RoleData[role as keyof typeof RoleData]}
            {/* {renderRoleData()} */}
          </Dropdown>
        </div>
        {/* )} */}
      </div>
      {/* )}  */}
    </div>
  );
};

export default React.memo(PeerMetaData);

interface IAcceptDenyProps {
  onAccept?: () => void;
  onDeny?: () => void;
}

const AcceptDenyGroup: React.FC<IAcceptDenyProps> = ({ onAccept, onDeny }) => (
  <div className="flex items-center gap-4">
    <div role="presentation" onClick={onAccept}>
      {/* {PeerListIcons.accept} */}
    </div>
    <div role="presentation" onClick={onDeny}>
      {/* {PeerListIcons.deny} */}
    </div>
  </div>
);
