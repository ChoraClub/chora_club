"use client";

import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { MEETING_URL } from "@/config/constants";

type LobbyPageProps = {
  roomId: string;
};

const IntroPage: React.FC<LobbyPageProps> = ({ roomId }) => {
  const { push } = useRouter();

  console.log("roomid from mainIntro", roomId);
  useEffect(() => {
    // push(`/meeting/session/${roomId}/lobby`);
    push(`${MEETING_URL}/session/${roomId}/lobby`);
  }, []);

  return null;
};
export default IntroPage;
