"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import InviteCreators from "./InviteCreators";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { TailSpin } from "react-loader-spinner";
import Image from "next/image";
import logo from "@/assets/images/daos/CCLogo2.png";

function ReferralsMain() {
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    setPageLoading(false);
  }, [isConnected, session]);

  return (
    <div className="font-poppins">
      {!pageLoading ? (
        isConnected && session !== null ? (
          <>
            <InviteCreators userAddress={address} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
            <div className="p-10 bg-white rounded-3xl shadow-xl text-center max-w-md transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center mb-5">
                <Image src={logo} alt="image" width={100} />
              </div>
              <h2 className="font-bold text-3xl text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-700 mb-8">
                To continue, please connect your wallet to invite your friends.
              </p>
              <div className="flex items-center justify-center">
                <ConnectWalletWithENS />
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center h-screen">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#FFFFFF"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </div>
  );
}

export default ReferralsMain;
