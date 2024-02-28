"use client";
import React from "react";
import IntroPage from "@/components/IntroPage/IntroPage";

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

const createRandomRoom = async () => {
  // const res = await fetch(`${process.env.NEXT_DOMAIN}/api/create-room`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // const result = await res.json();
  // const roomId = await result.data;
  const roomId = "dpy-ktda-bdq";
  return roomId;
};

export default async function Home() {
  const roomId = await createRandomRoom();

  // console.log({ roomId });

  return <IntroPage roomId={roomId} />;
}
