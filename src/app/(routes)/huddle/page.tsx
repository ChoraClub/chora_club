"use client";
import React from "react";
import IntroPage from "@/components/IntroPage/IntroPage";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

export default async function Home() {
  const createRandomRoom = async () => {
    const { address } = useAccount();
    // if (isDisconnected) {
    //   toast.error("connect your wallet");
    // }
    console.log("this izz adddaraaa", address);
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test Room",
          hostWallets: ["0x8dEa0ad941d577e356745d758b30Fa11EFa28E80"],
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );
    const result = await response.json();
    console.log("Result:", result);

    const roomId = (await result.data.roomId) as string;
    return roomId;
  };
  const roomId = await createRandomRoom();

  // console.log("roomID from intro page,,,", { roomId });

  return <IntroPage roomId={roomId} />;
}
