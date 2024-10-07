"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import InviteCreators from "./InviteCreators";
import { Oval, TailSpin } from "react-loader-spinner";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";
import ConnectYourWallet from "../ComponentUtils/ConnectYourWallet";
import { useConnection } from "@/app/hooks/useConnection";

function ReferralsMain() {
  const { address } = useAccount();
  const { isConnected, isLoading, isSessionLoading, isPageLoading, isReady } =
    useConnection();

  const renderContent = () => {
    if (isPageLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <TailSpin
            visible={true}
            height="40"
            width="40"
            color="#0356fc"
            ariaLabel="tail-spin-loading"
            radius="1"
          />
          <p className="ml-4 text-black">Loading...</p>
        </div>
      );
    }

    if (isSessionLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
          <p className="ml-4 text-black">Loading...</p>
        </div>
      );
    }

    if (!isConnected) {
      return <ConnectYourWallet />;
    }

    if (isReady) {
      return <InviteCreators userAddress={address} />;
    }

    return (
      <div className="text-black">Something went wrong. Please try again.</div>
    );
  };

  return (
    <>
      <MobileResponsiveMessage />

      <div className="hidden md:block font-poppins">{renderContent()}</div>
    </>
  );
}

export default ReferralsMain;
