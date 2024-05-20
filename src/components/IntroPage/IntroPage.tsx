"use client";

import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
type LobbyPageProps = {
  roomId: string;
};

const IntroPage: React.FC<LobbyPageProps> = ({ roomId }) => {
  const { push } = useRouter();

  console.log("roomid from mainIntro", roomId);
  useEffect(() => {
    push(`/meeting/session/${roomId}/lobby`);
  }, []);

  return null;
};
export default IntroPage;
