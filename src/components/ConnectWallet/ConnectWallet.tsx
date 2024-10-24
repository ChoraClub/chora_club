"use client";

import { useState } from "react";
import { BiSolidWallet } from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "@/components/MainSidebar/sidebar.module.css";
import { usePrivy } from "@privy-io/react-auth";

export const ConnectWallet = () => {
  const {authenticated, login } = usePrivy();

  return (
    <div>
      {/* When wallet is NOT connected */}
      {!authenticated ? (
        <>
          {/* Large screen button */}
          <button
            onClick={login}
            type="button"
            className={`hidden lg:flex cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}`}
          >
            <BiSolidWallet
              className={`size-5 text-blue-shade-200 ${styles.iconInner}`}
            />
          </button>

          {/* Small screen button */}
          <div
            className="block lg:hidden py-4 pl-6 sm:py-5 hover:bg-blue-shade-100 cursor-pointer"
            onClick={login}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BiSolidWallet className="size-5 mr-4" />
                <span>Wallet</span>
              </div>
              <FiArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </>
      ) : (
       <div>connected</div>
      )}
    </div>
  );
};
