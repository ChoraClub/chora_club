import { BasicIcons } from "@/utils/BasicIcons";
import { cn } from "@/components/ComponentUtils/helpers";
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
    <div className="bg-white max-w-xs mx-auto">
      <div className="relative z-50 border-b border-slate-700 py-3 text-center text-base font-semibold text-gray-800">
        Reactions
        <span
          className="absolute right-4 top-3 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
          role="presentation"
          onClick={onClose}
        >
          {BasicIcons.close}
        </span>
      </div>

      <div className="px-6 py-4 space-y-4">
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
            "w-full text-sm py-2 rounded-lg flex items-center justify-center font-medium transition-all duration-200",
            metadata?.isHandRaised
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
        >
          ✋ {metadata?.isHandRaised ? "Lower Hand" : "Raise Hand"}
        </button>

        <div className="grid grid-cols-5 gap-3">
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
              className="cursor-pointer text-xl hover:scale-110 transition-transform duration-200 p-2"
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
