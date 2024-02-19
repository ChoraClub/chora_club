import React from "react";
import Strip from "./Strip";
import { useLocalPeer, useRemotePeer, useRoom } from "@huddle01/react/hooks";
import { Role } from "@huddle01/server-sdk/auth";

type SpeakerDataProps = {
  peerId: string;
};

const Speaker: React.FC<SpeakerDataProps> = ({ peerId }) => {
  const { leaveRoom } = useRoom();
  const { updateRole } = useRemotePeer({ peerId });
  const me = useLocalPeer();

  return (
    <>
      {me.role === "host" && (
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
            )}
            {me.role && ["host", "coHost"].includes(me.role) && (
              <div>
            <Strip
              type="speaker"
              title="Remove as Speaker"
              variant="danger"
              onClick={() => {
                  updateRole(Role.LISTENER);
                }
              }
            />
            <Strip
              type="leave"
              title="Remove from spaces"
              variant="danger"
              onClick={() => {
                  // kickPeer(peerId);
              }}
            />
          </div>
        )}

      {me.role === "speaker" && (
        <div>
          <Strip
            type="leave"
            title="Leave speaker role"
            variant="danger"
            onClick={() => {
              updateRole(Role.LISTENER);
            }}
          />
          <Strip
            type="leave"
            title="Leave the spaces"
            variant="danger"
            onClick={() => {
              leaveRoom();
            }}
          />
        </div>
      )}
    </>
  );
};
export default Speaker;
