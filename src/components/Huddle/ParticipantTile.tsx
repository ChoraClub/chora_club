import React from "react";
import GridContainer from "./GridContainer";
import { usePeerIds } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";
import clsx from "clsx";
import { useStudioState } from "@/store/studioState";

function ParticipantTile() {
  const { peerIds } = usePeerIds({
    roles: [Role.HOST, Role.GUEST],
  });
  const { isScreenShared } = useStudioState();

  return (
    <GridContainer
      className={clsx(
        isScreenShared
          ? "w-full h-full gap-y-2 mx-1"
          : `w-[49%] ${
              peerIds.length === 2 || peerIds.length === 3 ? "h-[49%]" : ""
            }`
      )}
    >
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-shade-100 text-gray-200 text-3xl font-semibold ">+{peerIds.length - 2}</div>
    </GridContainer>
  );
}

export default ParticipantTile;
