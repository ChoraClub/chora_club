"use client";

import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { MEETING_BASE_URL } from "@/config/constants";

type LobbyPageProps = {
  roomId: string;
};

const IntroPage: React.FC<LobbyPageProps> = ({ roomId }) => {
  const { push } = useRouter();

  console.log("roomid from mainIntro", roomId);
  useEffect(() => {
    push(`${MEETING_BASE_URL}/meeting/session/${roomId}/lobby`);
  }, []);

  return null;
};
export default IntroPage;
