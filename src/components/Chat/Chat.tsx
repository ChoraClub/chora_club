"use client";
import React from "react";
import useChatScroll from "./ChatScroll";
import { nanoid } from "nanoid";
import useStore from "@/components/store/slices";
import { useState, useRef } from "react";
import { BasicIcons } from "@/assets/BasicIcons";
import { useDataMessage } from "@huddle01/react/hooks";
import Header from "../Sidebar/Header/Header";
import toast, { Toaster } from "react-hot-toast";

const Chat = () => {
  const userDisplayName = useStore((state) => state.userDisplayName);
  const [message, setMessage] = useState<string>("");
  const addChatMessage = useStore((state) => state.addChatMessage);
  const chatMessages = useStore((state) => state.chatMessages);
  const ref = useChatScroll(chatMessages);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { sendData } = useDataMessage();
  const setIsChatOpen = useStore((state) => state.setIsChatOpen);
  const setHasNewMessages = useStore((state) => state.setHasNewMessage);

  const handleNewMessageReceived = () => {
    setHasNewMessages(true);
  };

  async function handleSend() {
    if (message != "") {
      sendDataToAllPeers();
      const newChatMessage = {
        name: userDisplayName,
        text: message,
        is_user: true,
      };
      addChatMessage(newChatMessage);
      setHasNewMessages(true);
      setMessage("");
    }

    // toast(newChatMessage.text);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  const sendDataToAllPeers = () => {
    sendData({
      to: "*",
      payload: JSON.stringify({ message: message, name: userDisplayName }),
      label: "chat",
    });
  };

  const displayChats = chatMessages.map((chat) => {
    return (
      <div
        key={nanoid()}
        className={`${
          chat.is_user
            ? "ml-auto text-md break-words max-w-xs w-fit py-1 px-4 mb-2 bg-[#216CFC] text-white rounded-2xl items-center flex"
            : "w-fit py-1 px-4 break-words max-w-xs text-md mb-2 rounded-lg bg-[#343744] text-white"
        }`}
      >
        <div className="text-xs text-blue-300">
          {chat.is_user ? null : chat.name}
        </div>
        {chat.text}

        {/* {chat.is_user ? null : toast(chat.text)} */}
      </div>
    );
  });

  return (
    <aside className="flex flex-col text-gray-700 w-2/6 p-2 mr-2 mt-2 bg-gray-100 rounded-lg font-poppins">
      <div className="flex flex-col h-full">
        <Header
          title="Chat"
          icon={BasicIcons.chat}
          onClose={() => setIsChatOpen(false)}
        />
        {/* <div className="mb-3 font-mono text-left text-lg p-2">
          <div className="flex items-center gap-2">{BasicIcons.chat}Chat</div>
          <div className="border-t mt-3 border-gray-700"></div>
        </div> */}
        <div ref={ref} className="overflow-auto mt-2 flex-col h-full">
          <div className="font-sans">{displayChats}</div>
        </div>
        <div className="flex py-1 pl-1">
          <input
            type="text"
            placeholder="Type a message"
            className="p-2 rounded-lg w-full bg-white text-sm"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button ref={buttonRef} className="p-1" onClick={handleSend}>
            {BasicIcons.send}
          </button>
        </div>
      </div>
      {/* <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "14px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px",
          },
        }}
      /> */}
    </aside>
  );
};

export default Chat;
