import React from "react";
import Strip from "./Strip";
import {
  useRoom,
  useHuddle01,
  useLocalPeer,
  useRemotePeer,
} from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";

type ListenersDataProps = {
  peerId: string;
};

const ListenersData: React.FC<ListenersDataProps> = ({ peerId }) => {
  const { leaveRoom, kickPeer } = useRoom();
  // const { updateRole } = useRemotePeer({ peerId });
  const me = useLocalPeer();
  console.log("Local peer id>>>>>>>> ", me, peerId);

  return (
    <>
      {/* {me.role === "host" && (
        <div>
          <Strip
            type="personNormal"
            title="Invite as Co-Host"
            variant="normal"
            onClick={() => {
              updateRole(Role.CO_HOST);
            }}
          />
        </div>
      )} */}
      {me.role === "host" && (
        <div>
          {/* <Strip
              type="personSpeaker"
              title="Invite as Speaker"
              variant="normal"
              onClick={() => {
                updateRole(Role.SPEAKER);
              }}
            /> */}
          <Strip
            type="leave"
            title="Remove from spaces"
            variant="danger"
            onClick={() => {
              kickPeer(peerId);
            }}
          />
        </div>
      )}

      {me.role === "guest" && me.peerId === peerId && (
        <div>
          <Strip
            type="leave"
            title="Remove from spaces"
            variant="danger"
            onClick={() => {
              kickPeer(peerId);
            }}
          />
        </div>
      )}
    </>
  );
};
export default ListenersData;
