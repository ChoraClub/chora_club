import { BasicIcons } from "@/assets/BasicIcons";
import { cn } from "@/components/utils/helpers";
import React from "react";
import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { useStudioState } from "@/store/studioState";

type peerMetaData = {
  displayName: string;
  avatarUrl: string;
  isHandRaised: boolean;
};

type Reaction =
  | ""
  | "😂"
  | "😢"
  | "😦"
  | "😍"
  | "🤔"
  | "👀"
  | "🙌"
  | "👍"
  | "👎"
  | "🔥"
  | "🍻"
  | "🚀"
  | "🎉"
  | "❤️"
  | "💯";

interface Props {
  onClose: () => void;
  onClick: (reaction: Reaction) => void;
}

const EmojiTray: React.FC<Props> = ({ onClick, onClose }) => {
  // Emoji Data
  const emojis: Reaction[] = [
    "😂",
    "😢",
    "😦",
    "😍",
    "🤔",
    "👀",
    "🙌",
    "👍",
    "👎",
    "🔥",
    "🍻",
    "🚀",
    "🎉",
    "❤️",
    "💯",
  ];

  const { sendData } = useDataMessage();
  const setMyReaction = useStudioState((state) => state.setMyReaction);

  const { metadata, updateMetadata } = useLocalPeer<peerMetaData>();

  return (
    <div>
      <div className="relative z-50">
        <div className=" border-b border-slate-700 py-3 text-center text-base font-semibold text-gray-800">
          Reactions
          <span
            className="absolute right-2 cursor-pointer"
            role="presentation"
            onClick={onClose}
          >
            {BasicIcons.close}
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateMetadata({
              ...metadata,
              isHandRaised: !metadata?.isHandRaised,
            } as peerMetaData);
          }}
          className={cn(
            " w-full text-sm border text-gray-700 py-2 rounded-lg font-inter flex items-center justify-center font-medium",
            metadata?.isHandRaised
              ? "bg-gray-500 text-gray-100"
              : "border-gray-500"
          )}
        >
          ✋ {metadata?.isHandRaised ? "Lower Hand" : "Raise Hand"}
        </button>
        <div className="grid grid-cols-5 place-items-center gap-2">
          {emojis.map((emoji) => (
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
              className="m-1 cursor-pointer p-2 text-lg"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiTray;
