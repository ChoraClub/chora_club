import { usePeerIds } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import React from "react";

function ParticipantsCard() {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.LISTENER, Role.SPEAKER],
  });

  return (
    <div>
      <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-lg">
        <span className="p-14 bg-white text-black text-4xl rounded-full">+{peerIds.length - 2}</span>
      </div>
    </div>
  );
}

export default ParticipantsCard;
