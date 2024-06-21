"use client";

import dynamic from "next/dynamic";
import React from "react";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => m.Toaster),
  {
    ssr: false,
  }
);

type ToasterProps = {
  children: React.ReactNode;
};

const HuddleContextProvider: React.FC<ToasterProps> = ({ children }) => {
  const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  });

  return (
    <HuddleProvider client={huddleClient}>
      {children}
      <Toaster
        containerStyle={{
          bottom: "70px",
          animation: "ease-in-out",
          animationFillMode: "forwards",
        }}
        toastOptions={{
          style: {
            fontSize: "14px",
            backgroundColor: "#3E3D3D",
            color: "#fff",
            boxShadow: "none",
            borderRadius: "50px",
            padding: "3px 5px",
          },
          duration: 5000,
          success: {
            style: {
              border: "1px solid #3CCB7F",
              backgroundColor: "#3E3D3D",
              color: "#3CCB7F",
            },
          },
          error: {
            style: {
              border: "1px solid #F87171",
              background: "black",
              color: "#F87171",
            },
          },
        }}
      />
    </HuddleProvider>
  );
};
export default HuddleContextProvider;
