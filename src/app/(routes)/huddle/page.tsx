import React from "react";
import IntroPage from "@/components/IntroPage/IntroPage";
import { useAccount } from "wagmi";

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

const address = useAccount();

const createRandomRoom = async () => {
  const res = await fetch("https://iriko.huddle01.media/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Test Room",
      hostWallets: [address],
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
    },
    cache: "no-store",
  });
  const data: RoomDetails = await res.json();
  const { roomId } = data.data;
  return roomId;
};

export default async function Home() {
  const roomId = await createRandomRoom();

  console.log({ roomId });

  return <IntroPage roomId={roomId} />;
}
