"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiSolidWallet } from "react-icons/bi";
import styles from '@/components/MainSidebar/sidebar.module.css'
export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    <div className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}`}>
                <BiSolidWallet className={`size-5 text-blue-shade-200 ${styles.iconInner}`}/>
                </div>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={openAccountModal} type="button">
                    <div className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 rounded-full flex items-center justify-center bg-white w-10 h-10 ${styles.icon3d} ${styles.whiteBg}
                    `}>
                <BiSolidWallet className={`size-5 text-blue-shade-200 ${styles.iconInner}`}/>
                </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
