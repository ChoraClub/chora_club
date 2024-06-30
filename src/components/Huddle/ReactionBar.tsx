import React, { useState } from "react";
import Dropdown from "../common/Dropdown";
import EmojiTray from "../EmojiTray/EmojiTray";
import { BasicIcons } from "@/utils/BasicIcons";
import { useDataMessage } from "@huddle01/react/hooks";
import { useStudioState } from "@/store/studioState";

type peerMetaData = {
  displayName: string;
  avatarUrl: string;
  isHandRaised: boolean;
};

type Reaction = "" | "😂" | "👍" | "🎉";

function ReactionBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const emojiList: Reaction[] = ["😂", "👍", "🎉"];

  const { sendData } = useDataMessage();
  const setMyReaction = useStudioState((state) => state.setMyReaction);

  return (
    <div>
      <div className="flex rounded-lg bg-gray-600/50 items-center">
        <div className="cursor-pointer">
          <Dropdown
            triggerChild={BasicIcons.avatar}
            open={isOpen}
            onOpenChange={() => setIsOpen((prev) => !prev)}
          >
            <EmojiTray
              onClick={() => alert("todo")}
              onClose={() => setIsOpen(false)}
            />
          </Dropdown>
        </div>

        <div className="grid grid-cols-3 place-items-center gap-2 pe-2">
          {emojiList.map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                sendData({
                  to: "*",
                  payload: emoji,
                  label: "reaction",
                });
                setMyReaction(emoji);
              }}
              role="presentation"
              className="cursor-pointer text-lg hover:scale-125"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReactionBar;
